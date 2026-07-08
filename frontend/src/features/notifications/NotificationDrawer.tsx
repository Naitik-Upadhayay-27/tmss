import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Drawer, Button, EmptyState } from '@/design-system';
import { useNotificationStore } from './useNotificationStore';
import { formatRelative } from '@/utils';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();

  const handleNotificationClick = (id: number, ticketId?: number) => {
    markAsRead(id);
    if (ticketId) {
      navigate(`/tickets/${ticketId}`);
      onClose();
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Notifications" width="w-80">
      <div className="flex flex-col h-full">
        {notifications.length > 0 && (
          <div className="flex justify-end px-4 py-2 border-b border-surface-border">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>
        )}

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-10 w-10" />}
            title="No notifications"
            description="You're all caught up!"
          />
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-surface-border scrollbar-thin" role="list">
            {notifications.map((n) => (
              <li key={n.id} role="listitem">
                <button
                  onClick={() => handleNotificationClick(n.id, n.ticket)}
                  className={`w-full text-left px-4 py-3 hover:bg-surface-secondary transition-colors ${
                    !n.is_read ? 'bg-brand-purple-faint/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-purple flex-shrink-0" aria-label="Unread" />
                    )}
                    <div className={!n.is_read ? '' : 'pl-4'}>
                      <p className="text-sm font-medium text-text-primary">{n.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{n.message}</p>
                      <p className="text-xs text-text-muted mt-1">{formatRelative(n.created_at)}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Drawer>
  );
}
