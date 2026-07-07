export interface SolutionsImage {
  src: string
  alt: string
}

export interface SolutionsHero {
  title: string
  description: string
  primaryCta: string
  secondaryCta: string
}

export interface SourcingStage {
  badge: string
  title: string
  description: string
  bullets: string[]
  image: SolutionsImage
  stat: {
    label: string
    value: string
    caption: string
  }
}

export interface ExecutionCard {
  /** Material Symbols Outlined icon name */
  icon: string
  title: string
  description: string
}

export interface ExecutionStage {
  badge: string
  title: string
  description: string
  cards: ExecutionCard[]
}

export interface PostCloseFeature {
  /** Material Symbols Outlined icon name */
  icon: string
  title: string
  description: string
}

export interface PostCloseStage {
  badge: string
  title: string
  description: string
  features: PostCloseFeature[]
  bento: {
    image: SolutionsImage
    lpCard: { icon: string; title: string; caption: string }
    healthCard: { label: string; value: string }
    securityCard: { icon: string; text: string }
  }
}

export interface SolutionsCta {
  title: string
  primaryCta: string
  secondaryCta: string
  trustLine: string
}

export const solutionsHero: SolutionsHero = {
  title: "A Unified Platform for the Entire Investment Lifecycle",
  description:
    "From initial deal sourcing to post-close value creation, Visualcns Finance provides institutional-grade tools to optimize every stage of your capital deployment.",
  primaryCta: "Talk to a Deal Specialist",
  secondaryCta: "Platform Overview",
}

export const sourcingStage: SourcingStage = {
  badge: "Stage 01: Sourcing",
  title: "Pipeline & CRM Built for Sophisticated Networks",
  description:
    "Centralize deal flow and intermediary relationships. Our intelligent CRM identifies proprietary opportunities and tracks historical interactions across your entire fund.",
  bullets: [
    "Automated intermediary coverage tracking and scoring.",
    "Customizable deal pipelines with AI-driven probability analysis.",
    "Integrated document data extraction for initial teasers.",
  ],
  image: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWS9xJX4xo1jMrHrtTvTT7t1bwpWs3w_chQUZ9wDRJRyPsUPMhOdwftLnaVqjrJHdpDPvqI9JmRH15hj32gyuuJmWYigEU1-Raj9hLmMqw7U0lUvQDeMsZ8DM8-zK00ti7eDwMzP0m3J4cZZBU_8VpRmrzPBPAKouq0pq4xdJRhcvpdMYssl6JsSW4G07KTeV_-S31d9-M_p8hlS-5uWILO3aT76tSSfzxhhmWlbP4Y44m8PMsXw_b",
    alt: "A clean and professional software interface showing a financial pipeline dashboard. The UI is high-density with data tables, progress bars, and relationship network maps. The color palette is composed of professional navy blue and slate grays, set against a crisp white background, representing institutional-grade investment software.",
  },
  stat: {
    label: "Deal Velocity",
    value: "+24%",
    caption: "Efficiency gain in sourcing phase.",
  },
}

export const executionStage: ExecutionStage = {
  badge: "Stage 02: Execution",
  title: "Institutional QofE & Intelligent Modeling",
  description:
    "Drive diligence with precision. Our Document Lens™ and automated adjusted EBITDA bridge provide a level of speed and accuracy previously impossible.",
  cards: [
    {
      icon: "analytics",
      title: "Automated Bridge",
      description:
        "Instantly generate EBITDA bridges from raw GL data with AI-assisted adjustment flagging.",
    },
    {
      icon: "search_insights",
      title: "Document Lens™",
      description:
        "Hyperlink deal model assumptions directly to their source in the VDR with a single click.",
    },
    {
      icon: "rule_folder",
      title: "Scenario Modeling",
      description:
        "Stress-test investment memos with real-time sensitivity analysis across 100+ variables.",
    },
  ],
}

export const postCloseStage: PostCloseStage = {
  badge: "Stage 03: Post-Close",
  title: "Monitoring & LP Relations Built for Transparency",
  description:
    "Maintain a live connection to your portfolio company ERPs. Automate quarterly reporting and give LPs the granular transparency they demand in a modern market.",
  features: [
    {
      icon: "sync",
      title: "Real-time Data Sync",
      description:
        "Direct API connections to Sage, NetSuite, and QuickBooks for continuous monitoring.",
    },
    {
      icon: "description",
      title: "Automated LP Reporting",
      description: "Generate institutional-grade quarterly reports in seconds, not weeks.",
    },
  ],
  bento: {
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYB7Ktp-alHVHLluTlKoXYLb-_5-frI92hAnhJHERTLk-Vg8RJSn3DoV_UKQcgpnCXMbJL0QDNy_OrWCZXgXP8VtBjcF-1iYm2bBeuywTBUiO4eRhr4_iYDaqoRKRajg83nsFhZaU7jNUy2eZCgG9c6oo3kuAcnhm0yvYR7X77Pa8sKGsy25tseJuPpY_H0DlPzIb_vTeAnK4xxcLG2-MOAZ2jVy0cKIUdj1I6TkLXiHvm13P4UmGj",
      alt: "A sophisticated data visualization dashboard showing portfolio monitoring metrics. Charts include revenue growth, margin expansion, and cash flow trends. The design is minimalist and professional, featuring clean lines, high-contrast typography, and a palette of corporate blues and light grays.",
    },
    lpCard: { icon: "upload_file", title: "LP Ready", caption: "Instant Reporting" },
    healthCard: { label: "Portfolio Health", value: "89%" },
    securityCard: {
      icon: "security",
      text: "SOC-2 Type II Certified Data Infrastructure.",
    },
  },
}

export const solutionsCta: SolutionsCta = {
  title: "Optimize your fund's operational alpha today.",
  primaryCta: "Talk to a Deal Specialist",
  secondaryCta: "Watch Platform Demo",
  trustLine: "Trusted by 40+ Private Equity Firms Globally",
}
