import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenpayService } from './openpay.service';
import { CreateChargeDto } from './dto/create-charge.dto';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        private prisma: PrismaService,
        private openpayService: OpenpayService,
    ) { }

    async createCharge(graduateId: string, dto: CreateChargeDto) {
        this.logger.log(`Creating charge for graduate: ${graduateId}`);
        this.logger.log(`Payment type: ${dto.payment_type}, Method: ${dto.payment_method}`);

        const graduate = await this.prisma.graduate.findUnique({
            where: { id: graduateId },
            include: {
                event: true,
                tickets: true,
                payments: {
                    where: { status: 'paid' },
                },
            },
        });

        if (!graduate) {
            throw new NotFoundException('Graduate not found');
        }

        this.logger.log(`Graduate found: ${graduate.full_name}`);
        this.logger.log(`Tickets count: ${graduate.tickets?.length || 0}`);

        if (!graduate.tickets || graduate.tickets.length === 0) {
            throw new BadRequestException('No tickets found');
        }

        // Calcular monto según tipo de pago
        let amount: number;
        let description: string;
        let monthNumber: number | null = null;

        if (dto.payment_type === 'initial') {
            // Verificar que no haya pagado ya el inicial
            const hasInitialPayment = await this.prisma.payment.findFirst({
                where: {
                    graduate_id: graduateId,
                    type: 'initial',
                    status: 'paid',
                },
            });

            if (hasInitialPayment) {
                throw new BadRequestException('Initial payment already made');
            }

            amount = Number(graduate.event.initial_payment);
            description = `Pago inicial - ${graduate.event.name}`;
        } else {
            // Mensualidad
            if (!dto.month_number) {
                throw new BadRequestException('Month number is required for monthly payments');
            }

            // Verificar que haya pagado el inicial
            const hasInitialPayment = await this.prisma.payment.findFirst({
                where: {
                    graduate_id: graduateId,
                    type: 'initial',
                    status: 'paid',
                },
            });

            if (!hasInitialPayment) {
                throw new BadRequestException('Initial payment must be made first');
            }

            // Verificar que no haya pagado ya este mes
            const hasMonthPayment = await this.prisma.payment.findFirst({
                where: {
                    graduate_id: graduateId,
                    type: 'monthly',
                    month_number: dto.month_number,
                    status: 'paid',
                },
            });

            if (hasMonthPayment) {
                throw new BadRequestException(`Month ${dto.month_number} already paid`);
            }

            // Calcular mensualidad
            const totalAmount = Number(graduate.tickets[0].total_amount);
            const initialPayment = Number(graduate.event.initial_payment);
            const remaining = totalAmount - initialPayment;
            const monthlyPayment = Math.ceil(remaining / graduate.event.months_duration);

            amount = monthlyPayment;
            monthNumber = dto.month_number;
            description = `Mensualidad ${dto.month_number}/${graduate.event.months_duration} - ${graduate.event.name}`;
        }

        // Crear registro de pago pendiente
        const payment = await this.prisma.payment.create({
            data: {
                graduate_id: graduateId,
                amount,
                type: dto.payment_type,
                status: 'pending',
                month_number: monthNumber,
            },
        });

        try {
            let charge: any;

            // Crear cargo según el método de pago
            if (dto.payment_method === 'card') {
                // Tarjeta: requiere token
                if (!dto.token) {
                    throw new BadRequestException('Token is required for card payments');
                }

                charge = await this.openpayService.createChargeWithToken({
                    token: dto.token,
                    amount,
                    description,
                    order_id: payment.id,
                    customer: {
                        name: graduate.full_name,
                        email: graduate.email,
                        phone_number: graduate.phone,
                    },
                });
            } else if (dto.payment_method === 'bank_account') {
                // SPEI: transferencia bancaria
                charge = await this.openpayService.createBankCharge({
                    amount,
                    description,
                    order_id: payment.id,
                    customer: {
                        name: graduate.full_name,
                        email: graduate.email,
                        phone_number: graduate.phone,
                    },
                });
            } else if (dto.payment_method === 'store') {
                // Efectivo en tiendas
                charge = await this.openpayService.createStoreCharge({
                    amount,
                    description,
                    order_id: payment.id,
                    customer: {
                        name: graduate.full_name,
                        email: graduate.email,
                        phone_number: graduate.phone,
                    },
                });
            }

            // Actualizar con transaction ID
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    openpay_tx_id: charge.id,
                },
            });

            // Si el cargo fue exitoso inmediatamente (solo tarjeta), actualizar estado
            if (charge.status === 'completed') {
                await this.handleSuccessfulPayment(payment.id);
            }

            // Preparar respuesta según el método
            const response: any = {
                payment_id: payment.id,
                openpay_tx_id: charge.id,
                amount,
                status: charge.status,
                payment_method: dto.payment_method,
            };

            // Agregar información específica del método
            if (dto.payment_method === 'card') {
                response.authorization = charge.authorization;
            } else if (dto.payment_method === 'bank_account') {
                // SPEI: incluir CLABE y referencia
                response.payment_method_data = {
                    clabe: charge.payment_method?.clabe,
                    bank_name: charge.payment_method?.name,
                    agreement: charge.payment_method?.agreement,
                };
                response.due_date = charge.due_date;
            } else if (dto.payment_method === 'store') {
                // Efectivo: incluir referencia y código de barras
                response.payment_method_data = {
                    reference: charge.payment_method?.reference,
                    barcode_url: charge.payment_method?.barcode_url,
                };
                response.due_date = charge.due_date;
            }

            return response;
        } catch (error) {
            // Marcar pago como fallido
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'failed',
                },
            });

            this.logger.error('Payment failed:', error);
            throw new BadRequestException(
                error.description || 'Payment processing failed',
            );
        }
    }

    async handleSuccessfulPayment(paymentId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                graduate: {
                    include: {
                        event: true,
                        tickets: true,
                        payments: {
                            where: { status: 'paid' },
                        },
                    },
                },
            },
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Actualizar estado del pago
        await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: 'paid',
                payment_date: new Date(),
            },
        });

        // Calcular progreso
        const paidPayments = payment.graduate.payments.filter(
            (p) => p.status === 'paid',
        );
        const totalPaid =
            paidPayments.reduce((sum, p) => sum + Number(p.amount), 0) +
            Number(payment.amount);

        const totalAmount = Number(payment.graduate.tickets[0]?.total_amount || 0);
        const progressPercent =
            totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

        // Actualizar progreso del graduado
        const updateData: any = {
            payments_step: progressPercent >= 100 ? 'completed' : 'in_progress',
        };

        // Verificar si desbloquea termo
        if (progressPercent >= payment.graduate.event.thermo_threshold) {
            if (payment.graduate.thermo_step === 'locked') {
                updateData.thermo_step = 'unlocked';
            }
        }

        await this.prisma.graduate.update({
            where: { id: payment.graduate_id },
            data: updateData,
        });

        this.logger.log(
            `Payment ${paymentId} processed successfully. Progress: ${progressPercent}%`,
        );

        return { success: true, progress_percent: progressPercent };
    }

    async handleWebhook(event: any) {
        const { transaction, type } = event;

        this.logger.log(`Webhook received: ${type} for transaction ${transaction.id}`);

        if (type === 'charge.succeeded') {
            const payment = await this.prisma.payment.findUnique({
                where: { openpay_tx_id: transaction.id },
            });

            if (!payment) {
                this.logger.warn(`Payment not found for transaction ${transaction.id}`);
                return { success: false, message: 'Payment not found' };
            }

            if (payment.status === 'paid') {
                this.logger.log(`Payment ${payment.id} already processed`);
                return { success: true, message: 'Already processed' };
            }

            return await this.handleSuccessfulPayment(payment.id);
        }

        if (type === 'charge.failed') {
            const payment = await this.prisma.payment.findUnique({
                where: { openpay_tx_id: transaction.id },
            });

            if (payment) {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'failed',
                    },
                });
            }

            return { success: true, message: 'Payment marked as failed' };
        }

        return { success: true, message: 'Event processed' };
    }

    async getPaymentSummary(graduateId: string) {
        const graduate = await this.prisma.graduate.findUnique({
            where: { id: graduateId },
            include: {
                event: true,
                tickets: true,
                payments: {
                    orderBy: {
                        created_at: 'desc',
                    },
                },
            },
        });

        if (!graduate) {
            throw new NotFoundException('Graduate not found');
        }

        const totalAmount = Number(graduate.tickets[0]?.total_amount || 0);
        const paidPayments = graduate.payments.filter((p) => p.status === 'paid');
        const totalPaid = paidPayments.reduce(
            (sum, p) => sum + Number(p.amount),
            0,
        );
        const pendingAmount = totalAmount - totalPaid;
        const progressPercent =
            totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

        // Verificar pago inicial
        const hasInitialPayment = paidPayments.some((p) => p.type === 'initial');

        // Calcular siguiente mensualidad
        const paidMonths = paidPayments.filter((p) => p.type === 'monthly').length;
        const nextMonth = paidMonths + 1;

        // Calcular monto mensual
        const initialPayment = Number(graduate.event.initial_payment);
        const remaining = totalAmount - initialPayment;
        const monthlyPayment = Math.ceil(
            remaining / graduate.event.months_duration,
        );

        return {
            total_amount: totalAmount,
            paid_amount: totalPaid,
            pending_amount: pendingAmount,
            progress_percent: progressPercent,
            initial_payment: initialPayment,
            monthly_payment: monthlyPayment,
            has_initial_payment: hasInitialPayment,
            next_month: nextMonth <= graduate.event.months_duration ? nextMonth : null,
            months_duration: graduate.event.months_duration,
            thermo_unlocked: progressPercent >= graduate.event.thermo_threshold,
            thermo_threshold: graduate.event.thermo_threshold,
        };
    }

    async getPaymentHistory(graduateId: string) {
        const payments = await this.prisma.payment.findMany({
            where: { graduate_id: graduateId },
            orderBy: {
                created_at: 'desc',
            },
        });

        return payments.map((p) => ({
            id: p.id,
            amount: Number(p.amount),
            type: p.type,
            status: p.status,
            month_number: p.month_number,
            payment_date: p.payment_date,
            created_at: p.created_at,
            openpay_tx_id: p.openpay_tx_id,
        }));
    }

    getOpenpayConfig() {
        return {
            merchant_id: this.openpayService.getMerchantId(),
            public_key: this.openpayService.getPublicKey(),
        };
    }
}
