import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { ArrowDown, ArrowUp } from 'lucide-react';

const HISTORICAL_DATA = [
  { name: 'Jan', created: 20, resolved: 10, peak: 30 },
  { name: 'Feb', created: 50, resolved: 40, peak: 90 },
  { name: 'Mar', created: 40, resolved: 30, peak: 70 },
  { name: 'Apr', created: 60, resolved: 45, peak: 60 },
  { name: 'May', created: 80, resolved: 65, peak: 95 },
  { name: 'Jun', created: 50, resolved: 45, peak: 75 },
  { name: 'Jul', created: 90, resolved: 80, peak: 130 },
  { name: 'Aug', created: 130, resolved: 110, peak: 150 },
  { name: 'Sep', created: 90, resolved: 85, peak: 110 },
  { name: 'Oct', created: 110, resolved: 90, peak: 120 },
  { name: 'Nov', created: 90, resolved: 100, peak: 130 },
  { name: 'Dec', created: 120, resolved: 110, peak: 100 },
];

const DEPT_DATA = [
  { name: 'Engineering', volume: 1200, sla: '5%', active: 150 },
  { name: 'Insurance', volume: 850, sla: '8%', active: 120 },
  { name: 'IT Internal', volume: 300, sla: '1%', active: 140 },
  { name: 'HR', volume: 200, sla: '1%', active: 60 },
  { name: 'Support', volume: 150, sla: '1%', active: 10 },
];

const VOL_BY_DEPT = [
  { name: 'Eng', vol: 900 },
  { name: 'Ins', vol: 800 },
  { name: 'IT', vol: 500 },
  { name: 'HR', vol: 300 },
  { name: 'Sup', vol: 200 },
];

const VOL_BY_CHANNEL = [
  { name: 'Email', resolved: 400, open: 300, new: 150 },
  { name: 'Chat', resolved: 300, open: 200, new: 100 },
  { name: 'Phone', resolved: 200, open: 150, new: 50 },
];

export function VolumeTrendsTab() {
  return (
    <div className="space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Trends */}
        <div className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border flex justify-between items-center">
            <h2 className="text-sm font-bold text-text-primary">Historical Volume Trends (Last 12 Months)</h2>
            <span className="text-xs text-text-muted">Stored 1d ago</span>
          </div>
          <div className="p-5">
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HISTORICAL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" name="Total Tickets Created" dataKey="created" stroke="#1D4ED8" strokeWidth={2} dot={false} />
                  <Line type="monotone" name="Tickets Resolved" dataKey="resolved" stroke="#F5820D" strokeWidth={2} dot={false} />
                  <Line type="monotone" name="Peak Volume Day of Week" dataKey="peak" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-surface-border pt-4">
              <div>
                <p className="text-xs font-semibold text-text-primary">Summary - Current Period</p>
                <p className="text-xs text-text-muted">Total Created (Week): <span className="font-bold text-text-primary">2,450</span></p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Total Resolved (Week):</p>
                <p className="text-sm font-bold text-text-primary">2,120</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Avg. Resolution Time:</p>
                <p className="text-sm font-bold text-text-primary">6:15 pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dept Volume Table */}
        <div className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border flex justify-between items-center">
            <h2 className="text-sm font-bold text-text-primary">Departmental Volume & SLA</h2>
            <span className="text-xs text-text-muted">Stored 1d ago</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary text-left border-b border-surface-border">
                <th className="px-5 py-3 font-semibold text-text-muted">Dept Name</th>
                <th className="px-5 py-3 font-semibold text-text-muted">Total Volume</th>
                <th className="px-5 py-3 font-semibold text-text-muted">SLA Miss %</th>
                <th className="px-5 py-3 font-semibold text-text-muted">Active Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {DEPT_DATA.map(d => (
                <tr key={d.name} className="hover:bg-surface-secondary/50">
                  <td className="px-5 py-3 font-medium text-text-primary">{d.name}</td>
                  <td className="px-5 py-3 text-text-secondary tabular-nums">{d.volume}</td>
                  <td className="px-5 py-3 text-text-secondary tabular-nums">{d.sla}</td>
                  <td className="px-5 py-3 text-text-secondary tabular-nums">{d.active}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-surface-border shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-text-primary">Volume by Department</h2>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VOL_BY_DEPT}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="vol" fill="#F5820D" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-border shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-text-primary">Volume by Channel</h2>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VOL_BY_CHANNEL} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#999" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#999" width={50} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="new" stackId="a" fill="#10B981" />
                <Bar dataKey="open" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="resolved" stackId="a" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-border shadow-sm p-5 flex flex-col justify-center">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Channel Volume Overview <span className="text-text-muted font-normal capitalize">(Total 20 agents):</span></h2>
          <ul className="space-y-4">
            <li className="text-sm text-text-secondary"><strong className="text-text-primary font-semibold">Email</strong> | 1,100 (resolved)</li>
            <li className="text-sm text-text-secondary"><strong className="text-text-primary font-semibold">Chat</strong> | 650 (resolved)</li>
            <li className="text-sm text-text-secondary"><strong className="text-text-primary font-semibold">Phone</strong> | 370 (resolved)</li>
            <li className="text-sm text-text-secondary"><strong className="text-text-primary font-semibold">Other</strong> | 120 (resolved)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
