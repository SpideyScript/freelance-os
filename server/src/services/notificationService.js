import { Notification } from '../models/Notification.js';

export class NotificationService {
  static async getUserNotifications(userId) {
    return Notification.find({ userId }).sort({ createdAt: -1 }).limit(30);
  }

  static async markAsRead(userId, notificationId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { $set: { isRead: true } },
      { new: true }
    );
  }

  static async markAllAsRead(userId) {
    await Notification.updateMany({ userId }, { $set: { isRead: true } });
    return { message: 'All notifications marked as read' };
  }

  static async createNotification({ userId, title, message, type, link }) {
    return Notification.create({
      userId,
      title,
      message,
      type: type || 'system_alert',
      link,
    });
  }
}
