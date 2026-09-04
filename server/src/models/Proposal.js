import mongoose, { Schema } from 'mongoose';

const ProposalServiceItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const ProposalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    services: [ProposalServiceItemSchema],
    deliverables: [{ type: String }],
    timeline: { type: String },
    pricingExplanation: { type: String },
    terms: { type: String },
    callToAction: { type: String },
    totalAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
      default: 'draft',
      index: true,
    },
    generatedWithAi: { type: Boolean, default: false },
    sentAt: { type: Date },
    acceptedAt: { type: Date },
    expirationDate: { type: Date },
  },
  { timestamps: true }
);

export const Proposal = mongoose.model('Proposal', ProposalSchema);
