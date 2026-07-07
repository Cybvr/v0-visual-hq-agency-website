"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrandLockup } from "@/components/brand-lockup"
import { useAuth } from "@/components/auth-provider"
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
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 z-40 flex h-full w-60 flex-col gap-1.5 border-r border-(--fin-outline-variant) bg-(--fin-surface-container) p-3">
        <div className="mb-4 px-1.5 pt-3">
          <Link href="/finance" className="flex items-center gap-2">
            <BrandLockup logoSize={24} />
          </Link>
          <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-(--fin-secondary)">Finance</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {financeAppNav.map((item) => {
            const active =
              pathname === item.href || item.activeMatchers?.some((matcher) => pathname.startsWith(matcher)) === true
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-xs font-semibold transition-all",
                  active
                    ? "bg-(--fin-secondary-container) text-(--fin-on-secondary-container)"
                    : "text-(--fin-on-surface-variant) hover:bg-(--fin-surface-container-high)",
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-(--fin-outline-variant) pt-3">
          <div className="flex items-center gap-2.5 px-1.5 py-1.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--fin-primary-fixed) text-[11px] font-bold text-(--fin-on-primary-fixed)">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-(--fin-on-surface)">
                {user?.displayName || user?.email || "Signed in"}
              </p>
              <button
                onClick={signOut}
                className="text-[11px] text-(--fin-on-surface-variant) transition-colors hover:text-(--fin-error)"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>
      <main className="ml-60 min-h-screen bg-(--fin-surface) p-8">{children}</main>
    </div>
  )
}
