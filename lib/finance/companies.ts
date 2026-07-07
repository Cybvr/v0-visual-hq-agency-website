/**
 * Canonical company registry — the single source of truth for every company
 * name, sector, and lifecycle stage shown anywhere in the finance vertical.
 * Pipeline deals, Analysis subjects, Portfolio holdings, LP Report assets,
 * and Modeling workbooks all derive their identity from this list.
 */

export type CompanyStage =
  | "Sourcing"
  | "NDA Signed"
  | "LOI Issued"
  | "Due Diligence"
  | "Stalled"
  | "Closed"
  | "Owned"

export interface Company {
  /** Stable slug used to reference this company (e.g. in ?deal= links) */
  id: string
  name: string
  sector: string
  stage: CompanyStage
}

export const companies: Company[] = [
  // Prospects moving through the deal pipeline
  { id: "aerodynamic-systems", name: "AeroDynamic Systems", sector: "Industrial Automation", stage: "Due Diligence" },
  { id: "veridia-health-group", name: "Veridia Health Group", sector: "Healthcare SaaS", stage: "LOI Issued" },
  { id: "fintech-velocity", name: "FinTech Velocity", sector: "Payment Processing", stage: "Sourcing" },
  { id: "solaris-energy-partners", name: "Solaris Energy Partners", sector: "Renewable Infra", stage: "NDA Signed" },
  { id: "omnilogistics-corp", name: "OmniLogistics Corp", sector: "Cold Chain Logistics", stage: "Stalled" },
  // Bridges the lifecycle: closed through the pipeline, now an owned holding
  { id: "avionics-group", name: "Avionics Group", sector: "Aerospace & Defense", stage: "Closed" },
  // Holdings acquired in earlier funds (not visible in the current pipeline)
  { id: "nexgen-health", name: "NexGen Health", sector: "Healthcare IT", stage: "Owned" },
  { id: "stellar-tech", name: "Stellar Tech", sector: "SaaS / Enterprise", stage: "Owned" },
  { id: "logimaster", name: "LogiMaster", sector: "Supply Chain", stage: "Owned" },
]

export function getCompany(id: string): Company {
  const company = companies.find((candidate) => candidate.id === id)
  if (!company) throw new Error(`Unknown company id: ${id}`)
  return company
}
