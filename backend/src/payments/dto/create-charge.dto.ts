import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';

export class CreateChargeDto {
    @IsEnum(['card', 'bank_account', 'store'])
    payment_method: 'card' | 'bank_account' | 'store';

    @IsString()
    @IsOptional()
    token?: string; // Solo requerido para tarjeta

    @IsEnum(['initial', 'monthly'])
    payment_type: 'initial' | 'monthly';

    @IsInt()
    @Min(1)
    @IsOptional()
    month_number?: number;
}
