import { useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AIAssistantPanel } from '@/features/ai-panel/AIAssistantPanel';

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiPanelWidth, setAiPanelWidth] = useState(360);

  const ticketMatch = useMatch('/tickets/:id');
  const ticketId = ticketMatch?.params.id ? Number(ticketMatch.params.id) : undefined;

  return (
    <div className="flex h-screen bg-surface-secondary overflow-hidden relative">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto scrollbar-thin focus:outline-none"
          tabIndex={-1}
        >
          <div className="px-6 py-5 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <AIAssistantPanel
        ticketId={ticketId}
        isOpen={aiPanelOpen}
        onOpen={() => setAiPanelOpen(true)}
        onClose={() => setAiPanelOpen(false)}
        width={aiPanelWidth}
        onWidthChange={setAiPanelWidth}
      />
    </div>
  );
}
