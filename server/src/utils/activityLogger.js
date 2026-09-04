import { Activity } from '../models/Activity.js';

export const logActivity = async ({ userId, entityType, entityId, action, description }) => {
  try {
    await Activity.create({
      userId,
      entityType,
      entityId,
      action,
      description,
    });
  } catch (error) {
    console.error('[ActivityLogger Error]:', error);
  }
};
