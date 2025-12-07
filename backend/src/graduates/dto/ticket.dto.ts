import { IsInt, Min, Max } from 'class-validator';

export class CreateTicketDto {
    @IsInt()
    @Min(1)
    @Max(20)
    tickets_count: number;
}

export class AddGuestsDto {
    @IsInt()
    @Min(1)
    @Max(10)
    additional_guests: number;
}
