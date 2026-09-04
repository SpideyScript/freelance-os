import mongoose, { Schema } from 'mongoose';

const ClientSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['active', 'lead', 'inactive'], default: 'active' },
    tags: [{ type: String, trim: true }],
    notes: { type: String },
    totalRevenue: { type: Number, default: 0 },
    lastInteraction: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ClientSchema.index({ userId: 1, email: 1 });
ClientSchema.index({ userId: 1, name: 'text', company: 'text' });

export const Client = mongoose.model('Client', ClientSchema);
