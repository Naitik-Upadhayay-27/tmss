import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, UserPlus, RefreshCw, CheckCircle, ChevronRight,
  XCircle, RotateCcw, MessageSquare, Send, Bot, Tag,
  User as UserIcon, AlertCircle,
  Pin, Paperclip, Download, Trash2, Reply, X,
} from 'lucide-react';
import { useTicket, useTicketTimeline } from '@/hooks/useTickets';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { StatusBadge, PriorityBadge, Avatar, Button, ErrorState, Skeleton } from '@/design-system';
import { SLAIndicator } from './components/SLAIndicator';
import { AssignModal } from './modals/AssignModal';
import { StatusModal } from './modals/StatusModal';
import { ResolveModal } from './modals/ResolveModal';
import { CloseModal } from './modals/CloseModal';
import { ReopenModal } from './modals/ReopenModal';
import { formatDateTime, formatRelative } from '@/utils';
import { AssigneeTimeline } from './components/AssigneeTimeline';
import type { AssigneeSlot } from '@/types';

type ActiveModal = 'assign' | 'status' | 'resolve' | 'close' | 'reopen' | null;

interface ChatMsg { id: number; role: 'user' | 'ai'; text: string; ts: string; }
let _cid = 1; const mkId = () => _cid++;
let _cmtId = 200;

interface LocalComment {
  id: number;
  ticket: number;
  author: import('@/types').User;
  body: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  reply_to?: number;  // id of parent comment
  files: { name: string; url: string; size: number }[];
}

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const STORAGE_KEY = `fatakpay-comments-${id}`;

  const [comments, setComments] = useState<LocalComment[]>(() => {
    // Restore comments from localStorage on mount so they survive refresh
    try {
      const raw = localStorage.getItem(`fatakpay-comments-${id}`);
      return raw ? (JSON.parse(raw) as LocalComment[]) : [];
    } catch {
      return [];
    }
  });

  // Persist comments to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch { /* quota exceeded — ignore */ }
  }, [comments, STORAGE_KEY]);

  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [replyTo, setReplyTo] = useState<LocalComment | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  }, []);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data: ticket, isLoading, isError, refetch } = useTicket(Number(id));
  const { data: timelineEvents = [] } = useTicketTimeline(Number(id));

  const canAssign       = user?.role === 'SUPER_ADMIN' || user?.role === 'DEPT_HEAD';
  // Once escalated, only Super Admin can change status — members and HODs lose that right
  const isEscalated     = ticket?.status === 'escalated';
  const canChangeStatus = user?.role !== 'CALLER' && !(isEscalated && user?.role !== 'SUPER_ADMIN');
  const canResolve      = (user?.role === 'MEMBER' && ticket?.assignee?.id === user.id && !isEscalated) || user?.role === 'SUPER_ADMIN';
  const canClose        = (user?.role === 'SUPER_ADMIN' || user?.role === 'DEPT_HEAD') && ticket?.status === 'resolved';
  const canReopen       = user?.role === 'SUPER_ADMIN' && (ticket?.status === 'closed' || ticket?.status === 'resolved');
  const canAddInternal  = user?.role !== 'CALLER';

  // Build assignee slots from timeline assign events
  const assigneeSlots: AssigneeSlot[] = (() => {
    if (!ticket) return [];
    const assignEvents = timelineEvents.filter(e => e.type === 'assigned' || e.type === 'reassigned');
    return assignEvents.map((ev, i) => {
      const nextEv = assignEvents[i + 1];
      const start = ev.timestamp;
      const end = nextEv?.timestamp ?? (ticket.resolved_at ?? null);
      const durationMs = end
        ? new Date(end).getTime() - new Date(start).getTime()
        : Date.now() - new Date(start).getTime();
      return {
        assignee: ev.assignee ?? ticket.assignee!,
        assigned_by: ev.actor,
        reason: ev.assign_reason ?? '',
        start,
        end,
        duration_ms: Math.max(durationMs, 0),
        stats: { comments: 0, status_changes: 0, updates: 0, files: 0 },
      };
    });
  })();

  useEffect(() => {
    if (ticket && chatOpen && chatMsgs.length === 0) {
      setChatMsgs([{ id: mkId(), role: 'ai', ts: new Date().toISOString(),
        text: `I'm your AI assistant for ${ticket.ticket_number}. This is a ${ticket.priority} priority ${ticket.ticket_type} ticket currently ${ticket.status.replace(/_/g,' ')}. ${ticket.sla_breached ? 'The SLA has been breached. ' : ''}${ticket.assignee ? `Assigned to ${ticket.assignee.full_name}.` : 'Currently unassigned.'} Ask me anything.` }]);
    }
  }, [ticket, chatOpen]);

  const handleSendComment = () => {
    if (!commentText.trim() && attachedFiles.length === 0) return;
    if (!user || !ticket) return;
    const files = attachedFiles.map(f => ({
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size,
    }));
    setComments(prev => [...prev, {
      id: _cmtId++, ticket: ticket.id, author: user,
      body: commentText.trim() ? `<p>${commentText.trim().replace(/\n/g, '<br/>')}</p>` : '',
      is_internal: isInternal,
      pinned: false,
      reply_to: replyTo?.id,
      files,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]);
    setCommentText('');
    setIsInternal(false);
    setReplyTo(null);
    setAttachedFiles([]);
  };

  const handlePin = (id: number) =>
    setComments(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));

  const handleDelete = (id: number) =>
    setComments(prev => prev.filter(c => c.id !== id));

  const formatBytes = (b: number) =>
    b < 1024 ? `${b}B` : b < 1024 * 1024 ? `${(b/1024).toFixed(1)}KB` : `${(b/1024/1024).toFixed(1)}MB`;

  const handleChatSend = () => {
    if (!chatInput.trim() || !ticket) return;
    const userMsg: ChatMsg = { id: mkId(), role: 'user', text: chatInput.trim(), ts: new Date().toISOString() };
    const aiMsg: ChatMsg   = { id: mkId(), role: 'ai',   ts: new Date().toISOString(),
      text: `Regarding ${ticket.ticket_number}: The ticket "${ticket.subject}" is ${ticket.status.replace(/_/g,' ')} with ${ticket.priority} priority. ${ticket.sla_breached ? 'SLA is breached — immediate action required.' : 'SLA is currently within limits.'} ${ticket.assignee ? `${ticket.assignee.full_name} is handling this.` : 'No assignee yet.'}` };
    setChatMsgs(prev => [...prev, userMsg, aiMsg]);
    setChatInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-[90px] rounded-2xl" />
      <Skeleton className="h-[260px] rounded-2xl" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="col-span-2 h-[400px] rounded-2xl" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    </div>
  );

  if (isError || !ticket) return <ErrorState message="Ticket not found." onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">

      {/* ── STEP 1: SLIM HEADER ── */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-md overflow-hidden">
        {/* Row 1 — breadcrumb + actions */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-purple-700 bg-brand-purple">
          <nav className="flex items-center gap-1.5 text-xs text-white/70" aria-label="Breadcrumb">
            <Link to="/tickets" className="hover:text-white transition-colors font-medium text-white/80">Tickets</Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="text-white font-semibold font-mono">{ticket.ticket_number}</span>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} className="">Back</Button>
            {canReopen      && <Button variant="secondary" size="sm" onClick={() => setActiveModal('reopen')}  leftIcon={<RotateCcw   className="h-3.5 w-3.5" />}>Reopen</Button>}
            {canClose       && <Button variant="secondary" size="sm" onClick={() => setActiveModal('close')}   leftIcon={<XCircle     className="h-3.5 w-3.5" />}>Close Ticket</Button>}
            {canAssign && ['open', 'assigned', 'escalated'].includes(ticket.status) && <Button variant="secondary" size="sm" onClick={() => setActiveModal('assign')} leftIcon={<UserPlus className="h-3.5 w-3.5" />} data-testid="assign-btn">Assign</Button>}
            {canChangeStatus && ticket.status !== 'closed' && <Button variant="secondary" size="sm" onClick={() => setActiveModal('status')} leftIcon={<RefreshCw className="h-3.5 w-3.5" />} data-testid="change-status-btn">Update Status</Button>}
            {canResolve && ticket.status === 'in_progress' && <Button variant="orange" size="sm" onClick={() => setActiveModal('resolve')} leftIcon={<CheckCircle className="h-3.5 w-3.5" />} data-testid="resolve-btn">Resolve</Button>}
          </div>
        </div>

        {/* Row 2 — title + badges + meta */}
        <div className="px-5 py-3.5 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} size="sm" />
            <PriorityBadge priority={ticket.priority} size="sm" />
            <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border capitalize ${
              ticket.ticket_type === 'insurance'
                ? 'bg-brand-purple-faint text-brand-purple border-purple-200'
                : 'bg-surface-tertiary text-text-secondary border-surface-border'
            }`}>{ticket.ticket_type}</span>
            {ticket.sla_breached && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-50 text-red-600 border border-red-200">
                <AlertCircle className="h-3 w-3" aria-hidden="true" /> SLA Breached
              </span>
            )}
          </div>
          <h1 className="text-lg font-bold text-text-primary leading-snug">{ticket.subject}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span>{ticket.department.name}</span>
            <span aria-hidden="true">·</span>
            <span>Created {formatRelative(ticket.created_at)}</span>
            <span aria-hidden="true">·</span>
            <span>Updated {formatRelative(ticket.updated_at)}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" aria-hidden="true" />
              {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CARD: description + type fields + meta strip ── */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-md overflow-hidden">
        <div className="px-5 py-3 border-b border-purple-700 bg-brand-purple">
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">Description</span>
        </div>
        <div className="px-5 py-4 text-sm text-text-primary leading-relaxed prose-ticket"
          dangerouslySetInnerHTML={{ __html: ticket.description }}
        />

        {/* Insurance fields — inside same card */}
        {ticket.ticket_type === 'insurance' && ticket.insurance_fields && (
          <>
            <div className="mx-5 border-t border-surface-border" />
            <div className="px-5 pt-3 pb-1">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Insurance Details</span>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 px-5 pb-4">
              {([
                ['Policy Number',   ticket.insurance_fields.policy_number],
                ['Claim Number',    ticket.insurance_fields.claim_number],
                ['Insurer Name',    ticket.insurance_fields.insurer_name],
                ['Insurer Contact', ticket.insurance_fields.insurer_contact],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">{label}</dt>
                  <dd className="text-sm font-semibold text-text-primary">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {/* Internal fields — inside same card */}
        {ticket.ticket_type === 'internal' && ticket.internal_fields && (
          <>
            <div className="mx-5 border-t border-surface-border" />
            <div className="px-5 pt-3 pb-1">
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">Internal Details</span>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 px-5 pb-4">
              <div>
                <dt className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Affected System</dt>
                <dd className="text-sm font-semibold text-text-primary">{ticket.internal_fields.affected_system || '—'}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Business Impact</dt>
                <dd className="text-sm text-text-secondary leading-relaxed">{ticket.internal_fields.business_impact || '—'}</dd>
              </div>
            </dl>
          </>
        )}

        {/* Meta strip — SLA · Assignee · Reporter · Dept · Timestamps · Tags */}
        <div className="flex flex-wrap items-start gap-x-8 gap-y-3 px-5 py-3.5 border-t border-surface-border bg-surface-secondary">

          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">SLA</p>
            <SLAIndicator deadline={ticket.sla_deadline} breached={ticket.sla_breached} size="sm" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Assignee</p>
            {ticket.assignee ? (
              <div className="flex items-center gap-1.5">
                <Avatar name={ticket.assignee.full_name} size="xs" />
                <span className="text-xs font-semibold text-text-primary">{ticket.assignee.full_name}</span>
              </div>
            ) : (
              <span className="text-xs text-text-muted italic">Unassigned</span>
            )}
          </div>

          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Reporter</p>
            <div className="flex items-center gap-1.5">
              <Avatar name={ticket.created_by.full_name} size="xs" />
              <span className="text-xs font-semibold text-text-primary">{ticket.created_by.full_name}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Department</p>
            <span className="text-xs font-semibold text-text-primary">{ticket.department.name}</span>
          </div>

          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Created</p>
            <span className="text-xs text-text-secondary" title={formatDateTime(ticket.created_at)}>{formatRelative(ticket.created_at)}</span>
          </div>

          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Updated</p>
            <span className="text-xs text-text-secondary" title={formatDateTime(ticket.updated_at)}>{formatRelative(ticket.updated_at)}</span>
          </div>

          {ticket.resolved_at && (
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Resolved</p>
              <span className="text-xs font-semibold text-green-600" title={formatDateTime(ticket.resolved_at)}>{formatRelative(ticket.resolved_at)}</span>
            </div>
          )}

          {ticket.tags.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Tags</p>
              <div className="flex flex-wrap gap-1">
                {ticket.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-brand-purple-faint text-brand-purple rounded-full border border-purple-200">
                    <Tag className="h-2.5 w-2.5" aria-hidden="true" />{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ticket.problem_category && (
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Problem Category</p>
              <span className="text-xs font-semibold text-text-primary">{ticket.problem_category}</span>
            </div>
          )}

          {ticket.sub_problem && (
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Sub Problem</p>
              <span className="text-xs font-semibold text-text-primary">{ticket.sub_problem}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── COMMENTS (left) | TIMELINE (right) — equal height ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

        {/* ── LEFT: Comments ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-border shadow-md overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-purple-700 flex items-center justify-between flex-shrink-0 bg-brand-purple">
            <span className="text-[11px] font-bold text-white uppercase tracking-widest">Comments</span>
            <span className="text-[11px] font-semibold text-white/70 bg-white/20 px-2 py-0.5 rounded-full">{comments.length}</span>
          </div>

          {/* Pinned slab */}
          {comments.some(c => c.pinned) && (
            <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 space-y-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Pin className="h-3 w-3 text-amber-600" aria-hidden="true" />
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">Pinned</span>
              </div>
              {comments.filter(c => c.pinned).map(c => (
                <div key={c.id} className="flex items-start gap-2 bg-white border border-amber-200 rounded-lg px-3 py-2">
                  <Avatar name={c.author.full_name} size="xs" className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-text-primary">{c.author.full_name}</span>
                    {c.body && <div className="text-xs text-text-secondary mt-0.5 truncate" dangerouslySetInnerHTML={{ __html: c.body }} />}
                    {c.files.length > 0 && <p className="text-[10px] text-text-muted mt-0.5">{c.files.length} file{c.files.length > 1 ? 's' : ''} attached</p>}
                  </div>
                  <button onClick={() => handlePin(c.id)} className="text-amber-500 hover:text-amber-700 transition-colors flex-shrink-0" aria-label="Unpin">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Thread — fixed height, scrolls internally, never grows the card */}
          <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4 relative" style={{ height: 320 }}>
            {/* FatakPay watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
              <div className="flex flex-col items-center gap-1 opacity-[0.06]">
                <div className="text-4xl font-black tracking-tight leading-none">
                  <span className="text-brand-purple">फटाक</span><span className="text-brand-orange">PAY</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-purple">TMS</span>
              </div>
            </div>
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-8 w-8 text-text-muted/30 mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-text-muted">No comments yet</p>
                <p className="text-xs text-text-muted mt-0.5">Be the first to add a comment below</p>
              </div>
            ) : comments.map(c => {
              const isMe = c.author.id === user?.id;
              const parent = c.reply_to ? comments.find(p => p.id === c.reply_to) : null;
              return (
                <div key={c.id} className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!isMe && <Avatar name={c.author.full_name} size="sm" className="flex-shrink-0 mt-0.5" />}
                  <div className={`flex flex-col max-w-[78%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {/* header row */}
                    <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && <span className="text-xs font-bold text-text-primary">{c.author.full_name}</span>}
                      {c.is_internal && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Internal</span>}
                      {c.pinned && <Pin className="h-3 w-3 text-amber-500" aria-hidden="true" />}
                      <span className="text-[10px] text-text-muted">{formatDateTime(c.created_at)}</span>
                    </div>

                    {/* WhatsApp-style reply quote */}
                    {parent && (
                      <div className="mb-1.5 pl-3 border-l-2 border-brand-purple/40 bg-brand-purple-faint rounded-r-lg py-1 pr-2 w-full">
                        <p className="text-[10px] font-bold text-brand-purple">{parent.author.full_name}</p>
                        {parent.body && <div className="text-[11px] text-text-secondary truncate" dangerouslySetInnerHTML={{ __html: parent.body }} />}
                        {parent.files.length > 0 && !parent.body && <p className="text-[11px] text-text-muted">{parent.files[0].name}</p>}
                      </div>
                    )}

                    {/* bubble */}
                    <div className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      c.is_internal
                        ? 'bg-amber-50 border border-amber-200 text-amber-900'
                        : isMe
                          ? 'bg-brand-purple text-white rounded-tr-sm'
                          : 'bg-surface-secondary border border-surface-border text-text-primary rounded-tl-sm'
                    }`}>
                      {c.body && <div dangerouslySetInnerHTML={{ __html: c.body }} />}
                      {c.files.length > 0 && (
                        <div className={`${c.body ? 'mt-2 pt-2 border-t border-white/20' : ''} space-y-1.5`}>
                          {c.files.map(f => (
                            <a key={f.name} href={f.url} download={f.name}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all ${
                                isMe
                                  ? 'bg-white/15 hover:bg-white/25 border border-white/20'
                                  : 'bg-white border border-surface-border hover:border-brand-purple/40 hover:bg-brand-purple-faint'
                              }`}
                            >
                              <Paperclip className={`h-3.5 w-3.5 flex-shrink-0 ${isMe ? 'text-white/70' : 'text-text-muted'}`} aria-hidden="true" />
                              <span className={`text-xs font-medium truncate flex-1 ${isMe ? 'text-white' : 'text-text-primary'}`}>{f.name}</span>
                              <span className={`text-[10px] flex-shrink-0 ${isMe ? 'text-white/60' : 'text-text-muted'}`}>{formatBytes(f.size)}</span>
                              <Download className={`h-3 w-3 flex-shrink-0 ${isMe ? 'text-white/70' : 'text-text-muted'}`} aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* action buttons */}
                    <div className={`flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'flex-row-reverse' : ''}`}>
                      <button onClick={() => setReplyTo(c)}
                        className="flex items-center gap-1 text-[10px] text-text-muted hover:text-brand-purple transition-colors"
                        aria-label="Reply">
                        <Reply className="h-3 w-3" /> Reply
                      </button>
                      <button onClick={() => handlePin(c.id)}
                        className={`flex items-center gap-1 text-[10px] transition-colors ${
                          c.pinned ? 'text-amber-500 hover:text-amber-700' : 'text-text-muted hover:text-amber-500'
                        }`}
                        aria-label={c.pinned ? 'Unpin' : 'Pin'}>
                        <Pin className="h-3 w-3" /> {c.pinned ? 'Unpin' : 'Pin'}
                      </button>
                      {isMe && (
                        <button onClick={() => handleDelete(c.id)}
                          className="flex items-center gap-1 text-[10px] text-text-muted hover:text-red-500 transition-colors"
                          aria-label="Delete">
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compose area */}
          <div className="px-4 py-3 border-t border-surface-border bg-surface-secondary/40 flex-shrink-0 mt-auto">
            {/* Reply preview */}
            {replyTo && (
              <div className="flex items-start gap-2 mb-2 pl-3 border-l-2 border-brand-purple bg-brand-purple-faint rounded-r-lg py-1.5 pr-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-brand-purple">Replying to {replyTo.author.full_name}</p>
                  {replyTo.body && <div className="text-[11px] text-text-secondary truncate" dangerouslySetInnerHTML={{ __html: replyTo.body }} />}
                  {replyTo.files.length > 0 && !replyTo.body && <p className="text-[11px] text-text-muted">{replyTo.files[0].name}</p>}
                </div>
                <button onClick={() => setReplyTo(null)} className="text-text-muted hover:text-text-primary flex-shrink-0" aria-label="Cancel reply">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Attached files preview */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-surface-border rounded-lg text-xs">
                    <Paperclip className="h-3 w-3 text-text-muted" aria-hidden="true" />
                    <span className="text-text-primary font-medium truncate max-w-[120px]">{f.name}</span>
                    <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-text-muted hover:text-red-500 transition-colors" aria-label="Remove file">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={commentText}
                onChange={handleTextareaChange}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSendComment(); }}
                placeholder="Write a comment…"
                rows={1}
                className="flex-1 rounded-xl border border-surface-border bg-white text-sm text-text-primary placeholder:text-text-muted px-3.5 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all overflow-y-auto"
                style={{ height: '38px' }}
                data-testid="comment-textarea"
              />
              <input ref={fileInputRef} type="file" multiple className="hidden"
                onChange={e => setAttachedFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])}
              />
              <button onClick={() => fileInputRef.current?.click()}
                className="h-9 w-9 rounded-xl border border-surface-border bg-white flex items-center justify-center text-text-muted hover:text-brand-purple hover:border-brand-purple transition-all flex-shrink-0"
                aria-label="Attach files">
                <Paperclip className="h-4 w-4" />
              </button>
              <Button variant="primary" size="sm"
                onClick={handleSendComment}
                disabled={!commentText.trim() && attachedFiles.length === 0}
                leftIcon={<Send className="h-3.5 w-3.5" />}
                data-testid="add-comment-btn">
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Assignee Timeline ── */}
        <div className="flex flex-col">
          <AssigneeTimeline ticket={ticket} events={timelineEvents} slots={assigneeSlots} />
        </div>
      </div>


      {/* Modals */}
      {activeModal === 'assign'  && <AssignModal  ticket={ticket} isOpen onClose={() => setActiveModal(null)} />}
      {activeModal === 'status'  && <StatusModal  ticket={ticket} isOpen onClose={() => setActiveModal(null)} />}
      {activeModal === 'resolve' && <ResolveModal ticket={ticket} isOpen onClose={() => setActiveModal(null)} />}
      {activeModal === 'close'   && <CloseModal   ticket={ticket} isOpen onClose={() => setActiveModal(null)} />}
      {activeModal === 'reopen'  && <ReopenModal  ticket={ticket} isOpen onClose={() => setActiveModal(null)} />}
    </div>
  );
}
