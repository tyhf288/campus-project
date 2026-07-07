import { IsString, IsNumber } from "class-validator";

export class CreateUserDto { 
        
    @IsString()
    name!: string;
    @IsNumber()
    age!: number;
    @IsString()
    sex!: string;
}