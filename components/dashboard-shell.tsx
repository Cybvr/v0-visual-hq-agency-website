"use client"

import { type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, CircleHelp, Crown } from "lucide-react"

import { useAgent } from "@/components/agent/agent-context"
import { AppSidebar, type NavLink } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { dashboardPageTitle } from "@/components/dashboard/dashboard-document-title"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export type { NavLink }

/**
 * Shared dashboard layout (admin + client), built on the shadcn sidebar-07
 * block: SidebarProvider > AppSidebar + SidebarInset with a mobile opener.
 */
export function DashboardShell({
  subtitle,
  navLinks,
  rootHref,
  navExtra,
  banner,
  children,
}: {
  title: string
  subtitle?: string
  navLinks: NavLink[]
  rootHref: string
  navExtra?: ReactNode
  /** Full-width strip pinned above the whole shell (sidebar included). Keep it h-10. */
  banner?: ReactNode
  children: ReactNode
}) {
  const pathname = usePathname()
  const { open: agentOpen, setOpen: setAgentOpen } = useAgent()
  // The company detail page carries its own banner, so the sticky dashboard
  // header would just duplicate it.
  const hideHeader = /^\/dashboard\/companies\/[^/]+/.test(pathname ?? "")

  return (
    // h-svh + overflow-hidden: the shell never grows taller than the viewport,
    // so the body never scrolls. Only SidebarInset (overflow-y-auto) scrolls.
    <div className="flex h-svh flex-col overflow-hidden font-sans [&_*]:font-sans">
      {banner && <div className="z-50 h-10 shrink-0">{banner}</div>}
      <SidebarProvider
        className={cn(
          "min-h-0 flex-1",
          banner && "[&_[data-slot=sidebar-container]]:top-10 [&_[data-slot=sidebar-container]]:h-[calc(100svh-2.5rem)]"
        )}
      >
        <AppSidebar navLinks={navLinks} rootHref={rootHref} subtitle={subtitle} navExtra={navExtra} />
        {/* overflow-y-auto: this column is the scroll container, not the body */}
        <SidebarInset className="overflow-y-auto">
          {!hideHeader && (
          <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 bg-background px-4 text-[13px] font-medium text-muted-foreground max-md:text-sm">
            <div className="flex shrink-0 items-center gap-2 md:hidden">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
            </div>
            <h1 className="min-w-0 truncate text-[13px] font-medium text-muted-foreground max-md:text-sm">{dashboardPageTitle(pathname ?? "/dashboard")}</h1>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Button asChild variant="outline" className="text-[13px] font-medium text-muted-foreground max-md:text-sm">
                <Link href="/pricing" aria-label="Upgrade" title="Upgrade">
                  <Crown className="size-4 sm:hidden" aria-hidden="true" />
                  <span className="hidden sm:inline">Upgrade</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Link href="/faq" aria-label="Help">
                  <CircleHelp className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="size-4" aria-hidden="true" />
              </Button>
              <button
                type="button"
                onClick={() => setAgentOpen(true)}
                aria-label="Open Agent"
                aria-expanded={agentOpen}
                className="inline-flex rounded-full bg-[linear-gradient(90deg,#c32cff,#6ed8ff)] p-[2px] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex h-9 items-center gap-2 rounded-full bg-[#110e2c] px-3 text-sm font-semibold text-white">
                  <Image src="/visualhqlogo.svg" alt="" width={18} height={18} className="brightness-0 invert" />
                  <span className="hidden sm:inline">Agent</span>
                </span>
              </button>
            </div>
          </header>
          )}
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
