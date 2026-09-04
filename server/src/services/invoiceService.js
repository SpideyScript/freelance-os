import { Invoice } from '../models/Invoice.js';
import { Client } from '../models/Client.js';
import { logActivity } from '../utils/activityLogger.js';

export class InvoiceService {
  static calculateInvoiceTotals(items, taxRate = 0, discountAmount = 0) {
    const calculatedItems = items.map((item) => ({
      description: item.description,
      quantity: Number(item.quantity) || 1,
      rate: Number(item.rate) || 0,
      amount: parseFloat(((Number(item.quantity) || 1) * (Number(item.rate) || 0)).toFixed(2)),
    }));

    const subtotal = calculatedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxableAmount = Math.max(0, subtotal - (Number(discountAmount) || 0));
    const taxAmount = parseFloat(((taxableAmount * (Number(taxRate) || 0)) / 100).toFixed(2));
    const total = parseFloat((taxableAmount + taxAmount).toFixed(2));

    return { calculatedItems, subtotal, taxAmount, total };
  }

  static async listInvoices(userId, { clientId, projectId, paymentStatus, search }) {
    const query = { userId };

    if (clientId && clientId !== 'all') {
      query.clientId = clientId;
    }
    if (projectId && projectId !== 'all') {
      query.projectId = projectId;
    }
    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }
    if (search) {
      query.invoiceNumber = { $regex: search, $options: 'i' };
    }

    const invoices = await Invoice.find(query)
      .populate('clientId', 'name company email')
      .populate('projectId', 'name')
      .sort({ issueDate: -1 });

    const now = new Date();
    for (const inv of invoices) {
      if (inv.paymentStatus === 'sent' && new Date(inv.dueDate) < now) {
        inv.paymentStatus = 'overdue';
        await inv.save();
      }
    }

    return invoices;
  }

  static async getInvoiceById(userId, invoiceId) {
    const invoice = await Invoice.findOne({ _id: invoiceId, userId })
      .populate('clientId', 'name company email address phone')
      .populate('projectId', 'name');

    if (!invoice) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }
    return invoice;
  }

  static async createInvoice(userId, data) {
    const { calculatedItems, subtotal, taxAmount, total } = this.calculateInvoiceTotals(
      data.items,
      data.taxRate,
      data.discountAmount
    );

    const invoice = await Invoice.create({
      ...data,
      userId,
      items: calculatedItems,
      subtotal,
      taxAmount,
      total,
    });

    await logActivity({
      userId,
      entityType: 'invoice',
      entityId: invoice._id,
      action: 'created',
      description: `Created invoice #${invoice.invoiceNumber} for $${total.toLocaleString()}`,
    });

    return invoice;
  }

  static async updateInvoice(userId, invoiceId, data) {
    let updatePayload = { ...data };

    if (data.items) {
      const { calculatedItems, subtotal, taxAmount, total } = this.calculateInvoiceTotals(
        data.items,
        data.taxRate,
        data.discountAmount
      );
      updatePayload = {
        ...updatePayload,
        items: calculatedItems,
        subtotal,
        taxAmount,
        total,
      };
    }

    if (data.paymentStatus === 'paid' && !data.paidAt) {
      updatePayload.paidAt = new Date();
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, userId },
      { $set: updatePayload },
      { new: true }
    )
      .populate('clientId', 'name company email address')
      .populate('projectId', 'name');

    if (!invoice) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }

    if (invoice.paymentStatus === 'paid') {
      const paidInvoices = await Invoice.find({ clientId: invoice.clientId, paymentStatus: 'paid' });
      const lifetimeRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
      await Client.findByIdAndUpdate(invoice.clientId, { totalRevenue: lifetimeRevenue });
    }

    await logActivity({
      userId,
      entityType: 'invoice',
      entityId: invoice._id,
      action: 'updated',
      description: `Updated invoice #${invoice.invoiceNumber} status to ${invoice.paymentStatus}`,
    });

    return invoice;
  }

  static async deleteInvoice(userId, invoiceId) {
    const invoice = await Invoice.findOneAndDelete({ _id: invoiceId, userId });
    if (!invoice) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Invoice deleted successfully' };
  }
}
