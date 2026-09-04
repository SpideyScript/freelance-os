import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-muted text-muted-foreground border-transparent',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400',
    danger: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400',
    info: 'bg-sky-500/10 text-sky-600 border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-400',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/15 dark:text-purple-400',
    outline: 'bg-transparent text-foreground border-border',
  };

  const dotColors = {
    default: 'bg-muted-foreground',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500',
    outline: 'bg-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
