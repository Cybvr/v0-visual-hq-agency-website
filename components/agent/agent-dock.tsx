"use client"

import Image from "next/image"
import { RotateCcw, X } from "lucide-react"

import { AgentChat } from "@/components/agent/agent-chat"
import { useAgent } from "@/components/agent/agent-context"

function DockHeader({ onReset, onClose, showReset }: { onReset: () => void; onClose: () => void; showReset: boolean }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Image src="/ngai-logo.png" alt="" width={20} height={20} className="rounded-full" />
        Ngai
      </span>
      <div className="flex items-center gap-1">
        {showReset && (
          <button
            type="button"
            onClick={onReset}
            aria-label="New chat"
            title="New chat"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Ngai"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/**
 * The dashboard-wide assistant surface: a floating widget on desktop and a
 * full-screen sheet on mobile, both driven by the shared AgentProvider.
 */
export function AgentDock() {
  const { open, setOpen, messages, conversations, activeConversationId, sending, firstName, send, reset, selectConversation } = useAgent()
  const hasMessages = messages.length > 0

  if (!open) return null

  return (
    <>
      {/* Desktop: floating widget that leaves the dashboard layout unchanged. */}
      <aside
        aria-label="Ngai"
        className="fixed bottom-5 right-5 z-50 hidden h-[40rem] max-h-[calc(100svh-7rem)] w-[26rem] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl lg:flex"
      >
        <DockHeader onReset={reset} onClose={() => setOpen(false)} showReset={hasMessages} />
        <AgentChat messages={messages} conversations={conversations} activeConversationId={activeConversationId} sending={sending} firstName={firstName} onSend={send} onSelectConversation={selectConversation} onNewChat={reset} compact />
      </aside>

      {/* Mobile: full-screen sheet. */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <DockHeader onReset={reset} onClose={() => setOpen(false)} showReset={hasMessages} />
          <AgentChat messages={messages} conversations={conversations} activeConversationId={activeConversationId} sending={sending} firstName={firstName} onSend={send} onSelectConversation={selectConversation} onNewChat={reset} compact />
        </div>
      )}
    </>
  )
}
