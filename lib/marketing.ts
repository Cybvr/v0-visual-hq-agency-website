export type MarketingPost = {
  slug: string
  image: string
  imageAlt: string
  caption: string
  likes: number
  comments: number
  timeAgo: string
}

export type MarketingProfile = {
  handle: string
  name: string
  category: string
  bio: string
  site: string
  followers: string
  following: string
}

export const marketingProfile: MarketingProfile = {
  handle: "visualhq.studio",
  name: "VisualHQ",
  category: "Marketing agency",
  bio: "Visual style, copy tone and the workflow that keeps brands publishing month after month. Lagos.",
  site: "visualhq.pro",
  followers: "2,431",
  following: "56",
}

export const marketingPosts: MarketingPost[] = [
  {
    slug: "fintech-dashboard",
    image: "/fintech-dashboard-dark-modern.jpg",
    imageAlt: "Dark fintech dashboard design",
    caption: "Fintech dashboard, dark mode done right. Design that makes numbers feel calm.",
    likes: 312,
    comments: 14,
    timeAgo: "6h",
  },
  {
    slug: "creative-studio-identity",
    image: "/creative-studio-brand-identity-minimal.jpg",
    imageAlt: "Minimal creative studio brand identity",
    caption: "Brand identity for a creative studio. Minimal on purpose.",
    likes: 268,
    comments: 9,
    timeAgo: "1d",
  },
  {
    slug: "food-delivery-app",
    image: "/food-delivery-app-interface-orange.jpg",
    imageAlt: "Food delivery app interface",
    caption: "Appetite-first UI. A delivery experience designed around the food, not the menu tree.",
    likes: 421,
    comments: 22,
    timeAgo: "2d",
  },
  {
    slug: "healthcare-brand",
    image: "/healthcare-brand-identity-clean.jpg",
    imageAlt: "Clean healthcare brand identity",
    caption: "Healthcare branding that feels human. Clean, warm, trustworthy.",
    likes: 197,
    comments: 7,
    timeAgo: "3d",
  },
  {
    slug: "lagos-workspace",
    image: "/modern-creative-office-workspace-lagos.jpg",
    imageAlt: "Modern creative workspace in Lagos",
    caption: "Where the work happens. Lagos, always.",
    likes: 356,
    comments: 18,
    timeAgo: "4d",
  },
  {
    slug: "real-estate-site",
    image: "/modern-real-estate-website.png",
    imageAlt: "Modern real estate website",
    caption: "Real estate, minus the clutter. A listings site that sells the home before the visit.",
    likes: 243,
    comments: 11,
    timeAgo: "5d",
  },
  {
    slug: "consulting-identity",
    image: "/consulting-firm-brand-identity-professional.jpg",
    imageAlt: "Professional consulting firm brand identity",
    caption: "Identity system for a consulting firm. Serious without being stiff.",
    likes: 184,
    comments: 6,
    timeAgo: "6d",
  },
  {
    slug: "brand-mockup",
    image: "/creative-studio-brand-mockup.jpg",
    imageAlt: "Creative studio brand mockup",
    caption: "From moodboard to mockup. Process post - how a look becomes a system.",
    likes: 289,
    comments: 13,
    timeAgo: "1w",
  },
  {
    slug: "fintech-app",
    image: "/fintech-app-dashboard-dark-modern.jpg",
    imageAlt: "Fintech app dashboard",
    caption: "Same product, sharper story. Post-redesign metrics tell the rest.",
    likes: 231,
    comments: 8,
    timeAgo: "1w",
  },
]
