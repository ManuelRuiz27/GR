import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenpayService {
    private readonly logger = new Logger(OpenpayService.name);
    private openpay: any;

    constructor(private configService: ConfigService) {
        const Openpay = require('openpay');

        const merchantId = this.configService.get('OPENPAY_MERCHANT_ID');
        const privateKey = this.configService.get('OPENPAY_PRIVATE_KEY');
        const isProduction = this.configService.get('NODE_ENV') === 'production';

        this.openpay = new Openpay(merchantId, privateKey, isProduction);

        this.logger.log(
            `OpenPay initialized in ${isProduction ? 'PRODUCTION' : 'SANDBOX'} mode`,
        );
    }

    /**
     * Crea un cargo usando un token de tarjeta
     * El token se genera en el frontend con OpenPay.js
     */
    async createChargeWithToken(data: {
        token: string;
        amount: number;
        description: string;
        order_id: string;
        customer: {
            name: string;
            email: string;
            phone_number?: string;
        };
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            const chargeRequest = {
                source_id: data.token,
                method: 'card',
                amount: data.amount,
                currency: 'MXN',
                description: data.description,
                order_id: data.order_id,
                customer: {
                    name: data.customer.name,
                    email: data.customer.email,
                    phone_number: data.customer.phone_number || '',
                },
                use_3d_secure: false, // Cambiar a true en producción
            };

            this.openpay.charges.create(
                chargeRequest,
                (error: any, body: any, response: any) => {
                    if (error) {
                        this.logger.error('OpenPay charge error:', error);
                        reject(error);
                    } else {
                        this.logger.log(`Charge created successfully: ${body.id}`);
                        resolve(body);
                    }
                },
            );
        });
    }

    /**
     * Crea un cargo por transferencia bancaria (SPEI)
     */
    async createBankCharge(data: {
        amount: number;
        description: string;
        order_id: string;
        customer: {
            name: string;
            email: string;
            phone_number?: string;
        };
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            const chargeRequest = {
                method: 'bank_account',
                amount: data.amount,
                currency: 'MXN',
                description: data.description,
                order_id: data.order_id,
                customer: {
                    name: data.customer.name,
                    email: data.customer.email,
                    phone_number: data.customer.phone_number || '',
                },
            };

            this.openpay.charges.create(
                chargeRequest,
                (error: any, body: any, response: any) => {
                    if (error) {
                        this.logger.error('OpenPay bank charge error:', error);
                        reject(error);
                    } else {
                        this.logger.log(`Bank charge created: ${body.id}`);
                        resolve(body);
                    }
                },
            );
        });
    }

    /**
     * Crea un cargo por efectivo en tiendas (OXXO, 7-Eleven, etc.)
     */
    async createStoreCharge(data: {
        amount: number;
        description: string;
        order_id: string;
        customer: {
            name: string;
            email: string;
            phone_number?: string;
        };
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            const chargeRequest = {
                method: 'store',
                amount: data.amount,
                currency: 'MXN',
                description: data.description,
                order_id: data.order_id,
                customer: {
                    name: data.customer.name,
                    email: data.customer.email,
                    phone_number: data.customer.phone_number || '',
                },
            };

            this.openpay.charges.create(
                chargeRequest,
                (error: any, body: any, response: any) => {
                    if (error) {
                        this.logger.error('OpenPay store charge error:', error);
                        reject(error);
                    } else {
                        this.logger.log(`Store charge created: ${body.id}`);
                        resolve(body);
                    }
                },
            );
        });
    }

    /**
     * Obtiene información de un cargo
     */
    async getCharge(chargeId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openpay.charges.get(
                chargeId,
                (error: any, body: any, response: any) => {
                    if (error) {
                        this.logger.error('OpenPay get charge error:', error);
                        reject(error);
                    } else {
                        resolve(body);
                    }
                },
            );
        });
    }

    /**
     * Verifica la firma del webhook usando HMAC-SHA256
     */
    verifyWebhookSignature(payload: string, signature: string): boolean {
        const crypto = require('crypto');
        const privateKey = this.configService.get('OPENPAY_PRIVATE_KEY');

        const hash = crypto
            .createHmac('sha256', privateKey)
            .update(payload)
            .digest('hex');

        return hash === signature;
    }

    /**
     * Obtiene la clave pública para el frontend
     */
    getPublicKey(): string {
        return this.configService.get('OPENPAY_PUBLIC_KEY');
    }

    /**
     * Obtiene el merchant ID para el frontend
     */
    getMerchantId(): string {
        return this.configService.get('OPENPAY_MERCHANT_ID');
    }
}
