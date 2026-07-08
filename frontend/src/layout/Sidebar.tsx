import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2,
  BarChart3, ChevronLeft, ChevronRight, ClipboardList,
  LayoutGrid, ListChecks, AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { Avatar, Tooltip } from '@/design-system';
import type { Role } from '@/types';

interface NavItem {
  label: string;
  icon: React.ElementType;
  to: string;
  roles: Role[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Super Admin
  { label: 'Dashboard',      icon: LayoutDashboard, to: '/dashboard',        roles: ['SUPER_ADMIN'] },
  { label: 'Users',          icon: Users,           to: '/admin/users',       roles: ['SUPER_ADMIN'] },
  { label: 'Departments',    icon: Building2,       to: '/admin/departments', roles: ['SUPER_ADMIN'] },
  { label: 'Reports',        icon: BarChart3,       to: '/reports',           roles: ['SUPER_ADMIN'] },
  // Dept Head
  { label: 'Overview',       icon: LayoutDashboard, to: '/head/dashboard',    roles: ['DEPT_HEAD'] },
  { label: 'Dept Tickets',   icon: ListChecks,      to: '/head/tickets',      roles: ['DEPT_HEAD'] },
  { label: 'Reports',        icon: BarChart3,       to: '/reports',           roles: ['DEPT_HEAD'] },
  // Agent / Caller
  { label: 'Dashboard',      icon: LayoutDashboard, to: '/agent/dashboard',   roles: ['CALLER'] },
  { label: 'My Tickets',     icon: ListChecks,      to: '/agent/tickets',     roles: ['CALLER'] },
  // Team Member
  { label: 'My Queue',       icon: ClipboardList,   to: '/member/dashboard',  roles: ['MEMBER'] },
  { label: 'All My Tickets', icon: ListChecks,      to: '/member/tickets',    roles: ['MEMBER'] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const userRole = user?.role;

  const visibleItems = NAV_ITEMS.filter((item) => userRole && item.roles.includes(userRole));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside
      className={`flex flex-col h-full border-r border-surface-border bg-white transition-[width] duration-200 ease-in-out flex-shrink-0 ${
        collapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={`flex items-center h-14 border-b border-surface-border flex-shrink-0 ${collapsed ? 'justify-center px-3' : 'px-5'}`}>
        <div className="flex items-center gap-2.5">
          <img
            src="/fatakpay_logo.jpg"
            alt="FatakPay"
            className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
          />
          {!collapsed && (
            <span className="text-[17px] font-bold tracking-tight select-none">
              <span className="text-brand-purple">फटाक</span>
              <span className="text-brand-orange">PAY</span>
            </span>
          )}
        </div>
      </div>

      {/* User context (expanded only) */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <Avatar name={user.full_name} size="sm" className="flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate leading-tight">{user.full_name}</p>
              <p className="text-xs text-text-muted capitalize truncate leading-tight mt-0.5">
                {user.role.replace(/_/g, ' ').toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin" role="navigation">
        <ul className={`space-y-0.5 ${collapsed ? 'px-1.5' : 'px-3'}`} role="list">
          {visibleItems.map((item) => (
            <li key={`${item.to}-${item.roles[0]}`} role="listitem">
              {collapsed ? (
                <Tooltip content={item.label} position="right">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-center h-9 w-9 rounded-lg mx-auto transition-all duration-150 ${
                        isActive
                          ? 'bg-brand-purple text-white shadow-sm'
                          : 'text-text-muted hover:bg-surface-secondary hover:text-text-primary'
                      }`
                    }
                    aria-label={item.label}
                  >
                    <item.icon className="h-[18px] w-[18px] flex-shrink-0" aria-hidden="true" />
                  </NavLink>
                </Tooltip>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 h-9 rounded-lg transition-all duration-150 text-sm font-medium ${
                      isActive
                        ? 'bg-brand-purple text-white shadow-sm'
                        : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? 'text-white' : ''}`} aria-hidden="true" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                          isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom: profile + collapse */}
      <div className={`border-t border-surface-border p-2 space-y-1`}>
        {/* Profile */}
        {collapsed ? (
          <Tooltip content="My Profile" position="right">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center justify-center h-9 w-9 rounded-lg mx-auto transition-all ${
                  isActive ? 'bg-brand-purple text-white' : 'text-text-muted hover:bg-surface-secondary hover:text-text-primary'
                }`
              }
              aria-label="My Profile"
            >
              <Avatar name={user?.full_name ?? 'U'} size="xs" />
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-brand-purple-faint text-brand-purple' : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              }`
            }
          >
            <Avatar name={user?.full_name ?? 'U'} size="xs" />
            <span>My Profile</span>
          </NavLink>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`flex items-center w-full h-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-all duration-150 ${
            collapsed ? 'justify-center' : 'gap-2 px-3'
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
