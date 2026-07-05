"use client"

import { useEffect, useState, type ComponentType, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, PanelLeft, PanelLeftClose } from "lucide-react"
import { BrandLockup } from "@/components/brand-lockup"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

const COLLAPSE_STORAGE_KEY = "dashboardSidebarCollapsed"

export type NavLink = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

function isActive(pathname: string, href: string, rootHref: string) {
  return href === rootHref ? pathname === rootHref : pathname.startsWith(href)
}

/** The full sidebar contents, reused by the desktop rail and the mobile Sheet. */
function SidebarContent({
  title,
  subtitle,
  navLinks,
  rootHref,
  navExtra,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: {
  title: string
  subtitle?: string
  navLinks: NavLink[]
  rootHref: string
  navExtra?: ReactNode
  collapsed?: boolean
  onToggleCollapse?: () => void
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <>
      <div className={cn("flex items-center py-5", collapsed ? "justify-center px-3" : "gap-1.5 px-5")}>
        <Link
          href={rootHref}
          onClick={onNavigate}
          className={cn("flex min-w-0 items-center", collapsed ? "justify-center" : "gap-1.5")}
        >
          <BrandLockup
            logoSize={26}
            gapClassName={collapsed ? "gap-0" : "gap-1"}
            textClassName={collapsed ? "hidden" : undefined}
          />
        </Link>
        {!collapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            className="ml-auto h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {collapsed && onToggleCollapse && (
        <div className="flex justify-center px-3 pb-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            title={collapsed ? link.label : undefined}
            className={cn(
              "flex items-center rounded-lg py-2 text-sm transition-colors",
              collapsed ? "justify-center px-0" : "gap-3 px-3",
              isActive(pathname, link.href, rootHref)
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            {!collapsed && link.label}
          </Link>
        ))}
        {!collapsed && navExtra}
      </nav>

      <div className="border-t border-border p-3">
        <div className={cn("flex items-center rounded-lg py-2", collapsed ? "flex-col gap-2" : "gap-3 px-2")}>
          {user?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={user.displayName ?? "Account"}
              className="h-8 w-8 shrink-0 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="h-8 w-8 shrink-0 rounded-full bg-muted" />
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{user?.displayName ?? "Account"}</div>
              <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            aria-label="Sign out"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}

/**
 * Shared sidebar dashboard layout used by both the admin dashboard and the
 * client dashboard. Desktop shows a fixed rail that can collapse to an
 * icon-only strip; mobile shows a hamburger that opens the same sidebar in a
 * Sheet.
 */
export function DashboardShell({
  title,
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
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Restore the collapsed preference on mount (kept out of the initial state to
  // avoid an SSR/client hydration mismatch).
  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true")
  }, [])

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next))
      return next
    })
  }

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-black/5 bg-white/88 shadow-[0_18px_40px_rgba(15,23,42,0.07)] backdrop-blur-sm transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <SidebarContent
          title={title}
          subtitle={subtitle}
          navLinks={navLinks}
          rootHref={rootHref}
          navExtra={navExtra}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
        />
      </aside>

      {/* Mobile top bar with hamburger -> Sheet */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-black/5 bg-white/88 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarContent
              title={title}
              subtitle={subtitle}
              navLinks={navLinks}
              rootHref={rootHref}
              navExtra={navExtra}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <BrandLockup logoSize={22} gapClassName="gap-0.5" />
      </div>

      <div className={cn("transition-[padding] duration-200", collapsed ? "md:pl-16" : "md:pl-60")}>
        <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
          <main className="min-h-[calc(100vh-1.5rem)] rounded-[28px] border border-black/6 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] md:min-h-[calc(100vh-3rem)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
