import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Star,
  Mail,
  MailOpen,
  Trash2,
  ExternalLink,
  Archive,
  AlertCircle,
  Clock,
  Sparkles,
  Bot,
  MessageSquare,
  CheckSquare,
  Square,
  ChevronRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useNotificationStore } from './useNotificationStore';
import { Button, Input, EmptyState } from '@/design-system';
import { formatRelative } from '@/utils';
import type { Notification } from '@/types';

type CategoryTab = 'all' | 'unread' | 'starred' | 'read';

export function NotificationsPage() {
  const {
    notifications,
    markAsRead,
    markAsUnread,
    toggleStar,
    deleteNotification,
    batchMarkAsRead,
    batchMarkAsUnread,
    batchToggleStar,
    batchDelete,
  } = useNotificationStore();

  const navigate = useNavigate();

  // Search & Filter state
  const [activeTab, setActiveTab] = useState<CategoryTab>('unread');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ai' | 'sla' | 'comment' | 'assignment'>('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);

  // Resize states
  const [detailsWidth, setDetailsWidth] = useState(520);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = window.innerWidth - moveEvent.clientX;
      const maxWidth = window.innerWidth * 0.7; // limit detail pane to 70% max
      if (newWidth >= 320 && newWidth <= maxWidth) {
        setDetailsWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Filtered notifications
  const tabFilteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      switch (activeTab) {
        case 'unread':
          return !n.is_read;
        case 'starred':
          return !!n.starred;
        case 'read':
          return n.is_read;
        case 'all':
        default:
          return true;
      }
    });
  }, [notifications, activeTab]);

  const finalFilteredNotifications = useMemo(() => {
    return tabFilteredNotifications.filter((n) => {
      // Category/Type filter
      if (typeFilter === 'all') return true;
      if (typeFilter === 'ai') return n.title.toLowerCase().includes('ai');
      if (typeFilter === 'sla') return n.title.toLowerCase().includes('sla');
      if (typeFilter === 'comment') return n.title.toLowerCase().includes('comment');
      if (typeFilter === 'assignment') return n.title.toLowerCase().includes('assigned');

      return true;
    });
  }, [tabFilteredNotifications, typeFilter]);

  // Selected notification details
  const activeNotification = useMemo(() => {
    return notifications.find((n) => n.id === selectedNotificationId) || null;
  }, [notifications, selectedNotificationId]);

  // Tab counters
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => !n.is_read).length,
      starred: notifications.filter((n) => !!n.starred).length,
      read: notifications.filter((n) => n.is_read).length,
    };
  }, [notifications]);

  // Multi-select helpers
  const handleSelectAllToggle = () => {
    if (selectedIds.length === finalFilteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(finalFilteredNotifications.map((n) => n.id));
    }
  };

  const handleSelectToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchReadToggle = (readState: boolean) => {
    if (readState) {
      batchMarkAsRead(selectedIds);
    } else {
      batchMarkAsUnread(selectedIds);
    }
    setSelectedIds([]);
  };

  const handleBatchStarToggle = (starState: boolean) => {
    batchToggleStar(selectedIds, starState);
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    batchDelete(selectedIds);
    setSelectedIds([]);
    if (selectedNotificationId && selectedIds.includes(selectedNotificationId)) {
      setSelectedNotificationId(null);
    }
  };

  const handleNotificationClick = (n: Notification) => {
    setSelectedNotificationId(n.id);
    if (!n.is_read) {
      markAsRead(n.id);
    }
  };

  const getNotificationIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('ai')) return <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />;
    if (lower.includes('sla')) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (lower.includes('comment')) return <MessageSquare className="h-4 w-4 text-sky-500" />;
    if (lower.includes('assign')) return <Bot className="h-4 w-4 text-brand-purple animate-pulse" />;
    return <Inbox className="h-4 w-4 text-text-secondary" />;
  };

  const getAdditionalDetails = (n: Notification) => {
    const title = n.title.toLowerCase();
    if (title.includes('assign')) {
      return 'This ticket has been assigned to your active queue. Please review the ticket details, customer profile, and linked documents. Update the status to "In Progress" as soon as you begin work to satisfy immediate SLA parameters.';
    }
    if (title.includes('sla breach warning')) {
      return 'Critical SLA deadline approaching. This ticket requires immediate intervention to prevent breach flags. Review comments, contact stakeholders if needed, or escalate to your Department Head.';
    }
    if (title.includes('sla breached')) {
      return 'SLA deadline has been officially breached. An audit entry has been recorded in the database. Please prioritize resolution immediately and log the cause of delay in the ticket timeline.';
    }
    if (title.includes('auto-categorisation')) {
      return 'AI automated sorting verified this ticket based on department semantics. If you find the department routing is incorrect, use the "Edit Ticket" button on the detail page to manually re-route.';
    }
    if (title.includes('duplicate')) {
      return 'AI detected high semantic similarity with a previously resolved ticket. Review the historical ticket reference to see if the previous resolution path can be reused to close this issue.';
    }
    if (title.includes('sentiment')) {
      return 'Customer sentiment was flagged as negative/angry by the text analysis model. Exercise caution, use polite tone, and prioritize this ticket to resolve the customer grievance swiftly.';
    }
    if (title.includes('comment')) {
      return 'A new comment has been logged on the ticket discussion board. Please review the comments and reply or take necessary actions based on the team feed.';
    }
    return 'Please review the reference ticket and proceed with the necessary actions to resolve this notification.';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--topbar-height))] overflow-hidden bg-[#F8F9FB]">
      {/* Upper header controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-surface-border bg-white px-6 py-2 gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#1A1D2E]">Notification Center</h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage, filter, and track system & AI updates about your tickets.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Tabs Filter */}
          <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg">
            {[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'unread', label: 'Pending', count: counts.unread },
              { id: 'starred', label: 'Starred', count: counts.starred },
              { id: 'read', label: 'Read', count: counts.read },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as CategoryTab);
                    setSelectedNotificationId(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-purple text-white shadow-sm'
                      : 'text-text-secondary hover:bg-white/50 hover:text-text-primary'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`inline-flex items-center justify-center text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-tertiary text-text-muted border border-surface-border'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 border border-surface-border rounded-lg bg-white px-3 py-2 text-sm flex-shrink-0 text-text-secondary">
            <Filter className="h-4 w-4" />
            <select
              value={typeFilter}
              onChange={(e: any) => setTypeFilter(e.target.value)}
              className="bg-transparent focus:outline-none border-none text-sm text-text-secondary cursor-pointer font-semibold"
            >
              <option value="all">All Types</option>
              <option value="ai">AI System</option>
              <option value="sla">SLA Events</option>
              <option value="comment">Comments</option>
              <option value="assignment">Assignments</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Center: List of notifications */}
        <section className="flex-1 flex flex-col min-w-0 border-r border-surface-border bg-white overflow-hidden">
          {/* Actions toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-primary flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAllToggle}
                className="text-text-secondary hover:text-[#3D1A8E] transition-colors p-1"
                title={selectedIds.length === finalFilteredNotifications.length ? 'Clear all' : 'Select all'}
              >
                {selectedIds.length === 0 ? (
                  <Square className="h-4.5 w-4.5" />
                ) : selectedIds.length === finalFilteredNotifications.length ? (
                  <CheckSquare className="h-4.5 w-4.5 text-brand-purple" />
                ) : (
                  <div className="relative h-4.5 w-4.5 border border-brand-purple rounded flex items-center justify-center bg-brand-purple-faint">
                    <div className="w-2.5 h-0.5 bg-brand-purple" />
                  </div>
                )}
              </button>

              {selectedIds.length > 0 && (
                <div className="flex items-center gap-1.5 animate-fadeIn">
                  <span className="text-xs font-semibold text-brand-purple mr-1.5 px-2 py-0.5 bg-brand-purple/10 rounded-full">
                    {selectedIds.length} selected
                  </span>
                  <button
                    onClick={() => handleBatchReadToggle(true)}
                    className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-brand-purple transition-all"
                    title="Mark as Read"
                  >
                    <MailOpen className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleBatchReadToggle(false)}
                    className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-brand-purple transition-all"
                    title="Mark as Unread"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleBatchStarToggle(true)}
                    className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-amber-500 transition-all"
                    title="Mark Important"
                  >
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  </button>
                  <button
                    onClick={() => handleBatchStarToggle(false)}
                    className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-muted transition-all"
                    title="Unmark Important"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <div className="h-4 w-px bg-surface-border mx-1" />
                  <button
                    onClick={handleBatchDelete}
                    className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-red-500 transition-all"
                    title="Delete Selected"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs text-text-muted">
              Showing {finalFilteredNotifications.length} of {notifications.length}
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-surface-border scrollbar-thin">
            {finalFilteredNotifications.length === 0 ? (
              <div className="py-20">
                <EmptyState
                  icon={<Inbox className="h-12 w-12 text-text-muted" />}
                  title="No notifications found"
                  description="Try changing filters or search terms."
                />
              </div>
            ) : (
              <ul className="divide-y divide-surface-border">
                {finalFilteredNotifications.map((n) => {
                  const isSelected = selectedNotificationId === n.id;
                  const isChecked = selectedIds.includes(n.id);
                  return (
                    <li
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`group flex items-start gap-3 px-4 py-3.5 hover:bg-surface-secondary/70 transition-all cursor-pointer border-l-4 ${
                        isSelected
                          ? 'bg-brand-purple/5 border-brand-purple'
                          : !n.is_read
                          ? 'bg-brand-purple-faint/25 border-brand-purple-faint'
                          : 'border-transparent'
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        onClick={(e) => handleSelectToggle(n.id, e)}
                        className="mt-1 flex-shrink-0 text-text-muted hover:text-brand-purple transition-colors"
                      >
                        {isChecked ? (
                          <CheckSquare className="h-4.5 w-4.5 text-brand-purple" />
                        ) : (
                          <Square className="h-4.5 w-4.5 group-hover:opacity-100 opacity-60" />
                        )}
                      </div>

                      {/* Star Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(n.id);
                        }}
                        className={`mt-1 flex-shrink-0 hover:scale-115 transition-transform ${
                          n.starred ? 'text-amber-500' : 'text-text-muted hover:text-amber-500 opacity-40 hover:opacity-100'
                        }`}
                        title={n.starred ? 'Marked as important' : 'Mark as important'}
                      >
                        <Star className={`h-4.5 w-4.5 ${n.starred ? 'fill-current' : ''}`} />
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0 mt-0.5">{getNotificationIcon(n.title)}</span>
                          <h4
                            className={`text-sm truncate text-[#1A1D2E] ${
                              !n.is_read ? 'font-bold' : 'font-medium'
                            }`}
                          >
                            {n.title}
                          </h4>
                          {n.ticket_number && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-surface-tertiary text-text-secondary rounded uppercase tracking-wider font-mono flex-shrink-0">
                              {n.ticket_number}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs text-text-secondary mt-1 line-clamp-2 ${!n.is_read ? 'text-[#1A1D2E] font-medium' : ''}`}>
                          {n.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3" />
                            {formatRelative(n.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Action tools shown on hover */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 self-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (n.is_read) {
                              markAsUnread(n.id);
                            } else {
                              markAsRead(n.id);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-surface-tertiary text-text-secondary hover:text-brand-purple transition-all"
                          title={n.is_read ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          {n.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                            if (selectedNotificationId === n.id) {
                              setSelectedNotificationId(null);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-surface-tertiary text-text-secondary hover:text-red-500 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* Resize Handle */}
        <div
          onMouseDown={startResizing}
          className={`w-[5px] cursor-col-resize select-none h-full bg-surface-border/50 hover:bg-brand-purple active:bg-brand-purple transition-all duration-150 relative z-20 flex-shrink-0 border-x border-transparent ${
            isResizing ? 'bg-brand-purple border-brand-purple/20' : ''
          }`}
          title="Drag to resize detail pane"
        />

        {/* Right Pane: Master Detail preview */}
        <section
          style={{ width: `${detailsWidth}px` }}
          className="bg-white border-l border-surface-border flex flex-col overflow-hidden hidden lg:flex flex-shrink-0"
        >
          {activeNotification ? (
            <div className="flex flex-col h-full overflow-hidden animate-slideLeft">
              {/* Header toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-primary flex-shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStar(activeNotification.id)}
                    className={`p-2 rounded-lg hover:bg-surface-secondary transition-all ${
                      activeNotification.starred ? 'text-amber-500' : 'text-text-muted hover:text-amber-500'
                    }`}
                    title={activeNotification.starred ? 'Starred' : 'Star'}
                  >
                    <Star className={`h-5 w-5 ${activeNotification.starred ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      markAsUnread(activeNotification.id);
                      setSelectedNotificationId(null);
                    }}
                    className="p-2 rounded-lg hover:bg-surface-secondary text-text-secondary hover:text-brand-purple transition-all"
                    title="Mark Unread"
                  >
                    <Mail className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      deleteNotification(activeNotification.id);
                      setSelectedNotificationId(null);
                    }}
                    className="p-2 rounded-lg hover:bg-surface-secondary text-text-secondary hover:text-red-500 transition-all"
                    title="Delete Notification"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {activeNotification.ticket && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-1.5 font-semibold text-xs"
                    onClick={() => navigate(`/tickets/${activeNotification.ticket}`)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Go to Ticket
                  </Button>
                )}
              </div>

              {/* Message Details */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-brand-purple/10 text-brand-purple border border-brand-purple/20 rounded-full">
                      Notification Detail
                    </span>
                    {activeNotification.ticket_number && (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-surface-secondary text-text-primary rounded-full font-mono uppercase">
                        {activeNotification.ticket_number}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-extrabold text-[#1A1D2E] leading-tight">
                    {activeNotification.title}
                  </h2>
                </div>

                <div className="flex items-center justify-between border-y border-surface-border py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold text-sm">
                      SYS
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1D2E]">TMS Dispatcher</p>
                      <p className="text-xs text-text-secondary">Recipient: User Agent</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-text-secondary">Received</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(activeNotification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Detail content card */}
                <div className="bg-surface-secondary/50 rounded-xl p-5 border border-surface-border/60 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Message Description</p>
                    <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
                      {activeNotification.message}
                    </p>
                  </div>

                  {/* Recommendation action box */}
                  <div className="pt-4 border-t border-surface-border/60 space-y-2">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Recommended Next Action</p>
                    <p className="text-xs text-text-secondary leading-relaxed font-normal">
                      {getAdditionalDetails(activeNotification)}
                    </p>
                  </div>

                  {activeNotification.ticket && (
                    <div className="pt-4 border-t border-surface-border/60 flex items-center justify-between">
                      <span className="text-xs text-text-secondary font-medium">
                        Reference Ticket: <span className="font-mono font-bold text-[#1A1D2E]">{activeNotification.ticket_number}</span>
                      </span>
                      <button
                        onClick={() => navigate(`/tickets/${activeNotification.ticket}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple hover:underline hover:text-brand-purple/80 transition-colors"
                      >
                        Open Ticket Reference <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Info Tip based on content */}
                {activeNotification.title.toLowerCase().includes('ai') && (
                  <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <Sparkles className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-800">AI Engine Classification</h4>
                      <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                        This update was generated automatically by the TMS Mistral 7B classifier. If the suggested ticket categorization looks incorrect, you can manually override it inside the ticket details page.
                      </p>
                    </div>
                  </div>
                )}

                {activeNotification.title.toLowerCase().includes('sla') && (
                  <div className="flex gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-800">Critical SLA Deadline alert</h4>
                      <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                        Failure to resolve this ticket in the defined time will trigger an automatic escalation path to the Department Head.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-center">
              <div className="max-w-xs space-y-3">
                <div className="inline-flex h-14 w-14 bg-surface-secondary text-text-muted rounded-full items-center justify-center">
                  <Mail className="h-7 w-7" />
                </div>
                <h3 className="text-sm font-semibold text-[#1A1D2E]">No notification selected</h3>
                <p className="text-xs text-text-secondary">
                  Choose a notification from the list to preview its full details, metadata, and connected ticket links.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
