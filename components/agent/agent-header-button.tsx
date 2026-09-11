"use client"

import Image from "next/image"

import { useAgent } from "@/components/agent/agent-context"
import { cn } from "@/lib/utils"

/** Shared desktop header trigger for the dashboard and client portal. */
export function AgentHeaderButton({ className }: { className?: string }) {
  const { open, setOpen } = useAgent()

  if (open) return null

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Ask Ngai"
      className={cn(
        "hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex",
        className,
      )}
    >
      <Image src="/ngai-logo.png" alt="" width={16} height={16} className="rounded-full" />
      Ask Ngai
    </button>
  )
}
