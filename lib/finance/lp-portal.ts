export interface LpPortalHero {
  titleLines: string[]
  body: string
  cta: string
}

export interface LpTrendMetric {
  label: string
  value: string
  trend: string
}

export interface LpProgressMetric {
  label: string
  value: string
  progressPct: number
  target: string
}

export interface LpIrrMetric {
  label: string
  value: string
  badge: string
}

export interface LpReportDocument {
  name: string
  period: string
  format: "PDF" | "XLSX"
  /** Material Symbols Outlined icon name */
  icon: string
}

export interface LpCapitalCall {
  title: string
  dueDate: string
  amount: string
  cta: string
}

export interface LpMessage {
  body: string
  meta: string
}

export interface LpPortfolioAsset {
  tag: string
  name: string
  detail: string
  image: string
  alt: string
}

export const lpBreadcrumb = {
  section: "Investor Relations Portal / ",
  page: "Fund Performance Summary",
}

export const lpHero: LpPortalHero = {
  titleLines: ["Institutional Trust,", "Augmented Intelligence."],
  body: "Welcome back, Limited Partner. Your Q3 2023 performance summary and capital account details are now available for review.",
  cta: "Download Full Q3 Package",
}

export const lpTvpiMetric: LpTrendMetric = {
  label: "Total Value (TVPI)",
  value: "2.48x",
  trend: "+0.12 vs Q2",
}

export const lpDpiMetric: LpProgressMetric = {
  label: "Distributions (DPI)",
  value: "0.85x",
  progressPct: 35,
  target: "Target Realization: 1.20x",
}

export const lpNetIrrMetric: LpIrrMetric = {
  label: "Net IRR",
  value: "24.6%",
  badge: "Top Quartile",
}

export const lpReportDocuments: LpReportDocument[] = [
  {
    name: "Q3 2023 Performance Deck",
    period: "Sept 30, 2023",
    format: "PDF",
    icon: "picture_as_pdf",
  },
  {
    name: "Q3 Schedule of Investments",
    period: "Sept 30, 2023",
    format: "XLSX",
    icon: "table_chart",
  },
  {
    name: "Annual Tax Letter (K-1)",
    period: "Dec 31, 2022",
    format: "PDF",
    icon: "picture_as_pdf",
  },
]

export const lpCapitalCall: LpCapitalCall = {
  title: "Capital Call Pending",
  dueDate: "Due Date: Oct 25, 2023",
  amount: "$450,000.00",
  cta: "Confirm Wire",
}

export const lpIrMessage: LpMessage = {
  body: "The Q3 General Partner letter is now available for direct messaging if you have specific questions about the valuation of Core Tech Assets.",
  meta: "GP Office - 2h ago",
}

export const lpPortfolioAssets: LpPortfolioAsset[] = [
  {
    tag: "Cloud Infrastructure",
    name: "Stratosphere Systems",
    detail: "Valuation Uplift: +22% YoY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlkCsGhkLCUnhAsi8takMrnsnYzc0Kf22tiuHs8TfFizGm4DaqIoufj1orUz_kZcmwWhjMF28xG4iwVRJp9tdIr11EyldShuMwOZG7vaRSEJLkdiTOcIWwDXDyE-5bd0yycI88LJPqCeyz7-VzxH8q7Ek1MJt5Uee1bYI4k6TH1zFO0a8FOgRJO9-CUWNQ6n-w9wEECBZobpvAZt6vtfgcN4Ah373LKs1DtHxq2FdmMcguWUL-jqzI",
    alt: "A cinematic, architectural shot of a futuristic data center campus at dusk with cool blue lighting and sleek metallic textures, representing a high-performing private equity asset within a modern institutional framework. The lighting is sophisticated and minimal, emphasizing clean lines and high-value technology infrastructure.",
  },
  {
    tag: "Biotech Excellence",
    name: "OmniGene Therapeutics",
    detail: "Series C Completed successfully",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMd8Zn-8BMxXyio-2v7Ex7HCloEqS1fEzaJvcJDY4kIEa-vM2ovrWmJGWrMwS8upr9QCdEzbZ4MmgzsUFKtVqsCu71t7Fo6GZjptspretiDJlcPz_kaMHSwTc9f_rz7WTwDVbb1k4OQ3YQvDp7uQ_D2RJrbAGGB5uJEYwYcm8EiY_Ku3DZ8Q-V-nGhDlV2qkdQj3HQhvq9eHrNMl_MFy8bxazSkDX27yYGfJ3Bl2Z7NldlowqPOLLI",
    alt: "An elegant, macro photograph of a sustainable laboratory setting with high-end glass equipment and soft, natural daylight. The aesthetic is clean, clinical, and prestigious, reflecting a high-growth biotech investment for an institutional portfolio. The color palette is dominated by soft whites and subtle teal accents.",
  },
  {
    tag: "Real Assets",
    name: "Velocity Logistics Hub",
    detail: "100% Leased to Tier-1 Tenants",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgYI0Ss_txu_JSct2jFcUDZaE1rj3szQEJnkqX8iksB8AEdEdCp9Q2VSR897sJzkOYnIaVNkmh46o1fNn8bhRMo2ZVj33q8ctV0AhFhaJpSdk-uhc0tOHwg-_5D-TcfakNPXAe_RAhX4zN56AUBcNBwpxxFwDQQzEgLZyP5LjNmrXUtSxT-4OZ8woKGlIsg88qIolbvT_EcYdIXCUvCpeQl0BAKxVc8zjGgNj2BrdntebkIcecl-sG",
    alt: "A sophisticated shot of a modern, eco-friendly logistics center with solar panels and autonomous transit vehicles, captured with professional architectural photography techniques. The scene conveys efficiency, scale, and high-value real estate investment, utilizing a palette of deep blues and vibrant ecological greens.",
  },
]
