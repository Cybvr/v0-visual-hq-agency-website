export interface Capability {
  slug: string
  title: string
  description: string
}

export const capabilities: Capability[] = [
  {
    slug: "product-engineering",
    title: "Product Engineering",
    description: "Full-stack web and mobile systems for teams that need reliable software shipped with taste.",
  },
  {
    slug: "business-automation",
    title: "Business Automation",
    description: "Internal tools, workflows, dashboards, and integrations that make operations calmer and repeatable.",
  },
  {
    slug: "ai-enablement",
    title: "AI Enablement",
    description: "Practical AI features, agents, and creative systems that improve delivery, output, and decision-making.",
  },
  {
    slug: "brand-systems",
    title: "Brand Systems",
    description: "Identity, interface, and content systems that help software products feel clear, credible, and alive.",
  },
]

export function getCapabilities(): Capability[] {
  return capabilities
}

export function getCapabilityBySlug(slug: string): Capability | undefined {
  return capabilities.find((capability) => capability.slug === slug)
}
