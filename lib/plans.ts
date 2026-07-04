export type Currency = "NGN" | "USD"
export type Price = "free" | { amount: number; prefix?: string; suffix?: string }

export type ServiceRow = {
  service: string
  scope: string
  price: Price
  timeline: string
  included: string
}

export type TierSpec = { text: string } | { strong: string; rest?: string }

export type GrowthPlan = ServiceRow & {
  features: string[]
  paymentHref?: string
}

export const NGN_PER_USD = 1360

export const customDevelopmentRows: ServiceRow[] = [
  {
    service: "Discovery & Scoping",
    scope: "Fit, scope & build roadmap",
    price: "free",
    timeline: "45 min",
    included: "Fixed quote after call",
  },
  {
    service: "MVP Web App",
    scope: "Up to 5 screens - 1 user role - frontend only",
    price: { amount: 1632000 },
    timeline: "1 week",
    included: "Static frontend (no auth, DB or backend)",
  },
  {
    service: "Full Web App",
    scope: "Up to 12 screens - 2-3 roles - auth, DB, integrations",
    price: { amount: 3808000 },
    timeline: "2 weeks",
    included: "Frontend + backend + auth + DB + API integrations",
  },
  {
    service: "Custom Web App",
    scope: "Marketplaces, streaming, real-time, payments",
    price: { amount: 6120000, prefix: "From " },
    timeline: "4+ weeks",
    included: "Scoped per project",
  },
  {
    service: "Add-on: Backend/API",
    scope: "Extends an existing build",
    price: { amount: 1020000 },
    timeline: "3-5 days",
    included: "Auth, DB, endpoints",
  },
  {
    service: "Maintenance Retainer",
    scope: "Live site upkeep - Basic / Priority / Growth tiers",
    price: { amount: 340000, prefix: "From ", suffix: "/mo" },
    timeline: "Ongoing",
    included: "Updates, fixes & priority support",
  },
  {
    service: "Additional / Out-of-scope",
    scope: "Extra revisions & work beyond agreed scope",
    price: { amount: 54400, suffix: "/hr" },
    timeline: "As needed",
    included: "Billed hourly",
  },
]

export const platformRows: ServiceRow[] = [
  {
    service: "Webflow Site",
    scope: "Up to 7 pages - CMS - responsive",
    price: { amount: 1292000 },
    timeline: "3-5 days",
    included: "Design, build, CMS setup & launch",
  },
  {
    service: "Framer Site",
    scope: "Up to 7 pages - interactive & animated",
    price: { amount: 1156000 },
    timeline: "2-4 days",
    included: "Design, animations & publish",
  },
  {
    service: "WordPress Site",
    scope: "Up to 7 pages - blog - custom theme",
    price: { amount: 1088000 },
    timeline: "3-5 days",
    included: "Theme, plugins, SEO basics & launch",
  },
  {
    service: "Add-on: WooCommerce",
    scope: "E-commerce layer on WordPress",
    price: { amount: 612000, prefix: "+" },
    timeline: "+2-3 days",
    included: "Product catalogue, cart & checkout",
  },
]

export const growthPlanRows: GrowthPlan[] = [
  {
    service: "VisualHQ Pro",
    scope: "Monthly growth system for audience-to-action campaigns",
    price: { amount: 200000 },
    timeline: "Monthly",
    included: "Strategy, ads, automation, Notion OS & campaign design",
    paymentHref: "https://paystack.shop/pay/visualhqpro",
    features: [
      "Digital strategy that maps the next 30 days",
      "Meta Business Suite ad buy management to reach the right audience",
      "SendPulse automation for follow-up and conversion flows",
      "Dedicated Notion OS to manage campaign assets and tasks",
      "Visual design that makes the campaign feel premium",
    ],
  },
]

export const retainers: Array<{
  flag: string
  name: string
  amount: number
  featured?: boolean
  specs: TierSpec[]
}> = [
  {
    flag: "",
    name: "Basic",
    amount: 340000,
    specs: [
      { strong: "5 hrs", rest: "of work / month" },
      { strong: "48-hour", rest: "response time" },
      { text: "Updates, patches & bug fixes" },
      { text: "Email support" },
    ],
  },
  {
    flag: "Most popular",
    name: "Priority",
    amount: 612000,
    featured: true,
    specs: [
      { strong: "12 hrs", rest: "of work / month" },
      { strong: "24-hour", rest: "response time" },
      { text: "Everything in Basic" },
      { text: "Priority queue & monthly check-in" },
    ],
  },
  {
    flag: "",
    name: "Growth",
    amount: 800000,
    specs: [
      { strong: "25 hrs", rest: "of work / month" },
      { strong: "Same-day", rest: "response time" },
      { text: "Everything in Priority" },
      { text: "Feature development & monthly strategy call" },
    ],
  },
]

function ngnToUsd(amount: number) {
  const raw = amount / NGN_PER_USD
  const roundTo = raw < 50 ? 1 : 10
  return Math.round(raw / roundTo) * roundTo
}

export function formatPrice(price: Price, currency: Currency) {
  if (price === "free") return "Free"
  const { amount, prefix = "", suffix = "" } = price
  if (currency === "USD") {
    return `${prefix}$${ngnToUsd(amount).toLocaleString("en-US")}${suffix}`
  }
  return `${prefix}₦${amount.toLocaleString("en-NG")}${suffix}`
}
