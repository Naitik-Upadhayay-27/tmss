import { create } from 'zustand';
import type { Notification } from '@/types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  markAsRead: (id: number) => void;
  markAsUnread: (id: number) => void;
  toggleStar: (id: number) => void;
  deleteNotification: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'is_read' | 'created_at' | 'starred'>) => void;
  
  // Batch operations
  batchMarkAsRead: (ids: number[]) => void;
  batchMarkAsUnread: (ids: number[]) => void;
  batchToggleStar: (ids: number[], starState: boolean) => void;
  batchDelete: (ids: number[]) => void;
}

let nextId = 1;

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: nextId++,
    recipient: 1,
    title: 'Ticket Assigned',
    message: 'TKT-0003 has been assigned to you. Department: Insurance Operations.',
    ticket: 3,
    ticket_number: 'TKT-0003',
    is_read: false,
    starred: true,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
  },
  {
    id: nextId++,
    recipient: 1,
    title: 'SLA Breach Warning',
    message: 'TKT-0005 is within 30 minutes of breaching its SLA deadline. Assignee: You.',
    ticket: 5,
    ticket_number: 'TKT-0005',
    is_read: false,
    starred: false,
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 min ago
  },
  {
    id: nextId++,
    recipient: 1,
    title: 'AI Auto-Categorisation',
    message: 'AI successfully classified TKT-0007 as a TECH_BE issue (Confidence: 94%).',
    ticket: 7,
    ticket_number: 'TKT-0007',
    is_read: false,
    starred: false,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
  },
  {
    id: nextId++,
    recipient: 1,
    title: 'SLA Breached',
    message: 'TKT-0002 has breached its critical SLA deadline of 4 hours.',
    ticket: 2,
    ticket_number: 'TKT-0002',
    is_read: false,
    starred: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), // 1.5h ago
  },
  {
    id: nextId++,
    recipient: 1,
    title: 'AI Duplicate Detection',
    message: 'AI detected TKT-0009 has a 91% semantic similarity match to resolved ticket TKT-0001.',
    ticket: 9,
    ticket_number: 'TKT-0009',
    is_read: true,
    starred: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h ago
  },
  {
    id: nextId++,
    recipient: 1,
    title: 'New Internal Comment',
    message: 'Ankit Kumar added a comment on TKT-0004: "Please verify the bank verification documents uploaded by the customer."',
    ticket: 4,
    ticket_number: 'TKT-0004',
    is_read: true,
    starred: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
  },
  {
    id: nextId++,
    recipient: 1,
    title: 'AI Sentiment Alert',
    message: 'AI Sentiment analyzer flagged incoming ticket TKT-0012 as "Angry". Sentiment score: 0.12/1.0.',
    ticket: 12,
    ticket_number: 'TKT-0012',
    is_read: true,
    starred: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: nextId++,
    recipient: 1,
    title: 'Ticket Resolved',
    message: 'TKT-0001 has been resolved by Support Specialist Rohan Das.',
    ticket: 1,
    ticket_number: 'TKT-0001',
    is_read: true,
    starred: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length,
  isOpen: false,

  setOpen: (open) => set({ isOpen: open }),

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.is_read).length };
    }),

  markAsUnread: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: false } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.is_read).length };
    }),

  toggleStar: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, starred: !n.starred } : n
      ),
    })),

  deleteNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      return { notifications, unreadCount: notifications.filter((n) => !n.is_read).length };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),

  addNotification: (n) =>
    set((state) => {
      const newN: Notification = {
        ...n,
        id: nextId++,
        is_read: false,
        starred: false,
        created_at: new Date().toISOString(),
      };
      return {
        notifications: [newN, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),

  // Batch operations
  batchMarkAsRead: (ids) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        ids.includes(n.id) ? { ...n, is_read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.is_read).length };
    }),

  batchMarkAsUnread: (ids) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        ids.includes(n.id) ? { ...n, is_read: false } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.is_read).length };
    }),

  batchToggleStar: (ids, starState) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        ids.includes(n.id) ? { ...n, starred: starState } : n
      ),
    })),

  batchDelete: (ids) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => !ids.includes(n.id));
      return { notifications, unreadCount: notifications.filter((n) => !n.is_read).length };
    }),
}));
