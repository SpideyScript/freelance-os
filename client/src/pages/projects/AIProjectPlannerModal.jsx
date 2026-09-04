import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Sparkles, CheckCircle2, Layers, Clock } from 'lucide-react';
import { api } from '../../lib/api';

export const AIProjectPlannerModal = ({ isOpen, onClose, onPlanCreated }) => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [timeline, setTimeline] = useState('4 weeks');
  const [budget, setBudget] = useState('4000');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
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
    if (!projectName.trim() || !projectDescription.trim()) {
      setError('Project name and description are required');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const res = await api.post('/ai/project-planner', {
        projectName,
        projectDescription,
        timeline,
        budget: parseFloat(budget) || undefined,
      });

      if (res.data.success) {
        setGeneratedPlan(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptAndCreate = async () => {
    if (!generatedPlan || !clientId) {
      setError('Please select a client to assign this project to');
      return;
    }

    try {
      // 1. Create Project
      const projRes = await api.post('/projects', {
        clientId,
        name: projectName,
        description: generatedPlan.summary,
        budget: parseFloat(budget) || 4000,
        estimatedHours: generatedPlan.totalEstimatedHours || 40,
        status: 'in_progress',
        priority: 'high',
        milestones: generatedPlan.milestones?.map((m) => ({
          title: m.title,
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
          completed: false,
        })),
      });

      const newProjectId = projRes.data.data._id;

      // 2. Create Tasks from Phases
      for (const phase of generatedPlan.phases || []) {
        for (const task of phase.tasks || []) {
          await api.post('/tasks', {
            projectId: newProjectId,
            title: task.title,
            description: task.description,
            estimatedHours: task.estimatedHours,
            priority: task.priority || 'medium',
            status: 'todo',
          });
        }
      }

      onPlanCreated();
      onClose();
    } catch (err) {
      setError('Failed to instantiate project tasks from plan');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Autonomous Project Roadmap Planner"
      description="Freelance Copilot breaks down client briefs into technical phases, milestones, and actionable sprint tasks."
      size="lg"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        {!generatedPlan ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <Input
              label="Project Title *"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Real-time Crypto Analytics Dashboard"
              required
            />

            <Textarea
              label="Client Scope Brief & Deliverable Requirements *"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe requirements, APIs to connect, user authentication needs, charts, and deliverables..."
              rows={4}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Estimated Timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="4 weeks"
              />
              <Input
                label="Target Budget ($ USD)"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="4000"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="copilot" isLoading={isGenerating}>
                <Sparkles className="h-4 w-4 mr-1.5" />
                Generate Project Roadmap
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-sm">{projectName} Roadmap</span>
                <span className="font-mono text-xs font-semibold">
                  Est: {generatedPlan.totalEstimatedHours} hours
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{generatedPlan.summary}</p>
            </div>

            {/* Select Client for Instant Creation */}
            <Select
              label="Assign to Client Account *"
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

            {/* Phases Breakdown */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {generatedPlan.phases?.map((phase, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{phase.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{phase.duration}</span>
                  </div>
                  <div className="space-y-1">
                    {phase.tasks?.map((t, ti) => (
                      <div key={ti} className="flex items-center justify-between text-muted-foreground text-[11px] pl-2 border-l-2 border-primary/40">
                        <span>• {t.title}</span>
                        <span className="font-mono">{t.estimatedHours}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => setGeneratedPlan(null)}>
                Back / Edit Inputs
              </Button>
              <Button type="button" variant="copilot" onClick={handleAcceptAndCreate}>
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Instantiate Project & Tasks
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
