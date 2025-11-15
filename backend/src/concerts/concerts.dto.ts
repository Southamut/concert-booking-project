import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateConcertDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  totalSeats: number;
}

