export type MarketingPost = {
  slug: string
  eyebrow: string
  headline: string
  supporting: string
  cta: string
  variant: "discovery" | "website" | "funnel" | "mvp"
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
    slug: "discovery-call",
    eyebrow: "Free discovery",
    headline: "Book a 45-min scoping call.",
    supporting: "Get clarity, scope, and a fixed quote before the project starts.",
    cta: "Book now",
    variant: "discovery",
    caption:
      "Start with a free 45-minute discovery and scoping call. Leave with clearer next steps and a fixed quote for your build.",
    likes: 312,
    comments: 14,
    timeAgo: "6h",
  },
  {
    slug: "website-launch",
    eyebrow: "Fast websites",
    headline: "Launch a serious website in days.",
    supporting: "Webflow, Framer, or WordPress for brands that need to move quickly.",
    cta: "See options",
    variant: "website",
    caption:
      "Need a clean, conversion-focused site without a dragged-out timeline? We design and launch websites in days, not months.",
    likes: 268,
    comments: 9,
    timeAgo: "1d",
  },
  {
    slug: "ads-to-leads",
    eyebrow: "Campaign systems",
    headline: "Your ads should lead somewhere.",
    supporting: "Landing pages, follow-up, tracking, and the next steps after the click.",
    cta: "Build the funnel",
    variant: "funnel",
    caption:
      "We help businesses turn ad clicks into real leads with landing pages, follow-up flows, tracking, and clear next steps.",
    likes: 421,
    comments: 22,
    timeAgo: "2d",
  },
  {
    slug: "mvp-build",
    eyebrow: "Product sprint",
    headline: "Start with the MVP.",
    supporting: "Ship a focused product fast for testing, pitching, or launch.",
    cta: "Start scoping",
    variant: "mvp",
    caption:
      "If you need to test an idea, pitch investors, or launch quickly, we can design and build an MVP web app with speed and clarity.",
    likes: 197,
    comments: 7,
    timeAgo: "3d",
  },
]
