"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, CircleHelp, Crown, Search, SlidersHorizontal } from "lucide-react"

import { AppSidebar, type NavLink } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BrandLockup } from "@/components/brand-lockup"
import { useAuth } from "@/components/auth-provider"
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
  const [search, setSearch] = useState("")
  const router = useRouter()
  const { isAdmin, isImpersonating } = useAuth()
  // While an admin is "viewing as" a client, the shell behaves as the client's.
  const adminView = isAdmin && !isImpersonating

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim().toLowerCase()
    if (!query) return
    const destinations = adminView
      ? [
          { terms: ["agent", "chat", "assistant"], href: "/dashboard/agent" },
          { terms: ["project"], href: "/dashboard/projects" },
          { terms: ["task"], href: "/dashboard/tasks" },
          { terms: ["drive", "file", "document"], href: "/dashboard/drive" },
          { terms: ["email", "mail", "message", "template", "sender"], href: "/dashboard/email" },
          { terms: ["seo", "ranking", "keyword"], href: "/dashboard/seo" },
          { terms: ["invoice", "billing", "payment", "finance"], href: "/dashboard/invoices" },
          { terms: ["contract", "agreement", "signature"], href: "/dashboard/contracts" },
          { terms: ["client", "company", "workspace"], href: "/dashboard/companies" },
          { terms: ["user", "account", "settings"], href: "/dashboard/users" },
        ]
      : [
          { terms: ["agent", "chat", "assistant"], href: "/dashboard/agent" },
          { terms: ["project"], href: "/dashboard/projects" },
          { terms: ["task"], href: "/dashboard/tasks" },
          { terms: ["drive", "file", "document"], href: "/dashboard/drive" },
          { terms: ["email", "mail", "message", "template", "sender"], href: "/dashboard/email" },
          { terms: ["seo", "ranking", "keyword"], href: "/dashboard/seo" },
          { terms: ["invoice", "billing", "payment", "finance"], href: "/dashboard/invoices" },
          { terms: ["contract", "agreement", "signature"], href: "/dashboard/contracts" },
        ]
    const match = destinations.find(({ terms }) => terms.some((term) => term.includes(query) || query.includes(term)))
    router.push(match?.href ?? "/dashboard")
  }

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
          <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-3 bg-background px-4 sm:px-6">
            <div className="flex shrink-0 items-center gap-2 md:hidden">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
              <BrandLockup logoSize={20} gapClassName="gap-0.5" />
            </div>
            <form onSubmit={handleSearch} className="relative mr-auto hidden w-full max-w-[260px] sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search dashboard"
                aria-label="Search dashboard"
                className="h-10 pl-9 pr-11"
              />
              <button type="submit" className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring" aria-label="Search dashboard">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
              </button>
            </form>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Link
                href="/pricing"
                aria-label="Upgrade"
                title="Upgrade"
                className="inline-flex size-10 items-center justify-center gap-1.5 rounded-full border border-border text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:w-auto sm:px-3.5"
              >
                <Crown className="size-4 sm:hidden" aria-hidden="true" />
                <span className="hidden sm:inline">Upgrade</span>
              </Link>
              <Link
                href="/faq"
                aria-label="Help"
                className="hidden size-10 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
              >
                <CircleHelp className="size-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                aria-label="Notifications"
                className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Bell className="size-4" aria-hidden="true" />
              </button>
              <Link
                href="/dashboard/agent"
                aria-label="Open Agent"
                className="hidden rounded-full bg-[linear-gradient(90deg,#c32cff,#6ed8ff)] p-[2px] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:inline-block"
              >
                <span className="flex h-9 items-center gap-2 rounded-full bg-[#110e2c] px-3 text-sm font-semibold text-white">
                  <Image src="/visualhqlogo.svg" alt="" width={18} height={18} className="brightness-0 invert" />
                  <span className="hidden sm:inline">Agent</span>
                </span>
              </Link>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
