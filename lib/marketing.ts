import type {
  InstagramPreviewComment,
  InstagramPreviewHighlight,
  InstagramPreviewPost,
  InstagramPreviewProfile,
} from "@/components/instagram-preview";

function comments(items: Array<{ username: string; avatar: string; text: string; timeAgo: string; likes: number }>): InstagramPreviewComment[] {
  return items;
}

export const marketingProfile: InstagramPreviewProfile = {
  handle: "visualcns.studio",
  site: "visualcns.pro",
  name: "VisualCNS",
  category: "Software company",
  blurb: "Software systems, launch funnels, and digital products for modern businesses.",
  tagline: "Websites, MVPs, funnels, and growth systems. Lagos.",
  followers: "2,431",
  following: "56",
  logoSrc: "/visualhqlogo.svg",
  logoAlt: "VisualCNS logo",
  logoClassName: "w-[60%] object-contain",
};

export const marketingHighlights: InstagramPreviewHighlight[] = [
  { label: "Web", bg: "#0F3D84", text: "#ffffff", content: "WB", size: "text-xl" },
  { label: "Funnels", bg: "#101828", text: "#ffffff", content: "FN", size: "text-xl" },
  { label: "MVPs", bg: "#324F86", text: "#ffffff", content: "MV", size: "text-xl" },
  { label: "Calls", bg: "#DCE7FF", text: "#0A1730", content: "DC", size: "text-xl" },
];

export const marketingPosts: InstagramPreviewPost[] = [
  {
    slug: "discovery-call",
    image: "/marketing/discovery-call.png",
    imageAlt: "VisualCNS discovery call ad",
    location: "Lagos, Nigeria",
    caption:
      "Start with a free 45-minute discovery and scoping call. Leave with clearer next steps and a fixed quote for your build.",
    hashtags: ["VisualCNS", "DiscoveryCall", "WebBuild"],
    likes: 312,
    shares: 28,
    bookmarks: 41,
    timeAgo: "6h",
    comments: comments([
      {
        username: "kemi.builds",
        avatar: "linear-gradient(135deg,#7a4de0,#c93a86)",
        text: "This is the kind of first step more agencies should offer.",
        timeAgo: "5h",
        likes: 9,
      },
      {
        username: "lagosfounder",
        avatar: "linear-gradient(135deg,#0f3d84,#3a86c9)",
        text: "Do you scope internal tools too or only customer-facing products?",
        timeAgo: "4h",
        likes: 3,
      },
    ]),
  },
  {
    slug: "website-launch",
    image: "/marketing/website-launch.png",
    imageAlt: "VisualCNS fast website launch ad",
    location: "visualcns.pro",
    caption:
      "Need a clean, conversion-focused site without a dragged-out timeline? We design and launch websites in days, not months.",
    hashtags: ["VisualCNS", "Webflow", "Framer", "WordPress"],
    likes: 268,
    shares: 19,
    bookmarks: 36,
    timeAgo: "1d",
    comments: comments([
      {
        username: "brandteam.ng",
        avatar: "linear-gradient(135deg,#e0863a,#c93a86)",
        text: "The speed angle here is strong. Especially for campaign sites.",
        timeAgo: "22h",
        likes: 7,
      },
      {
        username: "temi.product",
        avatar: "linear-gradient(135deg,#4AABB0,#321A42)",
        text: "Would love to see a before/after next.",
        timeAgo: "19h",
        likes: 2,
      },
    ]),
  },
  {
    slug: "ads-to-leads",
    image: "/marketing/ads-to-leads.png",
    imageAlt: "VisualCNS ads to leads funnel ad",
    location: "Lagos, Nigeria",
    caption:
      "We help businesses turn ad clicks into real leads with landing pages, follow-up flows, tracking, and clear next steps.",
    hashtags: ["VisualCNS", "Funnels", "LeadGeneration"],
    likes: 421,
    shares: 33,
    bookmarks: 58,
    timeAgo: "2d",
    comments: comments([
      {
        username: "ayo.growth",
        avatar: "linear-gradient(135deg,#321A42,#656794)",
        text: "This is the real gap for most teams. Traffic without follow-up is wasted money.",
        timeAgo: "2d",
        likes: 13,
      },
      {
        username: "chioma.sales",
        avatar: "linear-gradient(135deg,#AA7836,#E07030)",
        text: "The handoff between ads and sales is where most things break.",
        timeAgo: "1d",
        likes: 5,
      },
    ]),
  },
  {
    slug: "mvp-build",
    image: "/marketing/mvp-build.png",
    imageAlt: "VisualCNS MVP product sprint ad",
    location: "VisualCNS Studio",
    caption:
      "If you need to test an idea, pitch investors, or launch quickly, we can design and build an MVP web app with speed and clarity.",
    hashtags: ["VisualCNS", "MVP", "ProductSprint"],
    likes: 197,
    shares: 17,
    bookmarks: 29,
    timeAgo: "3d",
    comments: comments([
      {
        username: "ada.startups",
        avatar: "linear-gradient(135deg,#4880B8,#B070B0)",
        text: "This is exactly the offer early-stage founders want explained plainly.",
        timeAgo: "2d",
        likes: 8,
      },
      {
        username: "buildwithtobi",
        avatar: "linear-gradient(135deg,#111826,#324F86)",
        text: "Focused MVP > six months of overthinking.",
        timeAgo: "2d",
        likes: 4,
      },
    ]),
  },
];
