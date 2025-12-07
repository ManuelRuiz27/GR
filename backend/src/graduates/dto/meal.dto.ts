import { IsString, IsIn } from 'class-validator';

export class UpdateMealDto {
    @IsString()
    @IsIn(['traditional', 'vegan'])
    meal_type: string;
}
