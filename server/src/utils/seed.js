import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Client } from '../models/Client.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Proposal } from '../models/Proposal.js';
import { Invoice } from '../models/Invoice.js';
import { TimeEntry } from '../models/TimeEntry.js';
import { Notification } from '../models/Notification.js';
import { Activity } from '../models/Activity.js';
import { AIConversation } from '../models/AIConversation.js';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Client.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      Proposal.deleteMany({}),
      Invoice.deleteMany({}),
      TimeEntry.deleteMany({}),
      Notification.deleteMany({}),
      Activity.deleteMany({}),
      AIConversation.deleteMany({}),
    ]);

    console.log('[Seed] Creating primary demo freelancer account...');
    const user = await User.create({
      name: 'Alex Rivera',
      email: 'alex@freelanceos.dev',
      password: 'password123',
      hourlyRate: 95,
      currency: 'USD',
      role: 'freelancer',
      businessDetails: {
        companyName: 'Rivera Digital Systems LLC',
        taxNumber: 'US-EIN-948201948',
        address: '548 Market St, Suite 39201, San Francisco, CA 94104',
        phone: '+1 (415) 890-3490',
        website: 'https://riveradigital.dev',
        defaultPaymentTerms: 'Net 14 days. Wire transfer preferred.',
        defaultInvoiceNotes: 'Thank you for your partnership! Please remit funds via wire or ACH.',
      },
    });

    const userId = user._id;

    console.log('[Seed] Creating realistic client accounts...');
    const clients = await Client.create([
      {
        userId,
        name: 'Elena Rostova',
        email: 'elena@vortexfintech.io',
        company: 'Vortex FinTech AI',
        phone: '+1 (415) 555-0192',
        address: '100 Montgomery St, Floor 22, San Francisco, CA',
        currency: 'USD',
        status: 'active',
        tags: ['Enterprise', 'FinTech', 'High-Priority', 'Retainer'],
        notes: 'Enterprise client. Prefers weekly asynchronous Slack updates and Bi-weekly sprint demos.',
        totalRevenue: 24500,
        lastInteraction: new Date(Date.now() - 2 * 86400000),
      },
      {
        userId,
        name: 'Marcus Vance',
        email: 'marcus@hypergrowth.co',
        company: 'HyperGrowth Media Labs',
        phone: '+1 (212) 555-0188',
        address: '55 Hudson Yards, New York, NY',
        currency: 'USD',
        status: 'active',
        tags: ['Design System', 'React', 'Media'],
        notes: 'Rapid turnaround design system implementation. Key contact is VP of Product.',
        totalRevenue: 14200,
        lastInteraction: new Date(Date.now() - 4 * 86400000),
      },
      {
        userId,
        name: 'Dr. Liam Thorne',
        email: 'liam@aegisbiotech.org',
        company: 'Aegis BioTech Health',
        phone: '+1 (617) 555-0144',
        address: 'Kendall Square, Cambridge, MA',
        currency: 'USD',
        status: 'active',
        tags: ['Healthcare', 'Security', 'Compliance'],
        notes: 'Strict HIPAA and SOC2 compliance requirements for all web modules.',
        totalRevenue: 18500,
        lastInteraction: new Date(Date.now() - 1 * 86400000),
      },
      {
        userId,
        name: 'Sophia Chen',
        email: 'sophia@luminaryvr.xyz',
        company: 'Luminary Spatial AI',
        phone: '+1 (206) 555-0133',
        address: 'South Lake Union, Seattle, WA',
        currency: 'USD',
        status: 'lead',
        tags: ['Spatial Computing', 'WebXR', 'Lead'],
        notes: 'Prospecting $12,000 WebGL simulation dashboard proposal.',
        totalRevenue: 0,
        lastInteraction: new Date(Date.now() - 3 * 86400000),
      },
    ]);

    console.log('[Seed] Creating active projects...');
    const projects = await Project.create([
      {
        userId,
        clientId: clients[0]._id,
        name: 'Algorithmic Trading Dashboard MVP',
        description: 'Next.js 14 + WebSockets algorithmic trading terminal with live order depth and chart visualizations.',
        status: 'in_progress',
        priority: 'urgent',
        budget: 16500,
        estimatedHours: 85,
        actualHours: 48,
        startDate: new Date(Date.now() - 21 * 86400000),
        dueDate: new Date(Date.now() + 10 * 86400000),
        milestones: [
          { title: 'Milestone 1: WebSockets Engine & State', dueDate: new Date(Date.now() - 10 * 86400000), completed: true },
          { title: 'Milestone 2: Real-time Order Depth Visuals', dueDate: new Date(Date.now() + 3 * 86400000), completed: false },
          { title: 'Milestone 3: QA & Staging Handover', dueDate: new Date(Date.now() + 10 * 86400000), completed: false },
        ],
        tags: ['WebSockets', 'Next.js', 'Finance', 'High-Yield'],
      },
      {
        userId,
        clientId: clients[1]._id,
        name: 'SaaS Design System & UI Kit Migration',
        description: 'Building custom accessible component tokens with Tailwind CSS and Radix UI primitives.',
        status: 'in_progress',
        priority: 'high',
        budget: 9500,
        estimatedHours: 50,
        actualHours: 32,
        startDate: new Date(Date.now() - 14 * 86400000),
        dueDate: new Date(Date.now() + 16 * 86400000),
        milestones: [
          { title: 'Token Foundation & Color Scales', dueDate: new Date(Date.now() - 5 * 86400000), completed: true },
          { title: 'Interactive Form & Modal Primitives', dueDate: new Date(Date.now() + 7 * 86400000), completed: false },
        ],
        tags: ['Design System', 'Tailwind', 'UI/UX'],
      },
      {
        userId,
        clientId: clients[2]._id,
        name: 'Clinical Trial Patient Analytics Portal',
        description: 'Secure HIPAA-compliant healthcare data portal with multi-factor authentication and PDF reports.',
        status: 'in_progress',
        priority: 'medium',
        budget: 14000,
        estimatedHours: 70,
        actualHours: 24,
        startDate: new Date(Date.now() - 7 * 86400000),
        dueDate: new Date(Date.now() + 24 * 86400000),
        tags: ['Healthcare', 'Security', 'Compliance'],
      },
    ]);

    console.log('[Seed] Creating sprint Kanban tasks...');
    await Task.create([
      {
        userId,
        projectId: projects[0]._id,
        title: 'Optimize WebSocket reconnect exponential backoff',
        description: 'Handle automatic reconnection with jitter when socket drops during volatile market feeds.',
        status: 'in_progress',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 1 * 86400000),
        estimatedHours: 4,
        actualHours: 2,
        subtasks: [
          { title: 'Add backoff formula with max 30s ceiling', completed: true },
          { title: 'Test network drop simulation in DevTools', completed: false },
        ],
        tags: ['Backend', 'WebSockets'],
        order: 1,
      },
      {
        userId,
        projectId: projects[0]._id,
        title: 'Implement Canvas-based order book depth chart',
        description: 'Render bid/ask depth visually using HTML5 Canvas for 60fps performance.',
        status: 'todo',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 86400000),
        estimatedHours: 6,
        actualHours: 0,
        subtasks: [
          { title: 'Calculate cumulative bid/ask totals', completed: false },
          { title: 'Draw step lines with gradient fill', completed: false },
        ],
        tags: ['Frontend', 'Canvas'],
        order: 2,
      },
      {
        userId,
        projectId: projects[1]._id,
        title: 'Build customizable dark/light theme switcher',
        description: 'Support system preference detection and CSS variable transition tokens.',
        status: 'done',
        priority: 'medium',
        dueDate: new Date(Date.now() - 2 * 86400000),
        estimatedHours: 3,
        actualHours: 3,
        subtasks: [{ title: 'Store active theme in localStorage', completed: true }],
        order: 1,
      },
      {
        userId,
        projectId: projects[2]._id,
        title: 'Audit HIPAA auth headers and token expiry',
        description: 'Verify access tokens expire in 15 minutes and refresh tokens rotate securely.',
        status: 'review',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 86400000),
        estimatedHours: 5,
        actualHours: 4,
        order: 1,
      },
      {
        userId,
        title: 'Prepare Q3 freelancer tax deductions and expense receipts',
        description: 'Organize software subscriptions, hardware deductions, and cloud hosting invoices.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 86400000),
        estimatedHours: 2,
        actualHours: 0,
        order: 3,
      },
    ]);

    console.log('[Seed] Creating strategic proposals...');
    await Proposal.create([
      {
        userId,
        clientId: clients[0]._id,
        title: 'Turnkey Algorithmic Trading Platform Solution',
        description: 'End-to-end architecture and implementation of the Vortex FinTech real-time analytics terminal.',
        services: [
          { name: 'Core WebSockets Engine', description: 'Ultra low-latency socket pipeline', rate: 110, amount: 6500 },
          { name: 'Terminal UI & Charting', description: 'Responsive dark mode dashboard', rate: 95, amount: 7000 },
          { name: 'QA, Security & Staging Deployment', description: 'End-to-end automated testing', rate: 95, amount: 3000 },
        ],
        deliverables: [
          'High-performance live order book depth chart',
          'Automated trade execution webhook triggers',
          'Full documentation and Docker deployment scripts',
        ],
        timeline: '4-6 Weeks across 3 Sprint Milestones',
        pricingExplanation: 'Total $16,500 structured across milestone deliveries with Net 14 payment terms.',
        terms: '30% upfront deposit upon signing. All IP transfers to client upon final milestone payment.',
        callToAction: 'Click Accept Proposal to lock in our sprint calendar starting next Monday.',
        totalAmount: 16500,
        status: 'accepted',
        generatedWithAi: true,
        acceptedAt: new Date(Date.now() - 25 * 86400000),
      },
      {
        userId,
        clientId: clients[3]._id,
        title: 'Spatial WebGL Simulation Engine Architecture',
        description: 'Architecting WebGL 3D simulation interface for spatial AI telemetry data.',
        services: [
          { name: 'Three.js / WebGL Scene Pipeline', description: 'Optimized rendering loop', rate: 120, amount: 8000 },
          { name: 'Telemetry Dashboard UI Controls', description: 'Sleek dark HUD interface', rate: 95, amount: 4000 },
        ],
        deliverables: [
          'Interactive 3D model inspector',
          'Real-time telemetry chart overlay',
        ],
        timeline: '3-4 Weeks',
        totalAmount: 12000,
        status: 'sent',
        generatedWithAi: true,
        sentAt: new Date(Date.now() - 2 * 86400000),
        expirationDate: new Date(Date.now() + 12 * 86400000),
      },
    ]);

    console.log('[Seed] Creating dynamic calculated invoices...');
    await Invoice.create([
      {
        userId,
        clientId: clients[0]._id,
        projectId: projects[0]._id,
        invoiceNumber: 'INV-2026-001',
        issueDate: new Date(Date.now() - 20 * 86400000),
        dueDate: new Date(Date.now() - 6 * 86400000),
        items: [
          { description: 'Sprint Deposit (30% Project Allocation)', quantity: 1, rate: 4950, amount: 4950 },
        ],
        subtotal: 4950,
        taxRate: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 4950,
        paymentStatus: 'paid',
        paidAt: new Date(Date.now() - 8 * 86400000),
        notes: 'Deposit received. Thank you for your partnership!',
      },
      {
        userId,
        clientId: clients[0]._id,
        projectId: projects[0]._id,
        invoiceNumber: 'INV-2026-002',
        issueDate: new Date(Date.now() - 5 * 86400000),
        dueDate: new Date(Date.now() + 9 * 86400000),
        items: [
          { description: 'Milestone 1: WebSockets Engine & Feed Parser', quantity: 40, rate: 110, amount: 4400 },
          { description: 'State Management & Redis Cache Integration', quantity: 15, rate: 110, amount: 1650 },
        ],
        subtotal: 6050,
        taxRate: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 6050,
        paymentStatus: 'sent',
        notes: 'Payment due within 14 days of invoice date.',
      },
      {
        userId,
        clientId: clients[1]._id,
        projectId: projects[1]._id,
        invoiceNumber: 'INV-2026-003',
        issueDate: new Date(Date.now() - 25 * 86400000),
        dueDate: new Date(Date.now() - 11 * 86400000),
        items: [
          { description: 'Phase 1: Design System Component Foundations', quantity: 35, rate: 95, amount: 3325 },
        ],
        subtotal: 3325,
        taxRate: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 3325,
        paymentStatus: 'overdue',
        notes: 'Past due notice. Please remit via standard wire.',
      },
    ]);

    console.log('[Seed] Creating focused time tracking entries...');
    await TimeEntry.create([
      {
        userId,
        projectId: projects[0]._id,
        description: 'Implementing WebSocket reconnect backoff algorithm',
        startTime: new Date(Date.now() - 4 * 3600000),
        endTime: new Date(Date.now() - 2 * 3600000),
        duration: 7200,
        isBillable: true,
        hourlyRate: 95,
      },
      {
        userId,
        projectId: projects[1]._id,
        description: 'Customizing dark mode palette and contrast tokens',
        startTime: new Date(Date.now() - 28 * 3600000),
        endTime: new Date(Date.now() - 25 * 3600000),
        duration: 10800,
        isBillable: true,
        hourlyRate: 95,
      },
    ]);

    console.log('[Seed] Creating system notifications & activity trail...');
    await Notification.create([
      {
        userId,
        title: 'Invoice #INV-2026-003 Overdue',
        message: 'HyperGrowth Media Labs invoice of $3,325 is 11 days past due. Copilot drafted a payment reminder.',
        type: 'invoice_overdue',
        link: '/invoices',
      },
      {
        userId,
        title: 'Proposal Accepted 🎉',
        message: 'Elena Rostova accepted "Turnkey Algorithmic Trading Platform Solution" ($16,500).',
        type: 'proposal_accepted',
        link: '/proposals',
      },
    ]);

    await Activity.create([
      {
        userId,
        entityType: 'proposal',
        entityId: projects[0]._id,
        action: 'accepted',
        description: 'Proposal accepted by Vortex FinTech AI ($16,500)',
      },
      {
        userId,
        entityType: 'invoice',
        entityId: projects[0]._id,
        action: 'paid',
        description: 'Payment of $4,950 received for Invoice #INV-2026-001',
      },
    ]);

    console.log('\n=========================================');
    console.log('✅ DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('Demo Login Credentials:');
    console.log('Email:    alex@freelanceos.dev');
    console.log('Password: password123');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
