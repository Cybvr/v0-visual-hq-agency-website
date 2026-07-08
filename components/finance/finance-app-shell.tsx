"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { BrandLockup } from "@/components/brand-lockup"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { financeAppNav } from "@/lib/finance/nav"
import { cn } from "@/lib/utils"

export function FinanceAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const initials =
    user?.displayName
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?"

  const isActive = (href: string, matchers?: string[]) =>
    pathname === href || matchers?.some((m) => pathname.startsWith(m)) === true

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-5" strokeWidth={2} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b">
                <SheetTitle asChild>
                  <Link href="/finance" className="inline-flex">
                    <BrandLockup logoSize={22} />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-3">
                {financeAppNav.map((item) => {
                  const active = isActive(item.href, item.activeMatchers)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50",
                      )}
                    >
                      <Icon className="size-4" strokeWidth={2} />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/finance" className="shrink-0">
            <BrandLockup logoSize={22} />
          </Link>

          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {financeAppNav.map((item) => {
              const active = isActive(item.href, item.activeMatchers)
              const Icon = item.icon
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "shrink-0 gap-1.5 font-medium",
                    active && "bg-accent text-accent-foreground",
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="size-4" strokeWidth={2} />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
          </nav>

          <div className="ml-auto md:ml-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 font-medium">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                    {initials}
                  </span>
                  <span className="hidden sm:block">
                    {user?.displayName || user?.email?.split("@")[0] || "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-sm font-medium">{user?.displayName || "Signed in"}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={signOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
    </div>
  )
}
