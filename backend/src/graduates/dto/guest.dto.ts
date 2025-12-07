import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateGuestDto {
    @IsString()
    @IsOptional()
    full_name?: string;

    @IsString()
    @IsIn(['traditional', 'vegan'])
    @IsOptional()
    meal_type?: string;
}
