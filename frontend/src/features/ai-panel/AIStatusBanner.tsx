import { Bot, AlertTriangle } from 'lucide-react';

interface AIStatusBannerProps {
  available: boolean;
}

export function AIStatusBanner({ available }: AIStatusBannerProps) {
  if (available) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-brand-purple-faint rounded-lg text-sm text-brand-purple">
        <Bot className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span>AI Assistant active</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700"
      role="status"
    >
      <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>AI Unavailable — Use Manual Mode</span>
    </div>
  );
}
