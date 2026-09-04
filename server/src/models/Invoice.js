import mongoose, { Schema } from 'mongoose';

const InvoiceItemSchema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const InvoiceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    invoiceNumber: { type: String, required: true, index: true },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true, index: true },
    items: [InvoiceItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    notes: { type: String },
    paymentTerms: { type: String, default: 'Net 14 days' },
    paymentStatus: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
      index: true,
    },
    paidAt: { type: Date },
    reminderHistory: [
      {
        sentAt: { type: Date, default: Date.now },
        reminderType: { type: String },
      },
    ],
  },
  { timestamps: true }
);

InvoiceSchema.index({ userId: 1, invoiceNumber: 1 });
InvoiceSchema.index({ userId: 1, paymentStatus: 1 });

export const Invoice = mongoose.model('Invoice', InvoiceSchema);
