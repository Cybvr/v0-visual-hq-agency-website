export interface Industry {
  name: string
  description: string
}

export const industries: Industry[] = [
  {
    name: "Startups",
    description: "MVPs, product foundations, and launch systems for founders moving from idea to market.",
  },
  {
    name: "Commerce",
    description: "Digital storefronts, booking flows, payments, and customer systems for growing businesses.",
  },
  {
    name: "Professional Services",
    description: "Web platforms, client portals, and internal tools for firms that sell expertise and execution.",
  },
  {
    name: "Creative Teams",
    description: "AI-assisted visual tools, campaign systems, and production workflows for modern creative work.",
  },
]

export function getIndustries(): Industry[] {
  return industries
}
