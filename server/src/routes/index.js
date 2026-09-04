import { Router } from 'express';
import authRoutes from './authRoutes.js';
import clientRoutes from './clientRoutes.js';
import projectRoutes from './projectRoutes.js';
import taskRoutes from './taskRoutes.js';
import proposalRoutes from './proposalRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import timeRoutes from './timeRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import aiRoutes from './aiRoutes.js';

import { requireAuth } from '../middleware/authMiddleware.js';
import { Client } from '../models/Client.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Invoice } from '../models/Invoice.js';
import { Proposal } from '../models/Proposal.js';

const router = Router();

// Subroutes mounting
router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/proposals', proposalRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/time', timeRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ai', aiRoutes);

// Global Search (Cmd+K) across all workspace records
router.get('/search', requireAuth, async (req, res, next) => {
  try {
    const q = req.query.q || '';
    if (!q || q.length < 1) {
      return res.status(200).json({ success: true, data: { clients: [], projects: [], tasks: [], invoices: [], proposals: [] } });
    }

    const regex = new RegExp(q, 'i');
    const userId = req.userId;

    const [clients, projects, tasks, invoices, proposals] = await Promise.all([
      Client.find({ userId, $or: [{ name: regex }, { company: regex }, { email: regex }] }).limit(5),
      Project.find({ userId, name: regex }).limit(5),
      Task.find({ userId, title: regex }).limit(5),
      Invoice.find({ userId, invoiceNumber: regex }).limit(5),
      Proposal.find({ userId, title: regex }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: { clients, projects, tasks, invoices, proposals },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
