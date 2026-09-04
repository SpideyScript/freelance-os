import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { AIProposalGeneratorModal } from './AIProposalGeneratorModal';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const ProposalEditor = () => {
  const { id } = useParams();
  const isEditing = !!id && id !== 'new';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeline, setTimeline] = useState('4-6 weeks');
  const [pricingExplanation, setPricingExplanation] = useState('');
  const [terms, setTerms] = useState('Net 14 days per milestone. All IP transfers upon final payment.');
  const [callToAction, setCallToAction] = useState('Click Accept to initiate sprint onboarding.');
  const [status, setStatus] = useState('draft');
  const [expirationDate, setExpirationDate] = useState('');
  const [deliverables, setDeliverables] = useState(['']);
  const [services, setServices] = useState([
    { name: 'Core Implementation', description: 'Full stack development', rate: 95, amount: 3500 },
  ]);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const clientsRes = await api.get('/clients');
        if (clientsRes.data.success) {
          setClients(clientsRes.data.data.clients || []);
        }

        if (isEditing) {
          const proposalRes = await api.get(`/proposals/${id}`);
          if (proposalRes.data.success) {
            const p = proposalRes.data.data;
            setClientId(typeof p.clientId === 'object' ? p.clientId._id : p.clientId);
            setTitle(p.title);
            setDescription(p.description || '');
            setTimeline(p.timeline || '');
            setPricingExplanation(p.pricingExplanation || '');
            setTerms(p.terms || '');
            setCallToAction(p.callToAction || '');
            setStatus(p.status);
            setExpirationDate(p.expirationDate ? new Date(p.expirationDate).toISOString().split('T')[0] : '');
            setDeliverables(p.deliverables?.length ? p.deliverables : ['']);
            setServices(p.services?.length ? p.services : []);
          }
        } else {
          setExpirationDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error('Failed to load proposal editor:', err);
      }
    };
    fetchInitData();
  }, [id, isEditing]);

  const handleAddDeliverable = () => setDeliverables([...deliverables, '']);
  const handleDeliverableChange = (idx, val) => {
    const updated = [...deliverables];
    updated[idx] = val;
    setDeliverables(updated);
  };
  const handleRemoveDeliverable = (idx) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const handleAddService = () => {
    setServices([...services, { name: '', description: '', rate: 95, amount: 1000 }]);
  };

  const handleServiceChange = (idx, field, val) => {
    const updated = [...services];
    updated[idx][field] = val;
    if (field === 'rate') {
      updated[idx].amount = Number(val) * 10;
    }
    setServices(updated);
  };

  const handleRemoveService = (idx) => {
    setServices(services.filter((_, i) => i !== idx));
  };

  const handleProposalGeneratedByAi = (aiData, selectedClientId) => {
    setClientId(selectedClientId);
    setTitle(aiData.title);
    setDescription(`${aiData.introduction}\n\n${aiData.problemUnderstanding}\n\n${aiData.proposedSolution}`);
    setTimeline(aiData.timeline);
    setPricingExplanation(aiData.pricingExplanation);
    setTerms(aiData.terms);
    setCallToAction(aiData.callToAction);
    setDeliverables(aiData.deliverables);
    setServices(aiData.services);
  };

  const totalCalculated = services.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setError('Please select a client');
      return;
    }
    setIsLoading(true);
    setError('');

    const payload = {
      clientId,
      title,
      description,
      timeline,
      pricingExplanation,
      terms,
      callToAction,
      status,
      expirationDate: expirationDate ? new Date(expirationDate).toISOString() : undefined,
      deliverables: deliverables.filter(Boolean),
      services,
      totalAmount: totalCalculated,
      generatedWithAi: true,
    };

    try {
      if (isEditing) {
        await api.put(`/proposals/${id}`, payload);
        navigate(`/proposals/${id}`);
      } else {
        const res = await api.post('/proposals', payload);
        navigate(`/proposals/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save proposal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/proposals" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Proposals
        </Link>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            variant="copilot"
            size="sm"
            className="text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Generate with Copilot
          </Button>

          {isEditing && (
            <Link to={`/proposals/${id}`}>
              <Button type="button" variant="outline" size="sm">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Preview
              </Button>
            </Link>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        {/* Section 1: Client & Proposal Core Info */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Proposal Header & Client Scope</CardTitle>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Target Client *"
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
              label="Proposal Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'Draft', value: 'draft' },
                { label: 'Sent to Client', value: 'sent' },
                { label: 'Accepted', value: 'accepted' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Expired', value: 'expired' },
              ]}
            />
          </div>

          <Input
            label="Proposal Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Turnkey Algorithmic Trading Platform Solution"
            required
          />

          <Textarea
            label="Executive Summary & Solution Architecture"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Introduce the solution, client problem understanding, and strategic deliverables..."
            rows={5}
          />
        </Card>

        {/* Section 2: Services & Pricing Table */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <CardTitle>Services & Investment Breakdown</CardTitle>
            <Button type="button" onClick={handleAddService} variant="secondary" size="sm" className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Service
            </Button>
          </div>

          <div className="space-y-3">
            {services.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Service / Phase Name"
                      value={item.name}
                      onChange={(e) => handleServiceChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Core Architecture Sprint"
                      required
                    />
                    <Input
                      label="Rate ($/hr)"
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleServiceChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                    />
                    <Input
                      label="Phase Amount ($ USD)"
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleServiceChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="text-muted-foreground hover:text-destructive p-1 mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Input
                  label="Service Scope Details"
                  value={item.description}
                  onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                  placeholder="Details of what is included in this phase..."
                />
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-sm">
            <span className="font-bold text-foreground">Total Proposed Investment:</span>
            <span className="font-extrabold font-mono text-lg text-primary">
              {formatCurrency(totalCalculated, user?.currency)}
            </span>
          </div>

          <Textarea
            label="Pricing Structure Explanation"
            value={pricingExplanation}
            onChange={(e) => setPricingExplanation(e.target.value)}
            placeholder="e.g. Structured across 3 milestones (30% deposit, 40% mid-point review, 30% final signoff)..."
            rows={2}
          />
        </Card>

        {/* Section 3: Deliverables Checklist & Terms */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <CardTitle>Key Deliverables & Timelines</CardTitle>
            <Button type="button" onClick={handleAddDeliverable} variant="secondary" size="sm" className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Deliverable
            </Button>
          </div>

          <div className="space-y-2">
            {deliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <Input
                  value={d}
                  onChange={(e) => handleDeliverableChange(i, e.target.value)}
                  placeholder={`Deliverable #${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDeliverable(i)}
                  className="text-muted-foreground hover:text-destructive p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/40">
            <Input
              label="Delivery Timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 4-6 weeks across sprint milestones"
            />

            <Input
              label="Proposal Expiration Date"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          <Textarea
            label="Terms & Conditions"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={2}
          />

          <Input
            label="Call to Action"
            value={callToAction}
            onChange={(e) => setCallToAction(e.target.value)}
            placeholder="e.g. Sign below to schedule our kickoff session..."
          />
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3">
          <Link to="/proposals">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={isLoading} className="h-11 px-6 font-semibold">
            <Save className="h-4 w-4 mr-2" />
            Save Proposal
          </Button>
        </div>
      </form>

      {/* AI Proposal Generator Modal */}
      <AIProposalGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onProposalGenerated={handleProposalGeneratedByAi}
      />
    </div>
  );
};
