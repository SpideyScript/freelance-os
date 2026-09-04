import { z } from 'zod';

export const aiProposalSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientCompany: z.string().optional(),
  projectDescription: z.string().min(10, 'Project description is too short'),
  services: z.array(z.string()).optional(),
  budget: z.number().optional(),
  timeline: z.string().optional(),
  freelancerSkills: z.array(z.string()).optional(),
});

export const aiMessageSchema = z.object({
  clientId: z.string().optional(),
  recipientName: z.string().min(1, 'Recipient name is required'),
  intent: z.enum([
    'project_update',
    'proposal_followup',
    'invoice_reminder',
    'kickoff',
    'feedback_request',
  ]),
  tone: z.enum(['professional', 'friendly', 'concise', 'persuasive']),
  keyPoints: z.string().optional(),
  projectName: z.string().optional(),
});

export const aiProjectPlannerSchema = z.object({
  projectName: z.string().min(2, 'Project name is required'),
  projectDescription: z.string().min(10, 'Project description is too short'),
  timeline: z.string().optional(),
  budget: z.number().optional(),
});

export const aiTaskPrioritizerSchema = z.object({
  tasks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        projectName: z.string().optional(),
        dueDate: z.any().optional(),
        priority: z.string().optional(),
        estimatedHours: z.number().optional(),
        status: z.string().optional(),
      })
    )
    .min(1, 'At least one task is required'),
});

export const aiInvoiceReminderSchema = z.object({
  invoiceNumber: z.string().min(1),
  clientName: z.string().min(1),
  amount: z.number().min(0),
  dueDate: z.any(),
  daysOverdue: z.number().min(0),
  relationshipTone: z.enum(['gentle', 'firm', 'urgent']),
});

export const aiSummarizeMeetingSchema = z.object({
  rawNotes: z.string().min(10, 'Meeting notes are too short'),
  clientName: z.string().optional(),
  projectName: z.string().optional(),
});

export const aiChatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
});
