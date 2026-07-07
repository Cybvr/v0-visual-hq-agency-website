"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
import { financeAppNav } from "@/lib/finance/nav"
import { cn } from "@/lib/utils"

export function FinanceAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const initials =
    user?.displayName
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?"

  return (
    <div className="min-h-screen bg-(--fin-surface)">
      <header className="sticky top-0 z-10 border-b border-(--fin-outline-variant) bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/finance" className="shrink-0">
            <BrandLockup logoSize={22} />
          </Link>

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {financeAppNav.map((item) => {
              const active =
                pathname === item.href || item.activeMatchers?.some((m) => pathname.startsWith(m)) === true
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 font-medium">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--fin-primary-fixed) text-[10px] font-bold text-(--fin-on-primary-fixed)">
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
      </header>
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
