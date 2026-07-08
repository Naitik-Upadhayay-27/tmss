import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Send, X, Bot, RefreshCw, WifiOff, Trash2, GripVertical, FileDown } from 'lucide-react';
import { sendChatMessage, getAIHealth, bulkAssign } from '@/api/ai.api';
import type { ChatMessage } from '@/api/ai.api';
import { ChatMessageRenderer } from './ChatMessageRenderer';
import { utils, writeFile } from 'xlsx';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  displayText: string;
  timestamp: Date;
  ai_available?: boolean;
  typing?: boolean;
  table_data?: { headers: string[]; rows: string[][] };
  filename?: string;
}

const STORAGE_KEY = 'fatakpay-copilot-messages';
const MIN_WIDTH = 300;
const MAX_WIDTH = 700;

const WELCOME_MSG: Message = {
  id: 'welcome',
  sender: 'ai',
  text: 'Hello! I am your FatakPay TMS Copilot. I can analyze ticket loads, predict SLA breaches, and recommend assignments. What would you like to check?',
  displayText: 'Hello! I am your FatakPay TMS Copilot. I can analyze ticket loads, predict SLA breaches, and recommend assignments. What would you like to check?',
  timestamp: new Date(),
  ai_available: true,
  typing: false,
};

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MSG];
    const parsed = JSON.parse(raw) as Message[];
    return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp), typing: false }));
  } catch {
    return [WELCOME_MSG];
  }
}

function saveMessages(msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.map(m => ({ ...m, typing: false }))));
  } catch { /* quota exceeded */ }
}

const COMMON_TASKS = [
  { label: 'Summarize open tickets', query: 'Give me a summary of all currently open tickets across departments.' },
  { label: 'Active workload analysis', query: 'Which departments have the highest active ticket load right now?' },
  { label: 'SLA breach risk', query: 'Which tickets are at risk of breaching SLA soon?' },
  { label: 'Unassigned tickets', query: 'List all unassigned tickets and suggest who should handle them.' },
];

// Detect bulk-assign intent and extract the filter keyword from the user message
function detectBulkAssign(text: string): { subject_contains?: string; problem_category?: string } | null {
  const t = text.toLowerCase();
  if (!t.includes('assign')) return null;
  // Extract quoted phrase or "with problem X" / "with subject X"
  const quotedMatch = text.match(/["']([^"']+)["']/);
  if (quotedMatch) return { subject_contains: quotedMatch[1] };
  const problemMatch = text.match(/problem[\s-]+([\w\s&]+?)(?:\s+among|\s+to|\s+equally|$)/i);
  if (problemMatch) return { problem_category: problemMatch[1].trim() };
  const subjectMatch = text.match(/subject[\s:]+([\w\s]+?)(?:\s+among|\s+to|\s+equally|$)/i);
  if (subjectMatch) return { subject_contains: subjectMatch[1].trim() };
  return null;
}

function toApiHistory(messages: Message[]): ChatMessage[] {
  return messages
    .filter((m) => m.id !== 'welcome')
    .slice(-20)
    .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
}

function inferFilename(userText: string): string {
  const t = userText.toLowerCase();
  if (t.includes('sla')) return 'sla_report.xlsx';
  if (t.includes('workload')) return 'workload_report.xlsx';
  if (t.includes('unassigned')) return 'unassigned_tickets.xlsx';
  return 'report.xlsx';
}

function triggerDownload(headers: string[], rows: string[][], filename: string) {
  const ws = utils.aoa_to_sheet([headers, ...rows]);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, filename);
}

interface AIAssistantPanelProps {
  ticketId?: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  width: number;
  onWidthChange: (w: number) => void;
}

export function AIAssistantPanel({ ticketId, isOpen, onOpen, onClose, width, onWidthChange }: AIAssistantPanelProps) {
  const [aiOnline, setAiOnline] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => loadMessages());
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => { saveMessages(messages); }, [messages]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Drag-to-resize ──────────────────────────────────────────────────────────
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartWidth.current + delta));
      onWidthChange(next);
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onWidthChange]);
  // ────────────────────────────────────────────────────────────────────────────

  const startTypewriter = (msgId: string, fullText: string) => {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    let pos = 0;
    typewriterRef.current = setInterval(() => {
      pos = Math.min(pos + 3, fullText.length);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, displayText: fullText.slice(0, pos), typing: pos < fullText.length } : m,
        ),
      );
      if (pos >= fullText.length) { clearInterval(typewriterRef.current!); typewriterRef.current = null; }
    }, 16);
  };

  useEffect(() => () => { if (typewriterRef.current) clearInterval(typewriterRef.current); }, []);

  useEffect(() => {
    let mounted = true;
    const check = async () => { const h = await getAIHealth(); if (mounted) setAiOnline(h.ai_available); };
    check();
    const id = setInterval(check, 30_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: crypto.randomUUID(), sender: 'user', text, displayText: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // ── Bulk assign intent ──────────────────────────────────────────────────
    const assignParams = detectBulkAssign(text);
    if (assignParams) {
      try {
        const result = await bulkAssign(assignParams);
        const lines = result.assigned.length
          ? result.assigned.map(a => `${a.ticket_number}: ${a.subject} → ${a.assignee_name} (${a.department})`).join('\n')
          : 'No matching tickets found.';
        const summary = `${result.message}\n\n${lines}`;
        const msgId = crypto.randomUUID();
        setMessages((prev) => [...prev, { id: msgId, sender: 'ai', text: summary, displayText: '', timestamp: new Date(), ai_available: true, typing: true }]);
        setTimeout(() => startTypewriter(msgId, summary), 30);
      } catch {
        const errText = 'Failed to assign tickets. Please check your permissions and try again.';
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: errText, displayText: errText, timestamp: new Date(), ai_available: false, typing: false }]);
      } finally {
        setIsTyping(false);
      }
      return;
    }
    // ── Regular chat ────────────────────────────────────────────────────────
    try {
      const history = toApiHistory([...messages]);
      const result = await sendChatMessage(text, history, ticketId);

      const filename = inferFilename(text);
      if (result.table_data) {
        triggerDownload(result.table_data.headers, result.table_data.rows, filename);
      }

      const aiText = result.ai_available && result.message
        ? result.message
        : result.message ?? 'AI assistant is temporarily unavailable. Please use manual workflow.';

      const newMsgId = crypto.randomUUID();
      setMessages((prev) => [...prev, {
        id: newMsgId,
        sender: 'ai',
        text: aiText,
        displayText: '',
        timestamp: new Date(),
        ai_available: result.ai_available,
        typing: true,
        table_data: result.table_data,
        filename,
      }]);
      setTimeout(() => startTypewriter(newMsgId, aiText), 30);
      setAiOnline(result.ai_available ?? false);
    } catch {
      const errText = 'Unable to reach the AI assistant. Please check your connection and try again.';
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: errText, displayText: errText, timestamp: new Date(), ai_available: false, typing: false }]);
      setAiOnline(false);
    } finally {
      setIsTyping(false);
    }
  };

  const statusChip = () => {
    if (aiOnline === null) return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-500 border border-gray-200">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse" />Connecting...
      </span>
    );
    if (aiOnline) return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />AI Engine Online · Groq LLM
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <WifiOff className="h-2.5 w-2.5" />AI Offline — Manual Mode
      </span>
    );
  };

  return (
    <>
      {/* FAB — only when panel is closed */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-purple text-white shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center z-40 transition-all duration-300 border-2 border-white/20 group"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-6 w-6 text-white group-hover:text-accent-orange transition-colors" />
          <span className="absolute inset-0 rounded-full animate-ping bg-brand-purple/30 pointer-events-none" />
        </button>
      )}

      {/* Side panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white border-l border-surface-border shadow-xl flex flex-col z-30 transition-transform duration-300 ease-out rounded-tl-2xl rounded-bl-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width }}
      >
        {/* Drag handle */}
        <div
          onMouseDown={onMouseDown}
          className="absolute left-0 top-0 h-full w-1 cursor-col-resize group hover:bg-brand-purple/20 transition-colors z-10 flex items-center justify-center"
          title="Drag to resize"
        >
          <GripVertical className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Header */}
        <div className="bg-brand-purple text-white px-4 py-3 flex items-center justify-between flex-shrink-0 rounded-tl-2xl">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-accent-orange" />
            </div>
            <div>
              <h3 className="text-sm font-bold">TMS Copilot</h3>
              <p className="text-[10px] text-white/60">
                {ticketId ? `Viewing ticket #${ticketId}` : 'Powered by Groq · Llama 3.1'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { localStorage.removeItem(STORAGE_KEY); setMessages([WELCOME_MSG]); }}
              className="h-7 w-7 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onClose}
              className="h-7 w-7 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
              aria-label="Close AI Assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin bg-surface-secondary/30 relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
            <div className="flex flex-col items-center gap-1 opacity-[0.045]">
              <div className="text-5xl font-black tracking-tight leading-none">
                <span className="text-brand-purple">फटाक</span>
                <span className="text-brand-orange">PAY</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-purple">TMS Copilot</span>
            </div>
          </div>

          <div className="flex justify-center">{statusChip()}</div>

          {aiOnline === false && (
            <div className="mx-1 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-700 flex items-center gap-1.5">
              <WifiOff className="h-3 w-3 flex-shrink-0" />
              AI is offline. You can still send messages — they'll be answered when AI comes back online.
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="h-6 w-6 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="h-3 w-3 text-brand-purple" />
                </div>
              )}
              <div className={`px-3 py-2 rounded-2xl max-w-[85%] shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-brand-purple text-white rounded-br-sm text-xs leading-relaxed'
                  : msg.ai_available === false
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 rounded-bl-sm text-xs leading-relaxed'
                  : 'bg-white text-text-primary rounded-bl-sm border border-surface-border'
              }`}>
                {msg.sender === 'user' ? msg.displayText : (
                  <>
                    <ChatMessageRenderer text={msg.displayText} />
                    {msg.typing && <span className="inline-block w-1 h-3 ml-0.5 bg-brand-purple/60 animate-pulse rounded-sm align-middle" />}
                    {/* Re-download button for excel responses */}
                    {!msg.typing && msg.table_data && (
                      <button
                        onClick={() => triggerDownload(msg.table_data!.headers, msg.table_data!.rows, msg.filename ?? 'report.xlsx')}
                        className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-purple text-white text-[10px] font-semibold hover:bg-brand-purple/90 transition-colors"
                      >
                        <FileDown className="h-3 w-3" />
                        Download {msg.filename ?? 'report.xlsx'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className="h-6 w-6 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-3 w-3 text-brand-purple" />
              </div>
              <div className="bg-white border border-surface-border px-3 py-2 rounded-2xl rounded-bl-sm text-xs text-text-muted flex items-center gap-1.5 shadow-sm">
                <RefreshCw className="h-3 w-3 animate-spin text-brand-purple" />Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick actions — only before first user message */}
        {!messages.some(m => m.sender === 'user') && (
          <div className="px-3 py-2 border-t border-surface-border bg-white flex-shrink-0">
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Quick Actions</p>
            <div className="grid grid-cols-2 gap-1">
              {COMMON_TASKS.map((task, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(task.query)}
                  disabled={isTyping}
                  className="text-left px-2 py-1.5 rounded-lg border border-surface-border hover:border-brand-purple hover:bg-brand-purple-faint text-[10px] text-text-secondary hover:text-brand-purple transition-all truncate disabled:opacity-50"
                >
                  {task.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-surface-border bg-white flex-shrink-0 rounded-bl-2xl">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
            className="flex items-center gap-2 bg-surface-secondary border border-surface-border rounded-xl px-3 py-2 focus-within:border-brand-purple focus-within:ring-1 focus-within:ring-brand-purple/30"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Copilot anything..."
              className="flex-1 bg-transparent text-xs text-text-primary focus:outline-none placeholder:text-text-muted"
              disabled={isTyping}
              aria-label="Message input"
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="h-7 w-7 rounded-full bg-brand-purple text-white flex items-center justify-center hover:bg-brand-purple/90 transition-colors disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
