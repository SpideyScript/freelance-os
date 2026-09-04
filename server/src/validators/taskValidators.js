import { z } from 'zod';

export const createTaskSchema = z.object({
  projectId: z.string().optional(),
  title: z.string().min(2, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional().default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  dueDate: z.string().datetime().optional().or(z.date()).optional(),
  estimatedHours: z.number().optional().default(0),
  subtasks: z
    .array(
      z.object({
        title: z.string(),
        completed: z.boolean().default(false),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
