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

export const benchmarkingHeader = {
  title: "Market Comparison",
  subtitle: "Benchmarking Current Deal metrics against peer universe and industry standards.",
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

export const ebitdaMultiples: EbitdaMultipleBar[] = [
  { label: "SaaS", tooltip: "14.2x", heightPct: 65 },
  { label: "FinTech", tooltip: "11.5x", heightPct: 52 },
  { label: "Current", tooltip: "Current Deal: 16.5x", heightPct: 82, isCurrentDeal: true },
  { label: "Health", tooltip: "9.8x", heightPct: 44 },
  { label: "Logistics", tooltip: "8.1x", heightPct: 36 },
  { label: "Security", tooltip: "12.4x", heightPct: 58 },
]

export const revenueGrowthBenchmarks: GrowthBenchmark[] = [
  { label: "Upper Quartile", value: "28.4%", widthPct: 85, tone: "upper" },
  { label: "Current Deal", value: "18.2%", widthPct: 55, tone: "current" },
  { label: "Median", value: "12.5%", widthPct: 38, tone: "median" },
]

export const revenueGrowthSummary = {
  value: "High",
  label: "Market Quartile",
}

export const benchmarkMatrix: BenchmarkMatrixRow[] = [
  {
    kpi: "Gross Margin %",
    currentDeal: "72.4%",
    medianPeer: "64.1%",
    topQuartile: "78.5%",
    variance: "+12.9%",
    variancePositive: true,
    confidence: "VERIFIED",
  },
  {
    kpi: "EBITDA Margin %",
    currentDeal: "24.8%",
    medianPeer: "18.2%",
    topQuartile: "29.1%",
    variance: "+36.2%",
    variancePositive: true,
    confidence: "VERIFIED",
  },
  {
    kpi: "Rule of 40 Score",
    currentDeal: "43.0",
    medianPeer: "30.7",
    topQuartile: "52.2",
    variance: "+40.1%",
    variancePositive: true,
    confidence: "ESTIMATED",
  },
  {
    kpi: "CAC Payback (Months)",
    currentDeal: "14.2",
    medianPeer: "12.5",
    topQuartile: "8.4",
    variance: "+13.6%",
    variancePositive: false,
    confidence: "VERIFIED",
  },
  {
    kpi: "Net Retention (NRR)",
    currentDeal: "108%",
    medianPeer: "102%",
    topQuartile: "115%",
    variance: "+5.9%",
    variancePositive: true,
    confidence: "VERIFIED",
  },
]

export const benchmarkMatrixFootnote =
  "* Peer universe includes 42 verified SaaS transactions within the $100M-$500M enterprise value range (2022-2024)."

export const benchmarkAiConfidence = "AI confidence score: 94% based on 1.2k data points"

export const qofeCards: QofeCard[] = [
  {
    title: "EBITDA Adjustments",
    value: "$4.2M",
    delta: "12.5%",
    deltaDirection: "up",
    sparklinePath: "M0,15 L10,12 L20,18 L30,5 L40,10 L50,8 L60,15 L70,12 L80,5 L90,10 L100,2",
    confidencePct: 88,
  },
  {
    title: "Working Capital Gap",
    value: "$850K",
    delta: "4.2%",
    deltaDirection: "down",
    sparklinePath: "M0,10 L10,15 L20,12 L30,18 L40,8 L50,12 L60,5 L70,15 L80,10 L90,12 L100,8",
    confidencePct: 65,
  },
]

export const aiLensCard: AiLensCard = {
  title: "AI Lens Synthesis",
  badge: "PREMIUM",
  quote:
    "\"Current deal's gross margin profile sits in the 88th percentile of SaaS peers, likely due to optimized cloud infrastructure spend identified in the QofE bridge.\"",
  linkLabel: "View Document Sources",
}
