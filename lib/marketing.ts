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
  handle: "visualcns.studio",
  name: "VisualCNS",
  category: "Marketing agency",
  bio: "Software systems, launch funnels, and digital products for modern businesses. Lagos.",
  site: "visualcns.pro",
  followers: "2,431",
  following: "56",
}

export const marketingPosts: MarketingPost[] = [
  {
    slug: "discovery-call",
    image: "/ads/discovery-call.png",
    imageAlt: "VisualCNS discovery call ad",
    caption:
      "Start with a free 45-minute discovery and scoping call. Leave with clearer next steps and a fixed quote for your build.",
    likes: 312,
    comments: 14,
    timeAgo: "6h",
  },
  {
    slug: "website-launch",
    image: "/ads/website-launch.png",
    imageAlt: "VisualCNS fast website launch ad",
    caption:
      "Need a clean, conversion-focused site without a dragged-out timeline? We design and launch websites in days, not months.",
    likes: 268,
    comments: 9,
    timeAgo: "1d",
  },
  {
    slug: "ads-to-leads",
    image: "/ads/ads-to-leads.png",
    imageAlt: "VisualCNS ads to leads funnel ad",
    caption:
      "We help businesses turn ad clicks into real leads with landing pages, follow-up flows, tracking, and clear next steps.",
    likes: 421,
    comments: 22,
    timeAgo: "2d",
  },
  {
    slug: "mvp-build",
    image: "/ads/mvp-build.png",
    imageAlt: "VisualCNS MVP product sprint ad",
    caption:
      "If you need to test an idea, pitch investors, or launch quickly, we can design and build an MVP web app with speed and clarity.",
    likes: 197,
    comments: 7,
    timeAgo: "3d",
  },
]
