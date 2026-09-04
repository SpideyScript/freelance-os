import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Sparkles, Clock } from 'lucide-react';
import { api } from '../../lib/api';

export const AITaskPrioritizerModal = ({ isOpen, onClose, tasks }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunPrioritizer = async () => {
    setIsAnalyzing(true);
    try {
      const formattedTasks = tasks.map((t) => ({
        id: t._id,
        title: t.title,
        projectName: typeof t.projectId === 'object' ? t.projectId?.name : undefined,
        dueDate: t.dueDate,
        priority: t.priority,
        estimatedHours: t.estimatedHours,
        status: t.status,
      }));

      const res = await api.post('/ai/prioritize-tasks', { tasks: formattedTasks });
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error('Failed to prioritize tasks:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Sprint Task Prioritizer"
      description="Freelance Copilot analyzes deadlines, client priority, and effort to recommend your exact daily focus order."
      size="lg"
    >
      <div className="space-y-4">
        {!result ? (
          <div className="text-center py-8 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-glow">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">Ready to optimize your sprint backlog</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Copilot will analyze <strong>{tasks.length} active tasks</strong> to construct the highest-leverage execution order.
              </p>
            </div>
            <Button onClick={handleRunPrioritizer} variant="copilot" isLoading={isAnalyzing} className="h-10 text-xs">
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze & Rank Backlog
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* General Advice Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground">
              <span className="font-bold text-emerald-500 block mb-1">Copilot Execution Strategy:</span>
              <p>{result.generalAdvice}</p>
            </div>

            {/* Ranked Task Recommendations */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {result.recommendations.map((rec) => {
                const task = tasks.find((t) => t._id === rec.taskId);
                if (!task) return null;

                return (
                  <div
                    key={rec.taskId}
                    className="p-3.5 rounded-xl border border-border bg-card space-y-2 text-xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="h-6 w-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          #{rec.recommendedRank}
                        </span>
                        <h5 className="font-bold text-foreground truncate">{task.title}</h5>
                      </div>
                      <Badge variant="warning" className="text-[10px] shrink-0">
                        Urgency: {rec.urgencyScore}/100
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      💡 {rec.reasoning}
                    </p>

                    <div className="p-2 rounded-lg bg-muted/40 text-[11px] font-medium text-foreground flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                      <span>{rec.actionAdvice}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
              <Button onClick={() => setResult(null)} variant="outline" size="sm">
                Rerun Analysis
              </Button>
              <Button onClick={onClose} size="sm">
                Got it
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
