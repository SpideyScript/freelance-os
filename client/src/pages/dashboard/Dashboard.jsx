import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Receipt,
  FileText,
  Play,
  Layers,
  CheckSquare,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { useTimer } from "../../context/TimerContext";
import { api } from "../../lib/api";
import { formatCurrency, formatDate, formatDuration } from "../../lib/utils";

export const Dashboard = () => {
  const { user } = useAuth();
  const { startTimer } = useTimer();

  const [metrics, setMetrics] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [metricsRes, financialRes] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/analytics/financial-report"),
        ]);

        if (metricsRes.data.success) {
          setMetrics(metricsRes.data.data);
        }
        if (financialRes.data.success) {
          setFinancialData(financialRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pieColors = ["#10b981", "#38bdf8", "#818cf8", "#f59e0b", "#ec4899"];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Welcome Hero & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Good day, {user?.name?.split(" ")[0] || "Freelancer"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Here is your studio pipeline, billable hours, and pending
            deliverables overview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/invoices/new">
            <Button size="sm" variant="outline" className="text-xs">
              <Receipt className="h-3.5 w-3.5 mr-1.5" />
              New Invoice
            </Button>
          </Link>
          <Link to="/proposals/new">
            <Button size="sm" variant="outline" className="text-xs">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              New Proposal
            </Button>
          </Link>
          <Link to="/copilot">
            <Button size="sm" variant="copilot" className="text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Freelance Copilot
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {isLoading ? (
                <Skeleton className="h-8 w-28" />
              ) : (
                formatCurrency(metrics?.totalRevenue, user?.currency)
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
        </Card>

        {/* Pending Invoices */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pending Receivables
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {isLoading ? (
                <Skeleton className="h-8 w-28" />
              ) : (
                formatCurrency(metrics?.pendingInvoicesAmount, user?.currency)
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mt-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{metrics?.overdueInvoicesCount || 0} overdue invoices</span>
            </div>
          </div>
        </Card>

        {/* Active Projects */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Projects
            </span>
            <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                metrics?.activeProjectsCount || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              across {metrics?.totalClientsCount || 0} client accounts
            </p>
          </div>
        </Card>

        {/* Realized Hourly Rate */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Effective Hourly Rate
            </span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                `$${metrics?.effectiveHourlyRate || 95}/hr`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: ${user?.hourlyRate || 85}/hr
            </p>
          </div>
        </Card>
      </div>

      {/* AI Copilot Strategic Health Callout */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-950/40 via-card to-slate-900 border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-foreground">
                Copilot Strategic Health Analysis
              </h4>
              <Badge variant="success" className="text-[10px]">
                Optimized
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl leading-relaxed">
              Your billable realization rate is <strong>78%</strong> this month.
              Recommend raising baseline rates for new enterprise clients by 15%
              and following up on 2 invoices past 14-day terms.
            </p>
          </div>
        </div>

        <Link to="/copilot" className="shrink-0">
          <Button size="sm" variant="copilot" className="text-xs">
            Open AI Advisor <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Profit Trends (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Cash Flow & Revenue History</CardTitle>
              <CardDescription>
                Monthly billing volume vs collected profit
              </CardDescription>
            </div>
            <Badge variant="outline">Trailing 6 Months</Badge>
          </CardHeader>

          <div className="h-72 w-full pt-4">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metrics?.revenueChart || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorProfit"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`$${value?.toLocaleString()}`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Gross Revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Net Profit"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Client Revenue Concentration (1 Col) */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Client Share</CardTitle>
              <CardDescription>Revenue concentration breakdown</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4 pt-2">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : metrics?.revenueByClient &&
              metrics.revenueByClient.length > 0 ? (
              metrics.revenueByClient.map((client, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground truncate max-w-[160px]">
                      {client.clientName}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {formatCurrency(client.revenue, user?.currency)} (
                      {client.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${client.percentage}%`,
                        backgroundColor: pieColors[idx % pieColors.length],
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">
                No client revenue recorded yet
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Operational Split: Upcoming Deadlines & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approaching Deliverables & Deadlines */}
        <Card className="space-y-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sky-500" />
              <CardTitle>Upcoming Milestones & Tasks</CardTitle>
            </div>
            <Link
              to="/tasks"
              className="text-xs text-primary hover:underline font-medium"
            >
              View Board
            </Link>
          </CardHeader>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : metrics?.upcomingDeadlines &&
            metrics.upcomingDeadlines.length > 0 ? (
            <div className="space-y-2.5">
              {metrics.upcomingDeadlines.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <CheckSquare className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-foreground line-clamp-1">
                        {task.title}
                      </h5>
                      <p className="text-muted-foreground text-[10px]">
                        {task.projectName} • {task.priority.toUpperCase()}{" "}
                        priority
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <Badge
                      variant={task.daysLeft <= 2 ? "danger" : "warning"}
                      className="text-[10px]"
                    >
                      {task.daysLeft === 0
                        ? "Due Today"
                        : `${task.daysLeft}d left`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">
              No imminent deadlines this week.
            </p>
          )}
        </Card>

        {/* Audit Trail / Recent Activity */}
        <Card className="space-y-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-500" />
              <CardTitle>Recent Business Activity</CardTitle>
            </div>
          </CardHeader>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : metrics?.recentActivities &&
            metrics.recentActivities.length > 0 ? (
            <div className="space-y-2.5">
              {metrics.recentActivities.map((act) => (
                <div
                  key={act._id}
                  className="flex items-start gap-3 p-2.5 rounded-xl text-xs hover:bg-muted/20 transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium leading-relaxed truncate">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatDate(act.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">
              No recent activity recorded yet.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};
