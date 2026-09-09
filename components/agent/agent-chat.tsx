"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { ArrowUp, Loader2 } from "lucide-react"

import type { AgentMessage } from "@/components/agent/agent-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/**
 * The agent conversation surface, shared by the full-page route and the
 * dashboard dock. `compact` tightens spacing for the narrow docked panel.
 */
export function AgentChat({
  messages,
  sending,
  firstName,
  onSend,
  compact = false,
}: {
  messages: AgentMessage[]
  sending: boolean
  firstName: string
  onSend: (text: string) => void
  compact?: boolean
}) {
  const [input, setInput] = useState("")
  const transcriptEnd = useRef<HTMLDivElement>(null)
  // The last assistant message is empty while its stream is still arriving.
  const streaming = sending && messages[messages.length - 1]?.content === ""

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, sending])

  function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    const content = input.trim()
    if (!content || sending) return
    onSend(content)
    setInput("")
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 pb-16 text-center sm:px-6">
          <div className="flex max-w-lg flex-col items-center">
            <Image src="/visualhqlogo.svg" alt="" width={compact ? 36 : 48} height={compact ? 36 : 48} priority />
            <h1 className={cn("mt-6 font-sans tracking-[-0.02em]", compact ? "text-xl" : "text-2xl sm:text-3xl")}>
              Hello {firstName}
            </h1>
            <p className={cn("mt-2 text-muted-foreground", compact ? "text-sm" : "text-base sm:text-lg")}>
              How can I help you today?
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "scrollbar-none mx-auto flex w-full flex-1 flex-col overflow-y-auto",
            compact ? "gap-5 px-4 py-5" : "max-w-3xl gap-7 px-4 py-8 sm:px-6",
          )}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex w-full", message.role === "user" ? "justify-end" : "items-start gap-3")}
            >
              {message.role === "assistant" && (
                <Image src="/visualhqlogo.svg" alt="" width={28} height={28} className="mt-0.5 shrink-0" />
              )}
              {message.role === "assistant" && !message.content ? (
                <span className="flex items-center gap-2 pt-1 text-sm text-muted-foreground" role="status" aria-live="polite">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Thinking
                </span>
              ) : (
                <p
                  className={cn(
                    "whitespace-pre-wrap leading-6",
                    compact ? "max-w-[88%] text-sm" : "max-w-[85%] text-sm sm:text-base",
                    message.role === "user"
                      ? "rounded-[16px] rounded-br-[4px] bg-foreground px-4 py-2.5 text-background"
                      : "pt-0.5 text-foreground",
                  )}
                >
                  {message.content}
                </p>
              )}
            </div>
          ))}
          <div ref={transcriptEnd} />
        </div>
      )}

      <div className={cn("shrink-0 bg-background", compact ? "px-4 pb-4 pt-2" : "px-4 pb-5 pt-3 sm:px-6 sm:pb-7")}>
        <form
          onSubmit={submit}
          className={cn(
            "mx-auto flex w-full items-end gap-3 rounded-[16px] border border-border bg-background p-2.5 focus-within:border-ring",
            compact ? "" : "max-w-3xl",
          )}
        >
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask VisualCNS"
            aria-label="Message the agent"
            className="max-h-40 min-h-11 resize-none border-0 bg-transparent px-2 py-2.5 shadow-none focus-visible:border-transparent focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={!input.trim() || streaming}
            className="size-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
  )
}
