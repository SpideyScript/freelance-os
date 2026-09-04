import { Router } from 'express';
import * as clientController from '../controllers/clientController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createClientSchema, updateClientSchema } from '../validators/clientValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/', clientController.listClients);
router.get('/:id', clientController.getClientById);
router.post('/', validate(createClientSchema), clientController.createClient);
router.put('/:id', validate(updateClientSchema), clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;
