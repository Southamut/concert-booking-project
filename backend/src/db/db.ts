// In-memory database for Concert Booking System

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Concert {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
  createdAt: Date;
}

export interface Reservation {
  id: number;
  userEmail: string;
  userName: string;
  concertId: number;
  createdAt: Date;
  status: 'reserved' | 'cancelled';      // NEW
  cancelledAt?: Date;
}

export type ReservationEventType = 'RESERVE' | 'CANCEL';

export interface ReservationEvent {
  id: number;
  reservationId: number;
  userEmail: string;
  userName: string;
  concertId: number;
  type: ReservationEventType;
  at: Date;
}

// In-memory storage with seed data
export const db = {
  users: [
    {
      id: 1,
      email: 'john@example.com',
      name: 'John Doe',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      email: 'jane@example.com',
      name: 'Jane Smith',
      createdAt: new Date('2024-01-02'),
    },
    {
      id: 3,
      email: 'bob@example.com',
      name: 'Bob Johnson',
      createdAt: new Date('2024-01-03'),
    },
  ] as User[],

  concerts: [
    {
      id: 1,
      name: 'Rock Festival 2024',
      description:
        'The biggest rock festival of the year featuring top bands from around the world. Get ready for an unforgettable night of music!',
      totalSeats: 100,
      availableSeats: 95,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: 2,
      name: 'Jazz Night',
      description:
        'An intimate evening of smooth jazz with renowned artists. Perfect for a relaxing night out.',
      totalSeats: 50,
      availableSeats: 30,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 3,
      name: 'Classical Symphony',
      description:
        'Experience the beauty of classical music performed by a world-class orchestra.',
      totalSeats: 200,
      availableSeats: 150,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: 4,
      name: 'Pop Sensation',
      description:
        'Chart-topping pop hits performed live! Dance the night away with the latest music.',
      totalSeats: 150,
      availableSeats: 0,
      createdAt: new Date('2024-01-25'),
    },
    {
      id: 5,
      name: 'Electronic Music Festival',
      description:
        'The ultimate EDM experience with top DJs and stunning visual effects.',
      totalSeats: 300,
      availableSeats: 280,
      createdAt: new Date('2024-02-01'),
    },
    {
      id: 6,
      name: 'Country Music Night',
      description:
        'Authentic country music from talented artists. Bring your cowboy boots!',
      totalSeats: 80,
      availableSeats: 75,
      createdAt: new Date('2024-02-05'),
    },
    {
      id: 7,
      name: 'Hip Hop Live',
      description:
        'The hottest hip hop artists performing live on stage. Feel the energy!',
      totalSeats: 120,
      availableSeats: 0,
      createdAt: new Date('2024-02-10'),
    },
    {
      id: 8,
      name: 'Acoustic Sessions',
      description:
        'Stripped-down acoustic performances in an intimate setting. Pure musical talent.',
      totalSeats: 40,
      availableSeats: 35,
      createdAt: new Date('2024-02-15'),
    },
  ] as Concert[],

  reservations: [
    {
      id: 1,
      userEmail: 'john@example.com',
      userName: 'John Doe',
      concertId: 1,
      createdAt: new Date('2024-01-11'),
      status: 'reserved',
    },
    {
      id: 2,
      userEmail: 'jane@example.com',
      userName: 'Jane Smith',
      concertId: 1,
      createdAt: new Date('2024-01-12'),
      status: 'reserved',
    },
    {
      id: 3,
      userEmail: 'bob@example.com',
      userName: 'Bob Johnson',
      concertId: 2,
      createdAt: new Date('2024-01-16'),
      status: 'reserved',
    },
    {
      id: 4,
      userEmail: 'john@example.com',
      userName: 'John Doe',
      concertId: 2,
      createdAt: new Date('2024-01-17'),
      status: 'reserved',
    },
    {
      id: 5,
      userEmail: 'jane@example.com',
      userName: 'Jane Smith',
      concertId: 3,
      createdAt: new Date('2024-01-21'),
      status: 'reserved',
    },
  ] as Reservation[],

  reservationEvents: [
    {
      id: 1,
      reservationId: 1,
      userEmail: 'john@example.com',
      userName: 'John Doe',
      concertId: 1,
      type: 'RESERVE',
      at: new Date('2024-01-11'),
    },
    {
      id: 2,
      reservationId: 2,
      userEmail: 'jane@example.com',
      userName: 'Jane Smith',
      concertId: 1,
      type: 'RESERVE',
      at: new Date('2024-01-12'),
    },
    {
      id: 3,
      reservationId: 3,
      userEmail: 'bob@example.com',
      userName: 'Bob Johnson',
      concertId: 2,
      type: 'RESERVE',
      at: new Date('2024-01-16'),
    },
    {
      id: 4,
      reservationId: 4,
      userEmail: 'john@example.com',
      userName: 'John Doe',
      concertId: 2,
      type: 'RESERVE',
      at: new Date('2024-01-17'),
    },
    {
      id: 5,
      reservationId: 5,
      userEmail: 'jane@example.com',
      userName: 'Jane Smith',
      concertId: 3,
      type: 'RESERVE',
      at: new Date('2024-01-21'),
    },
  ] as ReservationEvent[],
};

// Auto-increment IDs
let nextUserId = 4;
let nextConcertId = 9;
let nextReservationId = 6;
let nextReservationEventId = 6;

export const getNextId = (
  type: 'user' | 'concert' | 'reservation' | 'reservationEvent',
): number => {
  if (type === 'user') return nextUserId++;
  if (type === 'concert') return nextConcertId++;
  if (type === 'reservation') return nextReservationId++;
  return nextReservationEventId++;
};

// Helper functions
export const findUserByEmail = (email: string): User | undefined => {
  return db.users.find((user) => user.email === email);
};

export const createUser = (email: string, name: string): User => {
  const user: User = {
    id: getNextId('user'),
    email,
    name,
    createdAt: new Date(),
  };
  db.users.push(user);
  return user;
};

export const findOrCreateUser = (email: string, name: string): User => {
  const existingUser = findUserByEmail(email);
  if (existingUser) return existingUser;
  return createUser(email, name);
};

export const hasReservation = (userEmail: string, concertId: number): boolean => {
  return db.reservations.some(
    (r) =>
      r.userEmail === userEmail &&
      r.concertId === concertId &&
      r.status === 'reserved',          // only active ones
  );
};

export const findConcertById = (id: number): Concert | undefined => {
  return db.concerts.find((concert) => concert.id === id);
};

export const getUserReservations = (userEmail: string): Reservation[] => {
  return db.reservations.filter((r) => r.userEmail === userEmail);
};

