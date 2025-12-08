import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;
  banner?: string;
}