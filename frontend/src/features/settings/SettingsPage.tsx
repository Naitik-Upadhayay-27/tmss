import { useState } from 'react';
import { Settings, Shield, Bell, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDepartments } from '@/hooks/useDepartments';
import { PageHeader } from '@/layout/PageHeader';
import { Button, Input, Skeleton } from '@/design-system';
import { AIStatusBanner } from '@/features/ai-panel/AIStatusBanner';
import { mockDepartments } from '@/mockData';

type Tab = 'general' | 'sla' | 'notifications';

const NOTIFICATION_SETTINGS = [
  { id: 'email_assigned', label: 'Email on ticket assigned', description: 'Receive an email when a ticket is assigned to you' },
  { id: 'email_sla_breach', label: 'Email on SLA breach', description: 'Receive an email when a ticket in your department breaches SLA' },
  { id: 'email_resolved', label: 'Email on ticket resolved', description: 'Receive an email when a ticket you created is resolved' },
  { id: 'email_escalation', label: 'Email on escalation', description: 'Receive an email when a ticket is escalated' },
];

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('general');
  const { data } = useDepartments();
  const depts = data?.results ?? [];
  const [slaValues, setSlaValues] = useState<Record<number, { critical: number; high: number }>>({});
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_SETTINGS.map((s) => [s.id, true]))
  );

  const getSlaValue = (deptId: number, field: 'critical' | 'high', fallback: number) =>
    slaValues[deptId]?.[field] ?? fallback;

  const updateSla = (deptId: number, field: 'critical' | 'high', val: number) => {
    setSlaValues((prev) => ({
      ...prev,
      [deptId]: { ...prev[deptId], [field]: val },
    }));
  };

  const saveSLA = () => {
    Object.entries(slaValues).forEach(([id, vals]) => {
      const idx = mockDepartments.findIndex((d) => d.id === Number(id));
      if (idx !== -1) {
        mockDepartments[idx].sla_critical_hours = vals.critical;
        mockDepartments[idx].sla_high_hours = vals.high;
      }
    });
    toast.success('SLA defaults saved');
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'sla', label: 'SLA Defaults', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Settings" subtitle="System configuration and preferences" />

      {/* Tab bar */}
      <div className="flex border-b border-surface-border" role="tablist">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === id
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-surface-border'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* General tab */}
      {tab === 'general' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">System Information</h2>
            <dl className="space-y-4">
              {[
                { label: 'System Name', value: 'FatakPay TMS' },
                { label: 'Company', value: 'FatakPay' },
                { label: 'Version', value: 'Phase 1.0.0' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                  <dt className="text-sm text-text-secondary">{label}</dt>
                  <dd className="text-sm font-medium text-text-primary">{value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between py-2">
                <dt className="text-sm text-text-secondary">Data Mode</dt>
                <dd>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    Phase 1 — Mock Data Mode
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-brand-purple" aria-hidden="true" />
              AI Engine Status
            </h2>
            <AIStatusBanner available={false} />
            <p className="text-xs text-text-muted mt-3">
              AI features including auto-categorisation, smart assignment, and ticket summaries will be available in Phase 2.
            </p>
          </div>
        </div>
      )}

      {/* SLA defaults tab */}
      {tab === 'sla' && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Configure default SLA response times per department. Critical and High priority tickets will use these thresholds.
          </p>
          <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary border-b border-surface-border">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Department</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Critical SLA (hrs)</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">High SLA (hrs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {depts.length === 0
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 3 }).map((_, j) => (
                          <td key={j} className="px-5 py-3"><Skeleton className="h-8 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  : depts.map((dept) => (
                      <tr key={dept.id} className="hover:bg-surface-secondary transition-colors">
                        <td className="px-5 py-3 font-medium text-text-primary">{dept.name}</td>
                        <td className="px-5 py-3">
                          <Input
                            type="number"
                            value={getSlaValue(dept.id, 'critical', dept.sla_critical_hours)}
                            onChange={(e) => updateSla(dept.id, 'critical', Number(e.target.value))}
                            className="w-24"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <Input
                            type="number"
                            value={getSlaValue(dept.id, 'high', dept.sla_high_hours)}
                            onChange={(e) => updateSla(dept.id, 'high', Number(e.target.value))}
                            className="w-24"
                          />
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={saveSLA} data-testid="save-sla-btn">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {tab === 'notifications' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-surface-border shadow-card divide-y divide-surface-border">
            {NOTIFICATION_SETTINGS.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-text-primary">{setting.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{setting.description}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={notifToggles[setting.id]}
                  onClick={() => setNotifToggles((prev) => ({ ...prev, [setting.id]: !prev[setting.id] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-brand-purple focus-visible:outline-offset-2 ${
                    notifToggles[setting.id] ? 'bg-brand-purple' : 'bg-surface-tertiary'
                  }`}
                  data-testid={`toggle-${setting.id}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    notifToggles[setting.id] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={() => toast.success('Notification preferences saved')} data-testid="save-notifications-btn">
              Save Preferences
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
