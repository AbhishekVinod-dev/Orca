'use client';
import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Globe } from 'lucide-react';

interface ChatInputProps {
  onSend: (query: string) => void;
  disabled?: boolean;
}

const languages = ['English', 'हिंदी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी', 'ಕನ್ನಡ', 'മലയാളം'];

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [lang, setLang] = useState('English');
  const [showLang, setShowLang] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  // TODO: implement actual voice input with Web Speech API
  const handleMic = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SR = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
        (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
      if (!SR) return;
      const recognition = new SR();
      recognition.lang = 'en-IN';
      recognition.onresult = (ev: SpeechRecognitionEvent) => {
        setValue(ev.results[0][0].transcript);
      };
      recognition.start();
    } else {
      alert('Voice input not supported in this browser. Try Chrome.');
    }
  };

  return (
    <div className="relative">
      {/* Language selector */}
      {showLang && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-2 left-0 glass-strong border border-white/10 rounded-xl overflow-hidden z-50"
        >
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setShowLang(false); }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                lang === l ? 'text-teal-300 bg-teal-400/10' : 'text-ocean-300 hover:bg-white/5'
              }`}
            >
              {l}
            </button>
          ))}
        </motion.div>
      )}

      <div className={`flex items-end gap-2 glass-strong rounded-2xl border ${
        disabled ? 'border-white/5 opacity-60' : 'border-teal-400/20 focus-within:border-teal-400/40'
      } transition-all duration-200 p-2`}>
        {/* Language button */}
        <button
          onClick={() => setShowLang(v => !v)}
          className="shrink-0 mb-1 flex items-center gap-1 px-2 py-1.5 rounded-lg text-ocean-400 hover:text-teal-300 hover:bg-white/5 transition-colors text-xs"
          title="Select language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang}</span>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => { setValue(e.target.value); handleInput(); }}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="Ask ORCA anything... PFZ near me, cyclone alerts, safe routes, sea conditions..."
          rows={1}
          className="flex-1 bg-transparent resize-none text-ocean-100 placeholder-ocean-600 text-sm outline-none py-2 min-h-[36px] max-h-40 leading-relaxed"
        />

        {/* Mic */}
        <button
          onClick={handleMic}
          disabled={disabled}
          className="shrink-0 mb-1 w-8 h-8 rounded-lg flex items-center justify-center text-ocean-400 hover:text-teal-300 hover:bg-white/5 transition-colors"
          title="Voice input"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className={`shrink-0 mb-1 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            value.trim() && !disabled
              ? 'bg-teal-500 text-ocean-950 hover:bg-teal-400 hover:scale-105'
              : 'bg-ocean-800 text-ocean-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-[10px] text-ocean-600 mt-1.5">
        ORCA uses satellite data & AI — verify critical decisions with official agencies.
      </p>
    </div>
  );
}
