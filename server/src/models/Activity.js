import mongoose, { Schema } from 'mongoose';

const ActivitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    entityType: {
      type: String,
      enum: ['client', 'project', 'task', 'invoice', 'proposal', 'time_entry'],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

ActivitySchema.index({ userId: 1, createdAt: -1 });

export const Activity = mongoose.model('Activity', ActivitySchema);
