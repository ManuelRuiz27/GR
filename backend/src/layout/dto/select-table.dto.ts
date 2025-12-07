import { IsString, IsUUID } from 'class-validator';

export class SelectTableDto {
    @IsUUID()
    @IsString()
    table_id: string;
}
