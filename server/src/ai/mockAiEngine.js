export class MockAIEngine {
  static generateProposal(payload) {
    const budget = payload.budget || 5000;
    const services = payload.services?.length ? payload.services : ['Full-Stack SaaS Architecture', 'UI/UX Interactive Design', 'API Integration & QA'];

    return {
      title: `${payload.projectDescription.slice(0, 45)} Solution Proposal`,
      introduction: `Dear ${payload.clientName},\n\nThank you for considering our specialized engineering studio for your upcoming digital initiative. We specialize in building modern, scalable, and high-conversion software products tailored specifically to your objectives.`,
      problemUnderstanding: `Based on your brief: "${payload.projectDescription}", we understand you require a high-reliability, performant architecture that delivers maximum business leverage and seamless user experience.`,
      proposedSolution: `We propose a streamlined delivery cycle comprising modern frontend development, secure REST/GraphQL backend architecture, automated tests, and continuous deployment workflows.`,
      deliverables: [
        'Interactive High-Fidelity UI/UX Components',
        'Scalable RESTful Backend API with Auth & Validation',
        'Database Optimization, Migrations & Indexing',
        'Comprehensive Test Suite & Documentation',
        'Production Cloud Deployment & DNS Setup',
      ],
      services: services.map((s, i) => ({
        name: s,
        description: `Comprehensive phase deliverables for ${s}`,
        rate: 95,
        amount: Math.round(budget / services.length),
      })),
      timeline: payload.timeline || '4-6 Weeks across 3 Sprint Milestones',
      pricingExplanation: `Total proposed investment of $${budget.toLocaleString()} structured across milestone deliverables (30% deposit, 40% mid-point review, 30% final signoff).`,
      terms: 'Net 14 days per milestone. All intellectual property transfers to client upon final payment.',
      callToAction: 'Click "Accept Proposal" below to lock in the sprint schedule and begin kickoff discovery.',
    };
  }

  static generateMessage(payload) {
    const tonePrefix = {
      professional: 'I hope this message finds you well.',
      friendly: 'Hope you are having a wonderful week!',
      concise: 'Quick update on our ongoing deliverables:',
      persuasive: 'I wanted to share exciting progress on our milestones:',
    }[payload.tone] || 'I hope you are doing well.';

    let subject = `Update regarding ${payload.projectName || 'our project'}`;
    let body = `Hi ${payload.recipientName},\n\n${tonePrefix}\n\n`;

    if (payload.intent === 'project_update') {
      subject = `🚀 Sprint Progress Update: ${payload.projectName || 'Deliverables'}`;
      body += `We have completed our scheduled milestones and key modules are now live in staging for your review.\n\n${
        payload.keyPoints ? `Key notes:\n${payload.keyPoints}\n\n` : ''
      }Please test the preview link and let me know if you have any questions or feedback.`;
    } else if (payload.intent === 'invoice_reminder') {
      subject = `Friendly Reminder: Outstanding Invoice for ${payload.projectName || 'Services'}`;
      body += `This is a gentle reminder regarding our pending invoice. We would appreciate it if you could verify the payment status at your earliest convenience.\n\nThank you for your prompt attention!`;
    } else {
      subject = `Follow-up regarding ${payload.projectName || 'our discussion'}`;
      body += `Following up on our recent conversation:\n\n${payload.keyPoints || 'Looking forward to our next steps.'}\n\nPlease let me know your thoughts.`;
    }

    body += `\n\nBest regards,\nYour Engineering Partner`;
    return { subject, body };
  }

  static generateProjectPlan(payload) {
    return {
      summary: `Comprehensive roadmap for ${payload.projectName}: structured across 3 core phases ensuring modular delivery and testable milestone sign-offs.`,
      phases: [
        {
          name: 'Phase 1: Architecture, Data Modeling & UI Kit',
          duration: 'Week 1',
          tasks: [
            {
              title: 'Database Schema & Indexing Design',
              description: 'Model MongoDB collections with indexes and referential integrity.',
              estimatedHours: 8,
              priority: 'high',
            },
            {
              title: 'Design System & Component Library Setup',
              description: 'Configure typography, color tokens, and responsive UI foundations.',
              estimatedHours: 12,
              priority: 'high',
            },
          ],
        },
        {
          name: 'Phase 2: Core Business Logic & State Layer',
          duration: 'Week 2-3',
          tasks: [
            {
              title: 'REST API & Controller Implementations',
              description: 'Build backend routes, Zod input validators, and authentication middleware.',
              estimatedHours: 18,
              priority: 'urgent',
            },
            {
              title: 'Interactive Frontend Pages & React Hook Forms',
              description: 'Connect TanStack Query data fetching with live optimistic UI state.',
              estimatedHours: 20,
              priority: 'high',
            },
          ],
        },
        {
          name: 'Phase 3: QA, AI Integration & Production Launch',
          duration: 'Week 4',
          tasks: [
            {
              title: 'AI Copilot Prompt Engineering & Context Layer',
              description: 'Implement AI service with context scoping and graceful fallbacks.',
              estimatedHours: 10,
              priority: 'medium',
            },
            {
              title: 'End-to-End Testing & Production Deployment',
              description: 'Execute integration tests and verify cloud deployment pipeline.',
              estimatedHours: 8,
              priority: 'high',
            },
          ],
        },
      ],
      milestones: [
        { title: 'Milestone 1: Prototype & Schema Sign-off', deadline: 'End of Week 1' },
        { title: 'Milestone 2: Feature Complete Staging Release', deadline: 'End of Week 3' },
        { title: 'Milestone 3: Production Launch & Handover', deadline: 'End of Week 4' },
      ],
      totalEstimatedHours: 76,
    };
  }

  static prioritizeTasks(payload) {
    const sorted = [...payload.tasks].sort((a, b) => {
      const pOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (pOrder[b.priority] || 2) - (pOrder[a.priority] || 2);
    });

    const recommendations = sorted.map((task, index) => {
      const urgencyScore = Math.max(10, 100 - index * 12);
      let reasoning = 'Standard milestone task within delivery timeline.';
      let actionAdvice = 'Schedule in current sprint batch.';

      if (task.priority === 'urgent') {
        reasoning = 'High client sensitivity and blocking downstream deliverables.';
        actionAdvice = 'Execute as first priority in morning focus block.';
      } else if (task.priority === 'high') {
        reasoning = 'Core feature requirement needed for upcoming client demo.';
        actionAdvice = 'Block 2-3 continuous focus hours today.';
      }

      return {
        taskId: task.id,
        urgencyScore,
        recommendedRank: index + 1,
        reasoning,
        actionAdvice,
      };
    });

    return {
      recommendations,
      generalAdvice:
        'Focus on high-leverage blocking tasks first. Allocate 90-minute uninterrupted deep work blocks for architecture and bug fixes before context-switching to client communication.',
    };
  }

  static generateInvoiceReminder(payload) {
    let content = '';
    if (payload.daysOverdue > 14 || payload.relationshipTone === 'urgent') {
      content = `Dear ${payload.clientName},\n\nWe are following up urgently regarding Invoice #${payload.invoiceNumber} in the amount of $${payload.amount.toLocaleString()}, which was due on ${new Date(
        payload.dueDate
      ).toLocaleDateString()} (${payload.daysOverdue} days past due).\n\nPlease process this payment via our standard wire instructions as soon as possible to avoid project disruption.\n\nThank you,\nFinance & Accounts`;
    } else if (payload.daysOverdue > 0 || payload.relationshipTone === 'firm') {
      content = `Hi ${payload.clientName},\n\nI hope you're having a productive week. This is a follow-up regarding Invoice #${payload.invoiceNumber} ($${payload.amount.toLocaleString()}), which reached its due date on ${new Date(
        payload.dueDate
      ).toLocaleDateString()}.\n\nCould you please confirm if this invoice has been queued for remittance?\n\nBest regards,\nAccounts Team`;
    } else {
      content = `Hi ${payload.clientName},\n\nHope all is well! Just sending a friendly courtesy reminder that Invoice #${payload.invoiceNumber} for $${payload.amount.toLocaleString()} is scheduled for payment on ${new Date(
        payload.dueDate
      ).toLocaleDateString()}.\n\nPlease let me know if you need any additional PO numbers or remittance details.\n\nWarm regards,\nYour Engineering Team`;
    }
    return { content };
  }

  static summarizeMeeting(payload) {
    return {
      summary: `Discussion with ${payload.clientName || 'Client'} regarding ${payload.projectName || 'project deliverables'}: aligned on sprint scope, UX architecture, and delivery timelines.`,
      keyDecisions: [
        'Confirmed technical stack and component architecture guidelines.',
        'Agreed on weekly asynchronous sprint updates and milestone reviews.',
        'Approved milestone payment structure tied to staging deployments.',
      ],
      actionItems: [
        { task: 'Deploy interactive staging preview for review', owner: 'Freelancer', deadline: 'In 3 business days' },
        { task: 'Provide API credentials and production domain access', owner: 'Client', deadline: 'By Friday' },
        { task: 'Schedule Phase 2 kickoff review call', owner: 'Both', deadline: 'Next Monday' },
      ],
      followUpEmailDraft: `Hi ${payload.clientName || 'Team'},\n\nGreat speaking with you today! Here is a recap of our key decisions and next steps:\n\nKey Decisions:\n- Approved UI architecture and component roadmap.\n- Established weekly delivery checkpoints.\n\nNext Action Items:\n1. We will deploy the staging preview within 3 business days.\n2. Looking forward to receiving the API credentials when available.\n\nPlease reply if anything was missed!\n\nBest regards,`,
    };
  }

  static getBusinessAdvice(context) {
    return {
      healthScore: 88,
      effectiveHourlyRateAnalysis: `Your realized hourly rate of $95/hr is healthy and 12% above your target baseline. Time allocation is concentrated in high-value implementation.`,
      pricingAdvice: `Consider raising baseline rates for new enterprise leads from $85/hr to $105/hr given strong demand and high project completion velocity.`,
      cashFlowForecast: `Projected receivables over the next 30 days: $12,400 across active milestone invoices.`,
      insights: [
        {
          type: 'pricing_opportunity',
          title: 'Increase Fixed Milestone Margins',
          description: 'Your effective velocity on full-stack projects enables higher value-based fixed pricing.',
          impact: 'positive',
          recommendedAction: 'Quote fixed packages with 25% contingency buffer on upcoming enterprise proposals.',
        },
        {
          type: 'client_concentration',
          title: 'Client Concentration Within Safe Bounds',
          description: 'Your top client accounts for 45% of total revenue. Good diversification.',
          impact: 'positive',
          recommendedAction: 'Continue nurturing secondary client accounts to maintain resilience.',
        },
        {
          type: 'invoice_aging',
          title: 'Receivables Aging Alert',
          description: 'Two invoices are approaching due dates. Follow up proactively.',
          impact: 'warning',
          recommendedAction: 'Send automated 3-day courtesy payment reminders.',
        },
      ],
    };
  }

  static generateChatReply(message, context) {
    const lower = message.toLowerCase();

    if (lower.includes('task') || lower.includes('work') || lower.includes('today')) {
      return `Based on your active pipeline:\n\n1. **Focus on high-priority sprint tasks**: Work on urgent backend and WebSocket tasks for your active clients.\n2. **Time allocation**: You have 14 billable hours logged this week. Target 25-30 billable hours for optimal yield.\n3. Would you like me to prioritize your task backlog or draft a progress report?`;
    }

    if (lower.includes('invoice') || lower.includes('money') || lower.includes('paid') || lower.includes('revenue')) {
      return `Here is your current financial snapshot:\n\n- **Realized Revenue**: Strong monthly trajectory.\n- **Pending Invoices**: 2 invoices are awaiting remittance.\n- **Action**: You can use the **AI Payment Reminder** tool to send a gentle follow-up email.`;
    }

    if (lower.includes('proposal') || lower.includes('client') || lower.includes('rate')) {
      return `For client negotiations and proposals:\n\n- Highlight your full-stack delivery velocity and automated QA processes.\n- Structure proposals into 3 milestone phases to maintain positive cash flow.\n- Would you like me to draft a new executive proposal for a prospect?`;
    }

    return `I am analyzing your business operations. You have active projects, sprint tasks, and client accounts in good standing. How can I assist you right now with proposals, tasks, emails, or financial optimization?`;
  }
}
