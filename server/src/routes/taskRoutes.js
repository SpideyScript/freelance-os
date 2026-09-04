import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createTaskSchema, updateTaskSchema } from '../validators/taskValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/', taskController.listTasks);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.post('/reorder', taskController.reorderTasks);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
