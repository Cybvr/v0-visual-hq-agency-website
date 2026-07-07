export interface CaseStudiesImage {
  src: string
  alt: string
}

export interface CaseStudiesHero {
  eyebrow: string
  title: string
  description: string
}

export interface CaseStudyStat {
  value: string
  label: string
}

export interface FeaturedCaseStudy {
  logo: CaseStudiesImage
  title: string
  description: string
  stats: CaseStudyStat[]
  ctaLabel: string
  image: CaseStudiesImage
}

export interface DarkCaseStudy {
  wordmark: string
  title: string
  description: string
  stat: CaseStudyStat
  ctaLabel: string
}

export interface HorizontalCaseStudy {
  category: string
  title: string
  description: string
  ctaLabel: string
  image: CaseStudiesImage
}

export interface CaseStudyTestimonial {
  quote: string
  name: string
  role: string
  avatar: CaseStudiesImage
}

export const caseStudiesHero: CaseStudiesHero = {
  eyebrow: "Success stories",
  title: "Quantifiable Results for the Modern Institutional Investor.",
  description:
    "Discover how leading mid-market private equity firms leverage Visualcns Finance's AI-driven platform to accelerate Quality of Earnings analysis and gain proprietary deal insights.",
}

export const featuredCaseStudy: FeaturedCaseStudy = {
  logo: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA91OgcqDd7YdwkeSMjAAZcbhjqmsxECWGlTuemAoGqSWY6C9KJRei9k59gDR_NmBv8RyFfyLvjV-XZLc4Dll1B4kKKQLzWDfx6wyXpJUJ9u8IngqtTI95Ei3CY_6i-ASp4WTB7-wS7N1MDUE39s7xnvsGBO69cFcMpNENpn03uYTeQSWX2bv27YNNTC9_x7qgcGyubnCRIHOnbm-7Cr1V5D5P8QKU2mgAGlXbQ8A14s03fjL1bcC4D",
    alt: "A clean, minimalist monochrome logo for a fictional high-end finance company named Summit Equity, displayed against a soft gray professional background with subtle lighting and sharp edges.",
  },
  title: "65% Reduction in QofE Cycle Time",
  description:
    "Summit Equity Partners struggled with fragmented data across diverse portfolio acquisitions. Visualcns unified their workflow, automating the ingestion of 500+ source documents.",
  stats: [
    { value: "14 Days", label: "Avg. Time Saved" },
    { value: "3.5x", label: "Throughput Increase" },
  ],
  ctaLabel: "Read Full Case Study",
  image: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuALPy60XnhzwBibzq2c34wfJKtV6eAe-85_YimUC2-Ns2c4aJwoSvRxRMlRi77eshGaR2_zyU7fDGgN2a8CrKmjtmHlct_Hg7KjI1fLbFjqJDQ0Z4FkmfTptTvf9wE3J9YtV_Mf7cj6C1U-5xrJok0G2kWQZMT5WFQZ-GrYOdERbLToqC2U3BexZdIE8ZK6gR_irN0m0rLHkBgDgTHWyDJ26ax-ykltGVNpcujTNxA30dzwdRhU3ZLK",
    alt: "A high-density financial dashboard shown on a sleek monitor in a modern, sunlit office. The screen displays complex data grids and AI-generated charts with navy and slate accents, representing institutional-grade analytics and private equity tools.",
  },
}

export const darkCaseStudy: DarkCaseStudy = {
  wordmark: "MERIDIAN",
  title: "$4.2M Identified in Hidden Adjusted EBITDA",
  description:
    "Through AI-driven document lens analysis, Meridian Capital uncovered overlooked operational adjustments in a complex manufacturing carve-out.",
  stat: { value: "98%", label: "Audit Trail Confidence Score" },
  ctaLabel: "Read Case Study",
}

export const horizontalCaseStudies: HorizontalCaseStudy[] = [
  {
    category: "Real Estate PE",
    title: "40% Less Manual Entry",
    description:
      "Blue Harbor Realty automated rent roll ingestion across 40 properties, reducing analyst fatigue and data entry errors by 90%.",
    ctaLabel: "Read Full Case Study",
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnlrp57E97zDFwz_Uzpyxk5G_cEeLFwPwJFIVghb7d9proLzQTQhelu2w_1p8kovqxaeP5Spktz68cqdbObi5lq7YEdKd-dECIXbp8Z0ID4qMUh0CZoHqI8zoZkEp-FCtSjtLbAp-CAZ0B-lp4b-6XSHvmVKeNJvy79LTS7M24DIHlncWmgUxBYzCn0G4-MHAgYF8hIswTHGg5Ux9ehMst8G4Lj__b2SCmfKd6I5_I0mqrbXNNFmIN",
      alt: "A detailed macro photograph of a professional glass building exterior reflecting a blue sky. The aesthetic is corporate, minimalist, and powerful, symbolizing transparency and growth in the financial sector.",
    },
  },
  {
    category: "Tech Growth Equity",
    title: "Instant ARR Reconciliation",
    description:
      "Vertex Growth automated the complex task of reconciling SaaS subscription data against GAAP revenue for a critical Series C investment.",
    ctaLabel: "Read Full Case Study",
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT3Y7Jl8e0Ahz6czicsqE1Oj5C0DaVqt61INmnLIIQPwxt_635ryfKtfAeoDY6XID8leKtWrCqyTLMb-QHYia8SWEZzDHMc8ukxaYGf3f1MQi27NUGXZWBg7Do9W5giS2ySmglIeqvu0a6t5jGVgrqG2nty06hzMhlSklrYBHlnwnPm4D_R8hShoGUTNxtTStZl1FT7Lvaem8u8cnjT3xXNy9AjYE5Wp-QeDEmBSlFwXF7Uw5Ef-v1",
      alt: "A cinematic, low-angle shot of a group of diverse professionals in a high-rise conference room discussing financial models. Soft morning sunlight filters through large windows, creating a hopeful and focused atmosphere with professional blue tones.",
    },
  },
]

export const caseStudyTestimonial: CaseStudyTestimonial = {
  quote:
    "Visualcns is not just a tool; it's a competitive advantage. It allows our analysts to focus on the narrative of the deal rather than the mechanics of the data.",
  name: "Marcus Thorne",
  role: "Managing Director, Summit Equity Partners",
  avatar: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDerQGorLzCXqg80BZqiMhSR8dxigmTkwNPRdPYRC1gBkJB9G6CIUWUm_r42EKA1KsKQtOSieINmWyKSHF343IDC_S-zua6SgchXDVaX2AE1rggnpJv284p1FZxS3J927-s-cLessLpJBQN2H_zZbbVC9Ouz-jZXwHrIEdIVoBQZU3wv3rqFZS111gBHQEfZEBfDQwNOJjqcCBJbsatJ0TiJVMCM-Fjh1BYIaDYOWKTAB5PaH7lDnsJ",
    alt: "A professional headshot of a mature executive male with graying hair and a confident smile, wearing a dark navy suit and white shirt, photographed against a neutral studio background with soft lighting.",
  },
}
