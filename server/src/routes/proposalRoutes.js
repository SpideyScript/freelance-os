import { Router } from 'express';
import * as proposalController from '../controllers/proposalController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createProposalSchema, updateProposalSchema } from '../validators/proposalValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/', proposalController.listProposals);
router.get('/:id', proposalController.getProposalById);
router.post('/', validate(createProposalSchema), proposalController.createProposal);
router.put('/:id', validate(updateProposalSchema), proposalController.updateProposal);
router.delete('/:id', proposalController.deleteProposal);

export default router;
