import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Receipt,
  ArrowLeft,
  Printer,
  Edit2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { AIInvoiceReminderModal } from './AIInvoiceReminderModal';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const fetchInvoice = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await api.get(`/invoices/${id}`);
      if (res.data.success) {
        setInvoice(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load invoice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleUpdateStatus = async (status) => {
    if (!invoice) return;
    try {
      const res = await api.put(`/invoices/${invoice._id}`, { paymentStatus: status });
      if (res.data.success) {
        setInvoice(res.data.data);
      }
    } catch (err) {
      console.error('Failed to update invoice status:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Invoice not found</p>
        <Button onClick={() => navigate('/invoices')} variant="outline" className="mt-4">
          Back to Invoices
        </Button>
      </div>
    );
  }

  const client = typeof invoice.clientId === 'object' ? invoice.clientId : null;
  const project = typeof invoice.projectId === 'object' ? invoice.projectId : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in-50">
      {/* Top Action Controls (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link to="/invoices" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Invoices
        </Link>

        <div className="flex items-center gap-2">
          {/* AI Payment Reminder Trigger */}
          {invoice.paymentStatus !== 'paid' && (
            <Button
              onClick={() => setIsAiModalOpen(true)}
              variant="copilot"
              size="sm"
              className="text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              AI Reminder
            </Button>
          )}

          {invoice.paymentStatus !== 'paid' ? (
            <Button
              onClick={() => handleUpdateStatus('paid')}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              Mark as Paid
            </Button>
          ) : (
            <Badge variant="success" className="px-3 py-1 text-xs">
              ✓ Payment Settled
            </Badge>
          )}

          <Link to={`/invoices/edit/${invoice._id}`}>
            <Button variant="secondary" size="sm">
              <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
          </Link>

          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="h-3.5 w-3.5 mr-1.5" /> Print / PDF
          </Button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-glow">
                {user?.name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="font-bold text-base text-foreground block">
                  {user?.businessDetails?.companyName || user?.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">{user?.businessDetails?.taxNumber}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{user?.businessDetails?.address || 'San Francisco, CA'}</p>
            <p className="text-xs text-muted-foreground">{user?.email} • {user?.businessDetails?.phone}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-primary block">Tax Invoice</span>
            <h2 className="text-xl font-bold font-mono text-foreground mt-0.5">
              {invoice.invoiceNumber}
            </h2>
            <div className="mt-2">
              <Badge
                variant={
                  invoice.paymentStatus === 'paid'
                    ? 'success'
                    : invoice.paymentStatus === 'overdue'
                    ? 'danger'
                    : 'info'
                }
                dot
              >
                {invoice.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Bill To & Invoice Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-muted/30 border border-border/40 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Billed To</span>
            <h4 className="font-bold text-sm text-foreground">{client?.name}</h4>
            <p className="text-muted-foreground">{client?.company || 'Individual Client'}</p>
            <p className="text-muted-foreground">{client?.address}</p>
            <p className="text-muted-foreground">{client?.email}</p>
          </div>

          <div className="sm:text-right space-y-1 font-mono">
            <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold block mb-1">Invoice Timeline</span>
            <p><span className="text-muted-foreground font-sans">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
            <p className="font-bold text-foreground"><span className="text-muted-foreground font-sans font-normal">Due Date:</span> {formatDate(invoice.dueDate)}</p>
            {project && <p><span className="text-muted-foreground font-sans">Project:</span> {project.name}</p>}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Item & Description</th>
                  <th className="p-3.5 text-center">Qty / Hrs</th>
                  <th className="p-3.5 text-right">Rate</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3.5 font-medium text-foreground">{item.description}</td>
                    <td className="p-3.5 text-center font-mono">{item.quantity}</td>
                    <td className="p-3.5 text-right font-mono">{formatCurrency(item.rate, user?.currency)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-foreground">
                      {formatCurrency(item.amount, user?.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-mono font-medium text-foreground">{formatCurrency(invoice.subtotal, user?.currency)}</span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount:</span>
                  <span className="font-mono text-emerald-500">-{formatCurrency(invoice.discountAmount, user?.currency)}</span>
                </div>
              )}

              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span className="font-mono text-foreground">{formatCurrency(invoice.taxAmount, user?.currency)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-border font-bold text-sm">
                <span className="text-foreground">Total Due:</span>
                <span className="font-mono text-lg text-primary font-extrabold">
                  {formatCurrency(invoice.total, user?.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions & Notes */}
        <div className="pt-6 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <h5 className="font-bold text-foreground mb-1">Payment Terms</h5>
            <p className="text-muted-foreground leading-relaxed">
              {invoice.paymentTerms || 'Payment due within 14 days of invoice date.'}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-foreground mb-1">Remittance & Notes</h5>
            <p className="text-muted-foreground leading-relaxed">
              {invoice.notes || 'Thank you for your business! Please transfer funds via direct wire.'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Invoice Reminder Modal */}
      <AIInvoiceReminderModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        invoice={invoice}
      />
    </div>
  );
};
