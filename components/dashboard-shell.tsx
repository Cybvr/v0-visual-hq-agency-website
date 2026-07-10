"use client"

import { type ReactNode } from "react"

import { AppSidebar, type NavLink } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BrandLockup } from "@/components/brand-lockup"

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
  children,
}: {
  title: string
  subtitle?: string
  navLinks: NavLink[]
  rootHref: string
  navExtra?: ReactNode
  children: ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar navLinks={navLinks} rootHref={rootHref} subtitle={subtitle} navExtra={navExtra} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <BrandLockup logoSize={20} gapClassName="gap-0.5" className="md:hidden" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
