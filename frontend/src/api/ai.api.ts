/**
 * AI API — Phase 2: real calls to /api/v1/ai/
 * All responses include { ai_available: boolean } — frontend always handles false gracefully.
 */
import type { AIAnalysis } from '@/types';
import apiClient from './client';

export async function analyseTicket(subject: string, description: string): Promise<AIAnalysis> {
  try {
    const res = await apiClient.post<AIAnalysis>('/ai/analyse/', { subject, description });
    return res.data;
  } catch {
    return { ai_available: false };
  }
}

export async function getTicketSummary(ticketId: number): Promise<AIAnalysis> {
  try {
    const res = await apiClient.get<AIAnalysis>(`/ai/tickets/${ticketId}/summary/`);
    return res.data;
  } catch {
    return { ai_available: false };
  }
}

export async function getResolutionSuggestion(ticketId: number): Promise<AIAnalysis> {
  try {
    const res = await apiClient.get<AIAnalysis>(`/ai/tickets/${ticketId}/resolution-suggestion/`);
    return res.data;
  } catch {
    return { ai_available: false };
  }
}

export async function getAIHealth(): Promise<{ ai_available: boolean; status: string }> {
  try {
    // Use plain fetch — health endpoint is public, no auth needed
    const res = await fetch(
      `${import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'}/api/v1/ai/health/`,
      { method: 'GET', signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return { ai_available: false, status: `HTTP ${res.status}` };
    const data = await res.json();
    return { ai_available: data.ai_available ?? false, status: data.status ?? 'ok' };
  } catch {
    return { ai_available: false, status: 'Unreachable' };
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  ai_available: boolean;
  message?: string;
  fallback_reason?: string;
  table_data?: {
    headers: string[];
    rows: string[][];
  };
}

export interface BulkAssignResult {
  ticket_id: number;
  ticket_number: string;
  subject: string;
  department: string;
  assignee_id: number;
  assignee_name: string;
}

export async function bulkAssign(
  params: { subject_contains?: string; problem_category?: string },
): Promise<{ assigned: BulkAssignResult[]; message: string }> {
  const res = await apiClient.post('/ai/bulk-assign/', params);
  return res.data;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  ticketId?: number,
): Promise<ChatResponse> {
  try {
    const res = await apiClient.post<ChatResponse>('/ai/chat/', {
      message,
      history,
      ...(ticketId ? { ticket_id: ticketId } : {}),
    });
    return res.data;
  } catch {
    return { ai_available: false, message: 'AI assistant is currently unavailable. Please use manual workflow.' };
  }
}
