"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import type { ComponentType, ReactNode } from "react"

import { BrandLockup } from "@/components/brand-lockup"
import { NavUser } from "@/components/nav-user"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

// On mobile the sidebar is a slide-over sheet, so nav rows need finger-sized
// hit areas. max-md: keeps the desktop rail untouched.
const mobileNavButton =
  "max-md:h-12 max-md:gap-3 max-md:px-3 max-md:text-base [&>svg]:max-md:size-5"
const mobileNavSubButton =
  "max-md:h-11 max-md:gap-3 max-md:px-3 max-md:text-base [&>svg]:max-md:size-5"

export type NavLink = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
  /** When present the item is a collapsible dropdown and href is only its default destination. */
  items?: Array<{ label: string; href: string; icon: ComponentType<{ className?: string }> }>
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
  const { isMobile, setOpenMobile } = useSidebar()

  // Tapping a destination on mobile should dismiss the slide-over sheet.
  function handleNavigate() {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "bg-background text-muted-foreground group-data-[side=left]:border-r-0 [&_[data-slot=sidebar-inner]]:bg-background",
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
              {navLinks.map((link) =>
                link.items ? (
                  <Collapsible
                    key={link.label}
                    asChild
                    defaultOpen={link.items.some((item) => isActive(pathname, item.href, rootHref))}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={link.label} className={mobileNavButton}>
                          <link.icon className="h-4 w-4" />
                          <span>{link.label}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {link.items.map((item) => (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton asChild isActive={isActive(pathname, item.href, rootHref)} className={mobileNavSubButton}>
                                <Link href={item.href} onClick={handleNavigate}>
                                  <item.icon className="h-4 w-4" />
                                  <span>{item.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton asChild isActive={isActive(pathname, link.href, rootHref)} tooltip={link.label} className={mobileNavButton}>
                      <Link href={link.href} onClick={handleNavigate}>
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
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
