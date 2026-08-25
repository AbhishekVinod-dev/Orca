'use client';
// lib/store/chatStore.ts
import { create } from 'zustand';
import { AgentStep } from '@/lib/mock/chatResponses';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentTrace?: AgentStep[];
  isStreaming?: boolean;
  relatedData?: {
    pfzZones?: string[];
    alerts?: string[];
    coordinates?: [number, number];
    chartData?: { label: string; value: number }[];
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isThinking: boolean;
  currentAgentTrace: AgentStep[];
  activeTraceStep: number;

  createConversation: () => string;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateLastMessage: (conversationId: string, content: string, done?: boolean) => void;
  setThinking: (val: boolean) => void;
  setAgentTrace: (trace: AgentStep[]) => void;
  advanceTraceStep: () => void;
  resetTrace: () => void;
  getActiveMessages: () => Message[];
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isThinking: false,
  currentAgentTrace: [],
  activeTraceStep: -1,

  createConversation: () => {
    const id = generateId();
    const conv: Conversation = {
      id,
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set(s => ({ conversations: [conv, ...s.conversations], activeConversationId: id }));
    return id;
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (conversationId, message) => {
    set(s => ({
      conversations: s.conversations.map(c => {
        if (c.id !== conversationId) return c;
        const msgs = [...c.messages, message];
        const title = c.messages.length === 0 && message.role === 'user'
          ? message.content.slice(0, 48)
          : c.title;
        return { ...c, messages: msgs, title, updatedAt: new Date() };
      }),
    }));
  },

  updateLastMessage: (conversationId, content, done = false) => {
    set(s => ({
      conversations: s.conversations.map(c => {
        if (c.id !== conversationId) return c;
        const msgs = [...c.messages];
        const last = msgs[msgs.length - 1];
        if (last && last.role === 'assistant') {
          msgs[msgs.length - 1] = { ...last, content, isStreaming: !done };
        }
        return { ...c, messages: msgs };
      }),
    }));
  },

  setThinking: (val) => set({ isThinking: val }),

  setAgentTrace: (trace) => set({ currentAgentTrace: trace, activeTraceStep: 0 }),

  advanceTraceStep: () => {
    set(s => ({
      activeTraceStep: Math.min(s.activeTraceStep + 1, s.currentAgentTrace.length - 1),
    }));
  },

  resetTrace: () => set({ currentAgentTrace: [], activeTraceStep: -1 }),

  getActiveMessages: () => {
    const { conversations, activeConversationId } = get();
    const conv = conversations.find(c => c.id === activeConversationId);
    return conv?.messages || [];
  },
}));
