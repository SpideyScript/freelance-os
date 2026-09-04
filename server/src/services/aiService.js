import { aiService as openAIService } from '../ai/openaiService.js';
import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { Invoice } from '../models/Invoice.js';
import { User } from '../models/User.js';
import { AIConversation } from '../models/AIConversation.js';

export class AIService {
  static async getScopedBusinessContext(userId) {
    const [tasks, projects, invoices, user] = await Promise.all([
      Task.find({ userId, status: { $ne: 'done' } })
        .limit(15)
        .select('title priority dueDate status'),
      Project.find({ userId, status: 'in_progress' })
        .limit(10)
        .select('name budget actualHours estimatedHours dueDate'),
      Invoice.find({ userId, paymentStatus: { $in: ['sent', 'overdue'] } })
        .limit(10)
        .select('invoiceNumber total dueDate paymentStatus'),
      User.findById(userId).select('hourlyRate currency name'),
    ]);

    const pendingInvoicesAmount = invoices.reduce((s, i) => s + i.total, 0);

    return {
      freelancerName: user?.name,
      targetHourlyRate: user?.hourlyRate,
      tasksCount: tasks.length,
      projectsCount: projects.length,
      pendingInvoicesAmount,
      activeProjects: projects,
      pendingTasks: tasks,
      overdueInvoices: invoices.filter((i) => i.paymentStatus === 'overdue'),
    };
  }

  static async generateProposal(userId, payload) {
    return openAIService.generateProposal(payload);
  }

  static async generateMessage(userId, payload) {
    return openAIService.generateMessage(payload);
  }

  static async generateProjectPlan(userId, payload) {
    return openAIService.generateProjectPlan(payload);
  }

  static async prioritizeTasks(userId, payload) {
    return openAIService.prioritizeTasks(payload);
  }

  static async generateInvoiceReminder(userId, payload) {
    return openAIService.generateInvoiceReminder(payload);
  }

  static async summarizeMeeting(userId, payload) {
    return openAIService.summarizeMeeting(payload);
  }

  static async getBusinessAdvisor(userId) {
    const context = await this.getScopedBusinessContext(userId);
    return openAIService.getBusinessAdvice(context);
  }

  static async chat(userId, { message, conversationId }) {
    let conversation;
    if (conversationId) {
      conversation = await AIConversation.findOne({ _id: conversationId, userId });
    }

    if (!conversation) {
      conversation = await AIConversation.create({
        userId,
        title: message.slice(0, 30),
        messages: [],
      });
    }

    const context = await this.getScopedBusinessContext(userId);
    const reply = await openAIService.chat(message, conversation.messages, context);

    conversation.messages.push({ role: 'user', content: message });
    conversation.messages.push({ role: 'assistant', content: reply });
    await conversation.save();

    return {
      conversationId: conversation._id,
      reply,
      messages: conversation.messages,
    };
  }
}
