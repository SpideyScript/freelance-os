import { Router } from 'express';
import * as aiController from '../controllers/aiController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import {
  aiProposalSchema,
  aiMessageSchema,
  aiProjectPlannerSchema,
  aiTaskPrioritizerSchema,
  aiInvoiceReminderSchema,
  aiSummarizeMeetingSchema,
  aiChatSchema,
} from '../validators/aiValidators.js';

const router = Router();

router.use(requireAuth);
router.use(aiLimiter);

router.post('/proposal', validate(aiProposalSchema), aiController.generateProposal);
router.post('/message', validate(aiMessageSchema), aiController.generateMessage);
router.post('/project-planner', validate(aiProjectPlannerSchema), aiController.generateProjectPlan);
router.post('/prioritize-tasks', validate(aiTaskPrioritizerSchema), aiController.prioritizeTasks);
router.post('/invoice-reminder', validate(aiInvoiceReminderSchema), aiController.generateInvoiceReminder);
router.post('/summarize-meeting', validate(aiSummarizeMeetingSchema), aiController.summarizeMeeting);
router.get('/business-advisor', aiController.getBusinessAdvisor);
router.post('/chat', validate(aiChatSchema), aiController.chat);

export default router;
