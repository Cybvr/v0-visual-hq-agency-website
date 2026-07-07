"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { analysisNav } from "@/lib/finance/nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnalysisSubnavProps {
  /** Currently selected deal, appended to each nav link so the workspace stays in context */
  dealId?: string
}

export function AnalysisSubnav({ dealId }: AnalysisSubnavProps) {
  const pathname = usePathname()

  return (
    <nav className="mb-8 flex flex-wrap gap-1 border-b pb-4">
      {analysisNav.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        const href = dealId ? `${item.href}?deal=${dealId}` : item.href

        return (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            asChild
            className={cn("gap-1.5 font-medium", active && "bg-accent/15 text-primary")}
          >
            <Link href={href}>
              <Icon className="size-4" strokeWidth={2} />
              {item.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
