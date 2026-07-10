"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentType, ReactNode } from "react"

import { BrandLockup } from "@/components/brand-lockup"
import { NavUser } from "@/components/nav-user"
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
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navLinks: NavLink[]
  rootHref: string
  subtitle?: string
  navExtra?: ReactNode
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={rootHref}>
                <BrandLockup logoSize={24} gapClassName="gap-1" textClassName="group-data-[collapsible=icon]:hidden" />
                {subtitle && (
                  <span className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    {subtitle}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
