import OpenAI from 'openai';
import { ENV } from '../config/env.js';
import { MockAIEngine } from './mockAiEngine.js';

class AIService {
  constructor() {
    this.openai = null;
    if (ENV.OPENAI_API_KEY && ENV.OPENAI_API_KEY !== 'sk-dummy-key') {
      try {
        this.openai = new OpenAI({ apiKey: ENV.OPENAI_API_KEY });
      } catch (err) {
        console.warn('[OpenAI] Failed to initialize OpenAI client. Falling back to internal engine.');
      }
    }
  }

  async generateProposal(payload) {
    if (!this.openai) return MockAIEngine.generateProposal(payload);

    try {
      const prompt = `You are a high-earning freelance consultant proposal architect. Generate a JSON response for a client proposal with the following structure:
{
  "title": string,
  "introduction": string,
  "problemUnderstanding": string,
  "proposedSolution": string,
  "deliverables": string[],
  "services": [{ "name": string, "description": string, "rate": number, "amount": number }],
  "timeline": string,
  "pricingExplanation": string,
  "terms": string,
  "callToAction": string
}

Client: ${payload.clientName} (${payload.clientCompany || 'Direct Client'})
Project Scope: ${payload.projectDescription}
Services: ${payload.services?.join(', ') || 'Full stack development'}
Budget: $${payload.budget || 5000}
Timeline: ${payload.timeline || '4-6 weeks'}
Skills: ${payload.freelancerSkills?.join(', ') || 'React, TypeScript, Node.js'}`;

      const response = await this.openai.chat.completions.create({
        model: ENV.OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      return content ? JSON.parse(content) : MockAIEngine.generateProposal(payload);
    } catch (error) {
      console.warn('[OpenAI Error]: Falling back to MockAIEngine for proposal generation.', error.message);
      return MockAIEngine.generateProposal(payload);
    }
  }

  async generateMessage(payload) {
    if (!this.openai) return MockAIEngine.generateMessage(payload);

    try {
      const prompt = `You are an expert freelance client communications manager. Generate a JSON email message with keys "subject" (string) and "body" (string).
Recipient: ${payload.recipientName}
Intent: ${payload.intent}
Tone: ${payload.tone}
Key Points: ${payload.keyPoints || 'None specified'}
Project: ${payload.projectName || 'Current Project'}`;

      const response = await this.openai.chat.completions.create({
        model: ENV.OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      return content ? JSON.parse(content) : MockAIEngine.generateMessage(payload);
    } catch (error) {
      return MockAIEngine.generateMessage(payload);
    }
  }

  async generateProjectPlan(payload) {
    if (!this.openai) return MockAIEngine.generateProjectPlan(payload);

    try {
      const prompt = `You are a technical project manager for software freelancers. Generate a JSON project roadmap with structure:
{
  "summary": string,
  "phases": [{
    "name": string,
    "duration": string,
    "tasks": [{ "title": string, "description": string, "estimatedHours": number, "priority": "low"|"medium"|"high"|"urgent" }]
  }],
  "milestones": [{ "title": string, "deadline": string }],
  "totalEstimatedHours": number
}

Project: ${payload.projectName}
Brief: ${payload.projectDescription}
Timeline: ${payload.timeline || '4 weeks'}
Budget: $${payload.budget || 5000}`;

      const response = await this.openai.chat.completions.create({
        model: ENV.OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      return content ? JSON.parse(content) : MockAIEngine.generateProjectPlan(payload);
    } catch (error) {
      return MockAIEngine.generateProjectPlan(payload);
    }
  }

  async prioritizeTasks(payload) {
    if (!this.openai) return MockAIEngine.prioritizeTasks(payload);

    try {
      const prompt = `You are a productivity coach for freelancers. Analyze this task list and return a JSON ranking with structure:
{
  "recommendations": [{ "taskId": string, "urgencyScore": number (1-100), "recommendedRank": number, "reasoning": string, "actionAdvice": string }],
  "generalAdvice": string
}

Tasks:
${JSON.stringify(payload.tasks, null, 2)}`;

      const response = await this.openai.chat.completions.create({
        model: ENV.OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      const content = response.choices[0]?.message?.content;
      return content ? JSON.parse(content) : MockAIEngine.prioritizeTasks(payload);
    } catch (error) {
      return MockAIEngine.prioritizeTasks(payload);
    }
  }

  async generateInvoiceReminder(payload) {
    if (!this.openai) return MockAIEngine.generateInvoiceReminder(payload);

    try {
      const prompt = `Draft a payment reminder email for invoice #${payload.invoiceNumber}.
Client: ${payload.clientName}
Amount: $${payload.amount}
Due Date: ${payload.dueDate}
Days Past Due: ${payload.daysOverdue}
Tone: ${payload.relationshipTone}

Return JSON with key "content" (string with email body).`;

      const response = await this.openai.chat.completions.create({
        model: ENV.OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.6,
      });

      const content = response.choices[0]?.message?.content;
      return content ? JSON.parse(content) : MockAIEngine.generateInvoiceReminder(payload);
    } catch (error) {
      return MockAIEngine.generateInvoiceReminder(payload);
    }
  }

  async summarizeMeeting(payload) {
    if (!this.openai) return MockAIEngine.summarizeMeeting(payload);

    try {
      const prompt = `Extract structured insights from raw meeting notes.
Return JSON:
{
  "summary": string,
  "keyDecisions": string[],
  "actionItems": [{ "task": string, "owner": string, "deadline": string }],
  "followUpEmailDraft": string
}

Notes:
${payload.rawNotes}`;

      const response = await this.openai.chat.completions.create({
        model: ENV.OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      const content = response.choices[0]?.message?.content;
      return content ? JSON.parse(content) : MockAIEngine.summarizeMeeting(payload);
    } catch (error) {
      return MockAIEngine.summarizeMeeting(payload);
    }
  }

  async getBusinessAdvice(context) {
    if (!this.openai) return MockAIEngine.getBusinessAdvice(context);

    try {
      const prompt = `You are a fractional CFO and business coach for independent freelancers. Analyze this business snapshot and return a JSON assessment:
{
  "healthScore": number (1-100),
  "effectiveHourlyRateAnalysis": string,
  "pricingAdvice": string,
  "cashFlowForecast": string,
  "insights": [{ "type": string, "title": string, "description": string, "impact": "positive"|"warning"|"critical", "recommendedAction": string }]
}

Business Snapshot:
${JSON.stringify(context, null, 2)}`;

      const response = await this.openai.chat.completions.create({
        model: ENV.OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      const content = response.choices[0]?.message?.content;
      return content ? JSON.parse(content) : MockAIEngine.getBusinessAdvice(context);
    } catch (error) {
      return MockAIEngine.getBusinessAdvice(context);
    }
  }

  async chat(message, history, context) {
    if (!this.openai) return MockAIEngine.generateChatReply(message, context);

    try {
      const systemPrompt = `You are Freelance Copilot, an autonomous AI partner embedded inside a Freelance Business OS.
You have real-time contextual access to the user's business:
Active Tasks: ${context?.tasksCount || 0}
Active Projects: ${context?.projectsCount || 0}
Pending Invoices Amount: $${context?.pendingInvoicesAmount || 0}
Hourly Rate Target: $${context?.targetHourlyRate || 75}/hr

Provide direct, actionable, strategic advice for maximizing freelancer revenue, keeping clients happy, and managing sprint deliveries.`;

      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...(history || []).slice(-8).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ];

      const response = await this.openai.chat.completions.create({
        model: ENV.OPENAI_MODEL,
        messages: formattedMessages,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || MockAIEngine.generateChatReply(message, context);
    } catch (error) {
      return MockAIEngine.generateChatReply(message, context);
    }
  }
}

export const aiService = new AIService();
