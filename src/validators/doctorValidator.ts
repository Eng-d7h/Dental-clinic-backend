import { z } from 'zod';

export const createDoctorSchema = z.object({
  name: z.string().min(2, 'Doctor name must be at least 2 characters'),
  specialty: z.string().min(2, 'Specialty must be at least 2 characters'),
});