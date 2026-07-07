export interface AiReportingHero {
  badgeIcon: string
  badgeLabel: string
  headline: string
  headlineAccent: string
  description: string
  primaryCta: string
  secondaryCta: string
  image: string
  imageAlt: string
}

export interface DocumentLensCallout {
  icon: string
  label: string
  quote: string
}

export interface ReportingPillar {
  /** Material Symbols Outlined icon name */
  icon: string
  title: string
  description: string
}

export interface TbMappingRow {
  accountCode: string
  description: string
  /** Tooltip shown on the AI info icon, when the row is AI-flagged */
  aiFlag?: string
  category: string
  fy23Actual: string
  adjustments: string
  proForma: string
  /** Rows highlighted with the secondary-container tint */
  highlighted?: boolean
}

export interface TbMappingSection {
  heading: string
  description: string
  checklist: string[]
  tableTitle: string
  tableBadge: string
  saveLabel: string
  columns: string[]
  rows: TbMappingRow[]
  syncNote: string
}

export interface DocumentLensFeature {
  /** Material Symbols Outlined icon name */
  icon: string
  title: string
  description: string
}

export interface DocumentLensSection {
  heading: string
  description: string
  image: string
  imageAlt: string
  features: DocumentLensFeature[]
}

export interface AiReportingCta {
  heading: string
  description: string
  primaryCta: string
  secondaryCta: string
}

export const aiReportingHero: AiReportingHero = {
  badgeIcon: "auto_awesome",
  badgeLabel: "Next-Gen Quality of Earnings",
  headline: "Institutional-Grade Reporting",
  headlineAccent: "at Machine Speed",
  description:
    "Accelerate deal diligence with Visualcns Finance. Automate adjustments, link models to source documents, and generate bank-ready QofE reports in hours, not weeks.",
  primaryCta: "Request Demo",
  secondaryCta: "View Sample Report",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCjmVSjYcQSO4ediSjbmxg-DqsdfBIAKIklKMgE-SfBHh_T0M2J4uR9PgJxH8e8hIY9cuyzKnMDPCMn_yjPYXlnL5uFddRCxBesLm45SgSkedPANL9Jnn0zmvo6QJQZrPFKT8aqCypfmZ4YWGj1EZDoduesTyODL9PAewTgN3WIfffGozjcgTY4XlJ6qV8qNDvrRVBBQz0ajrbKUY0nJGeH5Gn9SwiRJwfzkcwv3_5DDyAKZhgzJlzv",
  imageAlt:
    "A clean, minimalist high-fidelity UI of a financial dashboard showing complex multi-column charts, a trial balance mapping interface, and a 'Document Lens' sidebar. The scene is lit with bright, professional studio lighting with a focus on deep navy blues and crisp white surfaces. The aesthetic is institutional and high-end, representing private equity software.",
}

export const documentLensCallout: DocumentLensCallout = {
  icon: "find_in_page",
  label: "Document Lens™",
  quote: "“Verified against Page 14 of Asset Purchase Agreement.”",
}

export const reportingPillarsHeading = "Precision Engineering for Diligence"
export const reportingPillarsDescription =
  "Three pillars of the Visualcns reporting engine designed for high-stakes transaction advisory."

export const reportingPillars: ReportingPillar[] = [
  {
    icon: "air",
    title: "Intelligent OCR",
    description:
      "Convert scanned PDFs and messy bank statements into structured data models with 99.9% accuracy via proprietary LLM parsing.",
  },
  {
    icon: "analytics",
    title: "AI-Driven Analysis",
    description:
      "Automatically flag TTM anomalies, identify non-recurring expenses, and suggest EBITDA adjustments based on historical deal patterns.",
  },
  {
    icon: "ios_share",
    title: "One-Click Export",
    description:
      "Generate fully formatted, executive-ready QofE PDF decks and Excel models that adhere to the strictest Big 4 reporting standards.",
  },
]

export const tbMappingSection: TbMappingSection = {
  heading: "Dynamic Trial Balance Mapping",
  description:
    "Our high-density mapping interface eliminates manual data entry. Drag and drop COA entries, merge accounts, and watch your EBITDA bridge update in real-time.",
  checklist: [
    "Auto-reconciliation against general ledger",
    "Real-time “What-If” adjustment scenarios",
    "Audit trail for every changed cell",
  ],
  tableTitle: "TB Mapping: FY23-FY24 Consolidation",
  tableBadge: "Draft v2.4",
  saveLabel: "Save Changes",
  columns: ["Account Code", "Description", "Categorization", "FY23 Actual", "Adjustments", "Pro-Forma"],
  rows: [
    {
      accountCode: "4001-00",
      description: "Net Product Revenue",
      category: "REVENUE",
      fy23Actual: "$12,450,000",
      adjustments: "—",
      proForma: "$12,450,000",
    },
    {
      accountCode: "6050-10",
      description: "Professional Fees",
      aiFlag: "AI Flagged: Non-recurring deal costs",
      category: "OPEX",
      fy23Actual: "$450,000",
      adjustments: "($225,000)",
      proForma: "$225,000",
      highlighted: true,
    },
    {
      accountCode: "7010-00",
      description: "Rent & Utilities",
      category: "G&A",
      fy23Actual: "$890,200",
      adjustments: "—",
      proForma: "$890,200",
    },
    {
      accountCode: "8005-22",
      description: "Personal Expense Add-back",
      category: "ADJ",
      fy23Actual: "$0",
      adjustments: "$125,000",
      proForma: "$125,000",
      highlighted: true,
    },
  ],
  syncNote: "Last synced with ERP 4 minutes ago",
}

export const documentLensSection: DocumentLensSection = {
  heading: "Trust the Source with Document Lens™",
  description:
    "Say goodbye to “black box” AI. Visualcns Finance creates a live, bidirectional link between every number in your report and its origin in the source PDF.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAqe3JsRn2LF_yfIbanCeaFJkw5dV-KsAwAXemgM45PHiMroOgvC0HzUCsH2LTCFfxD-tnYlT5wa4zFtFwNFNt9tLlFmfra-1Eqqauysiok0PMAD24bMHqRRTi7RJr1BgTWF_WKVC-hBxiOFDFn_UHAIPnzXdZLdopNZiUsDPSe3aXLLR7uF_h-VJQSYSuW5qoQrd0UuG-b9foNQHdXDFe5cE5VPF_kPKOcfjzV4vJ2I23-wvB51L5m",
  imageAlt:
    "A futuristic and sleek close-up of a digital magnifying glass highlighting a specific paragraph in a legal document, which is then connected by a glowing digital thread to a cell in a financial spreadsheet. The background is a sophisticated deep navy blue environment with glass-like textures and elegant lighting, suggesting a fusion of law, finance, and advanced technology.",
  features: [
    {
      icon: "verified_user",
      title: "Verifiable Confidence",
      description: "Instantly view the underlying contract clause or invoice simply by clicking a cell.",
    },
    {
      icon: "history",
      title: "Full Revision History",
      description: "See exactly who changed a mapping and what source document justified it.",
    },
  ],
}

export const aiReportingCta: AiReportingCta = {
  heading: "Ready to evolve your diligence process?",
  description:
    "Join over 450 private equity firms and investment banks using Visualcns Finance to close deals faster with superior accuracy.",
  primaryCta: "Schedule a Strategic Review",
  secondaryCta: "Contact Sales Team",
}
