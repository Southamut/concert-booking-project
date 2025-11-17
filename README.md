# Concert Booking System

A full-stack concert booking application built with NestJS (backend) and Next.js (frontend).


## 📋 Setup & Configuration

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

**Note**: Environment variables are optional. The application uses default values:
- API URL: `http://localhost:3001`
- Mock user: `john@example.com` / `John Doe`

If you want to customize these values, create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MOCK_USER_EMAIL=john@example.com
NEXT_PUBLIC_MOCK_USER_NAME=John Doe
```

Backend uses default port 3001 (can be overridden with `PORT` environment variable).


## 🏗️ Architecture Overview

### System Architecture

```
Frontend (Next.js)          Backend (NestJS)          Database
Port: 3000          ◄──►   Port: 3001          ◄──►  In-Memory
                                                      (db.ts)
```

### Backend Architecture (NestJS)

**Modular Structure**:
- `AppModule` - Root module
- `ConcertsModule` - Concert management (CRUD operations)
- `ReservationsModule` - Reservation management and event logging

**Layer Pattern**:
- **Controllers** (`*.controller.ts`) - Handle HTTP requests/responses
- **Services** (`*.service.ts`) - Business logic
- **DTOs** (`*.dto.ts`) - Data validation using `class-validator`
- **Database** (`db/db.ts`) - In-memory storage with seed data

**Key Features**:
- Global validation pipes for request validation
- CORS enabled for frontend communication
- Event logging for reservation history

### Frontend Architecture (Next.js)

**App Router Structure**:
- `/user/booking` - User interface for browsing and reserving concerts
- `/admin/home` - Admin dashboard with statistics
- `/admin/history` - Reservation history view

**Component Organization**:
- **Pages** - Route components in `app/` directory
- **Components** - Reusable UI components
  - Layout components (`AdminLayout`, `UserLayout`)
  - Feature components (`ConcertCard`, `AdminConcertCardList`)
  - UI primitives (`button`, `input`, `card` from `components/ui/`)

**State Management**:
- React hooks (`useState`, `useEffect`, `useMemo`)
- Client-side state for UI interactions
- Server-side data fetching with `fetch` API


## 📚 Libraries & Packages

### Backend

| Package | Role |
|---------|------|
| `@nestjs/core` | Core NestJS framework |
| `@nestjs/platform-express` | Express adapter for HTTP server |
| `class-validator` | DTO validation decorators |
| `class-transformer` | Object transformation |
| `jest` | Testing framework |
| `@nestjs/testing` | Testing utilities for NestJS |

### Frontend

| Package | Role |
|---------|------|
| `next` | React framework with App Router |
| `react` / `react-dom` | UI library |
| `tailwindcss` | Utility-first CSS framework |
| `shadcn/ui` | UI component library (includes alert-dialog, tooltip, toast notifications, etc.) |
| `lucide-react` | Icon library |


## 🧪 Running Unit Tests

### Backend Tests

Run all unit tests:
```bash
cd backend
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:cov
```

### Test Coverage

The backend includes unit tests for:
- **ConcertsService**: CRUD operations, seat management
- **ReservationsService**: Reservation creation, cancellation, validation

Test files are located in `backend/src/**/*.spec.ts`


## ▶️ Running the Application

### Development Mode

**Backend**:
```bash
cd backend
npm run start:dev
```
Runs on `http://localhost:3001`

**Frontend**:
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:3000`


## 📁 Project Structure

```
concert-booking-project/
├── backend/
│   ├── src/
│   │   ├── concerts/          # Concert module
│   │   ├── reservations/     # Reservation module
│   │   ├── db/               # In-memory database
│   │   └── main.ts           # Entry point
│   └── test/                 # E2E tests
└── frontend/
    ├── app/                  # Next.js pages
    ├── components/           # React components
    └── lib/                  # Utilities (API config)
```

## ⭐ Bonus Task

### 1.Website Optimization in case Intensive Data & High Traffic

- Change database to SQL with proper indexing
- Implement Redis caching for frequently accessed data (concerts, statistics). This may reduce server traffic and make user experience better

### 2.Handling many users want to reserve the ticket at the same time? (Preventing Overbooking)

Using Queue-Based System to make reservation by queue
  - When a user requests a reservation, the request is added to a queue instead of processing immediately
  - Process reservations sequentially
  - Prevent race conditions

Also use Database Constraints to double-check data before saving
  - prevent same user can accidently booking more than 1 ticket per consert
  - check that consert still have available seats to prevent user can accidently booking sold out ticket

---

**Note**: This project uses an in-memory database. Data is lost on server restart.
 
