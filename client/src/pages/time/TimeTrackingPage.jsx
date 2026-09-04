import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Square,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { api } from '../../lib/api';
import { formatCurrency, formatDate, formatDuration, formatDurationDigital } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useTimer } from '../../context/TimerContext';

export const TimeTrackingPage = () => {
  const { user } = useAuth();
  const { isRunning, elapsedSeconds, activeTimer, startTimer, stopTimer } = useTimer();

  const [entries, setEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick Start Form
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [sessionDesc, setSessionDesc] = useState('');

  // Manual Entry Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualProjId, setManualProjId] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualDurationHours, setManualDurationHours] = useState('2');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualIsBillable, setManualIsBillable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTimeData = async () => {
    try {
      setIsLoading(true);
      const [entriesRes, projRes] = await Promise.all([
        api.get('/time'),
        api.get('/projects'),
      ]);
      if (entriesRes.data.success) {
        setEntries(entriesRes.data.data || []);
      }
      if (projRes.data.success) {
        setProjects(projRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load time entries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeData();
  }, [isRunning]);

  const handleStartTimer = async (e) => {
    e.preventDefault();
    await startTimer({
      projectId: selectedProjectId || undefined,
      description: sessionDesc || 'Focus Work Session',
    });
    setSessionDesc('');
  };

  const handleSaveManualEntry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const hours = parseFloat(manualDurationHours) || 0;
      const durationSeconds = Math.round(hours * 3600);

      await api.post('/time/manual', {
        projectId: manualProjId || undefined,
        description: manualDesc || 'General Work',
        duration: durationSeconds,
        startTime: new Date(manualDate).toISOString(),
        isBillable: manualIsBillable,
      });

      setIsManualModalOpen(false);
      fetchTimeData();
    } catch (err) {
      console.error('Failed to log manual time:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Delete this time entry?')) {
      try {
        await api.delete(`/time/${id}`);
        setEntries((prev) => prev.filter((e) => e._id !== id));
      } catch (err) {
        console.error('Failed to delete time entry:', err);
      }
    }
  };

  const totalSeconds = entries.reduce((s, e) => s + (e.duration || 0), 0);
  const billableSeconds = entries.filter((e) => e.isBillable).reduce((s, e) => s + (e.duration || 0), 0);
  const totalHours = parseFloat((totalSeconds / 3600).toFixed(1));
  const billableHours = parseFloat((billableSeconds / 3600).toFixed(1));
  const estimatedRevenue = Math.round(billableHours * (user?.hourlyRate || 85));

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Clock className="h-7 w-7 text-purple-500" /> Time Tracking & Timesheets
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track focused sessions, log billable hours, and calculate realized revenue.
          </p>
        </div>

        <Button onClick={() => setIsManualModalOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Log Manual Time
        </Button>
      </div>

      {/* Live Active Timer Bar */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-card to-muted/30 border-primary/30">
        <form onSubmit={handleStartTimer} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={isRunning ? activeTimer?.description || 'Active Focus Session' : sessionDesc}
              onChange={(e) => setSessionDesc(e.target.value)}
              disabled={isRunning}
              placeholder="What are you working on right now?"
              className="h-11 w-full rounded-xl border border-border bg-card px-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-80"
            />

            <select
              value={isRunning ? (typeof activeTimer?.projectId === 'object' ? activeTimer?.projectId?._id : activeTimer?.projectId) || '' : selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={isRunning}
              className="h-11 px-3 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-60 disabled:opacity-80"
            >
              <option value="">No Project (General)</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider text-foreground">
              {formatDurationDigital(elapsedSeconds)}
            </div>

            {isRunning ? (
              <Button
                type="button"
                onClick={() => stopTimer()}
                variant="danger"
                className="h-11 px-6 text-xs font-bold"
              >
                <Square className="h-4 w-4 mr-2 fill-current" />
                Stop Session
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                className="h-11 px-6 text-xs font-bold shadow-glow"
              >
                <Play className="h-4 w-4 mr-2 fill-current" />
                Start Timer
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Total Hours Logged</span>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">{totalHours} hrs</div>
          <span className="text-xs text-muted-foreground">{entries.length} focus sessions</span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Billable Hours</span>
          <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">{billableHours} hrs</div>
          <span className="text-xs text-muted-foreground">
            {totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0}% utilization rate
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Estimated Billable Value</span>
          <div className="text-2xl font-bold font-mono text-primary mt-1">
            {formatCurrency(estimatedRevenue, user?.currency)}
          </div>
          <span className="text-xs text-muted-foreground">@ ${user?.hourlyRate || 85}/hr default rate</span>
        </Card>
      </div>

      {/* Timesheet Entries List */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>Recent Time Logs & Timesheet</CardTitle>
        </CardHeader>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-12">
            No time entries logged yet. Start the stopwatch above or click Log Manual Time.
          </p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const proj = typeof entry.projectId === 'object' ? entry.projectId?.name : null;
              const revenue = Math.round((entry.duration / 3600) * (entry.hourlyRate || user?.hourlyRate || 85));

              return (
                <div
                  key={entry._id}
                  className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground text-sm">{entry.description || 'Focus Session'}</h4>
                      <p className="text-muted-foreground text-[11px] flex items-center gap-2 mt-0.5">
                        {proj && <span className="font-semibold text-primary">{proj} •</span>}
                        <span>{formatDate(entry.startTime)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 font-mono">
                    <div className="text-left sm:text-right">
                      <span className="font-bold text-foreground text-sm block">
                        {formatDuration(entry.duration)}
                      </span>
                      {entry.isBillable ? (
                        <span className="text-[10px] text-emerald-500 font-semibold">
                          +{formatCurrency(revenue, user?.currency)} (Billable)
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Non-billable</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(entry._id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Manual Time Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Log Manual Time"
        description="Record hours spent on client deliverables or meetings."
        size="md"
      >
        <form onSubmit={handleSaveManualEntry} className="space-y-4">
          <Input
            label="Work Description *"
            value={manualDesc}
            onChange={(e) => setManualDesc(e.target.value)}
            placeholder="e.g. Client architecture briefing and wireframing"
            required
          />

          <Select
            label="Associated Project"
            value={manualProjId}
            onChange={(e) => setManualProjId(e.target.value)}
          >
            <option value="">No Project (General Work)</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hours Spent *"
              type="number"
              value={manualDurationHours}
              onChange={(e) => setManualDurationHours(e.target.value)}
              min="0.1"
              step="any"
              required
            />

            <Input
              label="Date"
              type="date"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="billableCheck"
              checked={manualIsBillable}
              onChange={(e) => setManualIsBillable(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="billableCheck" className="text-xs font-medium text-foreground cursor-pointer">
              Mark this entry as billable
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" onClick={() => setIsManualModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Time Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
