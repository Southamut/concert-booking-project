import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  db,
  Reservation,
  ReservationEvent,
  getNextId,
  findUserByEmail,
  hasReservation,
  findConcertById,
} from '../db/db';
import { CreateReservationDto } from './reservations.dto';
import { ConcertsService } from '../concerts/concerts.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly concertsService: ConcertsService) { }

  findAll(): Reservation[] {
    return db.reservations;
  }

  findByUser(userEmail: string): Reservation[] {
    return db.reservations.filter((r) => r.userEmail === userEmail);
  }

  findHistory(): ReservationEvent[] {
    return db.reservationEvents.sort((a, b) => +b.at - +a.at);
  }

  create(dto: CreateReservationDto): Reservation {
    const { concertId, userEmail, userName } = dto;

    // Check concert exists
    const concert = findConcertById(concertId);
    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    // Check seats available
    if (concert.availableSeats <= 0) {
      throw new BadRequestException('No seats available');
    }

    // Check if already reserved
    if (hasReservation(userEmail, concertId)) {
      throw new ConflictException('Already reserved for this concert');
    }

    // Check if user exists (pre-registered members only)
    const user = findUserByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('User not found. Please register first.');
    }

    // Verify userName matches (optional - for security)
    if (user.name !== userName) {
      throw new BadRequestException('User name does not match registered account');
    }

    // Create reservation
    const reservation: Reservation = {
      id: getNextId('reservation'),
      userEmail,
      userName: user.name,
      concertId,
      createdAt: new Date(),
      status: 'reserved',
    };
    db.reservations.push(reservation);

    // Log event
    db.reservationEvents.push({
      id: getNextId('reservationEvent'),
      reservationId: reservation.id,
      userEmail: reservation.userEmail,
      userName: reservation.userName,
      concertId: reservation.concertId,
      type: 'RESERVE',
      at: reservation.createdAt,
    });

    // Decrement seats
    this.concertsService.decrementSeats(concertId);

    return reservation;
  }

  delete(id: number, userEmail: string): void {
    const reservation = db.reservations.find((r) => r.id === id);
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.userEmail !== userEmail) {
      throw new BadRequestException('Can only cancel your own reservations');
    }
    if (reservation.status === 'cancelled') {
      return;
    }

    reservation.status = 'cancelled';
    reservation.cancelledAt = new Date();
    this.concertsService.incrementSeats(reservation.concertId);

    // Log cancel event
    db.reservationEvents.push({
      id: getNextId('reservationEvent'),
      reservationId: reservation.id,
      userEmail: reservation.userEmail,
      userName: reservation.userName,
      concertId: reservation.concertId,
      type: 'CANCEL',
      at: reservation.cancelledAt,
    });
  }
}

