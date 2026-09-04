import { z } from 'zod';

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  projectId: z.string().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  issueDate: z.string().datetime().optional().or(z.date()).optional(),
  dueDate: z.string().datetime().or(z.date()),
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'Description is required'),
        quantity: z.number().min(0.01),
        rate: z.number().min(0),
      })
    )
    .min(1, 'At least one item is required'),
  taxRate: z.number().min(0).optional().default(0),
  discountAmount: z.number().min(0).optional().default(0),
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
  paymentStatus: z
    .enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
    .optional()
    .default('draft'),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();
