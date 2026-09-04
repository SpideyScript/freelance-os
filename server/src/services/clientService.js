import { Client } from '../models/Client.js';
import { Project } from '../models/Project.js';
import { Invoice } from '../models/Invoice.js';
import { Activity } from '../models/Activity.js';
import { logActivity } from '../utils/activityLogger.js';

export class ClientService {
  static async listClients(userId, { search, status, tag, page = 1, limit = 50 }) {
    const query = { userId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (tag && tag !== 'all') {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [clients, total] = await Promise.all([
      Client.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      Client.countDocuments(query),
    ]);

    return { clients, total, page, limit };
  }

  static async getClientById(userId, clientId) {
    const client = await Client.findOne({ _id: clientId, userId });
    if (!client) {
      const error = new Error('Client not found');
      error.statusCode = 404;
      throw error;
    }

    const [projects, invoices, activities] = await Promise.all([
      Project.find({ clientId, userId }).sort({ updatedAt: -1 }),
      Invoice.find({ clientId, userId }).sort({ issueDate: -1 }),
      Activity.find({ entityId: clientId, userId }).sort({ createdAt: -1 }).limit(15),
    ]);

    return { client, projects, invoices, activities };
  }

  static async createClient(userId, data) {
    const client = await Client.create({ ...data, userId });
    await logActivity({
      userId,
      entityType: 'client',
      entityId: client._id,
      action: 'created',
      description: `Created client account for "${client.name}" (${client.company || 'Individual'})`,
    });
    return client;
  }

  static async updateClient(userId, clientId, data) {
    const client = await Client.findOneAndUpdate(
      { _id: clientId, userId },
      { $set: data },
      { new: true }
    );
    if (!client) {
      const error = new Error('Client not found');
      error.statusCode = 404;
      throw error;
    }

    await logActivity({
      userId,
      entityType: 'client',
      entityId: client._id,
      action: 'updated',
      description: `Updated client account for "${client.name}"`,
    });

    return client;
  }

  static async deleteClient(userId, clientId) {
    const client = await Client.findOneAndDelete({ _id: clientId, userId });
    if (!client) {
      const error = new Error('Client not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Client deleted successfully' };
  }
}
