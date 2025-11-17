import { IsString, IsInt, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  concertId: number;

  @IsNotEmpty()
  @IsEmail()
  userEmail: string;

  @IsNotEmpty()
  @IsString()
  userName: string;
}

