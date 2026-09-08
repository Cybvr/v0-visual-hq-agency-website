"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react"

import { useAuth } from "@/components/auth-provider"

export type AgentMessage = {
  id: number
  role: "user" | "assistant"
  content: string
}

interface AgentContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  messages: AgentMessage[]
  sending: boolean
  firstName: string
  send: (text: string) => void
  reset: () => void
}

const AgentContext = createContext<AgentContextValue | null>(null)

export function AgentProvider({ children }: { children: ReactNode }) {
  const { appUser, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [sending, setSending] = useState(false)
  const nextId = useRef(1)

  const displayName = appUser?.displayName || appUser?.company || user?.displayName || "there"
  const firstName = displayName.split(" ")[0]

  const send = useCallback(
    (text: string) => {
      const content = text.trim()
      if (!content || sending) return

      const userMessage: AgentMessage = { id: nextId.current++, role: "user", content }
      const assistantId = nextId.current++
      const history = [...messages, userMessage]

      setMessages([...history, { id: assistantId, role: "assistant", content: "" }])
      setSending(true)

      const payload = history.map(({ role, content: c }) => ({ role, content: c }))

      void (async () => {
        try {
          const response = await fetch("/api/agent", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ messages: payload, firstName }),
          })

          if (!response.ok || !response.body) {
            const message =
              response.status === 503
                ? "The assistant is not set up yet. Add a Gemini API key to enable it."
                : "Sorry, I could not respond just now. Please try again."
            setMessages((current) =>
              current.map((m) => (m.id === assistantId ? { ...m, content: message } : m)),
            )
            return
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let acc = ""
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            acc += decoder.decode(value, { stream: true })
            setMessages((current) =>
              current.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
            )
          }
          if (!acc.trim()) {
            setMessages((current) =>
              current.map((m) =>
                m.id === assistantId ? { ...m, content: "I did not catch that. Could you rephrase?" } : m,
              ),
            )
          }
        } catch {
          setMessages((current) =>
            current.map((m) =>
              m.id === assistantId ? { ...m, content: "Something went wrong reaching the assistant." } : m,
            ),
          )
        } finally {
          setSending(false)
        }
      })()
    },
    [messages, sending, firstName],
  )

  const reset = useCallback(() => setMessages([]), [])
  const toggle = useCallback(() => setOpen((current) => !current), [])

  const value = useMemo(
    () => ({ open, setOpen, toggle, messages, sending, firstName, send, reset }),
    [open, toggle, messages, sending, firstName, send, reset],
  )

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
}

export function useAgent(): AgentContextValue {
  const context = useContext(AgentContext)
  if (!context) throw new Error("useAgent must be used inside an AgentProvider")
  return context
}
