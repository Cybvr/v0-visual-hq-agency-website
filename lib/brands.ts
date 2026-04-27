export interface BrandItem {
  slug: string
  name: string
  product: string
  description: string
  content?: string
  href: string
  logo: string
  screenshot?: string
  websiteUrl: string
  color: string
}

export const brandItems: BrandItem[] = [
  {
    slug: "visualhq",
    name: "VisualHQ",
    product: "Software consulting",
    description: "Digital product design and engineering for web platforms, internal tools, and launch-ready systems.",
    href: "/brands/visualhq",
    logo: "/images/brands/visualhqlogo.svg",
    websiteUrl: "/portfolio",
    color: "#3b82f6",
  },
  {
    slug: "pasive",
    name: "Pasive",
    product: "Ecommerce",
    description: "Commerce tooling for storefronts, ordering, checkout, and the workflows behind online sales.",
    content: "Pasive is a comprehensive e-commerce and community ecosystem designed to help creators achieve independence by bypassing social media algorithms and building direct relationships with their fans. Operating on a \"Your House, Your Rules\" philosophy, the platform provides tools for selling a wide variety of offerings—including digital products, ebooks, courses, memberships, physical goods, and professional services—while fostering engagement through dedicated \"Spaces.\" With a global infrastructure that supports payouts in multiple currencies like NGN, USD, GBP, and EUR via Stripe and Flutterwave, Pasive serves as an all-in-one hub for creators to monetize their content and manage their business with 100% ownership.",
    href: "/brands/pasive",
    logo: "/images/brands/pasive.png",
    screenshot: "/images/screenshots/pasive.png",
    websiteUrl: "https://pasive.com",
    color: "#10b981",
  },
  {
    slug: "juju",
    name: "Juju",
    product: "AI Marketing Suite",
    description: "AI-assisted campaign, content, and marketing workflow tools for modern growth teams.",
    href: "/brands/juju",
    logo: "/images/brands/juju.png",
    websiteUrl: "https://juju.ai",
    color: "#f97316",
  },
  {
    slug: "waddi",
    name: "Waddi",
    product: "AI Experience Planner",
    description: "AI-powered experience and event planning platform designed to eliminate logistical stress.",
    content: "Waddi is an AI-powered experience and event planning platform designed to eliminate the logistical stress of organizing trips, celebrations, and corporate retreats. By leveraging a \"Brief to Go\" workflow, the platform uses AI to generate tailored itineraries, negotiate with vendors in real-time, and manage centralized task lists, allowing users to focus on the experience rather than the spreadsheets. Specifically optimized for the African market and its diaspora, Waddi connects clients with top-tier vendors in cities like Lagos for everything from rooftop soirées to beach excursions, providing a seamless end-to-end infrastructure for event management, RSVP tracking, and on-the-ground execution.",
    href: "/brands/waddi",
    logo: "/images/brands/waddi.png",
    screenshot: "/images/screenshots/waddi.png",
    websiteUrl: "https://wadd.cc",
    color: "#10b981",
  },
]

export function getBrandItems(): BrandItem[] {
  return brandItems
}

export function getBrandItemBySlug(slug: string): BrandItem | undefined {
  return brandItems.find((item) => item.slug === slug)
}
