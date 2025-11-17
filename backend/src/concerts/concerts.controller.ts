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
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './concerts.dto';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Get()
  findAll() {
    return this.concertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.concertsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateConcertDto, @Headers('x-is-admin') isAdmin: string) {
    if (isAdmin !== 'true') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.concertsService.create(dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Headers('x-is-admin') isAdmin: string) {
    if (isAdmin !== 'true') {
      throw new UnauthorizedException('Admin access required');
    }
    this.concertsService.delete(id);
    return { message: 'Concert deleted successfully' };
  }
}

