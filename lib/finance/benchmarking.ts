import { deriveFinancials, getFinancials, type PeerStats } from "./deal-financials"
import type { Deal } from "./pipeline"

export interface BenchmarkFilter {
  label: string
  options: string[]
  minWidthClass: string
}

export interface EbitdaMultipleBar {
  label: string
  tooltip: string
  heightPct: number
  isCurrentDeal?: boolean
}

export interface GrowthBenchmark {
  label: string
  value: string
  widthPct: number
  tone: "upper" | "current" | "median"
}

export interface BenchmarkMatrixRow {
  kpi: string
  currentDeal: string
  medianPeer: string
  topQuartile: string
  variance: string
  variancePositive: boolean
  confidence: "VERIFIED" | "ESTIMATED"
}

export interface QofeCard {
  title: string
  value: string
  delta: string
  deltaDirection: "up" | "down"
  sparklinePath: string
  confidencePct: number
}

export interface AiLensCard {
  title: string
  badge: string
  quote: string
  linkLabel: string
}

export const benchmarkFilters: BenchmarkFilter[] = [
  {
    label: "Industry",
    options: ["Technology & SaaS", "Healthcare Services", "Consumer Staples", "Industrial Mfg"],
    minWidthClass: "min-w-[160px]",
  },
  {
    label: "Deal Size",
    options: ["$50M - $250M", "$250M - $1B", "$1B+"],
    minWidthClass: "min-w-[140px]",
  },
  {
    label: "Region",
    options: ["North America", "EMEA", "APAC"],
    minWidthClass: "min-w-[140px]",
  },
]

export const benchmarkMatrixFootnote =
  "* Peer universe includes 42 verified transactions in the target's sector and enterprise-value range (2022-2024)."

export const benchmarkAiConfidence = "AI confidence score: 94% based on 1.2k data points"

/** Industry median EV/EBITDA bars; the selected deal's bar is computed. */
const peerEbitdaMultiples: EbitdaMultipleBar[] = [
  { label: "SaaS", tooltip: "14.2x", heightPct: 65 },
  { label: "FinTech", tooltip: "11.5x", heightPct: 52 },
  { label: "Health", tooltip: "9.8x", heightPct: 44 },
  { label: "Logistics", tooltip: "8.1x", heightPct: 36 },
  { label: "Security", tooltip: "12.4x", heightPct: 58 },
]

const GROWTH_UPPER_QUARTILE = { value: 28.4, widthPct: 85 }
const GROWTH_MEDIAN = { value: 12.5, widthPct: 38 }

/** heightPct scale matching the static peer bars (multiple -> percent). */
const MULTIPLE_HEIGHT_FACTOR = 4.6
/** widthPct scale matching the static growth rows (growth % -> percent). */
const GROWTH_WIDTH_FACTOR = 3

const clampPct = (n: number) => Math.min(95, Math.max(6, Math.round(n)))
const signedPct = (n: number) => `${n >= 0 ? "+" : "-"}${Math.abs(n).toFixed(1)}%`
const relativeVariance = (current: number, median: number) => ((current - median) / median) * 100

export interface BenchmarkData {
  ebitdaMultiples: EbitdaMultipleBar[]
  revenueGrowthBenchmarks: GrowthBenchmark[]
  revenueGrowthSummary: { value: string; label: string }
  benchmarkMatrix: BenchmarkMatrixRow[]
  qofeCards: QofeCard[]
  aiLensCard: AiLensCard
}

export function getBenchmarkData(deal: Deal): BenchmarkData {
  const fin = getFinancials(deal.id)
  const derived = deriveFinancials(fin)

  const ebitdaMultiples: EbitdaMultipleBar[] = [
    ...peerEbitdaMultiples.slice(0, 2),
    {
      label: "Current",
      tooltip: `${fin.evMultiple.toFixed(1)}x`,
      heightPct: clampPct(fin.evMultiple * MULTIPLE_HEIGHT_FACTOR),
      isCurrentDeal: true,
    },
    ...peerEbitdaMultiples.slice(2),
  ]

  const revenueGrowthBenchmarks: GrowthBenchmark[] = [
    { label: "Upper Quartile", value: `${GROWTH_UPPER_QUARTILE.value.toFixed(1)}%`, widthPct: GROWTH_UPPER_QUARTILE.widthPct, tone: "upper" },
    {
      label: "Subject Company",
      value: `${fin.ltmGrowthPct.toFixed(1)}%`,
      widthPct: clampPct(fin.ltmGrowthPct * GROWTH_WIDTH_FACTOR),
      tone: "current",
    },
    { label: "Median", value: `${GROWTH_MEDIAN.value.toFixed(1)}%`, widthPct: GROWTH_MEDIAN.widthPct, tone: "median" },
  ]

  const revenueGrowthSummary = {
    value:
      fin.ltmGrowthPct >= GROWTH_UPPER_QUARTILE.value ? "Top" : fin.ltmGrowthPct >= GROWTH_MEDIAN.value ? "High" : "Below",
    label: "Market Quartile",
  }

  const median = fin.peerMedian
  const topQuartile = fin.peerTopQuartile
  const matrixRow = (
    kpi: string,
    current: number,
    peer: (stats: PeerStats) => number,
    format: (n: number) => string,
    options: { lowerIsBetter?: boolean; confidence?: BenchmarkMatrixRow["confidence"] } = {},
  ): BenchmarkMatrixRow => ({
    kpi,
    currentDeal: format(current),
    medianPeer: format(peer(median)),
    topQuartile: format(peer(topQuartile)),
    variance: signedPct(relativeVariance(current, peer(median))),
    variancePositive: options.lowerIsBetter ? current <= peer(median) : current >= peer(median),
    confidence: options.confidence ?? "VERIFIED",
  })

  const pct1 = (n: number) => `${n.toFixed(1)}%`
  const benchmarkMatrix: BenchmarkMatrixRow[] = [
    matrixRow("Gross Margin %", fin.grossMarginPct, (stats) => stats.grossMarginPct, pct1),
    matrixRow("EBITDA Margin %", derived.proFormaMarginPct, (stats) => stats.ebitdaMarginPct, pct1),
    matrixRow("Rule of 40 Score", derived.ruleOf40, (stats) => stats.ruleOf40, (n) => n.toFixed(1), {
      confidence: "ESTIMATED",
    }),
    matrixRow("CAC Payback (Months)", fin.cacPaybackMonths, (stats) => stats.cacPaybackMonths, (n) => n.toFixed(1), {
      lowerIsBetter: true,
    }),
    matrixRow("Net Retention (NRR)", fin.netRetentionPct, (stats) => stats.netRetentionPct, (n) => `${Math.round(n)}%`),
  ]

  const qofeCards: QofeCard[] = [
    {
      title: "EBITDA Adjustments",
      value: `$${Math.abs(derived.netAdjustmentsM).toFixed(1)}M`,
      delta: `${Math.abs((derived.netAdjustmentsM / derived.reportedEbitdaM) * 100).toFixed(1)}%`,
      deltaDirection: derived.netAdjustmentsM >= 0 ? "up" : "down",
      sparklinePath: "M0,15 L10,12 L20,18 L30,5 L40,10 L50,8 L60,15 L70,12 L80,5 L90,10 L100,2",
      confidencePct: 88,
    },
    {
      title: "Working Capital Gap",
      value:
        fin.workingCapitalGapM < 1
          ? `$${Math.round(fin.workingCapitalGapM * 1000)}K`
          : `$${fin.workingCapitalGapM.toFixed(1)}M`,
      delta: "4.2%",
      deltaDirection: "down",
      sparklinePath: "M0,10 L10,15 L20,12 L30,18 L40,8 L50,12 L60,5 L70,15 L80,10 L90,12 L100,8",
      confidencePct: 65,
    },
  ]

  const grossMarginPosition =
    fin.grossMarginPct >= topQuartile.grossMarginPct
      ? "in the top quartile of"
      : fin.grossMarginPct >= median.grossMarginPct
        ? "above the median of"
        : "below the median of"
  const aiLensCard: AiLensCard = {
    title: "AI Lens Synthesis",
    badge: "PREMIUM",
    quote: `"${deal.name}'s gross margin profile sits ${grossMarginPosition} ${deal.sector} peers, consistent with the cost structure verified in the QofE bridge."`,
    linkLabel: "View Document Sources",
  }

  return { ebitdaMultiples, revenueGrowthBenchmarks, revenueGrowthSummary, benchmarkMatrix, qofeCards, aiLensCard }
}
