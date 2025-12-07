import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { CreateChargeDto } from './dto/create-charge.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @Get('config')
    getConfig() {
        return this.paymentsService.getOpenpayConfig();
    }

    @Get('summary')
    async getSummary(@GetUser() user: any) {
        return this.paymentsService.getPaymentSummary(user.id);
    }

    @Get('history')
    async getHistory(@GetUser() user: any) {
        return this.paymentsService.getPaymentHistory(user.id);
    }

    @Post('charge')
    async createCharge(@GetUser() user: any, @Body() dto: CreateChargeDto) {
        return this.paymentsService.createCharge(user.id, dto);
    }
}
