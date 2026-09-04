import mongoose, { Schema } from 'mongoose';

const MilestoneSchema = new Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

const DocumentSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const ProjectSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['planning', 'in_progress', 'in_review', 'completed', 'on_hold'],
      default: 'in_progress',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    budget: { type: Number, default: 0 },
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    startDate: { type: Date },
    dueDate: { type: Date, index: true },
    milestones: [MilestoneSchema],
    documents: [DocumentSchema],
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

ProjectSchema.index({ userId: 1, status: 1 });
ProjectSchema.index({ userId: 1, name: 'text' });

export const Project = mongoose.model('Project', ProjectSchema);
