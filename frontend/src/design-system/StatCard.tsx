import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from './Skeleton';

type Trend = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: Trend;
  trendLabel?: string;
  sublabel?: string;
  loading?: boolean;
  accent?: boolean; // purple gradient variant
  onClick?: () => void;
}

const TREND_CONFIG: Record<Trend, { icon: React.ElementType; color: string }> = {
  up:      { icon: TrendingUp,   color: 'text-green-600' },
  down:    { icon: TrendingDown, color: 'text-red-500' },
  neutral: { icon: Minus,        color: 'text-text-muted' },
};

export function StatCard({
  label, value, icon: Icon, iconColor, iconBg,
  trend, trendLabel, sublabel, loading, accent, onClick,
}: StatCardProps) {
  if (loading) return <Skeleton className="h-[100px] rounded-2xl" />;

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={[
        'relative overflow-hidden rounded-2xl border p-5 flex flex-col gap-3',
        'transition-all duration-150',
        accent
          ? 'bg-brand-purple border-brand-purple-dark text-white shadow-lg'
          : 'bg-white border-surface-border shadow-card hover:shadow-card-hover',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      {/* Subtle pattern for accent card */}
      {accent && (
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)',
        }} aria-hidden="true" />
      )}

      <div className="flex items-start justify-between relative">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ? 'bg-white/15' : iconBg}`}>
          <Icon className={`h-5 w-5 ${accent ? 'text-white' : iconColor}`} aria-hidden="true" />
        </div>
        {trend && trendLabel && (
          <div className={`flex items-center gap-1 text-xs font-medium ${accent ? 'text-white/70' : TREND_CONFIG[trend].color}`}>
            {(() => { const T = TREND_CONFIG[trend].icon; return <T className="h-3.5 w-3.5" aria-hidden="true" />; })()}
            <span>{trendLabel}</span>
          </div>
        )}
      </div>

      <div className="relative">
        <p className={`text-[28px] font-bold leading-none tabular-nums tracking-tight ${accent ? 'text-white' : 'text-text-primary'}`}>
          {value}
        </p>
        <p className={`text-sm font-medium mt-1.5 ${accent ? 'text-white/80' : 'text-text-secondary'}`}>{label}</p>
        {sublabel && (
          <p className={`text-xs mt-0.5 ${accent ? 'text-white/60' : 'text-text-muted'}`}>{sublabel}</p>
        )}
      </div>
    </Wrapper>
  );
}
