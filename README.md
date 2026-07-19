# Dental Clinic – Backend API

A RESTful backend API for a dental clinic appointment booking system, providing endpoints for managing doctors, services availability, appointments, and admin authentication.

## Features

- JWT-based admin authentication
- Doctor management (add, edit, delete, weekly working schedule)
- Real-time available time slot calculation based on doctor schedule, existing appointments, and manually blocked slots
- Appointment booking with automatic conflict prevention (no double-booking)
- Manual time slot blocking (e.g. for doctor leave or unavailability)
- Request validation with Zod
- Protected admin-only routes (create/update/delete operations)

## Tech Stack
- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL
- Zod (validation)
- JWT (authentication)
- bcrypt (password hashing)

## Getting Started

### Prerequisites
- Node.js installed
- MySQL server running locally or remotely

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file in the root directory with:

### Database Setup
```bash
npx prisma migrate dev
```

### Run the development server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

## API Overview

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | /auth/login | Admin login | No |
| GET | /doctors | List all doctors | No |
| POST | /doctors | Add a new doctor | Yes |
| PUT | /doctors/:id | Update a doctor | Yes |
| DELETE | /doctors/:id | Delete a doctor | Yes |
| GET | /doctors/:id/availability | Get available time slots for a date | No |
| GET | /doctors/:id/schedule | Get a doctor's weekly schedule | No |
| PUT | /doctors/:id/schedule | Update a doctor's weekly schedule | Yes |
| GET | /appointments | List all appointments | No |
| POST | /appointments | Book an appointment | No |
| PATCH | /appointments/:id/cancel | Cancel an appointment | Yes |
| DELETE | /appointments/:id | Permanently delete an appointment | Yes |
| GET | /blocked-slots | List blocked time slots | No |
| POST | /blocked-slots | Block a time slot | Yes |
| DELETE | /blocked-slots/:id | Unblock a time slot | Yes |

## Related Repository
- Frontend: [reservation-app](#)