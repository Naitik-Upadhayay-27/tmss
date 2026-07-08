import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, Tooltip } from 'recharts';
import { Eye, Download, Trash2, Settings } from 'lucide-react';

const SUMMARY_DATA = [
  { name: 'Last 3', critical: 200, major: 150, minor: 100 },
  { name: 'Last 9', critical: 250, major: 180, minor: 120 },
  { name: 'Last 15', critical: 300, major: 200, minor: 150 },
  { name: '', critical: 280, major: 250, minor: 130 },
  { name: '', critical: 240, major: 190, minor: 110 },
];

const SLA_AUDIT_DATA = [
  { name: 'Eng', onTime: 60, atRisk: 20, breached: 10 },
  { name: 'Ins', onTime: 70, atRisk: 15, breached: 15 },
  { name: 'IT', onTime: 50, atRisk: 25, breached: 5 },
  { name: 'Ops', onTime: 65, atRisk: 10, breached: 5 },
  { name: 'Sup', onTime: 55, atRisk: 20, breached: 15 },
];

export function AIReportsTab() {
  return (
    <div className="space-y-6">
      
      {/* Generate Input */}
      <div className="bg-white rounded-xl border border-surface-border shadow-sm p-4 flex gap-4 items-center">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search reports and metrics (e.g., CSAT, SLA breach)..." 
            defaultValue='Type: "Weekly Insurance summary by dept" →'
            className="w-full h-10 pl-4 pr-4 rounded-lg border border-surface-border bg-surface-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
          />
        </div>
        <button className="h-10 px-6 rounded-lg bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purple/90 transition-colors flex items-center gap-2">
          Generate Report <Settings className="h-4 w-4" />
        </button>
      </div>
      
      <p className="text-xs text-text-muted">*AI creates individual, stored report slabs here, which can be viewed or exported later, keeping the view clean.</p>

      {/* Generated Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-surface-border flex justify-between items-center bg-surface-secondary/30">
            <h3 className="text-sm font-bold text-text-primary">Insurance Weekly Summary - Oct 23-30</h3>
            <span className="text-xs text-text-muted">(Generated)</span>
          </div>
          <div className="p-4 flex-1">
            <div className="flex items-center justify-center gap-4 mb-4 text-xs font-semibold">
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-500" /> Critical</div>
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> Major</div>
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-teal-500" /> Minor</div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SUMMARY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="critical" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="major" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="minor" stroke="#14B8A6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-right text-xs text-text-muted mt-2">Stored 3d ago</div>
          </div>
          <div className="px-5 py-3 border-t border-surface-border flex justify-between items-center bg-surface-secondary/10">
            <button className="text-xs font-semibold text-text-secondary flex items-center gap-1 hover:text-text-primary">
              <Eye className="h-4 w-4" /> View
            </button>
            <button className="text-xs font-semibold text-text-secondary flex items-center gap-1 hover:text-text-primary">
              <Download className="h-4 w-4" /> Download CSV
            </button>
            <button className="text-xs font-semibold text-red-600 flex items-center gap-1 hover:text-red-700">
              Delete <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-surface-border flex justify-between items-center bg-surface-secondary/30">
            <h3 className="text-sm font-bold text-text-primary">Cross-Dept SLA Audit - Oct 1-7</h3>
            <span className="text-xs text-text-muted">(Stored)</span>
          </div>
          <div className="p-4 flex-1">
            <div className="flex items-center justify-center gap-4 mb-4 text-xs font-semibold">
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-500" /> On Time</div>
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> At Risk</div>
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500" /> Breached</div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SLA_AUDIT_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="breached" stackId="a" fill="#EF4444" />
                  <Bar dataKey="atRisk" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="onTime" stackId="a" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-right text-xs text-text-muted mt-2">Stored 1w ago</div>
          </div>
          <div className="px-5 py-3 border-t border-surface-border flex justify-between items-center bg-surface-secondary/10">
            <button className="text-xs font-semibold text-text-secondary flex items-center gap-1 hover:text-text-primary">
              <Eye className="h-4 w-4" /> View
            </button>
            <button className="text-xs font-semibold text-text-secondary flex items-center gap-1 hover:text-text-primary">
              <Download className="h-4 w-4" /> Download CSV
            </button>
            <button className="text-xs font-semibold text-red-600 flex items-center gap-1 hover:text-red-700">
              Delete <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-surface-border flex justify-between items-center bg-surface-secondary/30">
            <h3 className="text-sm font-bold text-text-primary">IT Internal Agent Performance</h3>
            <span className="text-xs text-text-muted">(Stored)</span>
          </div>
          <div className="p-4 flex-1">
            <div className="flex items-center justify-center gap-4 mb-4 text-xs font-semibold">
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-500" /> Critical</div>
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> Major</div>
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-teal-500" /> Minor</div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SUMMARY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="critical" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="major" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="minor" stroke="#14B8A6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-right text-xs text-text-muted mt-2">Stored 1w ago</div>
          </div>
          <div className="px-5 py-3 border-t border-surface-border flex justify-between items-center bg-surface-secondary/10">
            <button className="text-xs font-semibold text-text-secondary flex items-center gap-1 hover:text-text-primary">
              <Eye className="h-4 w-4" /> View
            </button>
            <button className="text-xs font-semibold text-text-secondary flex items-center gap-1 hover:text-text-primary">
              <Download className="h-4 w-4" /> Download CSV
            </button>
            <button className="text-xs font-semibold text-red-600 flex items-center gap-1 hover:text-red-700">
              Delete <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
