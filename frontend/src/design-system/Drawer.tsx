import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Drawer({ isOpen, onClose, title, children, width = 'w-96' }: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className="absolute inset-0 bg-[#0F1120]/40 backdrop-blur-[1px] animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div className={`relative flex flex-col ${width} max-w-full bg-white shadow-modal h-full animate-slide-up`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border flex-shrink-0">
          <h2 id="drawer-title" className="text-base font-bold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-all"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>
      </div>
    </div>,
    document.body
  );
}
