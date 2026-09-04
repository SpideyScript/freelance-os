import mongoose, { Schema } from 'mongoose';

const SubtaskSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const TaskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done'],
      default: 'todo',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    dueDate: { type: Date, index: true },
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    subtasks: [SubtaskSchema],
    tags: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TaskSchema.index({ userId: 1, status: 1, order: 1 });

export const Task = mongoose.model('Task', TaskSchema);
