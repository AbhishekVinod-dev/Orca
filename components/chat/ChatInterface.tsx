'use client';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/lib/store/chatStore';
import { getMockResponse, AgentStep, ChatResponse } from '@/lib/mock/chatResponses';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestionChips from './SuggestionChips';
import ChatInput from './ChatInput';
import AgentPipeline from './AgentPipeline';
import { MapPin } from 'lucide-react';
import { useMapStore } from '@/lib/store/mapStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Consumes the backend's SSE stream (event: step / event: final), calling
// onStep as each pipeline stage completes. Throws on any failure so the
// caller can fall back to mock data.
async function streamChat(query: string, language: string, onStep: (step: AgentStep) => void): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, language }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`Chat request failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let final: ChatResponse | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';
    for (const block of blocks) {
      const eventLine = block.split('\n').find(l => l.startsWith('event: '));
      const dataLine = block.split('\n').find(l => l.startsWith('data: '));
      if (!eventLine || !dataLine) continue;
      const event = eventLine.slice('event: '.length);
      const data = JSON.parse(dataLine.slice('data: '.length));
      if (event === 'step') onStep(data as AgentStep);
      if (event === 'final') final = data as ChatResponse;
    }
  }

  if (!final) throw new Error('Chat stream ended without a final response');
  return final;
}

export default function ChatInterface() {
  const {
    conversations,
    activeConversationId,
    addMessage,
    updateLastMessage,
    createConversation,
    isThinking,
    setThinking,
    pushTraceStep,
    resetTrace,
    getActiveMessages,
  } = useChatStore();

  const { userLocation } = useMapStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = getActiveMessages();

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async (query: string) => {
    // Ensure we have a conversation
    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }

    // Add user message
    const userMsgId = Math.random().toString(36).slice(2);
    addMessage(convId, {
      id: userMsgId,
      role: 'user',
      content: query,
      timestamp: new Date(),
    });

    setThinking(true);
    resetTrace();

    try {
      let response: ChatResponse;
      if (API_URL) {
        response = await streamChat(query, 'en', step => pushTraceStep(step));
      } else {
        response = await getMockResponse(query);
        for (const step of response.agentTrace) {
          await new Promise(r => setTimeout(r, step.duration_ms + 100));
          pushTraceStep(step);
        }
      }

      setThinking(false);

      // Add streaming assistant message
      const assistantMsgId = Math.random().toString(36).slice(2);
      addMessage(convId, {
        id: assistantMsgId,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        agentTrace: response.agentTrace,
        isStreaming: true,
        relatedData: response.relatedData,
      });

      // Simulate streaming completion
      const streamDuration = Math.min(response.response.length * 12, 8000);
      await new Promise(r => setTimeout(r, streamDuration + 500));
      updateLastMessage(convId, response.response, true);
      resetTrace();
    } catch (err) {
      setThinking(false);
      resetTrace();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Location banner */}
      {userLocation && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2 border-b border-white/5 text-xs text-ocean-400"
        >
          <MapPin className="w-3 h-3 text-teal-500" />
          <span>Personalized for: <span className="text-teal-300">{userLocation.name}</span></span>
          <span className="ml-auto text-ocean-600">
            {userLocation.lat.toFixed(2)}°N, {userLocation.lng.toFixed(2)}°E
          </span>
        </motion.div>
      )}

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <SuggestionChips key="chips" onSelect={handleSend} />
          ) : (
            messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
        </AnimatePresence>

        {/* Thinking indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 text-lg">
              🌊
            </div>
            <div className="glass-strong rounded-2xl rounded-tl-sm border border-white/5 px-1">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
      </div>

      {/* Agent pipeline (shows during thinking) */}
      <AgentPipeline />

      {/* Input area */}
      <div className="px-4 pb-4 pt-2 border-t border-white/5">
        <ChatInput onSend={handleSend} disabled={isThinking} />
      </div>
    </div>
  );
}
