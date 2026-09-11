"use client"

import Image from "next/image"
import { History, Plus, X } from "lucide-react"

import { AgentChat } from "@/components/agent/agent-chat"
import { useAgent } from "@/components/agent/agent-context"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Right-docked Ngai side panel — shared between the portal and dashboard shells.
 *
 * Mirrors the left Sidebar's fixed+gap pattern exactly:
 *  - A gap div (inside the SidebarProvider flex row) animates its width to
 *    push the main content left.
 *  - A fixed inset-y-0 right-0 h-svh panel is pinned to the right edge so it
 *    always fills exactly the viewport height with no overflow issues.
 *
 * Props:
 *  - hidden  — when true the panel collapses to w-0 (e.g. portal hides it on
 *              the dedicated /ngai full-page route).
 */
export function NgaiSidePanel({ hidden = false }: { hidden?: boolean }) {
  const {
    open,
    setOpen,
    messages,
    conversations,
    activeConversationId,
    sending,
    firstName,
    send,
    reset,
    selectConversation,
  } = useAgent()

  const visible = open && !hidden
  const hasMessages = messages.length > 0

  return (
    <>
      {/* Gap div — animates width inside the SidebarProvider flex row to push content left */}
      <div
        aria-hidden="true"
        className={cn(
          "hidden md:block shrink-0 transition-[width] duration-200 ease-linear",
          visible ? "w-80 lg:w-[26rem]" : "w-0",
        )}
      />

      {/* Fixed panel pinned to right edge — always exactly h-svh */}
      <div
        data-slot="ngai-panel"
        aria-label="Ngai Assistant"
        className={cn(
          "fixed inset-y-0 right-0 z-10 hidden md:flex h-svh flex-col bg-card shadow-[-4px_0_12px_rgba(0,0,0,0.04)]",
          "transition-[width] duration-200 ease-linear overflow-hidden",
          visible ? "w-80 lg:w-[26rem]" : "w-0",
        )}
      >
        {/* Inner wrapper is fixed-width so content never reflows during the animation */}
        <div className="flex h-full w-80 lg:w-[26rem] min-w-0 flex-col overflow-hidden">
          <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Image src="/ngai-logo.png" alt="" width={20} height={20} className="rounded-full" />
              <span>Ngai <span className="font-normal text-muted-foreground">/ Chat</span></span>
            </div>
            <div className="flex items-center gap-1">
              {/* Plus — new chat */}
              <button
                type="button"
                onClick={reset}
                aria-label="New chat"
                title="New chat"
                disabled={sending}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
              {/* History — beside plus */}
              {conversations.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="Chat history"
                      title="Chat history"
                      className="flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <History className="size-4" aria-hidden="true" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="max-h-72 w-60 overflow-y-auto">
                    {conversations.map((conversation) => (
                      <DropdownMenuItem
                        key={conversation.id}
                        onSelect={() => selectConversation(conversation.id)}
                        className={cn("truncate", conversation.id === activeConversationId && "font-medium")}
                      >
                        {conversation.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {/* Close */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Ngai"
                title="Close Ngai"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
            <AgentChat
              messages={messages}
              conversations={conversations}
              activeConversationId={activeConversationId}
              sending={sending}
              firstName={firstName}
              onSend={send}
              onSelectConversation={selectConversation}
              onNewChat={reset}
              compact
            />
          </div>
        </div>
      </div>
    </>
  )
}
