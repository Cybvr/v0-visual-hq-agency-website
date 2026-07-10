"use client"

import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { HoldingAvatarTone, HoldingCompany } from "@/lib/finance/portfolio"
import { cn } from "@/lib/utils"

interface HoldingsTableProps {
  holdings: HoldingCompany[]
  /** Show a Sector column between Company and Revenue (used on the full holdings list). */
  showSector?: boolean
  /** Override for the avatar tone → color mapping. Overview uses solid backgrounds; the holdings list uses tinted ones. */
  avatarClasses?: Record<HoldingAvatarTone, string>
  rowPaddingY?: "sm" | "md"
}

const defaultAvatarClasses: Record<HoldingAvatarTone, string> = {
  "primary-container": "bg-primary/90 text-primary-foreground",
  secondary: "bg-primary text-primary-foreground",
  tertiary: "bg-foreground text-background",
  outline: "bg-muted-foreground text-background",
}

export function HoldingsTable({
  holdings,
  showSector = false,
  avatarClasses = defaultAvatarClasses,
  rowPaddingY = "sm",
}: HoldingsTableProps) {
  const router = useRouter()
  const cellPaddingY = rowPaddingY === "md" ? "py-4" : ""

  return (
    <Table className="tabular-nums">
      <TableHeader>
        <TableRow>
          <TableHead className="px-6">Company</TableHead>
          {showSector && <TableHead className="px-6">Sector</TableHead>}
          <TableHead className="px-6">Revenue (LTM)</TableHead>
          <TableHead className="px-6">EBITDA %</TableHead>
          <TableHead className="px-6">Net Debt</TableHead>
          <TableHead className="px-6">Trend</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((company) => {
          const href = `/finance/dashboard/portfolio/holdings/${company.id}`
          return (
            <TableRow
              key={company.id}
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/50",
                company.highlighted && "bg-muted/40",
              )}
              tabIndex={0}
              role="link"
              aria-label={`Open ${company.name}`}
              onClick={() => router.push(href)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  router.push(href)
                }
              }}
            >
              <TableCell className={cn("px-6", cellPaddingY)}>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-sm text-xs font-bold",
                      avatarClasses[company.avatarTone],
                    )}
                  >
                    {company.initials}
                  </div>
                  {showSector ? (
                    <span className="text-sm font-semibold text-primary">{company.name}</span>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-foreground">{company.name}</p>
                      <p className="text-[10px] text-muted-foreground">{company.sector}</p>
                    </div>
                  )}
                </div>
              </TableCell>
              {showSector && (
                <TableCell className={cn("px-6 text-sm text-muted-foreground", cellPaddingY)}>
                  {company.sector}
                </TableCell>
              )}
              <TableCell className={cn("px-6 text-sm", cellPaddingY)}>{company.revenue}</TableCell>
              <TableCell className={cn("px-6 text-sm", cellPaddingY)}>{company.ebitdaMargin}</TableCell>
              <TableCell className={cn("px-6 text-sm", cellPaddingY)}>{company.netDebt}</TableCell>
              <TableCell className={cn("px-6 text-primary", cellPaddingY)}>
                <svg className="h-8 w-24" viewBox="0 0 100 30">
                  <path
                    d={company.sparklinePath}
                    fill="none"
                    stroke={company.sparklineStroke ?? "currentColor"}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
