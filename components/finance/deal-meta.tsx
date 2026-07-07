import type { Deal } from "@/lib/finance/pipeline"
import { Badge } from "@/components/ui/badge"

/** Status / size / sector pills for a deal, used in the analysis workspace header meta row. */
export function DealMeta({ deal }: { deal: Deal }) {
  return (
    <>
      <Badge className="bg-accent/15 text-primary hover:bg-accent/15">{deal.stage}</Badge>
      <Badge variant="secondary" className="tabular-nums">${deal.size}M</Badge>
      <span className="text-xs font-medium text-muted-foreground">{deal.sector}</span>
    </>
  )
}
