import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Sparkles } from 'lucide-react';
import { api } from '../../lib/api';

export const AIProposalGeneratorModal = ({ isOpen, onClose, onProposalGenerated }) => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [budget, setBudget] = useState('5000');
  const [timeline, setTimeline] = useState('4-6 weeks');
  const [skillsInput, setSkillsInput] = useState('React, JavaScript, Node.js, Tailwind CSS');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        if (res.data.success) {
          setClients(res.data.data.clients || []);
        }
      } catch (err) {
        console.error('Failed to load clients:', err);
      }
    };
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setError('Please select a client');
      return;
    }
    if (!projectDescription.trim()) {
      setError('Project description is required');
      return;
    }

    const selectedClient = clients.find((c) => c._id === clientId);
    setIsGenerating(true);
    setError('');

    try {
      const res = await api.post('/ai/proposal', {
        clientName: selectedClient?.name || 'Client',
        clientCompany: selectedClient?.company,
        projectDescription,
        services: servicesInput.split(',').map((s) => s.trim()).filter(Boolean),
        budget: parseFloat(budget) || undefined,
        timeline,
        freelancerSkills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
      });

      if (res.data.success) {
        onProposalGenerated(res.data.data, clientId);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate proposal');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Executive Proposal Generator"
      description="Freelance Copilot writes a high-converting client proposal with scope, deliverables, and pricing breakdown."
      size="lg"
    >
      <form onSubmit={handleGenerate} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        <Select
          label="Target Client Account *"
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

        <Textarea
          label="Project Requirements & Client Problem *"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="e.g. Build an algorithmic trading dashboard with live WebSockets, order depth charts, and automated reporting..."
          rows={3}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Estimated Budget ($ USD)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="5000"
          />
          <Input
            label="Delivery Timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="4-6 weeks"
          />
        </div>

        <Input
          label="Key Services (Comma separated)"
          value={servicesInput}
          onChange={(e) => setServicesInput(e.target.value)}
          placeholder="Frontend React, Backend API, WebSocket Architecture, QA Testing"
        />

        <Input
          label="Your Core Skills / Tech Stack"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          placeholder="React, JavaScript, Node.js, MongoDB, UI/UX"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="copilot" isLoading={isGenerating}>
            <Sparkles className="h-4 w-4 mr-1.5" />
            Generate Proposal Draft
          </Button>
        </div>
      </form>
    </Modal>
  );
};
