import { Clock, AlertTriangle } from 'lucide-react';
import { formatSLACountdown } from '@/utils';
import { Tooltip } from '@/design-system';

interface SLAIndicatorProps {
  deadline: string;
  breached: boolean;
  size?: 'sm' | 'md';
}

export function SLAIndicator({ deadline, breached, size = 'md' }: SLAIndicatorProps) {
  const { label, urgent } = formatSLACountdown(deadline);

  const colorClass = breached
    ? 'text-red-600'
    : urgent
    ? 'text-amber-600'
    : 'text-text-secondary';

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <Tooltip content={`SLA Deadline: ${new Date(deadline).toLocaleString()}`}>
      <span className={`inline-flex items-center gap-1 ${colorClass} ${textSize} font-medium`}>
        {breached || urgent ? (
          <AlertTriangle className={iconSize} aria-hidden="true" />
        ) : (
          <Clock className={iconSize} aria-hidden="true" />
        )}
        <span>{label}</span>
      </span>
    </Tooltip>
  );
}
