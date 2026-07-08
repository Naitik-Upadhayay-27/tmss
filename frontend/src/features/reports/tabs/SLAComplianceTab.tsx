import { useState } from 'react';
import { Calendar, PenLine, Trash2, Settings, Shield, Clock } from 'lucide-react';

type Tab = 'thresholds' | 'exceptions' | 'targets';

export function SLAComplianceTab() {
  const [tab, setTab] = useState<Tab>('thresholds');

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'thresholds', label: 'Thresholds', icon: Settings },
    { id: 'exceptions', label: 'Exceptions & Hours', icon: Calendar },
    { id: 'targets', label: 'Global Targets', icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">SLA Compliance Settings</h2>
          <p className="text-xs text-text-muted mt-1">Configure SLA parameters across all departments</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted">Apply to:</span>
          <select className="bg-transparent border border-surface-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-purple">
            <option>Global (All Departments)</option>
            <option>Engineering</option>
            <option>Insurance</option>
          </select>
        </div>
      </div>

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

      {/* Thresholds tab */}
      {tab === 'thresholds' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-purple" />
              Standard Response & Resolution
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-2">First Response Target</label>
                <div className="flex items-center gap-2">
                  <select className="border border-surface-border rounded-lg h-9 px-3 text-sm focus:outline-none focus:border-brand-purple flex-1">
                    <option>15 mins</option>
                    <option>30 mins</option>
                    <option>1 hr</option>
                  </select>
                  <span className="text-xs text-text-muted whitespace-nowrap">during business hours</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Standard Resolution</label>
                <div className="flex items-center gap-2">
                  <select className="border border-surface-border rounded-lg h-9 px-3 text-sm focus:outline-none focus:border-brand-purple flex-1">
                    <option>24 hrs</option>
                    <option>48 hrs</option>
                    <option>72 hrs</option>
                  </select>
                  <select className="border border-surface-border rounded-lg h-9 px-3 text-sm focus:outline-none focus:border-brand-purple bg-surface-secondary/50">
                    <option>Business Days</option>
                    <option>Calendar Days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
             <div className="px-5 py-4 border-b border-surface-border">
                <h3 className="text-sm font-semibold text-text-primary">SLA Definitions by Priority</h3>
                <p className="text-xs text-text-muted mt-1">Override standard times for specific priorities</p>
             </div>
            
             <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-secondary border-b border-surface-border">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide w-32">Priority</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Description</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Target Time</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Metric</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {[
                    { p: 'Critical', color: 'bg-red-500', desc: 'Complete failure, immediate attention.', val: 15, type: 'response' },
                    { p: 'High', color: 'bg-orange-500', desc: 'Severe degradation of service.', val: 4, type: 'resolution' },
                    { p: 'Medium', color: 'bg-yellow-500', desc: 'Partial impact, workarounds available.', val: 24, type: 'resolution' },
                    { p: 'Low', color: 'bg-blue-500', desc: 'Minor issue or general inquiry.', val: 48, type: 'resolution' },
                  ].map(item => (
                    <tr key={item.p} className="hover:bg-surface-secondary/50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 font-semibold">
                           <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                           {item.p}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{item.desc}</td>
                      <td className="px-5 py-3">
                         <div className="flex items-center gap-1">
                            <input type="text" defaultValue={item.val} className="w-12 h-8 border border-surface-border rounded text-center focus:outline-none focus:border-brand-purple" />
                            <span className="text-xs text-text-muted">{item.val > 20 ? 'hrs' : 'mins'}</span>
                         </div>
                      </td>
                      <td className="px-5 py-3">
                        <select className="h-8 border border-surface-border rounded text-xs focus:outline-none bg-surface-secondary/50" defaultValue={item.type}>
                          <option value="response">Response</option>
                          <option value="resolution">Resolution</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
          <div className="flex justify-end">
            <button className="h-9 px-4 rounded-lg bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purple/90 transition-colors shadow-sm">
              Save Thresholds
            </button>
          </div>
        </div>
      )}

      {/* Exceptions tab */}
      {tab === 'exceptions' && (
        <div className="space-y-5">
           <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Business Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Timezone</label>
                   <select className="w-full h-9 border border-surface-border rounded-lg px-3 text-sm focus:outline-none focus:border-brand-purple">
                     <option>Asia/Kolkata (IST)</option>
                     <option>America/New_York (EST)</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Working Hours</label>
                   <div className="flex items-center gap-2">
                     <select className="border border-surface-border rounded-lg h-9 px-3 text-sm focus:outline-none focus:border-brand-purple flex-1">
                       <option>09:00 AM</option>
                     </select>
                     <span className="text-text-muted text-xs">to</span>
                     <select className="border border-surface-border rounded-lg h-9 px-3 text-sm focus:outline-none focus:border-brand-purple flex-1">
                       <option>06:00 PM</option>
                     </select>
                   </div>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-surface-border">
               <label className="block text-xs font-semibold text-text-muted uppercase mb-3">Working Days</label>
               <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                     <button key={day} className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${['Sat', 'Sun'].includes(day) ? 'border-surface-border text-text-muted bg-surface-secondary/50' : 'border-brand-purple/30 bg-brand-purple-faint text-brand-purple'}`}>
                        {day}
                     </button>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-text-primary">Exception Rules</h3>
              <button className="text-xs text-brand-purple font-semibold hover:underline">
                + Add Rule
              </button>
            </div>
            <div className="space-y-3">
              <div className="border border-surface-border rounded-lg p-4 flex items-center justify-between bg-surface-secondary/20">
                <span className="text-sm text-text-secondary font-medium">If Ticket Status is 'On Hold' for more than 48 hrs, pause Resolution SLA</span>
                <button className="h-8 w-8 rounded flex items-center justify-center text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="border border-surface-border rounded-lg p-4 flex items-center justify-between bg-surface-secondary/20">
                <span className="text-sm text-text-secondary font-medium">Pause when assigned agent is 'Away'</span>
                <div className="w-10 h-5 bg-brand-purple rounded-full relative shadow-inner cursor-pointer">
                  <div className="absolute left-5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="h-9 px-4 rounded-lg bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purple/90 transition-colors shadow-sm">
              Save Exceptions
            </button>
          </div>
        </div>
      )}

      {/* Targets tab */}
      {tab === 'targets' && (
        <div className="space-y-5">
           <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Performance Targets</h3>
            <p className="text-sm text-text-secondary mb-6">
               Set your global organization goals for SLA compliance.
            </p>

            <div className="space-y-6">
              <div>
                 <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-text-primary">Target Global Compliance</span>
                    <span className="font-bold text-teal-600">95%</span>
                 </div>
                 <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-[95%]" />
                 </div>
              </div>

              <div>
                 <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-text-primary">Minimum Acceptable</span>
                    <span className="font-bold text-amber-600">85%</span>
                 </div>
                 <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[85%]" />
                 </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="h-9 px-4 rounded-lg bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purple/90 transition-colors shadow-sm flex items-center gap-2">
              <PenLine className="h-4 w-4" /> Edit Targets
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
