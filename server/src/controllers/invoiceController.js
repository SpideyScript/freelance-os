import { InvoiceService } from '../services/invoiceService.js';

export const listInvoices = async (req, res, next) => {
  try {
    const invoices = await InvoiceService.listInvoices(req.userId, {
      clientId: req.query.clientId,
      projectId: req.query.projectId,
      paymentStatus: req.query.paymentStatus,
      search: req.query.search,
    });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.getInvoiceById(req.userId, req.params.id);
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.createInvoice(req.userId, req.body);
    res.status(201).json({ success: true, message: 'Invoice created', data: invoice });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.updateInvoice(req.userId, req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Invoice updated', data: invoice });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const result = await InvoiceService.deleteInvoice(req.userId, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
