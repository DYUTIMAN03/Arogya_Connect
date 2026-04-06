import React from 'react';
import { clsx } from 'clsx';
import { Priority } from '@/lib/types';

interface BadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: BadgeProps) {
  const classes = clsx(
    priority === 'P1' && 'badge-p1',
    priority === 'P2' && 'badge-p2',
    priority === 'P3' && 'badge-p3',
    className
  );

  return (
    <span className={classes}>
      {priority === 'P1' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
      {priority === 'P2' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
      {priority === 'P3' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {priority}
    </span>
  );
}
