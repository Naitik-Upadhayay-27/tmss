/**
 * ChatMessageRenderer
 *
 * Renders AI response text with proper visual formatting:
 * - CSV table blocks → styled table + Export .xlsx button
 * - "Key: Value" lines → styled label/value pairs in a card
 * - "- item" list lines → clean bullet list
 * - "1. item" numbered lines → numbered list
 * - Plain text paragraphs → normal text blocks
 * - Strips any leftover ** or * markdown artifacts
 */
import { utils, writeFile } from 'xlsx';

interface Props {
  text: string;
  isTyping?: boolean;
}

type Block =
  | { type: 'kv'; rows: { key: string; value: string }[] }
  | { type: 'bullets'; items: string[] }
  | { type: 'numbered'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'text'; content: string };

function clean(s: string): string {
  // Strip markdown bold/italic, trim
  return s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').trim();
}

// Detect if a run of lines looks like CSV (at least 2 lines, each has same comma count ≥ 1)
function isCsvBlock(lines: string[], start: number): number {
  const first = clean(lines[start]);
  const commas = (first.match(/,/g) || []).length;
  if (commas < 1) return 0;
  let end = start + 1;
  while (end < lines.length) {
    const l = clean(lines[end]);
    if (!l) break;
    if ((l.match(/,/g) || []).length !== commas) break;
    end++;
  }
  return end - start >= 2 ? end : 0;
}

function parseBlocks(text: string): Block[] {
  const lines = text.split('\n');
  const blocks: Block[] = [];

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = clean(raw);

    if (!line) { i++; continue; }

    // CSV table
    const csvEnd = isCsvBlock(lines, i);
    if (csvEnd) {
      const csvLines = lines.slice(i, csvEnd).map(l => clean(l).split(',').map(c => c.trim()));
      blocks.push({ type: 'table', headers: csvLines[0], rows: csvLines.slice(1) });
      i = csvEnd;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(clean(lines[i]))) {
        items.push(clean(lines[i]).replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push({ type: 'numbered', items });
      continue;
    }

    // Bullet list (- item)
    if (/^[-•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-•]\s/.test(clean(lines[i]))) {
        items.push(clean(lines[i]).replace(/^[-•]\s/, ''));
        i++;
      }
      blocks.push({ type: 'bullets', items });
      continue;
    }

    // Key-value block — consecutive "Key: value" lines
    if (/^[A-Z][A-Za-z ]+:\s.+/.test(line) || /^[A-Z][A-Za-z ]+:$/.test(line)) {
      const rows: { key: string; value: string }[] = [];
      while (i < lines.length) {
        const l = clean(lines[i]);
        const m = l.match(/^([A-Z][A-Za-z ]+):\s*(.*)$/);
        if (m) {
          rows.push({ key: m[1].trim(), value: m[2].trim() });
          i++;
        } else {
          break;
        }
      }
      if (rows.length > 0) {
        blocks.push({ type: 'kv', rows });
        continue;
      }
    }

    // Plain text
    const textLines: string[] = [];
    while (
      i < lines.length &&
      clean(lines[i]) &&
      !/^\d+\.\s/.test(clean(lines[i])) &&
      !/^[-•]\s/.test(clean(lines[i])) &&
      !/^[A-Z][A-Za-z ]+:\s/.test(clean(lines[i]))
    ) {
      textLines.push(clean(lines[i]));
      i++;
    }
    if (textLines.length > 0) {
      blocks.push({ type: 'text', content: textLines.join(' ') });
    }
  }

  return blocks;
}

// Priority / status badge colours
const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-green-100 text-green-700',
};
const STATUS_COLORS: Record<string, string> = {
  open:        'bg-indigo-100 text-indigo-700',
  assigned:    'bg-orange-100 text-orange-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved:    'bg-green-100 text-green-700',
  closed:      'bg-gray-100 text-gray-600',
  escalated:   'bg-rose-100 text-rose-700',
  on_hold:     'bg-purple-100 text-purple-700',
};

function ValueBadge({ label, keyName }: { label: string; keyName: string }) {
  const lk = keyName.toLowerCase();
  const lv = label.toLowerCase();
  const cls =
    lk === 'priority' ? PRIORITY_COLORS[lv] :
    lk === 'status'   ? STATUS_COLORS[lv]   : null;

  if (cls) {
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>
        {label}
      </span>
    );
  }
  return <span className="text-text-primary font-medium">{label || '—'}</span>;
}

function exportXlsx(headers: string[], rows: string[][], filename = 'export.xlsx') {
  const ws = utils.aoa_to_sheet([headers, ...rows]);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, filename);
}

export function ChatMessageRenderer({ text }: Props) {
  const blocks = parseBlocks(text);

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {blocks.map((block, bi) => {
        if (block.type === 'table') {
          const filename = text.toLowerCase().includes('sla') ? 'sla_report.xlsx'
            : text.toLowerCase().includes('ticket') ? 'tickets_report.xlsx'
            : 'report.xlsx';
          return (
            <div key={bi} className="rounded-lg border border-surface-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-brand-purple/10">
                      {block.headers.map((h, hi) => (
                        <th key={hi} className="px-2.5 py-1.5 text-left font-semibold text-brand-purple uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-surface-secondary/40'}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-2.5 py-1.5 text-text-primary">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-2.5 py-1.5 border-t border-surface-border bg-surface-secondary/30 flex justify-end">
                <button
                  onClick={() => exportXlsx(block.headers, block.rows, filename)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-purple text-white text-[10px] font-semibold hover:bg-brand-purple/90 transition-colors"
                >
                  ⬇ Export .xlsx
                </button>
              </div>
            </div>
          );
        }

        if (block.type === 'text') {
          return (
            <p key={bi} className="text-text-primary">
              {block.content}
            </p>
          );
        }

        if (block.type === 'bullets') {
          return (
            <ul key={bi} className="space-y-1 pl-1">
              {block.items.map((item, ii) => (
                <li key={ii} className="flex gap-2 items-start">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-purple/50 flex-shrink-0" />
                  <span className="text-text-primary">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'numbered') {
          return (
            <ol key={bi} className="space-y-1 pl-1">
              {block.items.map((item, ii) => (
                <li key={ii} className="flex gap-2 items-start">
                  <span className="flex-shrink-0 h-4 w-4 rounded-full bg-brand-purple/10 text-brand-purple text-[9px] font-bold flex items-center justify-center mt-0.5">
                    {ii + 1}
                  </span>
                  <span className="text-text-primary">{item}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === 'kv') {
          return (
            <div key={bi} className="rounded-lg border border-surface-border overflow-hidden">
              {block.rows.map((row, ri) => (
                <div
                  key={ri}
                  className={`flex items-start gap-2 px-2.5 py-1.5 ${
                    ri % 2 === 0 ? 'bg-surface-secondary/60' : 'bg-white'
                  }`}
                >
                  <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide w-24 flex-shrink-0 pt-0.5">
                    {row.key}
                  </span>
                  <span className="text-right ml-auto">
                    <ValueBadge label={row.value} keyName={row.key} />
                  </span>
                </div>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
