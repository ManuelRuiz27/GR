import {
    Controller,
    Post,
    Body,
    Headers,
    UnauthorizedException,
    Logger,
    RawBodyRequest,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { OpenpayService } from './openpay.service';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('webhooks/openpay')
export class WebhooksController {
    private readonly logger = new Logger(WebhooksController.name);

    constructor(
        private paymentsService: PaymentsService,
        private openpayService: OpenpayService,
    ) { }

    @Post()
    async handleWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Body() body: any,
        @Headers('x-openpay-signature') signature: string,
    ) {
        this.logger.log('Webhook received from OpenPay');

        // Verificar firma
        const payload = JSON.stringify(body);
        const isValid = this.openpayService.verifyWebhookSignature(
            payload,
            signature,
        );

        if (!isValid) {
            this.logger.warn('Invalid webhook signature');
            throw new UnauthorizedException('Invalid webhook signature');
        }

        this.logger.log('Webhook signature verified');

        // Procesar evento
        return this.paymentsService.handleWebhook(body);
    }
}
