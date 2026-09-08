"use client"

import { AgentChat } from "@/components/agent/agent-chat"
import { useAgent } from "@/components/agent/agent-context"

export default function AgentPage() {
  const { messages, sending, firstName, send } = useAgent()

  return <AgentChat messages={messages} sending={sending} firstName={firstName} onSend={send} />
}
