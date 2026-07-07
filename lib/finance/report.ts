export interface QofeReportMeta {
  title: string
  subtitle: string
  currencyNote: string
  reportId: string
  analyst: string
  reviewStatus: string
  methodologyTitle: string
  methodologyNote: string
}

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

export const qofeReportMeta: QofeReportMeta = {
  title: "Quality of Earnings Report",
  subtitle: "Lumina Tech Solutions, Inc. • FY2023 Finalized Report",
  currencyNote: "All figures in USD (Millions)",
  reportId: "QOE-2023-LMN-09",
  analyst: "A. Hamilton",
  reviewStatus: "VERIFIED",
  methodologyTitle: "Methodology Note",
  methodologyNote:
    "The pro forma adjustments presented above are based on management's representations and AI-assisted forensic verification of the general ledger. Adjustments are strictly limited to non-recurring, one-time, or non-operational items as defined by the master engagement letter. All figures are subject to final audit reconciliation.",
}

export const qofeBridgeBars: QofeBridgeBar[] = [
  { label: "Reported", value: "$42.4", tone: "start", height: 192, offset: 0 },
  { label: "One-Time", value: "+$1.2", tone: "gain", height: 32, offset: 160, dashed: true },
  { label: "Non-Op", value: "+$2.8", tone: "gain", height: 48, offset: 112 },
  { label: "LIFO Adj", value: "-$0.5", tone: "loss", height: 16, offset: 96 },
  { label: "Pro Forma", value: "$45.9", tone: "end", height: 224, offset: 0 },
]

export const qofeInsight: QofeInsight = {
  title: "AI Adjustment Insight",
  icon: "lightbulb",
  body: "Anomalous legal disbursement detected in Q3. Automated analysis cross-referenced vendor history and identified a $1.2M settlement fee related to a resolved patent dispute. This has been reclassified as a non-recurring adjustment to normalize operational performance.",
  confidenceLabel: "Confidence Score",
  confidence: "98.4%",
  ctaLabel: "View Documentation Link",
}

export const qofeTableRows: QofeTableRow[] = [
  {
    description: "Total Revenue",
    reported: "184,200,000",
    adjustments: "—",
    proForma: "184,200,000",
    variant: "revenue",
    ref: "A.1",
  },
  {
    description: "COGS",
    reported: "(112,450,000)",
    adjustments: "+450,000",
    proForma: "(112,000,000)",
    variant: "detail",
    ref: "B.2",
  },
  {
    description: "Gross Profit",
    reported: "71,750,000",
    adjustments: "450,000",
    proForma: "72,200,000",
    variant: "subtotal",
  },
  {
    description: "Operating Expenses (SG&A)",
    reported: "(48,200,000)",
    adjustments: "—",
    proForma: "(48,200,000)",
    variant: "line",
  },
  {
    description: "Non-recurring Legal Fees",
    reported: "—",
    adjustments: "+1,200,000",
    proForma: "1,200,000",
    variant: "adjustment",
    refInfoIcon: true,
  },
  {
    description: "Excess Management Comp",
    reported: "—",
    adjustments: "+2,800,000",
    proForma: "2,800,000",
    variant: "adjustment",
    ref: "C.4",
  },
  {
    description: "Depreciation & Amortization",
    reported: "18,850,000",
    adjustments: "—",
    proForma: "18,850,000",
    variant: "line",
  },
  {
    description: "Adjusted EBITDA",
    reported: "42,400,000",
    adjustments: "+4,450,000",
    proForma: "46,850,000",
    variant: "total",
  },
  {
    description: "EBITDA Margin",
    reported: "23.0%",
    adjustments: "+2.4%",
    proForma: "25.4%",
    variant: "margin",
  },
]
