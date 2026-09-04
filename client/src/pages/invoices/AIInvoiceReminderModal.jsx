import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Sparkles, Copy, Check } from 'lucide-react';
import { api } from '../../lib/api';

export const AIInvoiceReminderModal = ({ isOpen, onClose, invoice }) => {
  const [tone, setTone] = useState('gentle');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const clientName = typeof invoice.clientId === 'object' ? invoice.clientId?.name : 'Client';
  const dueDate = new Date(invoice.dueDate);
  const now = new Date();
  const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)));

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post('/ai/invoice-reminder', {
        invoiceNumber: invoice.invoiceNumber,
        clientName,
        amount: invoice.total,
        dueDate: invoice.dueDate,
        daysOverdue,
        relationshipTone: tone,
      });

      if (res.data.success) {
        setGeneratedDraft(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to generate invoice reminder:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Invoice Payment Reminder"
      description={`Generate a tailored collection reminder for Invoice #${invoice.invoiceNumber}`}
      size="md"
    >
      <div className="space-y-4">
        {/* Overdue Status Banner */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground flex items-center justify-between">
          <div>
            <span className="font-bold text-amber-500 block">
              {daysOverdue > 0 ? `⚠️ ${daysOverdue} Days Past Due` : 'Due soon'}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Amount Outstanding: ${invoice.total?.toLocaleString()}
            </span>
          </div>
        </div>

        <Select
          label="Reminder Urgency Tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          options={[
            { label: 'Gentle & Friendly Follow-up', value: 'gentle' },
            { label: 'Professional & Firm Notice', value: 'firm' },
            { label: 'Urgent Overdue Collection Notice', value: 'urgent' },
          ]}
        />

        <Button
          onClick={handleGenerate}
          variant="copilot"
          isLoading={isGenerating}
          className="w-full text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Draft Payment Reminder
        </Button>

        {generatedDraft && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Generated Email Reminder:</span>
              <Button onClick={handleCopy} variant="ghost" size="sm" className="h-7 text-xs gap-1">
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/30 text-xs font-mono leading-relaxed whitespace-pre-wrap">
              {generatedDraft}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
