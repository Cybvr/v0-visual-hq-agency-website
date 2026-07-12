import type {
  InstagramPreviewComment,
  InstagramPreviewHighlight,
  InstagramPreviewPost,
  InstagramPreviewProfile,
} from "@/components/instagram-preview";

export type MarketingPost = InstagramPreviewPost & {
  title?: string;
  primaryText?: string;
  headline?: string;
  description?: string;
  cta?: string;
};

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

export const marketingPosts: MarketingPost[] = [
  {
    slug: "discovery-call",
    image: "/marketing/discovery-call.jpg",
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
    slug: "discovery-call-blue",
    image: "/marketing/discovery-call-blue.jpg",
    imageAlt: "VisualCNS discovery call blue ad",
    location: "Lagos, Nigeria",
    caption:
      "Book a discovery call to clarify what to build, what to fix, and what to prioritize before your team spends more time or money.",
    hashtags: ["VisualCNS", "DiscoveryCall", "StrategySession"],
    likes: 184,
    shares: 14,
    bookmarks: 27,
    timeAgo: "5h",
    comments: comments([
      {
        username: "chioma.ops",
        avatar: "linear-gradient(135deg,#274EAE,#08154C)",
        text: "This feels much clearer as an offer. Straight to the point.",
        timeAgo: "4h",
        likes: 6,
      },
      {
        username: "tolu.founder",
        avatar: "linear-gradient(135deg,#0f172a,#334155)",
        text: "Would book this before committing to a full build.",
        timeAgo: "3h",
        likes: 2,
      },
    ]),
  },
  {
    slug: "website-launch",
    image: "/marketing/website-launch.jpg",
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
    slug: "website-launch-blue",
    image: "/marketing/website-launch-blue.jpg",
    imageAlt: "VisualCNS website launch blue ad",
    location: "visualcns.pro",
    caption:
      "Launch a website that looks polished, explains your value fast, and gives visitors a clear next step to take.",
    hashtags: ["VisualCNS", "WebsiteLaunch", "ConversionDesign"],
    likes: 223,
    shares: 18,
    bookmarks: 31,
    timeAgo: "9h",
    comments: comments([
      {
        username: "ngozi.brand",
        avatar: "linear-gradient(135deg,#1d4ed8,#60a5fa)",
        text: "The stronger typography makes this feel more premium.",
        timeAgo: "8h",
        likes: 5,
      },
      {
        username: "deji.marketing",
        avatar: "linear-gradient(135deg,#1e293b,#475569)",
        text: "This would work well as a paid social creative too.",
        timeAgo: "7h",
        likes: 3,
      },
    ]),
  },
  {
    slug: "ads-to-leads",
    image: "/marketing/ads-to-leads.jpg",
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
    slug: "ads-to-leads-cream",
    image: "/marketing/ads-to-leads-cream.jpg",
    imageAlt: "VisualCNS ads to leads cream ad",
    location: "Lagos, Nigeria",
    caption:
      "Turn ad traffic into qualified leads with sharper landing pages, faster follow-up, and a funnel that is designed to convert.",
    hashtags: ["VisualCNS", "AdsToLeads", "LeadGeneration"],
    likes: 246,
    shares: 21,
    bookmarks: 35,
    timeAgo: "11h",
    comments: comments([
      {
        username: "grace.growth",
        avatar: "linear-gradient(135deg,#111827,#374151)",
        text: "Much easier to understand than most agency ads.",
        timeAgo: "10h",
        likes: 7,
      },
      {
        username: "samuel.sales",
        avatar: "linear-gradient(135deg,#a16207,#f59e0b)",
        text: "Lead quality is the real differentiator here.",
        timeAgo: "9h",
        likes: 4,
      },
    ]),
  },
  {
    slug: "mvp-build",
    image: "/marketing/mvp-build.jpg",
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
  {
    slug: "mvp-build-white",
    image: "/marketing/mvp-build-white.jpg",
    imageAlt: "VisualCNS MVP build white ad",
    location: "VisualCNS Studio",
    caption:
      "Move from rough idea to testable MVP with a faster sprint, clearer scope, and a product you can actually put in front of users.",
    hashtags: ["VisualCNS", "MVPBuild", "StartupSprint"],
    likes: 171,
    shares: 13,
    bookmarks: 24,
    timeAgo: "13h",
    comments: comments([
      {
        username: "ife.startup",
        avatar: "linear-gradient(135deg,#1e3a8a,#93c5fd)",
        text: "Founders need this framing. Speed with structure.",
        timeAgo: "12h",
        likes: 6,
      },
      {
        username: "productwithleo",
        avatar: "linear-gradient(135deg,#14532d,#4ade80)",
        text: "Nice balance between product and business language.",
        timeAgo: "10h",
        likes: 3,
      },
    ]),
  },
  {
    slug: "workflow-systems-audit",
    title: "Systems That Run Themselves",
    primaryText:
      "Your tools don't talk to each other — so leads slip, follow-ups get missed, and you're the glue holding it all together.\n\nWe connect your leads, content, and follow-up into one system that runs itself. Book a free systems audit and see where you're losing time (and money). 🚀",
    headline: "Systems That Run Themselves",
    description: "Free systems audit · Lagos",
    cta: "Book Now",
    image: "/marketing/systems.png",
    imageAlt: "VisualCNS systems that run themselves ad",
    location: "Lagos, Nigeria",
    caption:
      "Your tools don't talk to each other. Book a free systems audit and we'll connect leads, content, and follow-up into one flow that runs itself.",
    hashtags: ["VisualCNS", "Automation", "SystemsAudit", "AIagents"],
    likes: 289,
    shares: 24,
    bookmarks: 44,
    timeAgo: "4h",
    comments: comments([
      {
        username: "bola.ops",
        avatar: "linear-gradient(135deg,#0f3d84,#3a86c9)",
        text: "This is exactly the mess we're in. Too many disconnected tools.",
        timeAgo: "3h",
        likes: 8,
      },
      {
        username: "nkechi.builds",
        avatar: "linear-gradient(135deg,#7a4de0,#c93a86)",
        text: "A free audit as the first step is smart. Booking one.",
        timeAgo: "2h",
        likes: 4,
      },
    ]),
  },
  {
    slug: "workflow-stop-manual",
    title: "Stop The Sticky Notes",
    primaryText:
      "Running your business on sticky notes, open tabs, and \"I'll reply later\" DMs?\n\nWe replace the chaos with automated workflows built around how you actually work — leads answered instantly, content shipped on time, follow-ups that send themselves. Stop chasing. Start running. ⚡",
    headline: "Stop Running On Sticky Notes",
    description: "Automate the busywork",
    cta: "Learn More",
    image: "/marketing/sticky-notes.png",
    imageAlt: "VisualCNS stop the sticky notes ad",
    location: "Lagos, Nigeria",
    caption:
      "Stop running your business on sticky notes. We replace scattered tabs, DMs, and spreadsheets with automated workflows built around how you actually work.",
    hashtags: ["VisualCNS", "BusinessAutomation", "Workflows", "AIagents"],
    likes: 356,
    shares: 31,
    bookmarks: 52,
    timeAgo: "8h",
    comments: comments([
      {
        username: "seyi.founder",
        avatar: "linear-gradient(135deg,#321A42,#656794)",
        text: "The sticky notes line hits way too close to home.",
        timeAgo: "7h",
        likes: 11,
      },
      {
        username: "amaka.growth",
        avatar: "linear-gradient(135deg,#111827,#374151)",
        text: "Would love to see the follow-up automation in action.",
        timeAgo: "6h",
        likes: 3,
      },
    ]),
  },
  {
    slug: "workflow-outcome",
    title: "More Leads. Zero Extra Staff.",
    primaryText:
      "Growth shouldn't mean hiring three more people.\n\nWe build the systems that capture every lead, follow up in seconds, win back drop-offs, and show you what's actually driving sales — no extra headcount required. More leads, faster follow-up, zero extra staff. 📈",
    headline: "More Leads. Zero Extra Staff.",
    description: "Scale without hiring",
    cta: "Get Quote",
    image: "/marketing/zero-extra-staff.png",
    imageAlt: "VisualCNS more leads zero extra staff ad",
    location: "visualcns.pro",
    caption:
      "More leads, faster follow-up, zero extra staff. We build the systems that capture, nurture, and track your growth so scaling doesn't mean more headcount.",
    hashtags: ["VisualCNS", "LeadGeneration", "GrowthSystems", "Automation"],
    likes: 402,
    shares: 29,
    bookmarks: 57,
    timeAgo: "1d",
    comments: comments([
      {
        username: "tunde.scale",
        avatar: "linear-gradient(135deg,#e0863a,#c93a86)",
        text: "Growth without adding headcount is the dream. Following.",
        timeAgo: "22h",
        likes: 9,
      },
      {
        username: "chidinma.ops",
        avatar: "linear-gradient(135deg,#4AABB0,#321A42)",
        text: "This is what we needed before hiring two more people.",
        timeAgo: "20h",
        likes: 5,
      },
    ]),
  },
  {
    slug: "workflow-modular",
    title: "Built Around You",
    primaryText:
      "One system for the way YOUR business runs.\n\nMarketing, leads, content, follow-up, reporting, onboarding — pick the workflows you need, we build and run them with AI agents plugged into your existing tools. Live in days, managed monthly. From ₦200k/mo. 🧩",
    headline: "A System Built Around You",
    description: "Modular workflows from ₦200k/mo",
    cta: "Get Quote",
    image: "/marketing/built-around-you.png",
    imageAlt: "VisualCNS built around you ad",
    location: "VisualCNS Studio",
    caption:
      "One system for the way your business runs. Marketing, leads, content, follow-up, reporting, onboarding. Choose the workflows you need, we build and run them. From N200k/mo.",
    hashtags: ["VisualCNS", "Workflows", "AIagents", "GrowthSystems"],
    likes: 231,
    shares: 20,
    bookmarks: 38,
    timeAgo: "1d",
    comments: comments([
      {
        username: "ifeoma.startup",
        avatar: "linear-gradient(135deg,#4880B8,#B070B0)",
        text: "Love that it's modular. We only need leads and follow-up for now.",
        timeAgo: "23h",
        likes: 7,
      },
      {
        username: "obi.product",
        avatar: "linear-gradient(135deg,#111826,#324F86)",
        text: "Clear pricing up front is refreshing. Reaching out.",
        timeAgo: "21h",
        likes: 4,
      },
    ]),
  },
];
