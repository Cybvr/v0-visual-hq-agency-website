"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"

import { AppSidebar, type NavLink } from "@/components/app-sidebar"
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
 * block: SidebarProvider > AppSidebar + SidebarInset with a header trigger.
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
          { terms: ["project"], href: "/dashboard/projects" },
          { terms: ["task"], href: "/dashboard/tasks" },
          { terms: ["drive", "file", "document"], href: "/dashboard/drive" },
          { terms: ["portfolio", "work"], href: "/dashboard/portfolio" },
          { terms: ["marketing", "social"], href: "/dashboard/marketing" },
          { terms: ["user", "client", "settings"], href: "/dashboard/users" },
        ]
      : [
          { terms: ["project"], href: "/dashboard/projects" },
          { terms: ["task"], href: "/dashboard/tasks" },
          { terms: ["drive", "file", "document"], href: "/dashboard/drive" },
          { terms: ["marketing", "social"], href: "/dashboard/marketing" },
        ]
    const match = destinations.find(({ terms }) => terms.some((term) => term.includes(query) || query.includes(term)))
    router.push(match?.href ?? "/dashboard")
  }

  return (
    // h-svh + overflow-hidden: the shell never grows taller than the viewport,
    // so the body never scrolls. Only SidebarInset (overflow-y-auto) scrolls.
    <div className="flex h-svh flex-col overflow-hidden">
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
          <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-3 border-b bg-[#f8fafd]/95 px-4 backdrop-blur-md dark:bg-background/95 sm:px-6">
            <div className="flex shrink-0 items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
              <BrandLockup logoSize={20} gapClassName="gap-0.5" className="md:hidden" />
            </div>
            <form onSubmit={handleSearch} className="mx-auto hidden h-12 min-w-0 max-w-3xl flex-1 items-center rounded-[28px] bg-[#e9eef6] px-4 text-[#3c4043] transition-shadow focus-within:shadow-sm dark:bg-muted dark:text-foreground sm:flex">
              <Search className="h-5 w-5 shrink-0" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search dashboard" aria-label="Search dashboard" className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground" />
              <button type="submit" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10" aria-label="Search filters"><SlidersHorizontal className="h-5 w-5" /></button>
            </form>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
