import { companies } from "./companies"
import {
  deriveFinancials,
  formatMillionsShort,
  formatParenDollars,
  formatSignedDollars,
  formatSignedMillionsShort,
  formatWholeDollars,
  getFinancials,
} from "./deal-financials"
import type { Deal } from "./pipeline"

export type QofeBridgeTone = "start" | "gain" | "loss" | "end"

export interface QofeBridgeBar {
  label: string
  value: string
  tone: QofeBridgeTone
  /** Bar height in px (chart canvas is 256px tall) */
  height: number
  /** Bottom offset in px for floating waterfall segments */
  offset: number
  /** Render the dashed connector line on the left edge */
  dashed?: boolean
}

export interface QofeInsight {
  title: string
  icon: string
  body: string
  confidenceLabel: string
  confidence: string
  ctaLabel: string
}

export type QofeRowVariant = "revenue" | "detail" | "subtotal" | "line" | "adjustment" | "total" | "margin"

export interface QofeTableRow {
  description: string
  reported: string
  adjustments: string
  proForma: string
  variant: QofeRowVariant
  /** Reference badge text, e.g. "A.1" */
  ref?: string
  /** Render a filled info icon in the ref column instead of a badge */
  refInfoIcon?: boolean
}

/** Static report chrome shared by every deal's QofE report. */
export const qofeReportMeta = {
  title: "Quality of Earnings Report",
  currencyNote: "All figures in USD (Millions)",
  analyst: "A. Hamilton",
  methodologyTitle: "Methodology Note",
  methodologyNote:
    "The pro forma adjustments presented above are based on management's representations and AI-assisted forensic verification of the general ledger. Adjustments are strictly limited to non-recurring, one-time, or non-operational items as defined by the master engagement letter. All figures are subject to final audit reconciliation.",
}

/**
 * Stage-gated report status: a finalized, verified QofE only exists once a
 * deal has reached diligence. Earlier-stage deals get an honest draft or
 * indicative framing over the same worked content.
 */
const reportStatusByStage: Record<string, { periodLabel: string; reviewStatus: string }> = {
  "Due Diligence": { periodLabel: "FY2023 Finalized Report", reviewStatus: "VERIFIED" },
  Closed: { periodLabel: "FY2023 Finalized Report", reviewStatus: "VERIFIED" },
  "LOI Issued": { periodLabel: "FY2023 Draft — Diligence Pending", reviewStatus: "PRELIMINARY" },
}

const preDiligenceStatus = { periodLabel: "FY2023 Indicative View — Pre-Diligence", reviewStatus: "INDICATIVE" }

export interface QofeReport {
  reportId: string
  periodLabel: string
  reviewStatus: string
  bridgeBars: QofeBridgeBar[]
  tableRows: QofeTableRow[]
  insight: QofeInsight
}

const BRIDGE_MAX_PX = 224
const BRIDGE_MIN_PX = 12

export function getQofeReport(deal: Deal): QofeReport {
  const fin = getFinancials(deal.id)
  const derived = deriveFinancials(fin)
  const status = reportStatusByStage[deal.stage] ?? preDiligenceStatus

  const px = (m: number) => Math.max(BRIDGE_MIN_PX, Math.round((Math.abs(m) / derived.proFormaEbitdaM) * BRIDGE_MAX_PX))

  const bridgeBars: QofeBridgeBar[] = [
    {
      label: "Reported",
      value: formatMillionsShort(derived.reportedEbitdaM),
      tone: "start",
      height: px(derived.reportedEbitdaM),
      offset: 0,
    },
  ]
  let offset = px(derived.reportedEbitdaM)
  fin.adjustments.forEach((adjustment, index) => {
    const height = px(adjustment.amountM)
    offset -= height
    bridgeBars.push({
      label: adjustment.bridgeLabel,
      value: formatSignedMillionsShort(adjustment.amountM),
      tone: adjustment.amountM >= 0 ? "gain" : "loss",
      height,
      offset,
      dashed: index === 0,
    })
  })
  bridgeBars.push({
    label: "Pro Forma",
    value: formatMillionsShort(derived.proFormaEbitdaM),
    tone: "end",
    height: BRIDGE_MAX_PX,
    offset: 0,
  })

  const tableRows: QofeTableRow[] = [
    {
      description: "Total Revenue",
      reported: formatWholeDollars(derived.revenueM),
      adjustments: "—",
      proForma: formatWholeDollars(derived.revenueM),
      variant: "revenue",
      ref: "A.1",
    },
    {
      description: "COGS",
      reported: formatParenDollars(derived.cogsM),
      adjustments: "—",
      proForma: formatParenDollars(derived.cogsM),
      variant: "detail",
      ref: "B.2",
    },
    {
      description: "Gross Profit",
      reported: formatWholeDollars(derived.grossProfitM),
      adjustments: "—",
      proForma: formatWholeDollars(derived.grossProfitM),
      variant: "subtotal",
    },
    {
      description: "Operating Expenses (SG&A)",
      reported: formatParenDollars(derived.sgnaM),
      adjustments: "—",
      proForma: formatParenDollars(derived.sgnaM),
      variant: "line",
    },
    ...fin.adjustments.map(
      (adjustment, index): QofeTableRow => ({
        description: adjustment.label,
        reported: "—",
        adjustments: formatSignedDollars(adjustment.amountM),
        proForma: adjustment.amountM >= 0 ? formatWholeDollars(adjustment.amountM) : formatParenDollars(adjustment.amountM),
        variant: "adjustment",
        ...(index === 0 ? { refInfoIcon: true } : { ref: `C.${index + 1}` }),
      }),
    ),
    {
      description: "Depreciation & Amortization",
      reported: formatWholeDollars(derived.daM),
      adjustments: "—",
      proForma: formatWholeDollars(derived.daM),
      variant: "line",
    },
    {
      description: "Adjusted EBITDA",
      reported: formatWholeDollars(derived.reportedEbitdaM),
      adjustments: formatSignedDollars(derived.netAdjustmentsM),
      proForma: formatWholeDollars(derived.proFormaEbitdaM),
      variant: "total",
    },
    {
      description: "EBITDA Margin",
      reported: `${derived.reportedMarginPct.toFixed(1)}%`,
      adjustments: `${derived.proFormaMarginPct - derived.reportedMarginPct >= 0 ? "+" : "-"}${Math.abs(derived.proFormaMarginPct - derived.reportedMarginPct).toFixed(1)}%`,
      proForma: `${derived.proFormaMarginPct.toFixed(1)}%`,
      variant: "margin",
    },
  ]

  const keyAdjustment = fin.adjustments.reduce((largest, candidate) =>
    Math.abs(candidate.amountM) > Math.abs(largest.amountM) ? candidate : largest,
  )
  const insight: QofeInsight = {
    title: "AI Adjustment Insight",
    icon: "lightbulb",
    body: `Automated forensic review of ${deal.name}'s general ledger identified $${Math.abs(keyAdjustment.amountM).toFixed(1)}M tied to ${keyAdjustment.label.toLowerCase()}. The item was cross-referenced against vendor and payroll history and ${keyAdjustment.amountM >= 0 ? "added back as a non-recurring adjustment" : "deducted as a non-operating item"} to normalize run-rate performance.`,
    confidenceLabel: "Confidence Score",
    confidence: "98.4%",
    ctaLabel: "View Documentation Link",
  }

  const initials = deal.name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase()
  const sequence = String(companies.findIndex((company) => company.id === deal.id) + 1).padStart(2, "0")

  return {
    reportId: `QOE-2023-${initials}-${sequence}`,
    periodLabel: status.periodLabel,
    reviewStatus: status.reviewStatus,
    bridgeBars,
    tableRows,
    insight,
  }
}
