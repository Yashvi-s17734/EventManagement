import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateBookingDto{
    @IsNotEmpty()
    @IsString()
    ticketId:string;

    @IsInt()
    @Min(1)
    quantity:number;
}