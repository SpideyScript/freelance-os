import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AIConversationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Copilot Chat' },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export const AIConversation = mongoose.model('AIConversation', AIConversationSchema);
