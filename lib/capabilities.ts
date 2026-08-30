export interface Capability {
  slug: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  /** Long-form copy for the service detail page, one string per paragraph. */
  body?: string[]
  /** Service areas typically included in an engagement. */
  includes?: string[]
}

export const capabilities: Capability[] = [
  {
    slug: "brand-design",
    title: "Brand Design",
    description: "Codifying who and what your brand can be across every interaction to drive growth and delivery at scale.",
    image: "/services/brand-design.png",
    imageAlt: "Brand system in a website launch",
    includes: [
      "Growth strategy",
      "Brand identity",
      "Brand foundation",
      "Brand systems",
      "Brand architecture",
      "Brand AI tools",
    ],
  },
  {
    slug: "product-experience-design",
    title: "Product & Experience Design",
    description: "Reimagining how people interact with your brand through digital products and experiences that drive business and human impact.",
    image: "/services/product-experience-design.png",
    imageAlt: "Product team reviewing an early build",
    includes: [
      "Solutions design and consulting",
      "AI product strategy and development",
      "Product strategy and vision",
      "Commerce design",
      "Experience design and development",
      "Web and platform solutions",
      "Design systems",
      "Mobile product development",
    ],
  },
  {
    slug: "campaign-content-design",
    title: "Campaign & Content Design",
    description: "Creating connections and cultural relevance through storytelling that integrates technology, media, and design.",
    image: "/services/campaign-content-design.png",
    imageAlt: "Campaign creative and content system",
    includes: [
      "Omnichannel marketing strategy",
      "Social and influencer activation",
      "Campaign design systems",
      "Global content production",
      "Integrated campaigns and platform development",
      "Custom research and creative optimization",
    ],
  },
  {
    slug: "crm-relationship-design",
    title: "CRM & Relationship Design",
    description: "Transforming one-time buyers into lifelong advocates with meaningful customer experiences that build trust, loyalty, and growth.",
    image: "/services/crm-relationship-design.png",
    imageAlt: "Connected customer relationship systems",
    includes: [
      "CRM strategy and execution",
      "Customer journey mapping",
      "Customer segmentation and insights",
      "Customer engagement programs",
      "Loyalty strategy and programs",
      "Personalization",
      "Design systems for CRM",
      "Lifecycle marketing",
    ],
  },
  {
    slug: "visualcns-ventures",
    title: "VisualCNS Ventures",
    description: "Advancing innovation through access to emerging solutions, capabilities, and new product opportunities.",
    image: "/services/visualcns-ventures.png",
    imageAlt: "Team exploring a new product opportunity",
    includes: [
      "Venture consulting",
      "Innovation exchanges",
      "Emerging technology scouting",
      "Pilot development",
      "Innovation studios",
      "Product incubation",
    ],
  },
  {
    slug: "ai-design",
    title: "AI Design",
    description: "Using AI to improve existing work and design new brand experiences that were not possible before.",
    image: "/services/ai-design.png",
    imageAlt: "AI tooling built around a team's workflow",
    includes: [
      "AI application design",
      "AI content studio",
      "Brand AI tools",
      "AI strategy and consulting",
    ],
  },
  {
    slug: "commerce-design",
    title: "Commerce Design",
    description: "Designing digital commerce experiences that meet high technology expectations without losing brand storytelling or customer relationships.",
    image: "/marketing/website-launch.jpg",
    imageAlt: "Digital commerce experience at launch",
  },
]

export function getCapabilities(): Capability[] {
  return capabilities
}

export function getCapabilityBySlug(slug: string): Capability | undefined {
  return capabilities.find((capability) => capability.slug === slug)
}
