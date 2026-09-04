import { Router } from 'express';
import * as timeController from '../controllers/timeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { startTimerSchema, stopTimerSchema, manualTimeEntrySchema } from '../validators/timeValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/', timeController.listTimeEntries);
router.get('/active', timeController.getActiveTimer);
router.post('/start', validate(startTimerSchema), timeController.startTimer);
router.post('/stop', validate(stopTimerSchema), timeController.stopTimer);
router.post('/manual', validate(manualTimeEntrySchema), timeController.logManualTime);
router.delete('/:id', timeController.deleteTimeEntry);

export default router;
