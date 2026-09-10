"use client"

import { AgentChat } from "@/components/agent/agent-chat"
import { useAgent } from "@/components/agent/agent-context"

export default function AgentPage() {
  const { messages, conversations, activeConversationId, sending, firstName, send, reset, selectConversation } = useAgent()

  return <AgentChat messages={messages} conversations={conversations} activeConversationId={activeConversationId} sending={sending} firstName={firstName} onSend={send} onSelectConversation={selectConversation} onNewChat={reset} />
}
