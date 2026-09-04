import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  Kanban,
  List,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TaskModal } from './TaskModal';
import { AITaskPrioritizerModal } from './AITaskPrioritizerModal';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/utils';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-500/10 text-slate-400', border: 'border-slate-500/30' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-sky-500/10 text-sky-400', border: 'border-sky-500/30' },
  { id: 'review', label: 'Review', color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/30' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' },
];

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban');

  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAiPrioritizerOpen, setIsAiPrioritizerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState('todo');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        api.get(`/tasks?search=${encodeURIComponent(search)}&projectId=${projectFilter}&priority=${priorityFilter}`),
        api.get('/projects'),
      ]);

      if (tasksRes.data.success) {
        setTasks(tasksRes.data.data || []);
      }
      if (projectsRes.data.success) {
        setProjects(projectsRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, projectFilter, priorityFilter]);

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
      fetchData();
    }
  };

  const handleDeleteTask = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks((prev) => prev.filter((t) => t._id !== id));
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="danger" className="text-[10px]">Urgent</Badge>;
      case 'high':
        return <Badge variant="warning" className="text-[10px]">High</Badge>;
      case 'medium':
        return <Badge variant="info" className="text-[10px]">Medium</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <CheckSquare className="h-7 w-7 text-emerald-500" /> Task Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Organize sprints with Kanban workflow, subtasks checklist, and AI prioritization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-card border border-border">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <Button
            onClick={() => setIsAiPrioritizerOpen(true)}
            variant="copilot"
            size="sm"
            className="text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            AI Prioritizer
          </Button>

          <Button
            onClick={() => {
              setEditingTask(null);
              setDefaultStatusForNew('todo');
              setIsTaskModalOpen(true);
            }}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="h-10 w-full pl-9 pr-4 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-56"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-40"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="rounded-2xl border border-border/60 bg-card/60 p-3.5 space-y-3 min-h-[500px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground font-semibold">
                      {colTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setDefaultStatusForNew(col.id);
                      setIsTaskModalOpen(true);
                    }}
                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colTasks.map((task) => {
                    const projectName =
                      typeof task.projectId === 'object' ? task.projectId?.name : null;
                    const subtaskCount = task.subtasks?.length || 0;
                    const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

                    return (
                      <div
                        key={task._id}
                        onClick={() => {
                          setEditingTask(task);
                          setIsTaskModalOpen(true);
                        }}
                        className="p-3.5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 cursor-pointer transition-all card-hover space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-foreground line-clamp-2">
                            {task.title}
                          </h4>
                          {getPriorityBadge(task.priority)}
                        </div>

                        {projectName && (
                          <span className="inline-block text-[10px] font-semibold text-primary px-1.5 py-0.5 rounded bg-primary/10 truncate max-w-full">
                            {projectName}
                          </span>
                        )}

                        {task.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks Progress */}
                        {subtaskCount > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span>{completedSubtasks}/{subtaskCount} subtasks</span>
                          </div>
                        )}

                        {/* Footer & Status Shift Buttons */}
                        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                          {task.dueDate ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-sky-500" />
                              {formatDate(task.dueDate)}
                            </span>
                          ) : (
                            <span>{task.estimatedHours}h est</span>
                          )}

                          {/* Quick Column Shift Actions */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {col.id !== 'todo' && (
                              <button
                                onClick={() => handleStatusChange(task._id, col.id === 'done' ? 'review' : col.id === 'review' ? 'in_progress' : 'todo')}
                                className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-[10px] font-bold"
                                title="Move left"
                              >
                                ←
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={() => handleStatusChange(task._id, col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'review' : 'done')}
                                className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-[10px] font-bold"
                                title="Move right"
                              >
                                →
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDeleteTask(e, task._id)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table List View */
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Task Title</th>
                  <th className="p-3.5">Project</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Hours</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {tasks.map((task) => {
                  const projectName =
                    typeof task.projectId === 'object' ? task.projectId?.name : 'General';

                  return (
                    <tr
                      key={task._id}
                      onClick={() => {
                        setEditingTask(task);
                        setIsTaskModalOpen(true);
                      }}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5 font-bold text-foreground">{task.title}</td>
                      <td className="p-3.5 text-muted-foreground">{projectName}</td>
                      <td className="p-3.5">
                        <select
                          value={task.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className="bg-muted px-2 py-1 rounded text-xs border border-border font-medium text-foreground"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td className="p-3.5">{getPriorityBadge(task.priority)}</td>
                      <td className="p-3.5 font-mono text-muted-foreground">{formatDate(task.dueDate)}</td>
                      <td className="p-3.5 font-mono text-muted-foreground">{task.estimatedHours}h</td>
                      <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleDeleteTask(e, task._id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Task Add / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={fetchData}
        task={editingTask}
        defaultStatus={defaultStatusForNew}
      />

      {/* AI Task Prioritizer Modal */}
      <AITaskPrioritizerModal
        isOpen={isAiPrioritizerOpen}
        onClose={() => setIsAiPrioritizerOpen(false)}
        tasks={tasks}
      />
    </div>
  );
};
