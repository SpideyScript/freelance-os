import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { api } from '../../lib/api';

export const TaskModal = ({
  isOpen,
  onClose,
  onSaved,
  task,
  defaultStatus = 'todo',
  defaultProjectId,
}) => {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('0');
  const [tagsInput, setTagsInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        if (res.data.success) {
          setProjects(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setProjectId(typeof task.projectId === 'object' ? task.projectId._id : task.projectId || '');
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setEstimatedHours(task.estimatedHours?.toString() || '0');
      setTagsInput((task.tags || []).join(', '));
      setSubtasks(task.subtasks || []);
    } else {
      setProjectId(defaultProjectId || '');
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setDueDate(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
      setEstimatedHours('2');
      setTagsInput('');
      setSubtasks([]);
    }
    setError('');
  }, [task, defaultStatus, defaultProjectId, isOpen]);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (index) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      projectId: projectId || undefined,
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      estimatedHours: parseFloat(estimatedHours) || 0,
      tags,
      subtasks,
    };

    try {
      if (task) {
        await api.put(`/tasks/${task._id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create Task'}
      description="Manage sprint tasks, priority, due date, and subtask checklists."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        <Input
          label="Task Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Optimize WebSocket reconnect backoff strategy"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Associated Project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">No Project (General Backlog)</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </Select>

          <Select
            label="Status Column"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: 'To Do', value: 'todo' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Review', value: 'review' },
              { label: 'Done', value: 'done' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Priority Level"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Urgent', value: 'urgent' },
            ]}
          />

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Input
            label="Est. Hours"
            type="number"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            min="0"
          />
        </div>

        <Textarea
          label="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Technical context, acceptance criteria, or relevant links..."
          rows={2}
        />

        <Input
          label="Tags (Comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Bugfix, WebSockets, Optimization"
        />

        {/* Subtasks Checklist Section */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Subtasks Checklist ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
          </label>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {subtasks.map((st, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/40 text-xs"
              >
                <div
                  className="flex items-center gap-2 cursor-pointer flex-1"
                  onClick={() => handleToggleSubtask(i)}
                >
                  {st.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={`text-foreground ${st.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {st.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(i)}
                  className="text-muted-foreground hover:text-destructive p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add subtask item..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddSubtask} className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
