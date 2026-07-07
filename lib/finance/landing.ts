export interface LandingHero {
  badge: string
  titleLead: string
  titleEmphasis: string
  description: string
  primaryCta: string
  secondaryCta: string
  partnersLabel: string
}

export interface PartnerLogo {
  name: string
  mark: "square" | "pill" | "diamond" | "wordmark"
}

export interface PipelineStat {
  label: string
  value: string
  variant: "neutral" | "primary" | "secondary"
}

export interface PortfolioHealthCard {
  label: string
  status: string
  note: string
}

export interface EcosystemFeature {
  id: "sourcing" | "qofe" | "modeling"
  icon: string
  title: string
  description: string
  core: boolean
  badge?: string
}

export interface QofePreviewRow {
  label: string
  value: string
  tone: "positive" | "alert"
}

export interface EcosystemWideFeature {
  icon: string
  title: string
  description: string
  image?: {
    src: string
    alt: string
  }
}

export interface SectionIntro {
  heading: string
  description: string
}

export interface DocumentLensSection {
  heading: string
  description: string
  bullets: string[]
  image: {
    src: string
    alt: string
  }
  callout: {
    label: string
    title: string
    amount: string
  }
}

export interface FinalCtaSection {
  heading: string
  description: string
  primaryCta: string
  secondaryCta: string
}

export const landingHero: LandingHero = {
  badge: "Platform V2.0 Now Live",
  titleLead: "One place to review deals,",
  titleEmphasis: "check the numbers, and report clearly.",
  description:
    "Visualcns helps investment teams find deals, review company documents, understand real business performance, track portfolio companies, and prepare reports for investors in one connected workflow.",
  primaryCta: "Book a Demo",
  secondaryCta: "Explore the Platform",
  partnersLabel: "Built for serious finance teams",
}

export const partnerLogos: PartnerLogo[] = [
  { name: "GLOBAL CAPITAL", mark: "square" },
  { name: "EQUITY PARTNERS", mark: "pill" },
  { name: "STRATFORD", mark: "diamond" },
  { name: "FINANCE CO.", mark: "wordmark" },
]

export const pipelineStats: PipelineStat[] = [
  { label: "Sourcing", value: "12 Active", variant: "neutral" },
  { label: "Due Diligence", value: "4 QofE", variant: "neutral" },
  { label: "Closed YTD", value: "$240M", variant: "primary" },
  { label: "Avg. IRR", value: "28.4%", variant: "secondary" },
]

export const portfolioHealthCard: PortfolioHealthCard = {
  label: "Portfolio Health",
  status: "STABLE",
  note: "Next LP Report Due: 14 Days",
}

export const ecosystemIntro: SectionIntro = {
  heading: "Everything your team needs in one workflow",
  description:
    "Instead of juggling spreadsheets, folders, and separate tools, your team can do the main parts of the job in one place.",
}

export const ecosystemFeatures: EcosystemFeature[] = [
  {
    id: "sourcing",
    icon: "hub",
    title: "Deal Pipeline",
    description:
      "Keep track of possible deals, see what stage each one is in, and stay organized as opportunities move forward.",
    core: false,
  },
  {
    id: "qofe",
    icon: "auto_awesome",
    title: "Financial Review",
    description:
      "Upload company files, review the numbers, spot unusual items, and turn messy financial data into a cleaner picture of the business.",
    core: true,
    badge: "Core Workflow",
  },
  {
    id: "modeling",
    icon: "analytics",
    title: "Modeling & Planning",
    description:
      "Use cleaned financial data to build forecasts, test assumptions, and support investment decisions with more confidence.",
    core: false,
  },
]

export const qofePreviewRows: QofePreviewRow[] = [
  { label: "Adjusted EBITDA", value: "$45.5M", tone: "positive" },
  { label: "Variance Detected", value: "+2.1%", tone: "alert" },
]

export const ecosystemWideFeatures: EcosystemWideFeature[] = [
  {
    icon: "monitoring",
    title: "Portfolio Monitoring",
    description:
      "Track how portfolio companies are doing over time, follow key business numbers, and catch issues earlier.",
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQtxUJpg78Mrml24nzZ5XQVRtnG7kjfXlQmFHd27LpQbkFZYkvv5-82sKer1QJd5I_Lo8CdmSBCdDsO_qnOvPaxmjg_IYor9U4epiccZvzJYs8PEIKNwNs_9ktkHPD6CdHNAt34vz7vGM8hDedcngmZIARt-fk1E2AyRMoK8QqZJ3xK-BEvySgBDT4bKxNzHolreqmy0bcNF7Y2S3gxqfzhDSaC9eciWbHOSgHuO4l2hqS5dbHKeeo",
      alt: "A clean portfolio monitoring dashboard showing financial health metrics for multiple companies.",
    },
  },
  {
    icon: "assignment_ind",
    title: "Investor Reports",
    description:
      "Prepare clear updates, performance reports, and investor-ready materials without rebuilding everything by hand.",
  },
]

export const documentLensSection: DocumentLensSection = {
  heading: "See where every important number came from.",
  description:
    "When a number changes, you can quickly trace it back to the source document. That makes review easier and gives your team more confidence in the final report.",
  bullets: [
    "Direct links back to source documents",
    "Cleaner data from difficult exports",
    "Shared review for the whole deal team",
  ],
  image: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8JSyuul7eydZpMGL-p3gMh4iIdcJMbT-fRpA94sCJemvdslkZbaloeC8Nw8_1Eq53NVvlb-SCi8_CvXJe8dk-RCCfKUJxPpNG9dt-MWr6V_wSd0fCalVhhWW7ZQrEBmLwn1r7JgXchI52V5VrgUsNFXlI9Gq-UWRrGUzPZcjmK_-utOrkZroL6Orq3D644wq9ttGiZulI5gzNbRtExSyYXbFIT6q-2_57r06ptnwiWp5ljl408I1_",
    alt: "A macro close-up of a digital financial document with a glowing blue AI lens highlighting a specific line item.",
  },
  callout: {
    label: "AI Detected",
    title: "Non-recurring Legal Expense",
    amount: "$245,000",
  },
}

export const finalCtaSection: FinalCtaSection = {
  heading: "Ready to make the work clearer and faster?",
  description:
    "See how Visualcns can help your team review companies, understand performance, and prepare reports with less confusion and less manual work.",
  primaryCta: "Book a Demo",
  secondaryCta: "Talk to the Team",
}
