import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ConcertsService } from '../concerts/concerts.service';
import { db, Reservation, Concert } from '../db/db';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let concertsService: ConcertsService;
  let originalConcerts: Concert[];
  let originalReservations: Reservation[];
  let originalUsers: any[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationsService, ConcertsService],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    concertsService = module.get<ConcertsService>(ConcertsService);

    // Backup original data
    originalConcerts = JSON.parse(JSON.stringify(db.concerts));
    originalReservations = JSON.parse(JSON.stringify(db.reservations));
    originalUsers = JSON.parse(JSON.stringify(db.users));
  });

  afterEach(() => {
    // Restore original data after each test
    db.concerts = JSON.parse(JSON.stringify(originalConcerts));
    db.reservations = JSON.parse(JSON.stringify(originalReservations));
    db.users = JSON.parse(JSON.stringify(originalUsers));
  });

  describe('findAll', () => {
    it('should return all reservations', () => {
      const result = service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('userEmail');
      expect(result[0]).toHaveProperty('concertId');
    });
  });

  describe('findByUser', () => {
    it('should return user reservations', () => {
      const result = service.findByUser('john@example.com');
      expect(result).toBeInstanceOf(Array);
      result.forEach((reservation) => {
        expect(reservation.userEmail).toBe('john@example.com');
      });
    });

    it('should return empty array for user with no reservations', () => {
      const result = service.findByUser('nonexistent@example.com');
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create reservation for valid user', () => {
      // Find a concert with available seats that user hasn't reserved
      const concert = db.concerts.find(
        (c) => c.availableSeats > 0 && !db.reservations.some((r) => r.userEmail === 'bob@example.com' && r.concertId === c.id),
      );

      if (concert) {
        const dto = {
          concertId: concert.id,
          userEmail: 'bob@example.com',
          userName: 'Bob Johnson',
        };

        const beforeSeats = concertsService.findOne(concert.id).availableSeats;
        const beforeCount = db.reservations.length;

        const result = service.create(dto);

        expect(result).toBeDefined();
        expect(result.userEmail).toBe('bob@example.com');
        expect(result.userName).toBe('Bob Johnson');
        expect(result.concertId).toBe(concert.id);
        expect(db.reservations.length).toBe(beforeCount + 1);

        // Check seats decreased
        const afterSeats = concertsService.findOne(concert.id).availableSeats;
        expect(afterSeats).toBe(beforeSeats - 1);
      }
    });

    it('should throw NotFoundException if concert not found', () => {
      const dto = {
        concertId: 999,
        userEmail: 'john@example.com',
        userName: 'John Doe',
      };

      expect(() => service.create(dto)).toThrow(NotFoundException);
      expect(() => service.create(dto)).toThrow('Concert not found');
    });

    it('should throw BadRequestException if no seats available', () => {
      // Find concert with 0 available seats
      const concert = db.concerts.find((c) => c.availableSeats === 0);

      if (concert) {
        const dto = {
          concertId: concert.id,
          userEmail: 'bob@example.com',
          userName: 'Bob Johnson',
        };

        expect(() => service.create(dto)).toThrow(BadRequestException);
        expect(() => service.create(dto)).toThrow('No seats available');
      }
    });

    it('should throw ConflictException if already reserved', () => {
      // john@example.com already reserved concert 1
      const dto = {
        concertId: 1,
        userEmail: 'john@example.com',
        userName: 'John Doe',
      };

      expect(() => service.create(dto)).toThrow(ConflictException);
      expect(() => service.create(dto)).toThrow('Already reserved for this concert');
    });

    it('should throw NotFoundException if user not found', () => {
      const concert = db.concerts.find((c) => c.availableSeats > 0);
      if (concert) {
        const dto = {
          concertId: concert.id,
          userEmail: 'unknown@example.com',
          userName: 'Unknown User',
        };

        expect(() => service.create(dto)).toThrow(NotFoundException);
        expect(() => service.create(dto)).toThrow('User not found. Please register first.');
      }
    });

    it('should throw BadRequestException if userName does not match', () => {
      const concert = db.concerts.find(
        (c) => c.availableSeats > 0 && !db.reservations.some((r) => r.userEmail === 'john@example.com' && r.concertId === c.id),
      );

      if (concert) {
        const dto = {
          concertId: concert.id,
          userEmail: 'john@example.com',
          userName: 'Wrong Name', // Should be 'John Doe'
        };

        expect(() => service.create(dto)).toThrow(BadRequestException);
        expect(() => service.create(dto)).toThrow('User name does not match registered account');
      }
    });

    it('should use user name from database, not from request', () => {
      const concert = db.concerts.find(
        (c) => c.availableSeats > 0 && !db.reservations.some((r) => r.userEmail === 'jane@example.com' && r.concertId === c.id),
      );

      if (concert) {
        const dto = {
          concertId: concert.id,
          userEmail: 'jane@example.com',
          userName: 'Jane Smith',
        };

        const result = service.create(dto);
        // Should use name from database, not from dto
        expect(result.userName).toBe('Jane Smith'); // From db.users
      }
    });
  });

  describe('delete', () => {
    it('should delete own reservation', () => {
      // Find a reservation
      const reservation = db.reservations[0];
      const concertId = reservation.concertId;
      const beforeSeats = concertsService.findOne(concertId).availableSeats;
      const beforeCount = db.reservations.length;

      service.delete(reservation.id, reservation.userEmail);

      expect(db.reservations.length).toBe(beforeCount - 1);
      expect(db.reservations.find((r) => r.id === reservation.id)).toBeUndefined();

      // Check seats increased
      const afterSeats = concertsService.findOne(concertId).availableSeats;
      expect(afterSeats).toBe(beforeSeats + 1);
    });

    it('should throw NotFoundException if reservation not found', () => {
      expect(() => service.delete(999, 'john@example.com')).toThrow(NotFoundException);
      expect(() => service.delete(999, 'john@example.com')).toThrow('Reservation not found');
    });

    it('should throw BadRequestException if not owner', () => {
      const reservation = db.reservations[0];
      const ownerEmail = reservation.userEmail;
      const otherEmail = ownerEmail === 'john@example.com' ? 'jane@example.com' : 'john@example.com';

      expect(() => service.delete(reservation.id, otherEmail)).toThrow(BadRequestException);
      expect(() => service.delete(reservation.id, otherEmail)).toThrow('Can only cancel your own reservations');
    });
  });
});

