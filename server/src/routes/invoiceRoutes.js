import { Router } from 'express';
import * as invoiceController from '../controllers/invoiceController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createInvoiceSchema, updateInvoiceSchema } from '../validators/invoiceValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/', invoiceController.listInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', validate(createInvoiceSchema), invoiceController.createInvoice);
router.put('/:id', validate(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

export default router;
