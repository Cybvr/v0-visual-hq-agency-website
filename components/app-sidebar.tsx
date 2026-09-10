"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import type { ComponentType, ReactNode } from "react"

import { useAuth } from "@/components/auth-provider"
import { BrandLockup } from "@/components/brand-lockup"
import { SidebarSearch } from "@/components/dashboard/sidebar-search"
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
  "text-[13px] font-medium max-md:h-12 max-md:gap-3 max-md:px-3 max-md:text-sm [&>svg]:max-md:size-5"
const mobileNavSubButton =
  "text-[13px] font-medium max-md:h-11 max-md:gap-3 max-md:px-3 max-md:text-sm [&>svg]:max-md:size-5"

export type NavLink = {
  label: string
  /** Optional section label displayed before this navigation item. */
  sectionLabel?: string
  href: string
  icon: ComponentType<{ className?: string }>
  /** Admin destinations remain visible to admins while previewing another account. */
  adminOnly?: boolean
  /** When present the item is a collapsible dropdown and href is only its default destination. */
  items?: Array<{ label: string; href: string; icon: ComponentType<{ className?: string }>; adminOnly?: boolean }>
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
  const { isImpersonating, stopViewingAs } = useAuth()
  const { isMobile, setOpenMobile } = useSidebar()

  // Tapping a destination on mobile should dismiss the slide-over sheet.
  function handleNavigate(adminOnly = false) {
    // Admin tools open in the signed-in account; client pages keep the preview.
    if (adminOnly && isImpersonating) stopViewingAs()
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
      <div className="group/sidebar m-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] bg-card text-[13px] font-medium text-muted-foreground [&_*]:text-muted-foreground! group-data-[collapsible=icon]:m-1 group-data-[collapsible=icon]:rounded-[12px]">
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
            <SidebarTrigger className="size-8 shrink-0 opacity-0 transition-opacity group-hover/sidebar:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
          </div>
          <SidebarSearch />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:p-1">
            <SidebarMenu>
              {navLinks.map((link) => (
                <React.Fragment key={link.href}>
                  {link.sectionLabel && (
                    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
                      <p className="px-2 pb-1 pt-4 text-xs font-medium text-muted-foreground">{link.sectionLabel}</p>
                    </SidebarMenuItem>
                  )}
                {link.items ? (
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
                                <Link href={item.href} onClick={() => handleNavigate(item.adminOnly)}>
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
                      <Link href={link.href} onClick={() => handleNavigate(link.adminOnly)}>
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                </React.Fragment>
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
