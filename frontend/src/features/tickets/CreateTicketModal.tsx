import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { X, Paperclip, FileText, Trash2, Sparkles, AlertTriangle, Tag, Zap, Bot, CheckCircle, RefreshCw } from 'lucide-react';
import { Button, Input, Select, Skeleton } from '@/design-system';
import { createTicket, uploadAttachment } from '@/api/tickets.api';
import { useQueryClient } from '@tanstack/react-query';
import { useDepartments } from '@/hooks/useDepartments';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { DEPT_CATEGORIES } from '@/mockData/deptCategories';
import { addHours } from 'date-fns';

const schema = z.object({
  subject:          z.string().min(10, 'Min 10 characters'),
  description:      z.string().min(20, 'Min 20 characters'),
  priority:         z.enum(['critical', 'high', 'medium', 'low']),
  department:       z.string().min(1, 'Select a department'),
  problem_category: z.string().min(1, 'Select a problem category'),
  sub_problem:      z.string().optional(),
  affected_users:   z.string().optional(),
  urgency_reason:   z.string().optional(),
  contact_number:   z.string().optional(),
  reference_id:     z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const PRIORITY_OPTIONS = [
  { value: 'critical', label: '🔴 Critical' },
  { value: 'high',     label: '🟠 High' },
  { value: 'medium',   label: '🟡 Medium' },
  { value: 'low',      label: '🟢 Low' },
];

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-600', high: 'text-orange-600', medium: 'text-amber-600', low: 'text-green-600',
};

const AFFECTED_USERS_OPTIONS = [
  { value: 'just_me',   label: 'Just me' },
  { value: '2_5',       label: '2–5 users' },
  { value: '6_20',      label: '6–20 users' },
  { value: '21_50',     label: '21–50 users' },
  { value: '50_plus',   label: '50+ users' },
  { value: 'all_users', label: 'All users' },
];

interface AISuggestion {
  type: 'priority' | 'category' | 'assignee' | 'duplicate';
  label: string;
  value: string;
  confidence: number;
  icon: React.ElementType;
  color: string;
  bg: string;
  action?: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const { data: deptData, isLoading: deptsLoading } = useDepartments();
  const [isPending, setIsPending] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiAnalysed, setAiAnalysed] = useState(false);
  const analyseTimer = useRef<ReturnType<typeof setTimeout>>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium' },
  });

  const selectedDeptId = watch('department');
  const selectedCategory = watch('problem_category');
  const subject = watch('subject');
  const description = watch('description');
  const priority = watch('priority');

  // Derive dept code from selected dept id
  const depts = deptData?.results ?? [];
  const selectedDept = depts.find(d => String(d.id) === String(selectedDeptId));
  const deptCode = selectedDept?.code ?? '';
  const categories = DEPT_CATEGORIES[deptCode] ?? [];

  // Reset category/sub_problem when dept changes
  useEffect(() => {
    setValue('problem_category', '');
    setValue('sub_problem', '');
  }, [selectedDeptId, setValue]);

  // Reset sub_problem when category changes
  useEffect(() => {
    setValue('sub_problem', '');
  }, [selectedCategory, setValue]);

  // AI analysis
  useEffect(() => {
    if (analyseTimer.current) clearTimeout(analyseTimer.current);
    if (!subject || subject.length < 10) { setAiSuggestions([]); setAiAnalysed(false); return; }
    analyseTimer.current = setTimeout(() => runAIAnalysis(subject, description ?? ''), 900);
    return () => { if (analyseTimer.current) clearTimeout(analyseTimer.current); };
  }, [subject, description]);

  const runAIAnalysis = (subj: string, desc: string) => {
    setAiLoading(true);
    setTimeout(() => {
      const lower = (subj + ' ' + desc).toLowerCase();
      const suggestions: AISuggestion[] = [];

      const suggestedPriority =
        lower.includes('critical') || lower.includes('outage') || lower.includes('down') ? 'critical'
        : lower.includes('urgent') || lower.includes('failed') || lower.includes('stuck') ? 'high'
        : lower.includes('slow') || lower.includes('delay') || lower.includes('pending') ? 'medium' : 'low';

      suggestions.push({
        type: 'priority', icon: AlertTriangle, confidence: 87,
        label: 'Suggested Priority',
        value: suggestedPriority.charAt(0).toUpperCase() + suggestedPriority.slice(1),
        color: PRIORITY_COLORS[suggestedPriority],
        bg: suggestedPriority === 'critical' ? 'bg-red-50' : suggestedPriority === 'high' ? 'bg-orange-50' : 'bg-amber-50',
        action: suggestedPriority,
      });

      suggestions.push({
        type: 'category', icon: Tag, confidence: 82,
        label: 'Auto-category',
        value: lower.includes('api') ? 'API/Integration Issue' : lower.includes('login') ? 'Login & Authentication' : lower.includes('payment') ? 'Payment Failure' : 'Application Issue',
        color: 'text-indigo-600', bg: 'bg-indigo-50',
      });

      suggestions.push({
        type: 'assignee', icon: Zap, confidence: 74,
        label: 'Best Assignee', value: 'Auto-assigned on submit',
        color: 'text-violet-600', bg: 'bg-violet-50',
      });

      if (lower.includes('login') || lower.includes('api') || lower.includes('payment')) {
        suggestions.push({
          type: 'duplicate', icon: RefreshCw, confidence: 61,
          label: 'Similar Ticket Found', value: 'Check open tickets before submitting',
          color: 'text-amber-600', bg: 'bg-amber-50',
        });
      }

      setAiSuggestions(suggestions);
      setAiLoading(false);
      setAiAnalysed(true);
    }, 1200);
  };

  const applySuggestion = (s: AISuggestion) => {
    if (s.type === 'priority' && s.action) setValue('priority', s.action as FormData['priority']);
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setAttachedFiles(prev => {
      const existing = new Set(prev.map(f => f.name + f.size));
      return [...prev, ...files.filter(f => !existing.has(f.name + f.size))];
    });
    e.target.value = '';
  }, []);

  const removeFile = useCallback((index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const formatBytes = (b: number) =>
    b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setIsPending(true);
    try {
      const dept = depts.find(d => d.id === Number(data.department));
      const slaHours = data.priority === 'critical' ? (dept?.sla_critical_hours ?? 4) : (dept?.sla_high_hours ?? 24);
      const ticket = await createTicket({
        ticket_type: 'internal',
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        department_id: Number(data.department),
        problem_category: data.problem_category,
        sub_problem: data.sub_problem ?? '',
        tags: [deptCode.toLowerCase(), data.problem_category.toLowerCase().replace(/\s+/g, '_')],
        sla_deadline: addHours(new Date(), slaHours).toISOString(),
        status: 'open',
      } as any);

      if (attachedFiles.length > 0) {
        await Promise.all(attachedFiles.map(f => uploadAttachment(ticket.id, f).catch(() => null)));
      }

      toast.success(`Ticket ${ticket.ticket_number} created`);
      qc.invalidateQueries({ queryKey: ['tickets'] });
      reset(); setAiSuggestions([]); setAiAnalysed(false); setAttachedFiles([]);
      onClose();
    } catch {
      toast.error('Failed to create ticket');
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categoryOptions = categories.map(c => ({ value: c, label: c }));
  const deptOptions = depts.map(d => ({ value: d.id, label: d.name }));

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[#0F1120]/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-modal flex overflow-hidden animate-slide-up" style={{ maxHeight: '90vh' }}>

        {/* ── LEFT: Form ── */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border flex-shrink-0 bg-gradient-to-r from-brand-purple to-brand-purple-light">
            <div>
              <h2 className="text-base font-bold text-white">Create New Ticket</h2>
              <p className="text-xs text-white/60 mt-0.5">Fill in the details · AI will assist as you type</p>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

              {/* Department + Priority */}
              <div className="grid grid-cols-2 gap-4">
                {deptsLoading ? (
                  <Skeleton className="h-9 w-full rounded-lg" />
                ) : (
                  <Select
                    label="Department *"
                    options={deptOptions}
                    placeholder="Select department"
                    error={errors.department?.message}
                    {...register('department')}
                  />
                )}
                <div>
                  <Select label="Priority *" options={PRIORITY_OPTIONS} error={errors.priority?.message} {...register('priority')} />
                  {priority && (
                    <p className={`text-[11px] font-semibold mt-1 ${PRIORITY_COLORS[priority]}`}>
                      SLA: {priority === 'critical' ? '2–4h' : priority === 'high' ? '8–24h' : priority === 'medium' ? '24–48h' : '48h+'}
                    </p>
                  )}
                </div>
              </div>

              {/* Problem Category + Sub Problem */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Problem Category *"
                  options={categoryOptions}
                  placeholder={deptCode ? 'Select category' : 'Select department first'}
                  disabled={!deptCode || categories.length === 0}
                  error={errors.problem_category?.message}
                  {...register('problem_category')}
                />
                <Input
                  label="Sub Problem (Optional)"
                  placeholder="Describe the specific issue..."
                  error={errors.sub_problem?.message}
                  {...register('sub_problem')}
                />
              </div>

              {/* Subject */}
              <Input
                label="Subject *"
                placeholder="Brief, specific description of the issue..."
                error={errors.subject?.message}
                hint="AI analyses your subject to suggest priority"
                {...register('subject')}
              />

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Description *</label>
                <textarea
                  rows={4}
                  placeholder="Detailed description of the issue, steps to reproduce, impact..."
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all ${errors.description ? 'border-red-400' : 'border-surface-border hover:border-surface-border-strong'}`}
                  {...register('description')}
                />
                {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
              </div>

              {/* Extra fields */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Affected Users (Optional)"
                  options={AFFECTED_USERS_OPTIONS}
                  placeholder="How many users affected?"
                  {...register('affected_users')}
                />
                <Input
                  label="Reference / Ticket ID (Optional)"
                  placeholder="Related ticket, order, or case ID"
                  {...register('reference_id')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Contact Number (Optional)"
                  placeholder="Your contact number"
                  {...register('contact_number')}
                />
                <Input
                  label="Urgency Reason (Optional)"
                  placeholder="Why is this urgent?"
                  {...register('urgency_reason')}
                />
              </div>

              {/* Attachments */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Attachments <span className="text-[11px] font-normal text-text-muted">Optional</span>
                  </label>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-purple hover:text-brand-purple-light transition-colors">
                    <Paperclip className="h-3.5 w-3.5" /> Add files
                  </button>
                </div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-brand-purple', 'bg-brand-purple-faint'); }}
                  onDragLeave={e => e.currentTarget.classList.remove('border-brand-purple', 'bg-brand-purple-faint')}
                  onDrop={e => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-brand-purple', 'bg-brand-purple-faint');
                    const files = Array.from(e.dataTransfer.files);
                    setAttachedFiles(prev => {
                      const existing = new Set(prev.map(f => f.name + f.size));
                      return [...prev, ...files.filter(f => !existing.has(f.name + f.size))];
                    });
                  }}
                  className="border-2 border-dashed border-surface-border rounded-xl px-4 py-3 text-center cursor-pointer hover:border-brand-purple hover:bg-brand-purple-faint transition-all"
                >
                  <Paperclip className="h-5 w-5 text-text-muted mx-auto mb-1" />
                  <p className="text-xs text-text-muted">Click or drag files here</p>
                </div>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
                {attachedFiles.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {attachedFiles.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5 px-3 py-2 bg-surface-secondary rounded-lg border border-surface-border">
                        <FileText className="h-3.5 w-3.5 text-brand-purple flex-shrink-0" />
                        <span className="text-xs font-medium text-text-primary truncate flex-1">{f.name}</span>
                        <span className="text-[10px] text-text-muted flex-shrink-0">{formatBytes(f.size)}</span>
                        <button type="button" onClick={() => removeFile(i)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border flex-shrink-0 bg-surface-secondary/50">
            <p className="text-xs text-text-muted">SLA set based on priority & department</p>
            <div className="flex items-center gap-2.5">
              <Button variant="secondary" size="sm" onClick={onClose} disabled={isPending}>Cancel</Button>
              <Button variant="orange" size="md" onClick={handleSubmit(onSubmit)} isLoading={isPending}>
                Create Ticket
              </Button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: AI Panel ── */}
        <div className="w-72 flex-shrink-0 border-l border-surface-border flex flex-col bg-surface-secondary/30">
          <div className="px-4 py-4 border-b border-surface-border flex items-center gap-2.5 flex-shrink-0 bg-gradient-to-br from-brand-purple-faint to-indigo-50">
            <div className="h-8 w-8 rounded-xl bg-brand-purple flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-purple">AI Copilot</p>
              <p className="text-[10px] text-text-muted">Analyses as you type</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
            {!subject || subject.length < 10 ? (
              <div className="text-center py-8">
                <Bot className="h-8 w-8 text-text-muted/30 mx-auto mb-3" />
                <p className="text-xs font-semibold text-text-muted">Start typing your subject</p>
                <p className="text-[11px] text-text-muted mt-1">AI will suggest priority, category & assignee</p>
              </div>
            ) : aiLoading ? (
              <div className="text-center py-8">
                <div className="h-8 w-8 rounded-full bg-brand-purple-faint border-2 border-brand-purple/30 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <Sparkles className="h-4 w-4 text-brand-purple" />
                </div>
                <p className="text-xs text-text-muted">Analysing...</p>
                <div className="mt-3 space-y-2">
                  {[80, 60, 90].map((w, i) => (
                    <div key={i} className="h-3 bg-surface-tertiary rounded-full animate-pulse" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2.5">
                  {aiSuggestions.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="rounded-xl border border-surface-border bg-white p-3 shadow-card">
                        <div className="flex items-start gap-2.5">
                          <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                            <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{s.label}</p>
                            <p className={`text-sm font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1 bg-surface-tertiary rounded-full overflow-hidden">
                                <div className="h-full bg-brand-purple rounded-full transition-all duration-700" style={{ width: `${s.confidence}%` }} />
                              </div>
                              <span className="text-[10px] text-text-muted font-medium flex-shrink-0">{s.confidence}%</span>
                            </div>
                          </div>
                        </div>
                        {s.type === 'priority' && s.action && s.action !== priority && (
                          <button onClick={() => applySuggestion(s)}
                            className="mt-2 w-full text-[11px] font-semibold text-brand-purple bg-brand-purple-faint border border-purple-200 rounded-lg py-1.5 hover:bg-brand-purple hover:text-white transition-all">
                            Apply suggestion →
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                {aiAnalysed && (
                  <div className="rounded-xl border border-surface-border bg-white p-3 shadow-card">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">SLA Preview</p>
                    </div>
                    <p className="text-sm font-bold text-text-primary">
                      {priority === 'critical' ? '2–4 hours' : priority === 'high' ? '8–24 hours' : priority === 'medium' ? '24–48 hours' : '48+ hours'}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">Based on {priority} priority</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="px-4 py-3 border-t border-surface-border flex-shrink-0">
            <p className="text-[10px] text-text-muted text-center leading-relaxed">
              AI suggestions are Phase 1 simulations.<br />Phase 2 uses Mistral 7B.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
