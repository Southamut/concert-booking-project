import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Headers,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './reservations.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('all')
  findAll(@Headers('x-is-admin') isAdmin: string) {
    if (isAdmin !== 'true') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.reservationsService.findAll();
  }

  @Get('history')
  findHistory(@Headers('x-is-admin') isAdmin: string) {
    if (isAdmin !== 'true') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.reservationsService.findHistory();
  }

  @Get('user/:email')
  findByUser(@Param('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.reservationsService.findByUser(email);
  }

  @Post()
  create(
    @Body() dto: CreateReservationDto,
    @Headers('x-user-email') userEmail: string,
  ) {
    if (!userEmail) {
      throw new BadRequestException('User email header required');
    }
    if (dto.userEmail !== userEmail) {
      throw new BadRequestException('Can only reserve for yourself');
    }
    return this.reservationsService.create(dto);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-email') userEmail: string,
  ) {
    if (!userEmail) {
      throw new BadRequestException('User email header required');
    }
    this.reservationsService.delete(id, userEmail);
    return { message: 'Reservation cancelled successfully' };
  }
}

