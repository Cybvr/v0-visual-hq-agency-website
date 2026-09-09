"use client"

import Image from "next/image"
import { RotateCcw, X } from "lucide-react"

import { AgentChat } from "@/components/agent/agent-chat"
import { useAgent } from "@/components/agent/agent-context"
import { cn } from "@/lib/utils"

function DockHeader({ onReset, onClose, showReset }: { onReset: () => void; onClose: () => void; showReset: boolean }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Image src="/visualhqlogo.svg" alt="" width={20} height={20} />
        Agent
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
          aria-label="Close agent"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/**
 * The dashboard-wide assistant surface: a docked panel on desktop and a
 * full-screen sheet on mobile, both driven by the shared AgentProvider.
 */
export function AgentDock() {
  const { open, setOpen, messages, sending, firstName, send, reset } = useAgent()
  const hasMessages = messages.length > 0

  return (
    <>
      {/* Desktop: right-docked panel. Width is matched by the shell's padding. */}
      <aside
        aria-hidden={!open}
        className={cn(
          "fixed right-0 top-0 z-40 hidden h-svh w-[26rem] flex-col border-l border-border bg-background shadow-xl transition-transform duration-300 lg:flex",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        <DockHeader onReset={reset} onClose={() => setOpen(false)} showReset={hasMessages} />
        <AgentChat messages={messages} sending={sending} firstName={firstName} onSend={send} compact />
      </aside>

      {/* Mobile: full-screen sheet. */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <DockHeader onReset={reset} onClose={() => setOpen(false)} showReset={hasMessages} />
          <AgentChat messages={messages} sending={sending} firstName={firstName} onSend={send} compact />
        </div>
      )}
    </>
  )
}
