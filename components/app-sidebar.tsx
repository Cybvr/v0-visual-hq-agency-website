"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentType, ReactNode } from "react"

import { BrandLockup } from "@/components/brand-lockup"
import { NavUser } from "@/components/nav-user"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export type NavLink = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

function isActive(pathname: string, href: string, rootHref: string) {
  return href === rootHref ? pathname === rootHref : pathname.startsWith(href)
}

export function AppSidebar({
  navLinks,
  rootHref,
  subtitle,
  navExtra,
  className,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navLinks: NavLink[]
  rootHref: string
  subtitle?: string
  navExtra?: ReactNode
}) {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "bg-background group-data-[side=left]:border-r-0 [&_[data-slot=sidebar-inner]]:bg-background",
        className,
      )}
      {...props}
    >
      <div className="m-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-border/60 bg-card group-data-[collapsible=icon]:m-1 group-data-[collapsible=icon]:rounded-[12px]">
        <SidebarHeader className="group-data-[collapsible=icon]:p-1">
          <div className="flex h-12 items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <SidebarMenu className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href={rootHref}>
                    <BrandLockup logoSize={24} gapClassName="gap-1" />
                    {subtitle && <span className="truncate text-xs text-muted-foreground">{subtitle}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarTrigger className="size-8 shrink-0" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:p-1">
            <SidebarMenu>
              {navLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild isActive={isActive(pathname, link.href, rootHref)} tooltip={link.label}>
                    <Link href={link.href}>
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {navExtra && <div className="mt-2 group-data-[collapsible=icon]:hidden">{navExtra}</div>}
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="group-data-[collapsible=icon]:p-1">
          <NavUser />
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>
  )
}
