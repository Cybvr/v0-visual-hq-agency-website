"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react"
import { ArrowUp, History, Loader2 } from "lucide-react"

import type { AgentConversation, AgentForm, AgentMessage } from "@/components/agent/agent-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/** Inline markdown in one line of an agent reply: bold, italic, code, links. */
function formatInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g
  let last = 0
  let index = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const token = match[0]
    const key = `${keyPrefix}-${index++}`
    if (token.startsWith("**")) {
      nodes.push(<strong key={key} className="font-semibold">{token.slice(2, -2)}</strong>)
    } else if (token.startsWith("`")) {
      nodes.push(<code key={key} className="rounded bg-muted px-1 py-0.5 text-[0.9em]">{token.slice(1, -1)}</code>)
    } else if (token.startsWith("[")) {
      const link = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(token)
      const internal = link ? link[2].startsWith("/") : false
      nodes.push(
        link ? (
          <a
            key={key}
            href={link[2]}
            {...(internal ? {} : { target: "_blank", rel: "noreferrer" })}
            className="font-medium underline underline-offset-4"
          >
            {link[1]}
          </a>
        ) : (
          token
        ),
      )
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>)
    }
    last = match.index + token.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/** The markdown the agent actually returns: paragraphs, bullet and numbered lists. */
function AgentMarkdown({ content }: { content: string }) {
  const blocks: ReactNode[] = []
  let bullets: string[] = []
  let numbers: string[] = []

  function flushBullets() {
    if (!bullets.length) return
    const items = bullets
    const at = blocks.length
    bullets = []
    blocks.push(
      <ul key={`ul-${at}`} className="list-disc space-y-1 pl-5">
        {items.map((item, i) => (
          <li key={i}>{formatInline(item, `ul-${at}-${i}`)}</li>
        ))}
      </ul>,
    )
  }

  function flushNumbers() {
    if (!numbers.length) return
    const items = numbers
    const at = blocks.length
    numbers = []
    blocks.push(
      <ol key={`ol-${at}`} className="list-decimal space-y-1 pl-5">
        {items.map((item, i) => (
          <li key={i}>{formatInline(item, `ol-${at}-${i}`)}</li>
        ))}
      </ol>,
    )
  }

  for (const line of content.split("\n")) {
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    const numbered = /^\s*\d+\.\s+(.*)$/.exec(line)
    if (bullet) {
      flushNumbers()
      bullets.push(bullet[1])
      continue
    }
    if (numbered) {
      flushBullets()
      numbers.push(numbered[1])
      continue
    }
    flushBullets()
    flushNumbers()
    if (line.trim()) blocks.push(<p key={`p-${blocks.length}`}>{formatInline(line, `p-${blocks.length}`)}</p>)
  }
  flushBullets()
  flushNumbers()

  return <div className="space-y-3">{blocks}</div>
}

/**
 * The inline form the agent sends instead of listing required fields in prose.
 * Submitting sends the answers back as the user's next message.
 */
function AgentFormCard({ form, disabled, onSubmit }: { form: AgentForm; disabled: boolean; onSubmit: (text: string) => void }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const field = form.fields[step]
  const total = form.fields.length
  const value = field ? values[field.id] ?? "" : ""
  const answered = value.trim().length > 0

  function commit(nextValues: Record<string, string>) {
    if (step + 1 < total) {
      setStep(step + 1)
      return
    }
    setDone(true)
    const lines = form.fields
      .map((item) => ({ item, answer: nextValues[item.id]?.trim() }))
      .filter((entry) => entry.answer)
      .map((entry) => `${entry.item.label}: ${entry.answer}`)
    onSubmit(lines.length ? lines.join("\n") : "Skip the questions, I'll say it in my own words.")
  }

  function answer(next: string) {
    const nextValues = { ...values, [field.id]: next }
    setValues(nextValues)
    commit(nextValues)
  }

  if (done || !field) return null

  return (
    <div className="mt-3 w-full rounded-[16px] border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 font-medium">{field.label}</p>
        {total > 1 && (
          <span className="shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">
            {step + 1} of {total}
          </span>
        )}
      </div>

      <div className="mt-3">
        {field.type === "select" && field.options?.length ? (
          <Select value={value} onValueChange={(next) => answer(next)} disabled={disabled}>
            <SelectTrigger className="h-9 w-full text-sm">
              <SelectValue placeholder={field.placeholder ?? `Choose ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === "textarea" ? (
          <Textarea
            autoFocus
            value={value}
            onChange={(event) => setValues({ ...values, [field.id]: event.target.value })}
            placeholder={field.placeholder ?? undefined}
            disabled={disabled}
            className="min-h-16 text-sm"
          />
        ) : (
          <Input
            autoFocus
            type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
            value={value}
            onChange={(event) => setValues({ ...values, [field.id]: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter" && answered) {
                event.preventDefault()
                commit(values)
              }
            }}
            placeholder={field.placeholder ?? undefined}
            disabled={disabled}
            className="h-9 text-sm"
          />
        )}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={() => commit(values)}>
          Skip
        </Button>
        {field.type !== "select" && (
          <Button type="button" size="sm" disabled={disabled || !answered} onClick={() => commit(values)}>
            {step + 1 < total ? "Next" : "Done"}
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * The agent conversation surface, shared by the full-page route and the
 * dashboard dock. `compact` tightens spacing for the narrow docked panel.
 */
export function AgentChat({
  messages,
  conversations,
  activeConversationId,
  sending,
  firstName,
  onSend,
  onSelectConversation,
  onNewChat,
  compact = false,
}: {
  messages: AgentMessage[]
  conversations: AgentConversation[]
  activeConversationId: string
  sending: boolean
  firstName: string
  onSend: (text: string) => void
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  compact?: boolean
}) {
  const startingOptions = [
    "Create an invoice",
    "Create an estimate",
    "Create a contract",
    "Add a company",
    "Create a project",
    "Create a task",
    "How many projects do I have?",
  ]
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
    <div className="dashboard-body flex min-h-0 flex-1 flex-col bg-background font-sans [&_*]:font-sans">
      <div className={cn("shrink-0 border-b border-border", compact ? "px-4 py-3" : "px-4 py-4 sm:px-6")}>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onNewChat}
            disabled={sending}
            className="text-xs font-medium underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            New chat
          </button>
          {conversations.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Chat history"
                  className="flex size-7 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <History className="size-4" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-72 w-60 overflow-y-auto">
                {conversations.map((conversation) => (
                  <DropdownMenuItem
                    key={conversation.id}
                    onSelect={() => onSelectConversation(conversation.id)}
                    className={cn("truncate", conversation.id === activeConversationId && "font-medium")}
                  >
                    {conversation.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {messages.length === 0 ? (
        <div className={cn("flex min-h-0 flex-1 items-center justify-center overflow-y-auto text-center", compact ? "px-4 py-6" : "px-4 pb-16 sm:px-6")}>
          <div className="flex max-w-lg flex-col items-center">
            <Image src="/ngai-logo.png" alt="Ngai" width={compact ? 36 : 48} height={compact ? 36 : 48} priority />
            <h1 className={cn("mt-6 font-sans tracking-[-0.02em]", compact ? "text-xl" : "text-2xl sm:text-3xl")}>
              Hello {firstName}
            </h1>
            <p className={cn("mt-2 text-muted-foreground", compact ? "text-sm" : "text-base sm:text-lg")}>
              What would you like to do?
            </p>
            <div className={cn("mt-6 flex flex-wrap justify-center gap-2", compact ? "max-w-[18rem]" : "max-w-xl")}>
              {startingOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSend(option)}
                  disabled={sending}
                  className="rounded-full border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "scrollbar-none mx-auto flex w-full min-h-0 flex-1 flex-col overflow-y-auto",
            compact ? "gap-5 px-4 py-5" : "max-w-3xl gap-7 px-4 py-8 sm:px-6",
          )}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex w-full", message.role === "user" ? "justify-end" : "items-start gap-3")}
            >
              {message.role === "assistant" && (
                <Image src="/ngai-logo.png" alt="Ngai" width={28} height={28} className="mt-0.5 shrink-0 rounded-full" />
              )}
              {message.role === "assistant" && !message.content ? (
                <span className="flex items-center gap-2 pt-1 text-sm text-muted-foreground" role="status" aria-live="polite">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Thinking
                </span>
              ) : (
                <div
                  className={cn(
                    "leading-6",
                    compact ? "max-w-[88%] text-sm" : "max-w-[85%] text-sm",
                    message.role === "user"
                      ? "whitespace-pre-wrap rounded-[16px] rounded-br-[4px] bg-card px-4 py-2.5 text-foreground"
                      : "pt-0.5 text-foreground",
                  )}
                >
                  {message.role === "user" ? message.content : <AgentMarkdown content={message.content} />}
                  {message.form && (
                    <AgentFormCard form={message.form} disabled={sending} onSubmit={onSend} />
                  )}
                </div>
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
            placeholder="Ask Ngai"
            aria-label="Message Ngai"
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
