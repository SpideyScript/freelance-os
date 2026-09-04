import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const [financialData, setFinancialData] = useState(null);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [finRes, dashRes] = await Promise.all([
          api.get('/analytics/financial-report'),
          api.get('/analytics/dashboard'),
        ]);

        if (finRes.data.success) {
          setFinancialData(finRes.data.data);
        }
        if (dashRes.data.success) {
          setDashboardMetrics(dashRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load analytics report:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (!financialData?.invoices) return;

    const headers = 'Invoice Number,Client,Project,Amount,Status,Issue Date,Due Date\n';
    const rows = financialData.invoices
      .map((inv) =>
        `"${inv.invoiceNumber}","${inv.clientId?.name || ''}","${inv.projectId?.name || ''}",${inv.total},"${inv.paymentStatus}","${inv.issueDate}","${inv.dueDate}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `freelance_financial_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <BarChart3 className="h-7 w-7 text-sky-500" /> Financial Intelligence & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Realized cash flow, profit margins, billable yield, and client concentration breakdown.
          </p>
        </div>

        <Button onClick={handleExportCSV} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1.5" />
          Export CSV Report
        </Button>
      </div>

      {/* Financial KPIs 4-grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Cash Collected (Paid)</span>
          <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">
            {formatCurrency(financialData?.totalCollected || 0, user?.currency)}
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Realized income</span>
        </Card>

        <Card className="p-4 bg-amber-500/5 border-amber-500/20">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Outstanding Receivables</span>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-1">
            {formatCurrency(financialData?.totalOutstanding || 0, user?.currency)}
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Pending payment</span>
        </Card>

        <Card className="p-4 bg-sky-500/5 border-sky-500/20">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Total Invoiced</span>
          <div className="text-2xl font-bold font-mono text-sky-500 mt-1">
            {formatCurrency(financialData?.totalInvoiced || 0, user?.currency)}
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Lifetime volume</span>
        </Card>

        <Card className="p-4 bg-purple-500/5 border-purple-500/20">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Realized Hourly Rate</span>
          <div className="text-2xl font-bold font-mono text-purple-500 mt-1">
            ${dashboardMetrics?.effectiveHourlyRate || 95}/hr
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Yield across all logged hours</span>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Cash Flow Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cash Flow & Net Margin</CardTitle>
            <Badge variant="success">Yield Growth: +14.2%</Badge>
          </CardHeader>

          <div className="h-72 w-full pt-2">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardMetrics?.revenueChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`$${val?.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="profit" name="Net Margin" stroke="#38bdf8" strokeWidth={2} fill="#38bdf8" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Time Allocation Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Time Utilization</CardTitle>
          </CardHeader>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Logged Time:</span>
                <span className="font-mono font-bold text-foreground">{financialData?.totalHours || 0} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billable Hours:</span>
                <span className="font-mono font-bold text-emerald-500">{financialData?.billableHours || 0} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Non-billable Hours:</span>
                <span className="font-mono font-bold text-muted-foreground">{financialData?.nonBillableHours || 0} hrs</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Billable Ratio</span>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{
                    width: `${
                      financialData?.totalHours > 0
                        ? Math.round((financialData.billableHours / financialData.totalHours) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                {financialData?.totalHours > 0
                  ? Math.round((financialData.billableHours / financialData.totalHours) * 100)
                  : 0}
                % of your logged time produces direct revenue.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue by Client Table */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>Client Revenue Concentration Matrix</CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Client Account</th>
                <th className="p-3 text-right">Revenue Generated</th>
                <th className="p-3 text-right">Share (%)</th>
                <th className="p-3 text-right">Risk Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {dashboardMetrics?.revenueByClient?.map((client, i) => (
                <tr key={i}>
                  <td className="p-3 font-bold text-foreground">{client.clientName}</td>
                  <td className="p-3 text-right font-mono font-bold text-foreground">
                    {formatCurrency(client.revenue, user?.currency)}
                  </td>
                  <td className="p-3 text-right font-mono text-muted-foreground">{client.percentage}%</td>
                  <td className="p-3 text-right">
                    <Badge variant={client.percentage > 50 ? 'warning' : 'success'} className="text-[10px]">
                      {client.percentage > 50 ? 'High Concentration' : 'Diversified'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
