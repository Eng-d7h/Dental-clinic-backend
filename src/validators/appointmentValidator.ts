import { z } from 'zod';

export const createAppointmentSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters'),
  patientPhone: z.string().min(9, 'Please enter a valid phone number'),
  doctorId: z.number().int().positive('Please select a doctor'),
  date: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select a time'),
});