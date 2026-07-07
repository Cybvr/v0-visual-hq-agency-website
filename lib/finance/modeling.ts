import { getCompany } from "./companies"
import { deriveFinancials, formatEvShort, getFinancials } from "./deal-financials"

export interface ModelingHubMeta {
  title: string
  subtitle: string
  searchPlaceholder: string
}

export interface FeaturedDealMetaCard {
  label: string
  icon: string
  iconFilled?: boolean
  value: string
}

export interface FeaturedDeal {
  badge: string
  name: string
  sector: string
  ev: string
  evLabel: string
  image: string
  imageAlt: string
  meta: FeaturedDealMetaCard[]
  primaryAction: string
  secondaryAction: string
}

export interface PortfolioStat {
  label: string
  value: string
  /** Progress bar fill percentage; omit for stats without a bar */
  pct?: number
}

export interface PortfolioSummary {
  eyebrow: string
  title: string
  stats: PortfolioStat[]
  ctaLabel: string
}

export interface ModelingTab {
  label: string
  icon: string
}

export type ModelIconStyle = "tertiary-fixed" | "surface-highest" | "primary-container"
export type ModelBadgeTone = "green" | "amber" | "blue"

export interface ModelCard {
  name: string
  type: string
  icon: string
  iconStyle: ModelIconStyle
  badge?: { label: string; tone: ModelBadgeTone }
  updated: string
  linkIcon: "link" | "link_off"
  linkLabel: string
}

export type SyncStatusTone = "green" | "amber" | "blue"

export interface SyncRow {
  model: string
  integrity: { icon: string; iconFilled: boolean; label: string; tone: "green" | "amber" }
  /** Linked workbook chip; omit when there is no active link */
  link?: string
  status: { label: string; tone: SyncStatusTone }
  user: { initials: string; name: string; avatar: "primary" | "secondary" | "tertiary" }
  highlighted?: boolean
}

export const modelingHubMeta: ModelingHubMeta = {
  title: "Modeling & Valuation Hub",
  subtitle: "Institutional Deal Library & AI-Linked Workbooks",
  searchPlaceholder: "Search models, assets, or tags...",
}

export const featuredDeal: FeaturedDeal = {
  badge: "Active Deal",
  name: `${getCompany("aerodynamic-systems").name} — Platform LBO`,
  sector: `Sector: ${getCompany("aerodynamic-systems").sector}`,
  ev: formatEvShort(deriveFinancials(getFinancials("aerodynamic-systems")).enterpriseValueM),
  evLabel: "EV Estimate",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBK5PyPKiZF1NWk0aCCVe4gdWW4SzcfnuM1UqL3v3xRxAsAljCXtPZaAh3HhxOluYbNobYqyPJ4ijBBB79jB4NU2hnDCI54aVKlKKQvArUe54OitUqle8w786o_OBDP58FkM2eS7vFL8eAwTz8AvwVMfTzqUhmMzkiVL2aVWMT_2L8sykLXWDQ18A8SQ7uT2em6wMNdScdagQHf9MLXo20vr8c8UwvRL_nWnk4a48xYrW159tjJCf4l",
  imageAlt:
    "A high-contrast professional photograph of a modern financial district with glass skyscrapers reflecting a clear blue sky. The image is captured from a low angle to convey power and institutional scale, featuring deep navy and slate grey tones consistent with a private equity visual identity. Soft sunlight filters through the buildings, creating a sophisticated and authoritative atmosphere.",
  meta: [
    { label: "Linked QofE", icon: "verified", iconFilled: true, value: "v2.4 - Adjusted" },
    { label: "Last Modified", icon: "calendar_today", value: "Oct 14, 2024" },
  ],
  primaryAction: "Edit in Web",
  secondaryAction: "Excel",
}

export const portfolioSummary: PortfolioSummary = {
  eyebrow: "Portfolio Summary",
  title: "Active Valuations",
  stats: [
    { label: "LBO Models", value: "12", pct: 65 },
    { label: "DCF Analysis", value: "28", pct: 88 },
    { label: "Comparables", value: "154" },
  ],
  ctaLabel: "DOWNLOAD ROLLUP REPORT",
}

export const modelingTabs: ModelingTab[] = [
  { label: "LBO Models", icon: "account_balance" },
  { label: "DCF Analysis", icon: "water_drop" },
  { label: "Comparable Companies", icon: "compare_arrows" },
  { label: "Archive", icon: "history" },
]

export const modelCards: ModelCard[] = [
  {
    name: getCompany("aerodynamic-systems").name,
    type: "Acquisition Model - Buy Side",
    icon: "table_view",
    iconStyle: "tertiary-fixed",
    badge: { label: "VERIFIED", tone: "green" },
    updated: "2H AGO",
    linkIcon: "link",
    linkLabel: "QofE V1.2",
  },
  {
    name: getCompany("veridia-health-group").name,
    type: "Growth Equity / LBO Hybrid",
    icon: "calculate",
    iconStyle: "surface-highest",
    badge: { label: "DRAFT", tone: "amber" },
    updated: "OCT 12",
    linkIcon: "link_off",
    linkLabel: "NO QofE",
  },
  {
    name: `${getCompany("avionics-group").name} Recap`,
    type: "Dividend Recapitalization",
    icon: "insights",
    iconStyle: "primary-container",
    badge: { label: "REVIEW REQUIRED", tone: "blue" },
    updated: "OCT 10",
    linkIcon: "link",
    linkLabel: "QofE V0.9",
  },
  {
    name: `${getCompany("stellar-tech").name} Infrastructure`,
    type: "Asset-Level LBO Model",
    icon: "data_object",
    iconStyle: "surface-highest",
    updated: "SEP 29",
    linkIcon: "link",
    linkLabel: "QofE FINAL",
  },
]

export const createModelPlaceholder = {
  title: "Create New Model",
  description: "Start from a template or import an existing XLSX file",
}

export const syncSection = {
  title: "Model Sync Status",
  subtitle: "Real-time status of AI-linked adjustments and workbook integrity",
  refreshLabel: "Force Global Refresh",
  columns: ["Model Name", "Integrity Check", "Visualcns Link", "Status", "User"],
}

export const syncRows: SyncRow[] = [
  {
    model: getCompany("aerodynamic-systems").name,
    integrity: { icon: "check_circle", iconFilled: true, label: "Healthy", tone: "green" },
    link: "QofE_LTM_Adj_V12",
    status: { label: "Finalized", tone: "green" },
    user: { initials: "JD", name: "J. Dimon", avatar: "primary" },
  },
  {
    model: getCompany("veridia-health-group").name,
    integrity: { icon: "warning", iconFilled: false, label: "1 Dependency Missing", tone: "amber" },
    status: { label: "In Progress", tone: "amber" },
    user: { initials: "MS", name: "M. Solomon", avatar: "secondary" },
    highlighted: true,
  },
  {
    model: `${getCompany("avionics-group").name} Recap`,
    integrity: { icon: "check_circle", iconFilled: true, label: "Healthy", tone: "green" },
    link: "Debt_Sched_Cap_v2",
    status: { label: "Review", tone: "blue" },
    user: { initials: "BG", name: "B. Gorman", avatar: "tertiary" },
  },
]
