import { z } from 'zod';

export const createProposalSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  title: z.string().min(2, 'Proposal title is required'),
  description: z.string().optional(),
  services: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        rate: z.number(),
        amount: z.number(),
      })
    )
    .min(1, 'At least one service is required'),
  deliverables: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  pricingExplanation: z.string().optional(),
  terms: z.string().optional(),
  callToAction: z.string().optional(),
  totalAmount: z.number().min(0),
  status: z
    .enum(['draft', 'sent', 'accepted', 'rejected', 'expired'])
    .optional()
    .default('draft'),
  generatedWithAi: z.boolean().optional().default(false),
  expirationDate: z.string().datetime().optional().or(z.date()).optional(),
});

export const updateProposalSchema = createProposalSchema.partial();
