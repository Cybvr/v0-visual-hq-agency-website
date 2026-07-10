import { getCompany } from "./companies"
import { deriveFinancials, getFinancials } from "./deal-financials"

export type KpiDeltaTone = "positive" | "negative" | "neutral"

export interface PortfolioKpi {
  label: string
  value: string
  delta: string
  deltaTone: KpiDeltaTone
}

export type HoldingAvatarTone = "primary-container" | "secondary" | "tertiary" | "outline"

export interface HoldingCompany {
  /** Company registry slug — used to route to the holding detail page and cross-reference initiatives / activity */
  id: string
  initials: string
  avatarTone: HoldingAvatarTone
  name: string
  sector: string
  revenue: string
  ebitdaMargin: string
  netDebt: string
  /** SVG path for the 100x30 sparkline viewBox */
  sparklinePath: string
  /** Stroke color override (defaults to #1a365d) */
  sparklineStroke?: string
  highlighted?: boolean
}

export type HeatmapTone =
  | "primary"
  | "primary-90"
  | "primary-80"
  | "primary-60"
  | "primary-40"
  | "error"
  | "error-60"
  | "neutral"

export interface HeatmapCell {
  label: string
  tone: HeatmapTone
  colSpan?: number
  rowSpan?: number
}

export type InitiativeStatusTone = "on-track" | "delayed" | "completed"

export interface Initiative {
  name: string
  /** Company registry slug — used to scope this initiative to a holding detail page */
  companyId?: string
  context: string
  status: string
  statusTone: InitiativeStatusTone
  /** Progress bar width, percent */
  progress: number
}

export interface AiInsight {
  label: string
  icon: string
  quote: string
  cta: string
  backgroundIcon: string
}

export interface Deliverable {
  icon: string
  title: string
  subtitle: string
}

export interface DocumentLensStatus {
  icon: string
  title: string
  subtitle: string
}

export const portfolioLastUpdated = "Oct 24, 2024"

export const portfolioKpis: PortfolioKpi[] = [
  { label: "Total Portfolio Revenue", value: "$4.28B", delta: "+12.4%", deltaTone: "positive" },
  { label: "Aggregate EBITDA", value: "$842.1M", delta: "+8.1%", deltaTone: "positive" },
  { label: "Net Debt / EBITDA", value: "3.4x", delta: "+0.2x", deltaTone: "negative" },
  { label: "Active Initiatives", value: "14", delta: "Steady", deltaTone: "neutral" },
]

// Avionics Group's holding metrics derive from the same financial profile
// used for its pipeline deal and QofE report — one company, one set of books.
const avionicsCompany = getCompany("avionics-group")
const avionicsDerived = deriveFinancials(getFinancials("avionics-group"))

export const holdingCompanies: HoldingCompany[] = [
  {
    id: "avionics-group",
    initials: "AV",
    avatarTone: "primary-container",
    name: avionicsCompany.name,
    sector: avionicsCompany.sector,
    revenue: `$${Math.round(avionicsDerived.revenueM).toLocaleString("en-US")}M`,
    ebitdaMargin: `${avionicsDerived.reportedMarginPct.toFixed(1)}%`,
    netDebt: "2.8x",
    sparklinePath: "M0,25 L10,22 L20,24 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,6",
  },
  {
    id: "nexgen-health",
    initials: "NX",
    avatarTone: "secondary",
    name: getCompany("nexgen-health").name,
    sector: getCompany("nexgen-health").sector,
    revenue: "$856M",
    ebitdaMargin: "22.1%",
    netDebt: "4.1x",
    sparklinePath: "M0,15 L10,18 L20,16 L30,20 L40,15 L50,14 L60,18 L70,22 L80,25 L90,28 L100,26",
    sparklineStroke: "#ba1a1a",
  },
  {
    id: "stellar-tech",
    initials: "ST",
    avatarTone: "tertiary",
    name: getCompany("stellar-tech").name,
    sector: getCompany("stellar-tech").sector,
    revenue: "$412M",
    ebitdaMargin: "31.5%",
    netDebt: "1.2x",
    sparklinePath: "M0,28 L10,25 L20,20 L30,22 L40,15 L50,12 L60,14 L70,8 L80,5 L90,6 L100,2",
    highlighted: true,
  },
  {
    id: "logimaster",
    initials: "LM",
    avatarTone: "outline",
    name: getCompany("logimaster").name,
    sector: getCompany("logimaster").sector,
    revenue: "$2,104M",
    ebitdaMargin: "12.8%",
    netDebt: "5.2x",
    sparklinePath: "M0,10 L20,12 L40,11 L60,13 L80,12 L100,10",
  },
]

export const holdingsTotal = holdingCompanies.length

export function getHoldingCompany(id: string): HoldingCompany | undefined {
  return holdingCompanies.find((holding) => holding.id === id)
}

export const heatmapCells: HeatmapCell[] = [
  { label: "Aerospace", tone: "primary" },
  { label: "SaaS & Data", tone: "primary-80", colSpan: 2 },
  { label: "FinTech", tone: "primary-60" },
  { label: "Logistics", tone: "error", rowSpan: 2 },
  { label: "HealthCare", tone: "primary-90" },
  { label: "Manufacturing", tone: "neutral", colSpan: 2 },
  { label: "Energy", tone: "primary-40" },
  { label: "Consumer Retail", tone: "error-60", colSpan: 2 },
]

export const initiatives: Initiative[] = [
  {
    name: "ERP Implementation",
    companyId: "nexgen-health",
    context: `${getCompany("nexgen-health").name} • Phase 2/4`,
    status: "On Track",
    statusTone: "on-track",
    progress: 45,
  },
  {
    name: "Sales Force Restructuring",
    companyId: "avionics-group",
    context: `${avionicsCompany.name} • Execution`,
    status: "On Track",
    statusTone: "on-track",
    progress: 82,
  },
  {
    name: "Supply Chain Re-shoring",
    companyId: "logimaster",
    context: `${getCompany("logimaster").name} • Initial Phase`,
    status: "Delayed",
    statusTone: "delayed",
    progress: 12,
  },
  {
    name: "Pricing Optimization AI",
    companyId: "stellar-tech",
    context: `${getCompany("stellar-tech").name} • Post-Launch`,
    status: "Completed",
    statusTone: "completed",
    progress: 100,
  },
]

export const aiInsight: AiInsight = {
  label: "AI Strategic Insight",
  icon: "auto_awesome",
  quote: `"${getCompany("logimaster").name} EBITDA margins are 420bps below sector benchmark. Correlating with high fuel surcharges and legacy carrier contracts. Renegotiation could unlock $12M annually."`,
  cta: "Review Scenario Analysis",
  backgroundIcon: "troubleshoot",
}

export const pendingDeliverables: Deliverable[] = [
  { icon: "verified_user", title: "Q3 Compliance Cert", subtitle: "Due in 2 days" },
  { icon: "account_balance", title: "Tax Provision Memo", subtitle: getCompany("nexgen-health").name },
]

export const documentLensStatus: DocumentLensStatus = {
  icon: "search_insights",
  title: "Document Lens Active",
  subtitle: "Analyzing Source LP Report...",
}
