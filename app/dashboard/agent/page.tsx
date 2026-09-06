"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { ArrowUp, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Message = {
  id: number
  role: "user" | "assistant"
  content: string
}

function getPrototypeReply(message: string, firstName: string) {
  const prompt = message.toLowerCase()

  if (/^(hi|hello|hey)\b/.test(prompt)) {
    return `Hello ${firstName}. What would you like to work on?`
  }

  if (prompt.includes("what can you do") || prompt.includes("help me")) {
    return "I can help you think through projects, tasks, email, and shared files. This prototype keeps the conversation in this browser session."
  }

  return "I’ve captured your request. This prototype demonstrates the chat flow; connect it to an agent endpoint for generated answers."
}

export default function AgentPage() {
  const { appUser, user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [replying, setReplying] = useState(false)
  const nextId = useRef(1)
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const transcriptEnd = useRef<HTMLDivElement>(null)

  const displayName = appUser?.displayName || appUser?.company || user?.displayName || "there"
  const firstName = displayName.split(" ")[0]

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, replying])

  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current)
    }
  }, [])

  function sendMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    const content = input.trim()
    if (!content || replying) return

    const userMessage: Message = { id: nextId.current++, role: "user", content }
    setMessages((current) => [...current, userMessage])
    setInput("")
    setReplying(true)

    replyTimer.current = setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: getPrototypeReply(content, firstName),
        },
      ])
      setReplying(false)
      replyTimer.current = null
    }, 450)
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-background">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 pb-24 text-center sm:px-6">
          <div className="flex max-w-lg flex-col items-center">
            <Image src="/visualhqlogo.svg" alt="" width={48} height={48} priority />
            <h1 className="mt-7 font-sans text-2xl tracking-[-0.02em] sm:text-3xl">
              Hello {firstName}
            </h1>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">How can I help you today?</p>
          </div>
        </div>
      ) : (
        <div className="scrollbar-none mx-auto flex w-full max-w-3xl flex-1 flex-col gap-7 overflow-y-auto px-4 py-8 sm:px-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "items-start gap-3",
              )}
            >
              {message.role === "assistant" && (
                <Image src="/visualhqlogo.svg" alt="" width={28} height={28} className="mt-0.5 shrink-0" />
              )}
              <p
                className={cn(
                  "max-w-[85%] text-sm leading-6 sm:text-base",
                  message.role === "user"
                    ? "rounded-[16px] rounded-br-[4px] bg-foreground px-4 py-2.5 text-background"
                    : "pt-0.5 text-foreground",
                )}
              >
                {message.content}
              </p>
            </div>
          ))}
          {replying && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground" role="status" aria-live="polite">
              <Image src="/visualhqlogo.svg" alt="" width={28} height={28} className="shrink-0" />
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Agent is responding</span>
            </div>
          )}
          <div ref={transcriptEnd} />
        </div>
      )}

      <div className="shrink-0 bg-background px-4 pb-5 pt-3 sm:px-6 sm:pb-7">
        <form
          onSubmit={sendMessage}
          className="mx-auto flex w-full max-w-3xl items-end gap-3 rounded-[16px] border border-border bg-background p-2.5 focus-within:border-ring"
        >
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            rows={1}
            placeholder="Ask VisualCNS"
            aria-label="Message the agent"
            className="max-h-40 min-h-11 resize-none border-0 bg-transparent px-2 py-2.5 shadow-none focus-visible:border-transparent focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={!input.trim() || replying}
            className="size-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </main>
  )
}
