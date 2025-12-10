import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateTicketDto {
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsInt()
    @Min(0)
    price:number;

    @IsInt()
    @Min(1)
    totalSeats:number;
}