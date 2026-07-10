"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  Deal,
  DealStageTone,
  PartnerAvatarTone,
} from "@/lib/finance/pipeline"
import { cn } from "@/lib/utils"

const dealStageBadgeVariant: Record<DealStageTone, "default" | "secondary" | "outline" | "destructive"> = {
  "due-diligence": "default",
  loi: "secondary",
  neutral: "outline",
  stalled: "destructive",
}

const partnerAvatarClasses: Record<PartnerAvatarTone, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-primary/20 text-primary",
  tertiary: "bg-muted text-muted-foreground",
}

export function DealsTable({ deals }: { deals: Deal[] }) {
  const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-6">Target</TableHead>
          <TableHead className="px-6">Size ($M)</TableHead>
          <TableHead className="px-6">Sector</TableHead>
          <TableHead className="px-6">Stage</TableHead>
          <TableHead className="px-6">Lead Partner</TableHead>
          <TableHead className="px-6" aria-hidden />
        </TableRow>
      </TableHeader>
      <TableBody>
        {deals.map((deal) => {
          const href = `/finance/dashboard/analysis?deal=${deal.id}`
          return (
            <TableRow
              key={deal.id}
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/50",
                deal.highlighted && "bg-muted/40",
              )}
              tabIndex={0}
              role="link"
              aria-label={`Open ${deal.name}`}
              onClick={() => router.push(href)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  router.push(href)
                }
              }}
            >
              <TableCell className="px-6 font-semibold text-primary">{deal.name}</TableCell>
              <TableCell className="px-6">{deal.size}</TableCell>
              <TableCell className="px-6 text-muted-foreground">{deal.sector}</TableCell>
              <TableCell className="px-6">
                <Badge variant={dealStageBadgeVariant[deal.stageTone]}>{deal.stage}</Badge>
              </TableCell>
              <TableCell className="px-6">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
                      partnerAvatarClasses[deal.partnerAvatarTone],
                    )}
                  >
                    {deal.partnerInitials}
                  </span>
                  <span className="text-sm">{deal.partner}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 text-right text-muted-foreground">
                <ArrowRight className="ml-auto size-4" />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
