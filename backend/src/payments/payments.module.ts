import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { WebhooksController } from './webhooks.controller';
import { PaymentsService } from './payments.service';
import { OpenpayService } from './openpay.service';

@Module({
    controllers: [PaymentsController, WebhooksController],
    providers: [PaymentsService, OpenpayService],
    exports: [PaymentsService, OpenpayService],
})
export class PaymentsModule { }
