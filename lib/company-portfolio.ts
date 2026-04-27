export interface CompanyPortfolioItem {
  name: string
  product: string
  description: string
  href: string
}

export const companyPortfolioItems: CompanyPortfolioItem[] = [
  {
    name: "VisualHQ",
    product: "Software consulting",
    description: "Digital product design and engineering for web platforms, internal tools, and launch-ready systems.",
    href: "/portfolio",
  },
  {
    name: "Pasive",
    product: "Ecommerce",
    description: "Commerce tooling for storefronts, ordering, checkout, and the workflows behind online sales.",
    href: "https://pasive.co",
  },
  {
    name: "Juju",
    product: "AI Marketing Suite",
    description: "AI-assisted campaign, content, and marketing workflow tools for modern growth teams.",
    href: "https://jujuapp.co",
  },
]

export function getCompanyPortfolioItems(): CompanyPortfolioItem[] {
  return companyPortfolioItems
}
