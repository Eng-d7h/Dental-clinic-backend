import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  price: z.number().positive('Price must be a positive number'),
  duration: z.number().int().positive('Duration must be a positive whole number'),
});