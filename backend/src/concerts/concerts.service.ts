import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db, Concert, getNextId, findConcertById } from '../db/db';
import { CreateConcertDto } from './concerts.dto';

@Injectable()
export class ConcertsService {
  findAll(): Concert[] {
    return db.concerts;
  }

  findOne(id: number): Concert {
    const concert = findConcertById(id);
    if (!concert) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
    return concert;
  }

  create(dto: CreateConcertDto): Concert {
    const concert: Concert = {
      id: getNextId('concert'),
      name: dto.name,
      description: dto.description,
      totalSeats: dto.totalSeats,
      availableSeats: dto.totalSeats,
      createdAt: new Date(),
    };
    db.concerts.push(concert);
    return concert;
  }

  delete(id: number): void {
    const index = db.concerts.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
    
    // Check if there are reservations
    const hasReservations = db.reservations.some((r) => r.concertId === id);
    if (hasReservations) {
      throw new BadRequestException('Cannot delete concert with reservations');
    }
    
    db.concerts.splice(index, 1);
  }

  decrementSeats(concertId: number): void {
    const concert = findConcertById(concertId);
    if (!concert) {
      throw new NotFoundException(`Concert not found`);
    }
    if (concert.availableSeats <= 0) {
      throw new BadRequestException('No seats available');
    }
    concert.availableSeats--;
  }

  incrementSeats(concertId: number): void {
    const concert = findConcertById(concertId);
    if (concert && concert.availableSeats < concert.totalSeats) {
      concert.availableSeats++;
    }
  }
}

