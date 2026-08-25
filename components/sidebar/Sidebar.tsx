'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/lib/store/chatStore';
import Link from 'next/link';
import { Plus, MessageCircle, Waves, Fish, Wind, AlertTriangle, Navigation, ChevronLeft } from 'lucide-react';

const quickActions = [
  { icon: Fish, label: 'PFZ near me', query: 'Where are the best fishing zones near me today?' },
  { icon: Wind, label: 'Safe tomorrow?', query: 'Is it safe to go fishing tomorrow?' },
  { icon: AlertTriangle, label: 'Cyclone alerts', query: 'What are the active cyclone warnings?' },
  { icon: Navigation, label: 'Safe route', query: 'Find me a safe route from Chennai to Rameswaram' },
];

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { conversations, activeConversationId, setActiveConversation, createConversation, addMessage } = useChatStore();

  const handleQuickAction = (query: string) => {
    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }
    // Trigger a message send via store
    addMessage(convId, {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: query,
      timestamp: new Date(),
    });
  };

  return (
    <div className="h-full flex flex-col glass-panel" style={{ width: 260 }}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Waves className="w-4 h-4 text-teal-400" />
          <span className="font-display font-semibold text-sm text-ocean-100">Conversations</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-ocean-500 hover:text-ocean-300 transition-colors rounded"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* New conversation button */}
      <div className="p-3 border-b border-white/5">
        <button
          onClick={() => createConversation()}
          className="w-full flex items-center gap-2 px-3 py-2.5 glass rounded-xl text-teal-300 hover:bg-teal-400/10 border border-teal-400/20 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      {/* Quick actions */}
      <div className="p-3 border-b border-white/5">
        <p className="text-xs text-ocean-500 mb-2 px-1 font-medium uppercase tracking-wider">Quick Ask</p>
        <div className="flex flex-col gap-1">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => handleQuickAction(a.query)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-ocean-300 hover:text-teal-300 hover:bg-white/5 transition-all text-xs text-left w-full"
            >
              <a.icon className="w-3.5 h-3.5 shrink-0 text-teal-500" />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation history */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs text-ocean-500 mb-2 px-1 font-medium uppercase tracking-wider">History</p>
        <AnimatePresence>
          {conversations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-ocean-600 text-xs py-8"
            >
              No conversations yet.<br />Start asking ORCA!
            </motion.div>
          )}
          {conversations.map((conv) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full flex items-start gap-2 px-3 py-2.5 rounded-lg text-left transition-all mb-1 ${
                activeConversationId === conv.id
                  ? 'bg-teal-400/10 border border-teal-400/20 text-ocean-100'
                  : 'text-ocean-400 hover:bg-white/5 hover:text-ocean-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{conv.title}</p>
                <p className="text-[10px] text-ocean-600 mt-0.5">
                  {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                </p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-ocean-500 hover:text-ocean-300 hover:bg-white/5 transition-colors text-xs"
        >
          <Waves className="w-3.5 h-3.5" />
          ORCA v1.0 · SIH 2026
        </Link>
      </div>
    </div>
  );
}
