import { getCompany } from "./companies"
import { deriveFinancials, formatDealSizeM, getFinancials } from "./deal-financials"

export type PipelineStageTone = "primary" | "secondary" | "highlight" | "closed"

export interface PipelineStage {
  label: string
  count: number
  /** Funnel conversion bar width, percent */
  progress: number
  tone: PipelineStageTone
}

export type DealStageTone = "due-diligence" | "loi" | "neutral" | "stalled"

export type PartnerAvatarTone = "primary" | "secondary" | "tertiary"

export interface Deal {
  /** Stable slug used to select this deal from the pipeline (e.g. in ?deal= links) */
  id: string
  name: string
  /** Deal size in $M, formatted as in source */
  size: string
  sector: string
  stage: string
  stageTone: DealStageTone
  partner: string
  partnerInitials: string
  partnerAvatarTone: PartnerAvatarTone
  highlighted?: boolean
}

export type ActivityIconTone = "secondary-container" | "tertiary-dark" | "secondary-fixed" | "muted"

export interface ActivityItem {
  icon: string
  iconTone: ActivityIconTone
  title: string
  description: string
  time: string
}

export interface ConfidenceMetric {
  label: string
  /** Percent value */
  value: number
  tone: "primary" | "secondary"
}

export interface DdConfidence {
  label: string
  score: string
  icon: string
  metrics: ConfidenceMetric[]
  note: string
}

export interface MarketSentiment {
  title: string
  body: string
  cta: string
}

export const pipelineStages: PipelineStage[] = [
  { label: "SOURCING", count: 24, progress: 100, tone: "primary" },
  { label: "NDAs", count: 12, progress: 75, tone: "primary" },
  { label: "LOIs", count: 6, progress: 45, tone: "secondary" },
  { label: "DUE DILIGENCE", count: 3, progress: 25, tone: "highlight" },
  { label: "CLOSED", count: 1, progress: 10, tone: "closed" },
]

/**
 * Deal-team attribution per company. Identity (name, sector, stage) comes from
 * the canonical company registry; deal size is the enterprise value computed
 * from that company's financial profile.
 */
interface DealAttribution {
  id: string
  stageTone: DealStageTone
  partner: string
  partnerInitials: string
  partnerAvatarTone: PartnerAvatarTone
  highlighted?: boolean
}

const dealAttributions: DealAttribution[] = [
  {
    id: "aerodynamic-systems",
    stageTone: "due-diligence",
    partner: "Marcus Kane",
    partnerInitials: "MK",
    partnerAvatarTone: "primary",
  },
  {
    id: "veridia-health-group",
    stageTone: "loi",
    partner: "Sarah White",
    partnerInitials: "SW",
    partnerAvatarTone: "secondary",
    highlighted: true,
  },
  {
    id: "fintech-velocity",
    stageTone: "neutral",
    partner: "David Lee",
    partnerInitials: "DL",
    partnerAvatarTone: "tertiary",
  },
  {
    id: "solaris-energy-partners",
    stageTone: "neutral",
    partner: "Marcus Kane",
    partnerInitials: "MK",
    partnerAvatarTone: "primary",
  },
  {
    id: "omnilogistics-corp",
    stageTone: "stalled",
    partner: "Sarah White",
    partnerInitials: "SW",
    partnerAvatarTone: "secondary",
  },
  {
    // Bridges the lifecycle: a closed deal that also appears as an owned
    // holding (Avionics Group) on the Portfolio and LP Reports screens.
    id: "avionics-group",
    stageTone: "neutral",
    partner: "Marcus Kane",
    partnerInitials: "MK",
    partnerAvatarTone: "primary",
  },
]

export const deals: Deal[] = dealAttributions.map((attribution) => {
  const company = getCompany(attribution.id)
  const derived = deriveFinancials(getFinancials(attribution.id))
  return {
    ...attribution,
    name: company.name,
    sector: company.sector,
    stage: company.stage,
    size: formatDealSizeM(derived.enterpriseValueM),
  }
})

export function getDealById(id: string | undefined): Deal | undefined {
  return id ? deals.find((deal) => deal.id === id) : undefined
}

/**
 * The one fully-worked example deal (in Due Diligence). Used as the default
 * subject for the Analysis workspace when no specific deal is selected, so
 * every analysis screen always has a named company to render.
 */
export const flagshipDeal: Deal = deals.find((deal) => deal.stageTone === "due-diligence") ?? deals[0]

/** Resolve the selected deal from an id, falling back to the flagship deal. */
export function resolveDeal(id: string | undefined): Deal {
  return getDealById(id) ?? flagshipDeal
}

export const recentActivity: ActivityItem[] = [
  {
    icon: "history_edu",
    iconTone: "secondary-container",
    title: "NDA Executed",
    description: "OmniLogistics Corp legal team finalized the bilateral NDA.",
    time: "2 hours ago",
  },
  {
    icon: "check_circle",
    iconTone: "tertiary-dark",
    title: "DD Checklist Updated",
    description: "AeroDynamic Systems uploaded 14 new tax documents to the VDR.",
    time: "5 hours ago",
  },
  {
    icon: "mail",
    iconTone: "secondary-fixed",
    title: "Email Received",
    description: "Veridia Health CEO confirmed availability for the management meeting.",
    time: "Yesterday",
  },
  {
    icon: "person_add",
    iconTone: "muted",
    title: "New Lead",
    description: 'Marcus Kane added "Skyward Avionics" to the sourcing funnel.',
    time: "Yesterday",
  },
]

export const ddConfidence: DdConfidence = {
  label: "Active DD Confidence",
  score: "88%",
  icon: "hub",
  metrics: [
    { label: "Data Integrity", value: 94, tone: "primary" },
    { label: "Risk Mitigation", value: 82, tone: "secondary" },
  ],
  note: '"Confidence scores are derived from AI cross-referencing of VDR disclosures vs. initial deck projections."',
}

export const marketSentiment: MarketSentiment = {
  title: "Market Sentiment Analysis",
  body: "Our AI Document Lens has identified a 15% increase in valuation multiples for European B2B SaaS targets this quarter. Adjusting strategy for Project Alpha sourcing.",
  cta: "View Intelligence Report",
}
