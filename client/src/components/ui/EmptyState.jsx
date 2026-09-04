import React from 'react';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  copilotActionLabel,
  onCopilotAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-border/80 bg-card/40 my-4 animate-in fade-in-50">
      {Icon && (
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4 shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        )}
        {copilotActionLabel && onCopilotAction && (
          <Button onClick={onCopilotAction} variant="copilot" size="sm">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {copilotActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
