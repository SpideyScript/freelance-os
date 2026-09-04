import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Receipt,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const InvoiceBuilder = () => {
  const { id } = useParams();
  const isEditing = !!id && id !== 'new';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('draft');
  const [taxRate, setTaxRate] = useState('0');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [notes, setNotes] = useState(user?.businessDetails?.defaultInvoiceNotes || 'Thank you for your business! Please transfer funds via bank wire.');
  const [paymentTerms, setPaymentTerms] = useState(user?.businessDetails?.defaultPaymentTerms || 'Net 14 days');
  const [items, setItems] = useState([
    { description: 'Sprint 1: Full-stack SaaS Development', quantity: 1, rate: 2500, amount: 2500 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [clientsRes, projectsRes] = await Promise.all([
          api.get('/clients'),
          api.get('/projects'),
        ]);

        if (clientsRes.data.success) {
          setClients(clientsRes.data.data.clients || []);
        }
        if (projectsRes.data.success) {
          setProjects(projectsRes.data.data || []);
        }

        if (isEditing) {
          const invRes = await api.get(`/invoices/${id}`);
          if (invRes.data.success) {
            const inv = invRes.data.data;
            setClientId(typeof inv.clientId === 'object' ? inv.clientId._id : inv.clientId);
            setProjectId(typeof inv.projectId === 'object' ? inv.projectId._id : inv.projectId || '');
            setInvoiceNumber(inv.invoiceNumber);
            setIssueDate(new Date(inv.issueDate).toISOString().split('T')[0]);
            setDueDate(new Date(inv.dueDate).toISOString().split('T')[0]);
            setPaymentStatus(inv.paymentStatus);
            setTaxRate(inv.taxRate?.toString() || '0');
            setDiscountAmount(inv.discountAmount?.toString() || '0');
            setNotes(inv.notes || '');
            setPaymentTerms(inv.paymentTerms || '');
            setItems(inv.items || []);
          }
        } else {
          setInvoiceNumber(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
          setIssueDate(new Date().toISOString().split('T')[0]);
          setDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error('Failed to initialize invoice builder:', err);
      }
    };
    fetchInit();
  }, [id, isEditing]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: user?.hourlyRate || 85, amount: user?.hourlyRate || 85 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    const qty = Number(updated[index].quantity) || 1;
    const rate = Number(updated[index].rate) || 0;
    updated[index].amount = parseFloat((qty * rate).toFixed(2));

    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const discountVal = Number(discountAmount) || 0;
  const taxable = Math.max(0, subtotal - discountVal);
  const taxVal = (taxable * (Number(taxRate) || 0)) / 100;
  const grandTotal = parseFloat((taxable + taxVal).toFixed(2));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setError('Please select a client for this invoice');
      return;
    }
    if (items.length === 0) {
      setError('At least one line item is required');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      clientId,
      projectId: projectId || undefined,
      invoiceNumber,
      issueDate: new Date(issueDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      items,
      taxRate: Number(taxRate) || 0,
      discountAmount: discountVal,
      notes,
      paymentTerms,
      paymentStatus,
    };

    try {
      if (isEditing) {
        await api.put(`/invoices/${id}`, payload);
        navigate(`/invoices/${id}`);
      } else {
        const res = await api.post('/invoices', payload);
        navigate(`/invoices/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save invoice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/invoices" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Invoices
        </Link>

        {isEditing && (
          <Link to={`/invoices/${id}`}>
            <Button type="button" variant="outline" size="sm">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview Invoice
            </Button>
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        {/* Invoice Metadata */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Invoice Details & Client</CardTitle>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Billed Client *"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              <option value="">Select a client...</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.company ? `(${c.company})` : ''}
                </option>
              ))}
            </Select>

            <Select
              label="Associated Project (Optional)"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">None (Standalone Invoice)</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </Select>

            <Input
              label="Invoice Number *"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Issue Date"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />

            <Input
              label="Due Date *"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />

            <Select
              label="Status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              options={[
                { label: 'Draft', value: 'draft' },
                { label: 'Sent (Pending Payment)', value: 'sent' },
                { label: 'Paid', value: 'paid' },
                { label: 'Overdue', value: 'overdue' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
          </div>
        </Card>

        {/* Line Items Builder */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <CardTitle>Line Items & Services</CardTitle>
            <Button type="button" onClick={handleAddItem} variant="secondary" size="sm" className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1 w-full">
                  <Input
                    label={idx === 0 ? 'Description' : undefined}
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Item or service description"
                    required
                  />
                </div>

                <div className="w-full sm:w-24">
                  <Input
                    label={idx === 0 ? 'Qty / Hrs' : undefined}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    min="0.1"
                    step="any"
                    required
                  />
                </div>

                <div className="w-full sm:w-32">
                  <Input
                    label={idx === 0 ? 'Rate ($)' : undefined}
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="any"
                    required
                  />
                </div>

                <div className="w-full sm:w-32 text-right">
                  {idx === 0 && <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Amount</span>}
                  <span className="font-mono font-bold text-sm text-foreground block py-2">
                    {formatCurrency(item.amount, user?.currency)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-muted-foreground hover:text-destructive p-1 self-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Calculations Summary Section */}
          <div className="pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-3">
              <Input
                label="Payment Terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="e.g. Net 14 days"
              />
              <Textarea
                label="Invoice Notes / Wire Transfer Instructions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="p-4 rounded-xl bg-card border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-mono font-bold text-foreground">{formatCurrency(subtotal, user?.currency)}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Discount ($):</span>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="h-7 w-24 text-right px-2 rounded border border-border bg-muted/40 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Tax Rate (%):</span>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="h-7 w-24 text-right px-2 rounded border border-border bg-muted/40 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border font-bold text-sm">
                <span className="text-foreground">Grand Total:</span>
                <span className="font-mono text-base text-primary font-extrabold">
                  {formatCurrency(grandTotal, user?.currency)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link to="/invoices">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={isLoading} className="h-11 px-6 font-semibold">
            <Save className="h-4 w-4 mr-2" />
            Save Invoice
          </Button>
        </div>
      </form>
    </div>
  );
};
