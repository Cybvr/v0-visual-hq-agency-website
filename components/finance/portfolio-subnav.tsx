"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { portfolioNav } from "@/lib/finance/nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PortfolioSubnav() {
  const pathname = usePathname()

  return (
    <nav className="mb-8 flex flex-wrap gap-1 border-b pb-4">
      {portfolioNav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/finance/dashboard/portfolio" && pathname.startsWith(`${item.href}/`))
        const Icon = item.icon

        return (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            asChild
            className={cn("gap-1.5 font-medium", active && "bg-accent/15 text-primary")}
          >
            <Link href={item.href}>
              <Icon className="size-4" strokeWidth={2} />
              {item.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
