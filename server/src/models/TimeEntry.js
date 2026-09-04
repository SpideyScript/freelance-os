import mongoose, { Schema } from 'mongoose';

const TimeEntrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', index: true },
    description: { type: String, trim: true },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number, default: 0 }, // Duration in seconds
    isBillable: { type: Boolean, default: true },
    isTimerRunning: { type: Boolean, default: false, index: true },
    hourlyRate: { type: Number, default: 75 },
  },
  { timestamps: true }
);

TimeEntrySchema.index({ userId: 1, startTime: -1 });

export const TimeEntry = mongoose.model('TimeEntry', TimeEntrySchema);
