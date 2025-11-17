import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { db, Concert } from '../db/db';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let originalConcerts: Concert[];
  let originalReservations: any[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcertsService],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);

    // Backup original data
    originalConcerts = JSON.parse(JSON.stringify(db.concerts));
    originalReservations = JSON.parse(JSON.stringify(db.reservations));
  });

  afterEach(() => {
    // Restore original data after each test
    db.concerts = JSON.parse(JSON.stringify(originalConcerts));
    db.reservations = JSON.parse(JSON.stringify(originalReservations));
  });

  describe('findAll', () => {
    it('should return all concerts', () => {
      const result = service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('totalSeats');
      expect(result[0]).toHaveProperty('availableSeats');
    });
  });

  describe('findOne', () => {
    it('should return concert by id', () => {
      const result = service.findOne(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBeDefined();
    });

    it('should throw NotFoundException if concert not found', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow('Concert with ID 999 not found');
    });
  });

  describe('create', () => {
    it('should create new concert', () => {
      const dto = {
        name: 'Test Concert',
        description: 'Test description',
        totalSeats: 100,
      };

      const beforeCount = db.concerts.length;
      const result = service.create(dto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Test Concert');
      expect(result.description).toBe('Test description');
      expect(result.totalSeats).toBe(100);
      expect(result.availableSeats).toBe(100); // Should equal totalSeats
      expect(db.concerts.length).toBe(beforeCount + 1);
    });

    it('should set availableSeats equal to totalSeats on creation', () => {
      const dto = {
        name: 'New Concert',
        description: 'Description',
        totalSeats: 50,
      };

      const result = service.create(dto);
      expect(result.availableSeats).toBe(result.totalSeats);
    });
  });

  describe('delete', () => {
    it('should delete concert without reservations', () => {
      // Create a concert with no reservations
      const newConcert = service.create({
        name: 'To Delete',
        description: 'Will be deleted',
        totalSeats: 50,
      });

      const beforeCount = db.concerts.length;
      expect(() => service.delete(newConcert.id)).not.toThrow();
      expect(db.concerts.length).toBe(beforeCount - 1);
      expect(db.concerts.find((c) => c.id === newConcert.id)).toBeUndefined();
    });

    it('should throw BadRequestException if concert has reservations', () => {
      // Concert 1 has reservations in seed data
      expect(() => service.delete(1)).toThrow(BadRequestException);
      expect(() => service.delete(1)).toThrow('Cannot delete concert with reservations');
    });

    it('should throw NotFoundException if concert not found', () => {
      expect(() => service.delete(999)).toThrow(NotFoundException);
      expect(() => service.delete(999)).toThrow('Concert with ID 999 not found');
    });
  });

  describe('decrementSeats', () => {
    it('should decrease availableSeats by 1', () => {
      const concert = service.findOne(1);
      const beforeSeats = concert.availableSeats;

      service.decrementSeats(1);

      const afterConcert = service.findOne(1);
      expect(afterConcert.availableSeats).toBe(beforeSeats - 1);
    });

    it('should throw NotFoundException if concert not found', () => {
      expect(() => service.decrementSeats(999)).toThrow(NotFoundException);
    });

    it('should throw BadRequestException if no seats available', () => {
      // Find a concert with 0 available seats (concert 4 or 7)
      const concert = db.concerts.find((c) => c.availableSeats === 0);
      if (concert) {
        expect(() => service.decrementSeats(concert.id)).toThrow(BadRequestException);
        expect(() => service.decrementSeats(concert.id)).toThrow('No seats available');
      }
    });
  });

  describe('incrementSeats', () => {
    it('should increase availableSeats by 1', () => {
      const concert = service.findOne(1);
      const beforeSeats = concert.availableSeats;

      service.incrementSeats(1);

      const afterConcert = service.findOne(1);
      expect(afterConcert.availableSeats).toBe(beforeSeats + 1);
    });

    it('should not exceed totalSeats', () => {
      const concert = service.findOne(1);
      const totalSeats = concert.totalSeats;
      const availableSeats = concert.availableSeats;

      // Increment until full
      for (let i = availableSeats; i < totalSeats; i++) {
        service.incrementSeats(1);
      }

      const afterConcert = service.findOne(1);
      expect(afterConcert.availableSeats).toBe(totalSeats);

      // Try to increment beyond total - should not increase
      service.incrementSeats(1);
      const finalConcert = service.findOne(1);
      expect(finalConcert.availableSeats).toBe(totalSeats);
    });

    it('should handle non-existent concert gracefully', () => {
      // incrementSeats doesn't throw, just does nothing
      expect(() => service.incrementSeats(999)).not.toThrow();
    });
  });
});

