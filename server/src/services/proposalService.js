import { Proposal } from '../models/Proposal.js';
import { logActivity } from '../utils/activityLogger.js';

export class ProposalService {
  static async listProposals(userId, { clientId, status, search }) {
    const query = { userId };

    if (clientId && clientId !== 'all') {
      query.clientId = clientId;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    return Proposal.find(query).populate('clientId', 'name company email').sort({ updatedAt: -1 });
  }

  static async getProposalById(userId, proposalId) {
    const proposal = await Proposal.findOne({ _id: proposalId, userId }).populate(
      'clientId',
      'name company email address'
    );
    if (!proposal) {
      const error = new Error('Proposal not found');
      error.statusCode = 404;
      throw error;
    }
    return proposal;
  }

  static async createProposal(userId, data) {
    const proposal = await Proposal.create({ ...data, userId });
    await logActivity({
      userId,
      entityType: 'proposal',
      entityId: proposal._id,
      action: 'created',
      description: `Created proposal "${proposal.title}" for $${proposal.totalAmount.toLocaleString()}`,
    });
    return proposal;
  }

  static async updateProposal(userId, proposalId, data) {
    if (data.status === 'sent' && !data.sentAt) {
      data.sentAt = new Date();
    }
    if (data.status === 'accepted' && !data.acceptedAt) {
      data.acceptedAt = new Date();
    }

    const proposal = await Proposal.findOneAndUpdate(
      { _id: proposalId, userId },
      { $set: data },
      { new: true }
    ).populate('clientId', 'name company email');

    if (!proposal) {
      const error = new Error('Proposal not found');
      error.statusCode = 404;
      throw error;
    }

    await logActivity({
      userId,
      entityType: 'proposal',
      entityId: proposal._id,
      action: 'updated',
      description: `Updated proposal "${proposal.title}" status to ${proposal.status}`,
    });

    return proposal;
  }

  static async deleteProposal(userId, proposalId) {
    const proposal = await Proposal.findOneAndDelete({ _id: proposalId, userId });
    if (!proposal) {
      const error = new Error('Proposal not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Proposal deleted successfully' };
  }
}
