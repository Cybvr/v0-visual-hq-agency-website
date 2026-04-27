export interface BrandItem {
  slug: string
  name: string
  product: string
  description: string
  href: string
  logo: string
  websiteUrl: string
}

export const brandItems: BrandItem[] = [
  {
    slug: "visualhq",
    name: "VisualHQ",
    product: "Software consulting",
    description: "Digital product design and engineering for web platforms, internal tools, and launch-ready systems.",
    href: "/brands/visualhq",
    logo: "/brands/visualhqlogo.svg",
    websiteUrl: "/portfolio",
  },
  {
    slug: "pasive",
    name: "Pasive",
    product: "Ecommerce",
    description: "Commerce tooling for storefronts, ordering, checkout, and the workflows behind online sales.",
    href: "/brands/pasive",
    logo: "/brands/pasive.png",
    websiteUrl: "https://pasive.com",
  },
  {
    slug: "juju",
    name: "Juju",
    product: "AI Marketing Suite",
    description: "AI-assisted campaign, content, and marketing workflow tools for modern growth teams.",
    href: "/brands/juju",
    logo: "/brands/juju.png",
    websiteUrl: "https://juju.ai",
  },
]

export function getBrandItems(): BrandItem[] {
  return brandItems
}

export function getBrandItemBySlug(slug: string): BrandItem | undefined {
  return brandItems.find((item) => item.slug === slug)
}
