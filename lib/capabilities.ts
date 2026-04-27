export interface Capability {
  title: string
  description: string
}

export const capabilities: Capability[] = [
  {
    title: "Product Engineering",
    description: "Full-stack web and mobile systems for teams that need reliable software shipped with taste.",
  },
  {
    title: "Business Automation",
    description: "Internal tools, workflows, dashboards, and integrations that make operations calmer and repeatable.",
  },
  {
    title: "AI Enablement",
    description: "Practical AI features, agents, and creative systems that improve delivery, output, and decision-making.",
  },
  {
    title: "Brand Systems",
    description: "Identity, interface, and content systems that help software products feel clear, credible, and alive.",
  },
]

export function getCapabilities(): Capability[] {
  return capabilities
}
