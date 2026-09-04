import { NotificationService } from '../services/notificationService.js';

export const getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.userId);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await NotificationService.markAsRead(req.userId, req.params.id);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await NotificationService.markAllAsRead(req.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
