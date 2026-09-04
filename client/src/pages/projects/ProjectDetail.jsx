import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  IndianRupee,
  Plus,
  Play,
  CheckSquare,
  Building2,
  Edit2,
  Trash2,
  Receipt,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { ProjectModal } from "./ProjectModal";
import { api } from "../../lib/api";
import { formatCurrency, formatDate, formatDuration } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { useTimer } from "../../context/TimerContext";

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startTimer } = useTimer();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProjectDetail = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/projects/${id}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load project detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const handleStartProjectTimer = () => {
    if (!data?.project) return;
    startTimer({
      projectId: data.project._id,
      description: `Working on ${data.project.name}`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data?.project) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Project not found</p>
        <Button
          onClick={() => navigate("/projects")}
          variant="outline"
          className="mt-4"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  const { project, tasks, timeEntries, invoices } = data;
  const client = typeof project.clientId === "object" ? project.clientId : null;

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleStartProjectTimer}
            variant="copilot"
            size="sm"
            className="text-xs"
          >
            <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
            Start Session Timer
          </Button>

          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="secondary"
            size="sm"
          >
            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
            Edit Project
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {project.name}
              </h1>
              <Badge
                variant={project.status === "completed" ? "success" : "info"}
                dot
              >
                {project.status.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {project.priority} priority
              </Badge>
            </div>

            {client && (
              <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> Client: {client.name}
              </p>
            )}

            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed pt-1">
              {project.description || "No description provided."}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap gap-4 text-xs font-mono shrink-0">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 text-center min-w-[120px]">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block font-sans">
                Budget
              </span>
              <span className="text-lg font-bold text-foreground block mt-0.5">
                {formatCurrency(project.budget, user?.currency)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 text-center min-w-[120px]">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block font-sans">
                Logged Hours
              </span>
              <span className="text-lg font-bold text-emerald-500 block mt-0.5">
                {project.actualHours} / {project.estimatedHours}h
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks & Milestones Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Tasks */}
        <Card className="space-y-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-emerald-500" />
              <CardTitle>Project Tasks ({tasks.length})</CardTitle>
            </div>
            <Link to="/tasks" className="text-xs text-primary hover:underline">
              Task Board
            </Link>
          </CardHeader>

          {tasks.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No tasks assigned to this project yet.
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${
                        task.status === "done"
                          ? "text-emerald-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`font-semibold ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <Badge
                    variant={task.status === "done" ? "success" : "outline"}
                    className="text-[10px]"
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Milestones & Time Entries */}
        <Card className="space-y-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <CardTitle>Time Logged ({timeEntries.length} entries)</CardTitle>
            </div>
            <Link to="/time" className="text-xs text-primary hover:underline">
              Time Tracker
            </Link>
          </CardHeader>

          {timeEntries.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No tracked sessions for this project yet.
            </p>
          ) : (
            <div className="space-y-2">
              {timeEntries.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 text-xs font-mono"
                >
                  <div>
                    <p className="font-sans font-semibold text-foreground text-xs">
                      {entry.description || "Focus Session"}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(entry.startTime)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground block">
                      {formatDuration(entry.duration)}
                    </span>
                    <span className="text-[10px] text-emerald-500">
                      {entry.isBillable ? "Billable" : "Non-billable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={fetchProjectDetail}
        project={project}
      />
    </div>
  );
};
