import { useRef, useState, useEffect } from 'react';
import { Bell, Search, ChevronDown, User, LogOut, Ticket, Building2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { useNotificationStore } from '@/features/notifications/useNotificationStore';
import { Avatar, Tooltip } from '@/design-system';
import { useTickets } from '@/hooks/useTickets';
import { useUsers } from '@/hooks/useUsers';
import { useDepartments } from '@/hooks/useDepartments';
import { ROLE_LABELS } from '@/utils';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Data for search dropdown
  const { data: ticketsData } = useTickets({ search: searchQuery, page_size: 5 });
  const { data: usersData } = useUsers();
  const { data: deptsData } = useDepartments();

  const tickets = ticketsData?.results || [];
  
  const users = (usersData?.results || []).filter(u => 
    searchQuery && (u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 3);
  
  const depts = (deptsData?.results || []).filter(d => 
    searchQuery && d.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const showDropdown = isSearchFocused && searchQuery.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search when route changes
  useEffect(() => {
    setIsSearchFocused(false);
    setSearchQuery('');
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <header className="h-14 flex items-center justify-between px-5 bg-white border-b border-surface-border flex-shrink-0 gap-4 z-30 relative">
        {/* Search */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <label className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-text-muted" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search tickets, users, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/tickets?search=${encodeURIComponent(searchQuery.trim())}`);
                  setIsSearchFocused(false);
                }
              }}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-surface-border bg-surface-secondary text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
              aria-label="Search"
            />
            <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 text-[10px] text-text-muted font-medium">
              ↵
            </kbd>
          </label>

          {/* Search Dropdown */}
          {showDropdown && (
            <div className="absolute top-11 left-0 w-full bg-white rounded-xl border border-surface-border shadow-dropdown z-40 max-h-[400px] overflow-y-auto animate-slide-up">
              {tickets.length === 0 && users.length === 0 && depts.length === 0 ? (
                <div className="p-4 text-center text-sm text-text-muted">No results found for "{searchQuery}"</div>
              ) : (
                <div className="py-2">
                  {tickets.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-bold text-text-muted uppercase tracking-wider">Tickets</div>
                      {tickets.map(t => (
                        <button
                          key={t.id}
                          onClick={() => navigate(`/tickets/${t.id}`)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-secondary transition-colors text-left"
                        >
                          <div className="h-8 w-8 rounded bg-brand-purple-faint flex items-center justify-center flex-shrink-0">
                            <Ticket className="h-4 w-4 text-brand-purple" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{t.subject}</p>
                            <p className="text-xs text-text-muted">{t.ticket_number} • {t.status.replace('_', ' ')}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {users.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-bold text-text-muted uppercase tracking-wider">Users</div>
                      {users.map(u => (
                        <button
                          key={u.id}
                          onClick={() => navigate('/admin/users')}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-secondary transition-colors text-left"
                        >
                          <Avatar name={u.full_name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{u.full_name}</p>
                            <p className="text-xs text-text-muted">{ROLE_LABELS[u.role]}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {depts.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-xs font-bold text-text-muted uppercase tracking-wider">Departments</div>
                      {depts.map(d => (
                        <button
                          key={d.id}
                          onClick={() => navigate('/admin/departments')}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-secondary transition-colors text-left"
                        >
                          <div className="h-8 w-8 rounded bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{d.name}</p>
                            <p className="text-xs text-text-muted">Department</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* See all results */}
                  <div className="mt-2 pt-2 border-t border-surface-border px-2">
                    <button 
                      onClick={() => {
                        navigate(`/tickets?search=${encodeURIComponent(searchQuery.trim())}`);
                        setIsSearchFocused(false);
                      }}
                      className="w-full py-2 text-sm text-brand-purple font-medium hover:bg-brand-purple-faint rounded-lg transition-colors"
                    >
                      See all ticket results for "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <Tooltip content="Notifications" position="bottom">
            <button
              onClick={() => navigate('/notifications')}
              className="relative flex items-center justify-center h-9 w-9 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all"
              aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ''}`}
            >
              <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 h-[7px] w-[7px] rounded-full bg-red-500 ring-2 ring-white"
                  aria-hidden="true"
                />
              )}
            </button>
          </Tooltip>

          {/* Divider */}
          <div className="h-6 w-px bg-surface-border mx-1" aria-hidden="true" />

          {/* User menu */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 pl-1 pr-2 h-9 rounded-lg hover:bg-surface-secondary transition-all group"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <Avatar name={user.full_name} size="sm" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-text-primary leading-tight">{user.full_name}</p>
                  <p className="text-[11px] text-text-muted leading-tight">{ROLE_LABELS[user.role]}</p>
                </div>
                <ChevronDown className={`hidden sm:block h-3.5 w-3.5 text-text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-11 w-52 bg-white rounded-xl border border-surface-border shadow-dropdown z-50 py-1 animate-slide-up"
                  role="menu"
                >
                  <div className="px-4 py-2.5 border-b border-surface-border">
                    <p className="text-sm font-semibold text-text-primary">{user.full_name}</p>
                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors"
                    role="menuitem"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    My Profile
                  </button>
                  <div className="my-1 border-t border-surface-border" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}

              {/* Close on outside click */}
              {userMenuOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                  aria-hidden="true"
                />
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
