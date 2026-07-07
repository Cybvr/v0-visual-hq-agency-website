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

export const deals: Deal[] = [
  {
    name: "AeroDynamic Systems",
    size: "450.0",
    sector: "Industrial Automation",
    stage: "Due Diligence",
    stageTone: "due-diligence",
    partner: "Marcus Kane",
    partnerInitials: "MK",
    partnerAvatarTone: "primary",
  },
  {
    name: "Veridia Health Group",
    size: "1,200.5",
    sector: "Healthcare SaaS",
    stage: "LOI Issued",
    stageTone: "loi",
    partner: "Sarah White",
    partnerInitials: "SW",
    partnerAvatarTone: "secondary",
    highlighted: true,
  },
  {
    name: "FinTech Velocity",
    size: "85.0",
    sector: "Payment Processing",
    stage: "Sourcing",
    stageTone: "neutral",
    partner: "David Lee",
    partnerInitials: "DL",
    partnerAvatarTone: "tertiary",
  },
  {
    name: "Solaris Energy Partners",
    size: "320.0",
    sector: "Renewable Infra",
    stage: "NDA Signed",
    stageTone: "neutral",
    partner: "Marcus Kane",
    partnerInitials: "MK",
    partnerAvatarTone: "primary",
  },
  {
    name: "OmniLogistics Corp",
    size: "58.0",
    sector: "Cold Chain Logistics",
    stage: "Stalled",
    stageTone: "stalled",
    partner: "Sarah White",
    partnerInitials: "SW",
    partnerAvatarTone: "secondary",
  },
]

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
