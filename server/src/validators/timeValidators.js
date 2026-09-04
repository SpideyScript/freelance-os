import { z } from 'zod';

export const startTimerSchema = z.object({
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  description: z.string().optional(),
  isBillable: z.boolean().optional().default(true),
});

export const stopTimerSchema = z.object({
  timeEntryId: z.string().optional(),
  description: z.string().optional(),
});

export const manualTimeEntrySchema = z.object({
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  description: z.string().optional(),
  startTime: z.string().datetime().or(z.date()),
  duration: z.number().min(1, 'Duration must be at least 1 second'),
  isBillable: z.boolean().optional().default(true),
  hourlyRate: z.number().optional(),
});
