"use client";

import { IntelligenceChat } from '../../components/chat/IntelligenceChat';
import { ContextPanel } from '../../components/layout/ContextPanel';

export default function WorkspacePage() {
  return (
    <div className="flex w-full h-full bg-space-950">
      <IntelligenceChat />
      <ContextPanel />
    </div>
  );
}
