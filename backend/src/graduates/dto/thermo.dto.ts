import { IsString, IsIn, MaxLength, MinLength } from 'class-validator';

export class CustomizeThermoDto {
    @IsString()
    @IsIn(['Lic.', 'Ing.', 'Arq.', 'Dr.', 'Mtro.', 'Mtra.', 'C.', ''])
    prefix: string;

    @IsString()
    @MinLength(1)
    @MaxLength(14)
    name: string;
}
