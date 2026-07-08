import { Search, X } from 'lucide-react';
import { Input, Select, Button } from '@/design-system';
import { useDepartments } from '@/hooks/useDepartments';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { DEPT_CATEGORIES } from '@/mockData/deptCategories';
import type { TicketFilters } from '@/types';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'on_hold', label: 'On Hold' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'internal', label: 'Internal' },
];

interface TicketFiltersBarProps {
  filters: TicketFilters;
  onChange: (filters: Partial<TicketFilters>) => void;
  hideSearch?: boolean;
}

export function TicketFiltersBar({ filters, onChange, hideSearch }: TicketFiltersBarProps) {
  const { user } = useAuthStore();
  const { data: deptData } = useDepartments();
  const deptOptions = [
    { value: '', label: 'All Departments' },
    ...(deptData?.results ?? []).map((d) => ({ value: d.id, label: d.name })),
  ];

  // Build problem category options based on role
  const categoryOptions = (() => {
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    let categories: string[];
    if (isSuperAdmin) {
      // All categories flat, deduplicated
      const all = Object.values(DEPT_CATEGORIES).flat();
      categories = [...new Set(all)].sort();
    } else {
      const deptCode = user?.department?.code ?? '';
      categories = DEPT_CATEGORIES[deptCode] ?? [];
    }
    return [
      { value: '', label: 'All Categories' },
      ...categories.map((c) => ({ value: c, label: c })),
    ];
  })();

  const hasActiveFilters =
    !!filters.search || !!filters.status || !!filters.priority ||
    !!filters.ticket_type || !!filters.department || !!filters.problem_category;

  const clearFilters = () =>
    onChange({ search: '', status: '', priority: '', ticket_type: '', department: '', problem_category: '' });

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {!hideSearch && (
        <Input
          placeholder="Search tickets..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value })}
          leftIcon={<Search className="h-4 w-4" />}
          className="w-56"
          data-testid="ticket-search-input"
        />
      )}
      <Select
        options={STATUS_OPTIONS}
        value={filters.status ?? ''}
        onChange={(e) => onChange({ status: e.target.value as TicketFilters['status'] })}
        className="w-36"
        data-testid="status-filter"
      />
      <Select
        options={PRIORITY_OPTIONS}
        value={filters.priority ?? ''}
        onChange={(e) => onChange({ priority: e.target.value as TicketFilters['priority'] })}
        className="w-36"
        data-testid="priority-filter"
      />
      <Select
        options={TYPE_OPTIONS}
        value={filters.ticket_type ?? ''}
        onChange={(e) => onChange({ ticket_type: e.target.value as TicketFilters['ticket_type'] })}
        className="w-32"
        data-testid="type-filter"
      />
      {isSuperAdmin && (
        <Select
          options={deptOptions}
          value={filters.department ?? ''}
          onChange={(e) => onChange({ department: e.target.value ? Number(e.target.value) : '' })}
          className="w-44"
          data-testid="dept-filter"
        />
      )}
      <Select
        options={categoryOptions}
        value={filters.problem_category ?? ''}
        onChange={(e) => onChange({ problem_category: e.target.value })}
        className="w-48"
        data-testid="category-filter"
      />
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<X className="h-4 w-4" />} data-testid="clear-filters-btn">
          Clear
        </Button>
      )}
    </div>
  );
}
