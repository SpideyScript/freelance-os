import { Invoice } from '../models/Invoice.js';
import { Project } from '../models/Project.js';
import { Client } from '../models/Client.js';
import { Task } from '../models/Task.js';
import { TimeEntry } from '../models/TimeEntry.js';
import { Activity } from '../models/Activity.js';
import { User } from '../models/User.js';

export class AnalyticsService {
  static async getDashboardMetrics(userId) {
    const [
      invoices,
      projects,
      clients,
      tasks,
      timeEntries,
      recentActivities,
      user,
    ] = await Promise.all([
      Invoice.find({ userId }),
      Project.find({ userId }).populate('clientId', 'name'),
      Client.find({ userId }),
      Task.find({ userId, status: { $ne: 'done' } }).populate('projectId', 'name'),
      TimeEntry.find({ userId }),
      Activity.find({ userId }).sort({ createdAt: -1 }).limit(8),
      User.findById(userId),
    ]);

    // Financial totals
    const paidInvoices = invoices.filter((i) => i.paymentStatus === 'paid');
    const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0);

    const pendingInvoices = invoices.filter((i) => i.paymentStatus === 'sent' || i.paymentStatus === 'overdue');
    const pendingInvoicesAmount = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

    const overdueInvoices = invoices.filter((i) => i.paymentStatus === 'overdue');
    const overdueInvoicesCount = overdueInvoices.length;

    // Time & Rate metrics
    const totalDurationSeconds = timeEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
    const totalHoursLogged = parseFloat((totalDurationSeconds / 3600).toFixed(1));

    const billableSeconds = timeEntries
      .filter((e) => e.isBillable)
      .reduce((sum, e) => sum + (e.duration || 0), 0);
    const billableHoursLogged = parseFloat((billableSeconds / 3600).toFixed(1));

    const effectiveHourlyRate =
      totalHoursLogged > 0 ? Math.round(totalRevenue / totalHoursLogged) : user?.hourlyRate || 75;

    // Active project counts
    const activeProjectsCount = projects.filter((p) => p.status === 'in_progress').length;
    const completedProjectsCount = projects.filter((p) => p.status === 'completed').length;

    // Monthly revenue aggregation
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map();

    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap.set(key, { month: key, revenue: 0, profit: 0 });
    }

    paidInvoices.forEach((inv) => {
      const d = new Date(inv.paidAt || inv.issueDate);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyMap.has(key)) {
        const entry = monthlyMap.get(key);
        entry.revenue += inv.total;
        entry.profit += Math.round(inv.total * 0.85); // 85% margin
      }
    });

    // Client concentration share
    const clientRevenueMap = new Map();
    paidInvoices.forEach((inv) => {
      const clientId = inv.clientId?.toString();
      if (clientId) {
        clientRevenueMap.set(clientId, (clientRevenueMap.get(clientId) || 0) + inv.total);
      }
    });

    const revenueByClient = clients
      .map((c) => ({
        clientId: c._id.toString(),
        clientName: c.name,
        revenue: clientRevenueMap.get(c._id.toString()) || 0,
        percentage:
          totalRevenue > 0
            ? Math.round(((clientRevenueMap.get(c._id.toString()) || 0) / totalRevenue) * 100)
            : 0,
      }))
      .filter((c) => c.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Upcoming deadlines
    const upcomingDeadlines = tasks
      .filter((t) => t.dueDate)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map((t) => {
        const diffMs = new Date(t.dueDate).getTime() - Date.now();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return {
          _id: t._id.toString(),
          title: t.title,
          projectName: t.projectId?.name || 'General',
          dueDate: t.dueDate,
          daysLeft: Math.max(0, daysLeft),
          priority: t.priority,
        };
      });

    return {
      totalRevenue,
      pendingInvoicesAmount,
      overdueInvoicesCount,
      activeProjectsCount,
      completedProjectsCount,
      totalClientsCount: clients.length,
      effectiveHourlyRate,
      totalHoursLogged,
      billableHoursLogged,
      revenueChart: Array.from(monthlyMap.values()),
      revenueByClient,
      upcomingDeadlines,
      recentActivities,
    };
  }

  static async getFinancialReport(userId) {
    const [invoices, timeEntries] = await Promise.all([
      Invoice.find({ userId }).populate('clientId', 'name').populate('projectId', 'name'),
      TimeEntry.find({ userId }),
    ]);

    const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
    const totalCollected = invoices
      .filter((i) => i.paymentStatus === 'paid')
      .reduce((s, i) => s + i.total, 0);
    const totalOutstanding = invoices
      .filter((i) => i.paymentStatus === 'sent' || i.paymentStatus === 'overdue')
      .reduce((s, i) => s + i.total, 0);
    const totalDraft = invoices
      .filter((i) => i.paymentStatus === 'draft')
      .reduce((s, i) => s + i.total, 0);

    const totalSeconds = timeEntries.reduce((s, e) => s + (e.duration || 0), 0);
    const billableSeconds = timeEntries.filter((e) => e.isBillable).reduce((s, e) => s + (e.duration || 0), 0);

    return {
      totalInvoiced,
      totalCollected,
      totalOutstanding,
      totalDraft,
      totalHours: parseFloat((totalSeconds / 3600).toFixed(1)),
      billableHours: parseFloat((billableSeconds / 3600).toFixed(1)),
      nonBillableHours: parseFloat(((totalSeconds - billableSeconds) / 3600).toFixed(1)),
      invoices,
    };
  }
}
