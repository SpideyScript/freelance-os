import { Task } from '../models/Task.js';
import { logActivity } from '../utils/activityLogger.js';

export class TaskService {
  static async listTasks(userId, { projectId, status, priority, search }) {
    const query = { userId };

    if (projectId && projectId !== 'all') {
      query.projectId = projectId;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    return Task.find(query)
      .populate('projectId', 'name')
      .sort({ order: 1, createdAt: -1 });
  }

  static async createTask(userId, data) {
    const count = await Task.countDocuments({ userId, status: data.status || 'todo' });
    const task = await Task.create({ ...data, userId, order: count });
    await logActivity({
      userId,
      entityType: 'task',
      entityId: task._id,
      action: 'created',
      description: `Created task "${task.title}"`,
    });
    return task;
  }

  static async updateTask(userId, taskId, data) {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: data },
      { new: true }
    ).populate('projectId', 'name');

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return task;
  }

  static async reorderTasks(userId, taskUpdates) {
    const bulkOps = taskUpdates.map((item) => ({
      updateOne: {
        filter: { _id: item.id, userId },
        update: { $set: { status: item.status, order: item.order } },
      },
    }));

    await Task.bulkWrite(bulkOps);
    return { message: 'Tasks updated successfully' };
  }

  static async deleteTask(userId, taskId) {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Task deleted successfully' };
  }
}
