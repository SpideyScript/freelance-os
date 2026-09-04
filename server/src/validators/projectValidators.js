import { z } from 'zod';

export const createProjectSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  name: z.string().min(2, 'Project name is required'),
  description: z.string().optional(),
  status: z
    .enum(['planning', 'in_progress', 'in_review', 'completed', 'on_hold'])
    .optional()
    .default('in_progress'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  budget: z.number().optional().default(0),
  estimatedHours: z.number().optional().default(0),
  startDate: z.string().datetime().optional().or(z.date()).optional(),
  dueDate: z.string().datetime().optional().or(z.date()).optional(),
  milestones: z
    .array(
      z.object({
        title: z.string(),
        dueDate: z.string().datetime().or(z.date()),
        completed: z.boolean().default(false),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
