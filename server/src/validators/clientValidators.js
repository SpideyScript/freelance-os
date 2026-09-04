import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Client name is required'),
  email: z.string().email('Valid client email is required'),
  company: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  currency: z.string().optional().default('USD'),
  status: z.enum(['active', 'lead', 'inactive']).optional().default('active'),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();
