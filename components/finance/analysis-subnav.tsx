"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { analysisNav } from "@/lib/finance/nav"
import { cn } from "@/lib/utils"

export function AnalysisSubnav() {
  const pathname = usePathname()

  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-(--fin-outline-variant) pb-4">
      {analysisNav.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-[4px] px-3 py-2 text-xs font-semibold transition-colors",
              active
                ? "bg-(--fin-secondary-container) text-(--fin-on-secondary-container)"
                : "text-(--fin-on-surface-variant) hover:bg-(--fin-surface-container-low)",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
