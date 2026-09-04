import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({
  className,
  glass = false,
  hoverEffect = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-all',
        glass && 'glass-panel',
        hoverEffect && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-between gap-4 pb-4 border-b border-border/50 mb-4', className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('font-semibold tracking-tight text-base sm:text-lg text-foreground', className)} {...props} />
);

export const CardDescription = ({ className, ...props }) => (
  <p className={cn('text-xs text-muted-foreground', className)} {...props} />
);
