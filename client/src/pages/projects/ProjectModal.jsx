import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';

export const ProjectModal = ({ isOpen, onClose, onSaved, project, defaultClientId }) => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [priority, setPriority] = useState('medium');
  const [budget, setBudget] = useState('0');
  const [estimatedHours, setEstimatedHours] = useState('0');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (project) {
      setClientId(typeof project.clientId === 'object' ? project.clientId._id : project.clientId);
      setName(project.name || '');
      setDescription(project.description || '');
      setStatus(project.status || 'in_progress');
      setPriority(project.priority || 'medium');
      setBudget(project.budget?.toString() || '0');
      setEstimatedHours(project.estimatedHours?.toString() || '0');
      setStartDate(project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '');
      setDueDate(project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '');
      setTagsInput((project.tags || []).join(', '));
    } else {
      setClientId(defaultClientId || '');
      setName('');
      setDescription('');
      setStatus('in_progress');
      setPriority('medium');
      setBudget('3500');
      setEstimatedHours('40');
      setStartDate(new Date().toISOString().split('T')[0]);
      setDueDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
      setTagsInput('');
    }
    setError('');
  }, [project, defaultClientId, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setError('Please select a client');
      return;
    }

    setIsLoading(true);
    setError('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      clientId,
      name,
      description,
      status,
      priority,
      budget: parseFloat(budget) || 0,
      estimatedHours: parseFloat(estimatedHours) || 0,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      tags,
    };

    try {
      if (project) {
        await api.put(`/projects/${project._id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      description="Track milestones, tasks, estimated hours, and budget deliverables."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Client Account *"
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

          <Input
            label="Project Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Next.js SaaS MVP Build"
            required
          />
        </div>

        <Textarea
          label="Project Scope & Deliverable Overview"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Key deliverables, tech requirements, target outcomes..."
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Planning / Discovery', value: 'planning' },
              { label: 'Client Review', value: 'in_review' },
              { label: 'Completed', value: 'completed' },
              { label: 'On Hold', value: 'on_hold' },
            ]}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Urgent', value: 'urgent' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Total Budget ($ USD)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            min="0"
          />

          <Input
            label="Estimated Total Hours"
            type="number"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            min="0"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            label="Target Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Input
          label="Tags (Comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Frontend, React, WebSockets, Sprint"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {project ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
