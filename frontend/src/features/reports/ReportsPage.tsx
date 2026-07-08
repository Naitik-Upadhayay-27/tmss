import { useState } from 'react';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import { VolumeTrendsTab } from './tabs/VolumeTrendsTab';
import { AgentPerformanceTab } from './tabs/AgentPerformanceTab';
import { SLAComplianceTab } from './tabs/SLAComplianceTab';
import { AIReportsTab } from './tabs/AIReportsTab';

type TabId = 'volume' | 'agent' | 'sla' | 'ai';

const ALL_TABS: { id: TabId; label: string; roles: string[] }[] = [
  { id: 'volume', label: 'Volume Trends', roles: ['SUPER_ADMIN', 'DEPT_HEAD'] },
  { id: 'agent', label: 'Agent Performance', roles: ['SUPER_ADMIN', 'DEPT_HEAD'] },
  { id: 'sla', label: 'SLA Compliance', roles: ['SUPER_ADMIN'] }, // Only Super Admin
  { id: 'ai', label: 'AI Reports', roles: ['SUPER_ADMIN', 'DEPT_HEAD'] },
];

export function ReportsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabId>('volume');

  // Filter tabs based on user role
  const availableTabs = ALL_TABS.filter(tab => 
    tab.roles.includes(user?.role || '')
  );

  // If current tab is not available for user, switch to first available
  const validTab = availableTabs.find(tab => tab.id === activeTab) ? activeTab : availableTabs[0]?.id || 'volume';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Reports Overview</h1>
          <p className="text-sm text-text-muted mt-1">Tickets &gt; Reports Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-9 rounded-lg border border-surface-border bg-white text-sm text-text-primary px-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/30">
            <option>Weekly Insurance summary by dept</option>
            <option>Monthly IT Operations SLA</option>
          </select>
          <button className="h-9 px-4 rounded-lg bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purple/90 transition-colors shadow-sm">
            Generate Report
          </button>
        </div>
      </div>

      <div className="border-b border-surface-border">
        <nav className="flex space-x-6" aria-label="Tabs">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                validTab === tab.id
                  ? 'border-brand-purple text-brand-purple'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-surface-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-2">
        {validTab === 'volume' && <VolumeTrendsTab />}
        {validTab === 'agent' && <AgentPerformanceTab />}
        {validTab === 'sla' && <SLAComplianceTab />}
        {validTab === 'ai' && <AIReportsTab />}
      </div>
    </div>
  );
}
