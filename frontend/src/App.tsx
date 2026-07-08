import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppShell } from './layout/AppShell';
import { AuthGuard, RoleGuard } from './features/auth/RoleGuard';
import { LoginPage } from './features/auth/LoginPage';
import { Skeleton } from './design-system';

const page = <T,>(fn: () => Promise<{ [k: string]: T }>, key: string) =>
  lazy(() => fn().then((m) => ({ default: m[key] as React.ComponentType })));

// Pages
const DashboardPage           = page(() => import('./features/dashboard/DashboardPage'), 'DashboardPage');
const TicketListPage          = page(() => import('./features/tickets/TicketListPage'), 'TicketListPage');
const TicketDetailPage        = page(() => import('./features/tickets/TicketDetailPage'), 'TicketDetailPage');
const AgentDashboardPage      = page(() => import('./features/agent/AgentDashboardPage'), 'AgentDashboardPage');
const AgentTicketListPage     = page(() => import('./features/agent/AgentTicketListPage'), 'AgentTicketListPage');
const MemberDashboardPage     = page(() => import('./features/member/MemberDashboardPage'), 'MemberDashboardPage');
const MemberTicketsPage       = page(() => import('./features/member/MemberTicketsPage'), 'MemberTicketsPage');
const DeptHeadDashboardPage   = page(() => import('./features/depthead/DeptHeadDashboardPage'), 'DeptHeadDashboardPage');
const DeptHeadTicketsPage     = page(() => import('./features/depthead/DeptHeadTicketsPage'), 'DeptHeadTicketsPage');
const UserManagementPage      = page(() => import('./features/users/UserManagementPage'), 'UserManagementPage');
const UserDetailPage          = page(() => import('./features/users/UserDetailPage'), 'UserDetailPage');
const DepartmentManagementPage= page(() => import('./features/departments/DepartmentManagementPage'), 'DepartmentManagementPage');
const DepartmentDetailPage    = page(() => import('./features/departments/DepartmentDetailPage'), 'DepartmentDetailPage');
const SLADashboardPage        = page(() => import('./features/admin/SLADashboardPage'), 'SLADashboardPage');
const ReportsPage             = page(() => import('./features/reports/ReportsPage'), 'ReportsPage');
const SettingsPage            = page(() => import('./features/settings/SettingsPage'), 'SettingsPage');
const ProfilePage             = page(() => import('./features/profile/ProfilePage'), 'ProfilePage');
const NotificationsPage       = page(() => import('./features/notifications/NotificationsPage'), 'NotificationsPage');
const NotFoundPage            = page(() => import('./pages/NotFoundPage'), 'NotFoundPage');

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function Fallback() {
  return (
    <div className="p-6 space-y-3">
      <Skeleton className="h-7 w-52" />
      <div className="grid grid-cols-4 gap-4 mt-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <Skeleton className="h-64 rounded-2xl mt-2" />
    </div>
  );
}

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Fallback />}>{children}</Suspense>;
}

const ADMIN: React.ComponentProps<typeof RoleGuard>['allowedRoles'] = ['SUPER_ADMIN'];
const HEAD: React.ComponentProps<typeof RoleGuard>['allowedRoles'] = ['DEPT_HEAD'];
const CALLER: React.ComponentProps<typeof RoleGuard>['allowedRoles'] = ['CALLER'];
const MEMBER: React.ComponentProps<typeof RoleGuard>['allowedRoles'] = ['MEMBER'];
const ADMIN_HEAD: React.ComponentProps<typeof RoleGuard>['allowedRoles'] = ['SUPER_ADMIN', 'DEPT_HEAD'];

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<AuthGuard><AppShell /></AuthGuard>}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Shared */}
            <Route path="/dashboard"   element={<S><DashboardPage /></S>} />
            <Route path="/tickets"     element={<S><TicketListPage /></S>} />
            <Route path="/tickets/:id" element={<S><TicketDetailPage /></S>} />
            <Route path="/profile"     element={<S><ProfilePage /></S>} />
            <Route path="/notifications" element={<S><NotificationsPage /></S>} />

            {/* Agent */}
            <Route path="/agent/dashboard" element={<RoleGuard allowedRoles={CALLER}><S><AgentDashboardPage /></S></RoleGuard>} />
            <Route path="/agent/tickets"   element={<RoleGuard allowedRoles={CALLER}><S><AgentTicketListPage /></S></RoleGuard>} />

            {/* Member */}
            <Route path="/member/dashboard" element={<RoleGuard allowedRoles={MEMBER}><S><MemberDashboardPage /></S></RoleGuard>} />
            <Route path="/member/tickets"   element={<RoleGuard allowedRoles={MEMBER}><S><MemberTicketsPage /></S></RoleGuard>} />

            {/* Dept Head */}
            <Route path="/head/dashboard" element={<RoleGuard allowedRoles={HEAD}><S><DeptHeadDashboardPage /></S></RoleGuard>} />
            <Route path="/head/tickets"   element={<RoleGuard allowedRoles={HEAD}><S><DeptHeadTicketsPage /></S></RoleGuard>} />

            {/* Admin */}
            <Route path="/admin/users"       element={<RoleGuard allowedRoles={ADMIN}><S><UserManagementPage /></S></RoleGuard>} />
            <Route path="/admin/users/:id"   element={<RoleGuard allowedRoles={ADMIN}><S><UserDetailPage /></S></RoleGuard>} />
            <Route path="/admin/departments" element={<RoleGuard allowedRoles={ADMIN}><S><DepartmentManagementPage /></S></RoleGuard>} />
            <Route path="/admin/departments/:id" element={<RoleGuard allowedRoles={ADMIN}><S><DepartmentDetailPage /></S></RoleGuard>} />
            <Route path="/admin/sla"         element={<RoleGuard allowedRoles={ADMIN}><S><SLADashboardPage /></S></RoleGuard>} />

            {/* Reports + Settings */}
            <Route path="/reports"  element={<RoleGuard allowedRoles={ADMIN_HEAD}><S><ReportsPage /></S></RoleGuard>} />
            <Route path="/settings" element={<RoleGuard allowedRoles={ADMIN}><S><SettingsPage /></S></RoleGuard>} />

            <Route path="*" element={<S><NotFoundPage /></S>} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#0F1120',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 8px 24px rgba(15,17,32,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0F1120' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#0F1120' } },
        }}
      />
    </QueryClientProvider>
  );
}
