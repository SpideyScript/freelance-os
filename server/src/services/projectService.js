import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { TimeEntry } from '../models/TimeEntry.js';
import { Invoice } from '../models/Invoice.js';
import { logActivity } from '../utils/activityLogger.js';

export class ProjectService {
  static async listProjects(userId, { clientId, status, priority, search }) {
    const query = { userId };

    if (clientId && clientId !== 'all') {
      query.clientId = clientId;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    return Project.find(query).populate('clientId', 'name company email').sort({ updatedAt: -1 });
  }

  static async getProjectById(userId, projectId) {
    const project = await Project.findOne({ _id: projectId, userId }).populate(
      'clientId',
      'name company email currency'
    );
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const [tasks, timeEntries, invoices] = await Promise.all([
      Task.find({ projectId, userId }).sort({ order: 1, createdAt: -1 }),
      TimeEntry.find({ projectId, userId }).sort({ startTime: -1 }),
      Invoice.find({ projectId, userId }).sort({ issueDate: -1 }),
    ]);

    return { project, tasks, timeEntries, invoices };
  }

  static async createProject(userId, data) {
    const project = await Project.create({ ...data, userId });
    await logActivity({
      userId,
      entityType: 'project',
      entityId: project._id,
      action: 'created',
      description: `Created project "${project.name}" with budget $${project.budget.toLocaleString()}`,
    });
    return project;
  }

  static async updateProject(userId, projectId, data) {
    const project = await Project.findOneAndUpdate(
      { _id: projectId, userId },
      { $set: data },
      { new: true }
    );
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }
    await logActivity({
      userId,
      entityType: 'project',
      entityId: project._id,
      action: 'updated',
      description: `Updated project "${project.name}" status to ${project.status}`,
    });
    return project;
  }

  static async deleteProject(userId, projectId) {
    const project = await Project.findOneAndDelete({ _id: projectId, userId });
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }
    await Task.deleteMany({ projectId, userId });
    return { message: 'Project and associated tasks deleted successfully' };
  }
}
