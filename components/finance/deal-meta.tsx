import type { Deal } from "@/lib/finance/pipeline"

/** Status / size / sector pills for a deal, used in the analysis workspace header meta row. */
export function DealMeta({ deal }: { deal: Deal }) {
  return (
    <>
      <span className="rounded-full bg-(--fin-secondary-container) px-3 py-1 text-xs font-semibold text-(--fin-on-secondary-container)">
        {deal.stage}
      </span>
      <span className="rounded-full bg-(--fin-surface-container-low) px-3 py-1 text-xs font-semibold text-(--fin-primary)">
        ${deal.size}M
      </span>
      <span className="text-xs font-medium text-(--fin-on-surface-variant)">{deal.sector}</span>
    </>
  )
}
