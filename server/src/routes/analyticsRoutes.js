import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/dashboard', analyticsController.getDashboardMetrics);
router.get('/financial-report', analyticsController.getFinancialReport);

export default router;
