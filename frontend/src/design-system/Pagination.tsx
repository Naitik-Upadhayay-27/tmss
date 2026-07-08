import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build page numbers: always show first, last, current ±1, with ellipsis
  const pages: (number | '...')[] = [];
  const add = (n: number) => { if (!pages.includes(n)) pages.push(n); };
  add(1);
  if (page > 3) pages.push('...');
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) add(i);
  if (page < totalPages - 2) pages.push('...');
  if (totalPages > 1) add(totalPages);

  return (
    <div className="flex items-center justify-center gap-6 px-1 pt-3 border-t border-surface-border flex-shrink-0">
      <span className="text-xs text-text-muted">
        Showing <span className="font-semibold text-text-primary">{from}–{to}</span> of <span className="font-semibold text-text-primary">{total.toLocaleString()}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="h-7 w-7 flex items-center justify-center rounded-lg border border-surface-border text-text-muted hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="h-7 w-7 flex items-center justify-center text-xs text-text-muted">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`h-7 min-w-[28px] px-1.5 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                p === page
                  ? 'bg-brand-purple text-white'
                  : 'border border-surface-border text-text-secondary hover:bg-surface-secondary'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="h-7 w-7 flex items-center justify-center rounded-lg border border-surface-border text-text-muted hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
