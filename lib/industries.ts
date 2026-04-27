export interface Industry {
  slug: string
  name: string
  description: string
}

export const industries: Industry[] = [
  {
    slug: "startups",
    name: "Startups",
    description: "MVPs, product foundations, and launch systems for founders moving from idea to market.",
  },
  {
    slug: "commerce",
    name: "Commerce",
    description: "Digital storefronts, booking flows, payments, and customer systems for growing businesses.",
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    description: "Web platforms, client portals, and internal tools for firms that sell expertise and execution.",
  },
  {
    slug: "creative-teams",
    name: "Creative Teams",
    description: "AI-assisted visual tools, campaign systems, and production workflows for modern creative work.",
  },
]

export function getIndustries(): Industry[] {
  return industries
}

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug)
}
