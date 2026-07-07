/**
 * Per-deal financial profiles and the arithmetic that turns them into the
 * figures shown on the QofE report, Benchmarking, Modeling, and Pipeline
 * screens. Each pipeline company gets its own profile so no two deals render
 * identical numbers, and every derived figure (gross profit, SG&A, pro-forma
 * EBITDA, EV) stays internally consistent by construction.
 */

export interface QofeAdjustment {
  /** Full line-item label in the adjusted-EBITDA table */
  label: string
  /** Short label under the corresponding waterfall bar */
  bridgeLabel: string
  /** Signed amount in $M (positive = add-back, negative = deduction) */
  amountM: number
}

export interface PeerStats {
  grossMarginPct: number
  ebitdaMarginPct: number
  ruleOf40: number
  cacPaybackMonths: number
  netRetentionPct: number
}

export interface DealFinancials {
  /** LTM revenue, $M */
  revenueM: number
  grossMarginPct: number
  /** Reported (pre-adjustment) EBITDA margin */
  ebitdaMarginPct: number
  daPctOfRevenue: number
  adjustments: QofeAdjustment[]
  /** EV / pro-forma EBITDA */
  evMultiple: number
  ltmGrowthPct: number
  cacPaybackMonths: number
  netRetentionPct: number
  workingCapitalGapM: number
  peerMedian: PeerStats
  peerTopQuartile: PeerStats
}

const financialsByCompany: Record<string, DealFinancials> = {
  "aerodynamic-systems": {
    revenueM: 184.2,
    grossMarginPct: 39.0,
    ebitdaMarginPct: 23.0,
    daPctOfRevenue: 10.2,
    adjustments: [
      { label: "Non-recurring Legal Fees", bridgeLabel: "One-Time", amountM: 1.2 },
      { label: "Excess Management Comp", bridgeLabel: "Non-Op", amountM: 2.8 },
      { label: "LIFO Inventory Adjustment", bridgeLabel: "LIFO Adj", amountM: -0.5 },
    ],
    evMultiple: 9.8,
    ltmGrowthPct: 18.2,
    cacPaybackMonths: 14.2,
    netRetentionPct: 108,
    workingCapitalGapM: 0.85,
    peerMedian: { grossMarginPct: 34.5, ebitdaMarginPct: 19.5, ruleOf40: 28.0, cacPaybackMonths: 16.8, netRetentionPct: 101 },
    peerTopQuartile: { grossMarginPct: 44.0, ebitdaMarginPct: 26.0, ruleOf40: 41.5, cacPaybackMonths: 11.2, netRetentionPct: 109 },
  },
  "veridia-health-group": {
    revenueM: 215.0,
    grossMarginPct: 71.0,
    ebitdaMarginPct: 26.0,
    daPctOfRevenue: 3.8,
    adjustments: [
      { label: "One-Time Integration Costs", bridgeLabel: "One-Time", amountM: 3.2 },
      { label: "Owner Compensation Normalization", bridgeLabel: "Non-Op", amountM: 2.1 },
      { label: "Deferred Revenue Haircut", bridgeLabel: "Def. Rev", amountM: -1.0 },
    ],
    evMultiple: 20.0,
    ltmGrowthPct: 24.6,
    cacPaybackMonths: 11.8,
    netRetentionPct: 117,
    workingCapitalGapM: 1.6,
    peerMedian: { grossMarginPct: 68.0, ebitdaMarginPct: 22.4, ruleOf40: 41.0, cacPaybackMonths: 13.5, netRetentionPct: 109 },
    peerTopQuartile: { grossMarginPct: 76.5, ebitdaMarginPct: 30.0, ruleOf40: 55.0, cacPaybackMonths: 9.0, netRetentionPct: 118 },
  },
  "fintech-velocity": {
    revenueM: 32.4,
    grossMarginPct: 58.0,
    ebitdaMarginPct: 18.0,
    daPctOfRevenue: 6.0,
    adjustments: [
      { label: "Non-recurring Platform Migration", bridgeLabel: "One-Time", amountM: 0.6 },
      { label: "Founder Compensation Normalization", bridgeLabel: "Non-Op", amountM: 0.4 },
    ],
    evMultiple: 12.5,
    ltmGrowthPct: 34.2,
    cacPaybackMonths: 9.6,
    netRetentionPct: 121,
    workingCapitalGapM: 0.35,
    peerMedian: { grossMarginPct: 52.0, ebitdaMarginPct: 16.0, ruleOf40: 39.5, cacPaybackMonths: 11.5, netRetentionPct: 112 },
    peerTopQuartile: { grossMarginPct: 61.5, ebitdaMarginPct: 24.5, ruleOf40: 58.0, cacPaybackMonths: 7.5, netRetentionPct: 124 },
  },
  "solaris-energy-partners": {
    revenueM: 128.8,
    grossMarginPct: 42.0,
    ebitdaMarginPct: 31.0,
    daPctOfRevenue: 14.0,
    adjustments: [
      { label: "One-Time Grid Interconnection Fees", bridgeLabel: "One-Time", amountM: 1.8 },
      { label: "Non-Operating Land Lease Income", bridgeLabel: "Non-Op", amountM: -1.4 },
    ],
    evMultiple: 8.0,
    ltmGrowthPct: 9.8,
    cacPaybackMonths: 22.0,
    netRetentionPct: 96,
    workingCapitalGapM: 1.1,
    peerMedian: { grossMarginPct: 38.5, ebitdaMarginPct: 27.5, ruleOf40: 33.0, cacPaybackMonths: 24.5, netRetentionPct: 97 },
    peerTopQuartile: { grossMarginPct: 47.0, ebitdaMarginPct: 35.5, ruleOf40: 44.0, cacPaybackMonths: 17.0, netRetentionPct: 104 },
  },
  "omnilogistics-corp": {
    revenueM: 74.5,
    grossMarginPct: 28.0,
    ebitdaMarginPct: 12.0,
    daPctOfRevenue: 9.0,
    adjustments: [
      { label: "Fuel Surcharge Normalization", bridgeLabel: "Fuel Adj", amountM: -0.9 },
      { label: "One-Time Fleet Disposal Loss", bridgeLabel: "One-Time", amountM: 0.7 },
    ],
    evMultiple: 6.5,
    ltmGrowthPct: 3.1,
    cacPaybackMonths: 18.4,
    netRetentionPct: 94,
    workingCapitalGapM: 0.7,
    peerMedian: { grossMarginPct: 26.5, ebitdaMarginPct: 13.0, ruleOf40: 18.5, cacPaybackMonths: 16.0, netRetentionPct: 97 },
    peerTopQuartile: { grossMarginPct: 33.0, ebitdaMarginPct: 18.5, ruleOf40: 28.0, cacPaybackMonths: 12.0, netRetentionPct: 103 },
  },
  "avionics-group": {
    revenueM: 1240.0,
    grossMarginPct: 34.0,
    ebitdaMarginPct: 18.4,
    daPctOfRevenue: 7.0,
    adjustments: [
      { label: "Transaction & Advisory Fees", bridgeLabel: "One-Time", amountM: 6.2 },
      { label: "Legacy Pension Curtailment", bridgeLabel: "Non-Op", amountM: 3.4 },
    ],
    evMultiple: 5.2,
    ltmGrowthPct: 6.4,
    cacPaybackMonths: 17.6,
    netRetentionPct: 103,
    workingCapitalGapM: 4.2,
    peerMedian: { grossMarginPct: 31.0, ebitdaMarginPct: 16.5, ruleOf40: 21.5, cacPaybackMonths: 19.5, netRetentionPct: 100 },
    peerTopQuartile: { grossMarginPct: 38.5, ebitdaMarginPct: 22.0, ruleOf40: 30.0, cacPaybackMonths: 14.0, netRetentionPct: 106 },
  },
}

/** Fallback profile: the flagship deal's, so Analysis always has figures. */
const FALLBACK_ID = "aerodynamic-systems"

export function getFinancials(companyId: string): DealFinancials {
  return financialsByCompany[companyId] ?? financialsByCompany[FALLBACK_ID]
}

const round1 = (n: number) => Math.round(n * 10) / 10

export interface DerivedFinancials {
  revenueM: number
  cogsM: number
  grossProfitM: number
  sgnaM: number
  daM: number
  reportedEbitdaM: number
  netAdjustmentsM: number
  proFormaEbitdaM: number
  reportedMarginPct: number
  proFormaMarginPct: number
  ruleOf40: number
  enterpriseValueM: number
}

/**
 * Derive the full income-statement skeleton from a profile, rounded to $0.1M.
 * SG&A is computed as the balancing line (GP + D&A - reported EBITDA) so the
 * table always foots.
 */
export function deriveFinancials(fin: DealFinancials): DerivedFinancials {
  const revenueM = fin.revenueM
  const cogsM = round1(revenueM * (1 - fin.grossMarginPct / 100))
  const grossProfitM = round1(revenueM - cogsM)
  const daM = round1(revenueM * (fin.daPctOfRevenue / 100))
  const reportedEbitdaM = round1(revenueM * (fin.ebitdaMarginPct / 100))
  const sgnaM = round1(grossProfitM + daM - reportedEbitdaM)
  const netAdjustmentsM = round1(fin.adjustments.reduce((sum, adj) => sum + adj.amountM, 0))
  const proFormaEbitdaM = round1(reportedEbitdaM + netAdjustmentsM)
  return {
    revenueM,
    cogsM,
    grossProfitM,
    sgnaM,
    daM,
    reportedEbitdaM,
    netAdjustmentsM,
    proFormaEbitdaM,
    reportedMarginPct: round1((reportedEbitdaM / revenueM) * 100),
    proFormaMarginPct: round1((proFormaEbitdaM / revenueM) * 100),
    ruleOf40: round1(fin.ltmGrowthPct + (proFormaEbitdaM / revenueM) * 100),
    enterpriseValueM: round1(proFormaEbitdaM * fin.evMultiple),
  }
}

// --- Formatting helpers -----------------------------------------------------

/** 184.2 -> "184,200,000" */
export function formatWholeDollars(m: number): string {
  return Math.round(Math.abs(m) * 1_000_000).toLocaleString("en-US")
}

/** 112.4 -> "(112,400,000)" (accounting-style negative) */
export function formatParenDollars(m: number): string {
  return `(${formatWholeDollars(m)})`
}

/** +1.2 -> "+1,200,000"; -0.5 -> "(500,000)" */
export function formatSignedDollars(m: number): string {
  return m >= 0 ? `+${formatWholeDollars(m)}` : formatParenDollars(m)
}

/** 42.4 -> "$42.4" */
export function formatMillionsShort(m: number): string {
  return `$${m.toFixed(1)}`
}

/** +1.2 -> "+$1.2"; -0.5 -> "-$0.5" */
export function formatSignedMillionsShort(m: number): string {
  return m >= 0 ? `+$${m.toFixed(1)}` : `-$${Math.abs(m).toFixed(1)}`
}

/** 449.8 -> "$450M" */
export function formatEvShort(m: number): string {
  return `$${Math.round(m).toLocaleString("en-US")}M`
}

/** 1204 -> "1,204.0" (pipeline deal-size column format) */
export function formatDealSizeM(m: number): string {
  return m.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}
