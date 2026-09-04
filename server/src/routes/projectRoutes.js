import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createProjectSchema, updateProjectSchema } from '../validators/projectValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/', projectController.listProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', validate(createProjectSchema), projectController.createProject);
router.put('/:id', validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
