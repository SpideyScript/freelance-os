import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Plus,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  Edit2,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { ProjectModal } from './ProjectModal';
import { AIProjectPlannerModal } from './AIProjectPlannerModal';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const ProjectsList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/projects?search=${encodeURIComponent(search)}&status=${statusFilter}&priority=${priorityFilter}`);
      if (res.data.success) {
        setProjects(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, statusFilter, priorityFilter]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this project and all linked tasks?')) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="info" dot>In Progress</Badge>;
      case 'completed':
        return <Badge variant="success" dot>Completed</Badge>;
      case 'planning':
        return <Badge variant="purple" dot>Planning</Badge>;
      case 'in_review':
        return <Badge variant="warning" dot>In Review</Badge>;
      case 'on_hold':
        return <Badge variant="default" dot>On Hold</Badge>;
      default:
        return <Badge variant="outline" dot>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Briefcase className="h-7 w-7 text-amber-500" /> Projects & Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track client delivery milestones, estimated sprint hours, and task status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsAiModalOpen(true)}
            variant="copilot"
            size="sm"
            className="text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            AI Project Planner
          </Button>

          <Button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Project
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name..."
            className="h-10 w-full pl-9 pr-4 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All Projects', value: 'all' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Planning', value: 'planning' },
            { label: 'Completed', value: 'completed' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects found"
          description="Create your first client project or use Freelance Copilot AI to plan a full sprint."
          actionLabel="Create Project"
          onAction={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          copilotActionLabel="AI Roadmap Generator"
          onCopilotAction={() => setIsAiModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            const client = typeof project.clientId === 'object' ? project.clientId : null;
            const progressPct =
              project.estimatedHours > 0
                ? Math.min(100, Math.round((project.actualHours / project.estimatedHours) * 100))
                : 0;

            return (
              <Link key={project._id} to={`/projects/${project._id}`} className="group block">
                <Card hoverEffect className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      {getStatusBadge(project.status)}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{client?.name || 'Client Account'}</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      {project.description || 'No description provided.'}
                    </p>

                    {/* Hours Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-muted-foreground">Hours Progress</span>
                        <span className="font-bold text-foreground">
                          {project.actualHours} / {project.estimatedHours}h ({progressPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progressPct > 100 ? 'bg-destructive' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Budget
                      </span>
                      <span className="font-bold text-foreground font-mono">
                        {formatCurrency(project.budget, user?.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingProject(project);
                          setIsModalOpen(true);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        onClick={(e) => handleDelete(e, project._id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Manual Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchProjects}
        project={editingProject}
      />

      {/* AI Project Planner Modal */}
      <AIProjectPlannerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onPlanCreated={fetchProjects}
      />
    </div>
  );
};
