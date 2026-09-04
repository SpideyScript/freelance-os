import { TimeEntry } from '../models/TimeEntry.js';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { logActivity } from '../utils/activityLogger.js';

export class TimeService {
  static async listTimeEntries(userId, { projectId, taskId, startDate, endDate }) {
    const query = { userId };
    if (projectId) query.projectId = projectId;
    if (taskId) query.taskId = taskId;
    if (startDate && endDate) {
      query.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    return TimeEntry.find(query)
      .populate('projectId', 'name')
      .populate('taskId', 'title')
      .sort({ startTime: -1 });
  }

  static async getActiveTimer(userId) {
    return TimeEntry.findOne({ userId, isTimerRunning: true })
      .populate('projectId', 'name')
      .populate('taskId', 'title');
  }

  static async startTimer(userId, { projectId, taskId, description, isBillable }) {
    const active = await TimeEntry.findOne({ userId, isTimerRunning: true });
    if (active) {
      const now = new Date();
      const duration = Math.floor((now.getTime() - active.startTime.getTime()) / 1000);
      active.endTime = now;
      active.duration = duration;
      active.isTimerRunning = false;
      await active.save();
    }

    const user = await User.findById(userId);
    const timeEntry = await TimeEntry.create({
      userId,
      projectId,
      taskId,
      description: description || 'Focus Session',
      startTime: new Date(),
      isBillable: isBillable !== undefined ? isBillable : true,
      isTimerRunning: true,
      hourlyRate: user?.hourlyRate || 75,
    });

    return timeEntry;
  }

  static async stopTimer(userId, { timeEntryId, description }) {
    const query = { userId, isTimerRunning: true };
    if (timeEntryId) query._id = timeEntryId;

    const timeEntry = await TimeEntry.findOne(query);
    if (!timeEntry) {
      const error = new Error('No active timer running');
      error.statusCode = 400;
      throw error;
    }

    const now = new Date();
    const duration = Math.floor((now.getTime() - timeEntry.startTime.getTime()) / 1000);
    timeEntry.endTime = now;
    timeEntry.duration = duration;
    timeEntry.isTimerRunning = false;
    if (description) timeEntry.description = description;
    await timeEntry.save();

    if (timeEntry.projectId) {
      const allEntries = await TimeEntry.find({ projectId: timeEntry.projectId });
      const totalSecs = allEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
      const actualHours = parseFloat((totalSecs / 3600).toFixed(1));
      await Project.findByIdAndUpdate(timeEntry.projectId, { actualHours });
    }

    await logActivity({
      userId,
      entityType: 'time_entry',
      entityId: timeEntry._id,
      action: 'completed',
      description: `Logged ${Math.round(duration / 60)} minutes: "${timeEntry.description}"`,
    });

    return timeEntry;
  }

  static async logManualTime(userId, data) {
    const user = await User.findById(userId);
    const timeEntry = await TimeEntry.create({
      ...data,
      userId,
      isTimerRunning: false,
      hourlyRate: data.hourlyRate || user?.hourlyRate || 75,
    });

    if (timeEntry.projectId) {
      const allEntries = await TimeEntry.find({ projectId: timeEntry.projectId });
      const totalSecs = allEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
      const actualHours = parseFloat((totalSecs / 3600).toFixed(1));
      await Project.findByIdAndUpdate(timeEntry.projectId, { actualHours });
    }

    await logActivity({
      userId,
      entityType: 'time_entry',
      entityId: timeEntry._id,
      action: 'logged_manual',
      description: `Manually logged ${Math.round(timeEntry.duration / 3600)}h: "${timeEntry.description}"`,
    });

    return timeEntry;
  }

  static async deleteTimeEntry(userId, timeEntryId) {
    const entry = await TimeEntry.findOneAndDelete({ _id: timeEntryId, userId });
    if (!entry) {
      const error = new Error('Time entry not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Time entry deleted' };
  }
}
