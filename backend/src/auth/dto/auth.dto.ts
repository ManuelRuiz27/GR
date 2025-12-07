import { IsEmail, IsString, MinLength, IsOptional, IsUUID } from 'class-validator';

export class RegisterDto {
    @IsUUID()
    event_id: string;

    @IsString()
    @MinLength(3)
    full_name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(10)
    phone: string;

    @IsString()
    career: string;

    @IsString()
    generation: string;

    @IsString()
    @IsOptional()
    group?: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
