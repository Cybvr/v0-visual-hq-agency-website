// A section of an original, VisualCNS-authored article. Curated news items
// omit `body` and link out; our own pieces carry the full text here.
export interface ArticleSection {
  heading?: string
  paragraphs: string[]
}

export interface NewsItem {
  slug: string
  title: string
  excerpt: string
  source: string
  author: string
  date: string
  url: string
  image: string
  imageAlt: string
  imageCredit: string
  imagePosition?: string
  // When present, the detail page renders this in full instead of linking out.
  body?: ArticleSection[]
}

export const newsItems: NewsItem[] = [
  {
    slug: "africa-agentic-ai-role",
    title: "Africa's part in agentic AI: the continent isn't just a market, it's a builder",
    excerpt:
      "Agentic AI — software that reasons, plans, and acts on its own — is reshaping how products get built. Africa's young, mobile-first, multilingual talent base gives the continent a distinct role in that shift: not only as a place agents are deployed, but as a place they are designed, trained, and governed.",
    source: "VisualCNS",
    author: "VisualCNS Editorial",
    date: "August 12, 2026",
    url: "/news/africa-agentic-ai-role",
    image: "/fintech-dashboard-dark-modern.jpg",
    imageAlt: "A dark, modern software interface representing AI systems",
    imageCredit: "VisualCNS",
    body: [
      {
        paragraphs: [
          "For most of the last decade, Africa's story in artificial intelligence was told in the language of adoption: which markets would take up the tools built elsewhere, how fast, and at what price. Agentic AI changes the frame. When software can reason through a goal, break it into steps, call other tools, and act with limited supervision, the interesting question stops being who uses the agent and becomes who designs, trains, and governs it. On that question, the continent has more to offer than it is usually credited for.",
          "The shift is real and it is fast. Agents now draft code, reconcile invoices, triage support queues, and run multi-step research that once needed a team. What they still lack is judgment about context — the local language a customer actually speaks, the payment rail that actually clears, the regulatory line that actually matters. That context is exactly where African builders have an edge that no amount of compute buys.",
        ],
      },
      {
        heading: "A demographic and mobile-first advantage",
        paragraphs: [
          "Africa is the youngest continent on earth, with a median age under twenty and the fastest-growing pool of working-age people anywhere. That is not just a consumer statistic; it is a supply of engineers, annotators, product thinkers, and operators entering the field at the precise moment agentic systems need human oversight to be safe and useful.",
          "It is also a market that skipped the desktop era. Products here were born mobile, born low-bandwidth, and born around money that moves through a phone. Builders who cut their teeth making software work under those constraints tend to design agents that are frugal, resilient, and honest about failure — qualities that matter far beyond Lagos or Nairobi.",
        ],
      },
      {
        heading: "Language, data, and the problem of context",
        paragraphs: [
          "There are more than two thousand languages spoken across Africa, and the overwhelming majority are underserved by today's models. That gap is often described as a weakness. It is better understood as an unclaimed frontier. The teams that assemble high-quality datasets, evaluation benchmarks, and fine-tuned agents for Yoruba, Swahili, Amharic, Hausa, or Zulu are not doing charity work — they are building the moats that make an agent genuinely useful to hundreds of millions of people.",
          "Ownership of that data is the strategic question. An agent trained on African context, hosted on infrastructure the continent controls, serving users in their own language, is a fundamentally different asset from one rented wholesale from abroad. The choice between the two is being made right now, in procurement decisions and open-source contributions that rarely make headlines.",
        ],
      },
      {
        heading: "The real constraints",
        paragraphs: [
          "None of this is inevitable. Compute remains scarce and expensive; reliable power and connectivity are uneven; capital for deep-tech is thinner than in other regions; and a genuine risk exists that the continent is positioned only as a source of cheap data labeling rather than as an owner of the systems that data trains. Agentic AI can widen inequality as easily as it narrows it.",
          "The path through those constraints is not to wait for perfect infrastructure. It is to build narrow, high-value agents for concrete local problems — logistics, agriculture, health triage, financial inclusion, public services — and to keep the data, the evaluation, and the governance close to home. Depth in a domain beats breadth on a leaderboard.",
        ],
      },
      {
        heading: "Building from here",
        paragraphs: [
          "This is the bet we are making at VisualCNS. We build software systems and AI tools from Lagos, and we run product businesses of our own — which means we deploy agents against our own problems before we ship them for anyone else. That posture keeps us honest about what these systems can and cannot do, and it keeps the context where it belongs: with the people who understand the ground.",
          "Africa's part in agentic AI will not be handed to it. But the ingredients — young talent, mobile-native instincts, untapped linguistic depth, and hard problems worth solving — are already here. The work is to build, own, and govern, rather than to wait and adopt.",
        ],
      },
    ],
  },
  {
    slug: "firms-donate-animal-farm-lagos-students",
    title: "AcademyPress and Ekenua&Co donate 1,500 copies of Animal Farm to Lagos students",
    excerpt:
      "Academy Press Plc and Ekenua & Co. Limited distributed 1,500 copies of George Orwell’s Animal Farm to students at three Lagos secondary schools, launching the Million Classics Programme to promote reading and critical thinking.",
    source: "The Guardian Nigeria",
    author: "Isaac Chibuife",
    date: "July 11, 2026",
    url: "https://guardian.ng/news/firms-donate-1500-copies-of-animal-farm-to-lagos-students/",
    image: "/news/animal-farm-lagos-students.jpg",
    imageAlt: "Secondary school students walking together on a school campus",
    imageCredit: "The Guardian Nigeria",
  },
  {
    slug: "honeywell-flour-fy-2026-profit-dividend",
    title: "Honeywell Flour’s FY 2026 profit hits N21.9 billion, declares 20 kobo dividend",
    excerpt:
      "Honeywell Flour Mills reported a 3.29% rise in full-year profit before tax to N21.896 billion, supported by lower cost of sales and stronger net finance income. The directors recommended a N1.59 billion dividend, equal to 20 kobo per share.",
    source: "Nairametrics",
    author: "Idika Aja",
    date: "May 31, 2026",
    url: "https://nairametrics.com/2026/05/31/honeywell-flours-fy-2026-profit-hits-n21-9-billion-declares-20-kobo-dividend/",
    image: "/news/honeywell-flour-mills.jpg",
    imageAlt: "Honeywell Flour Mills industrial facility in Lagos",
    imageCredit: "Honeywell Group via Nairametrics",
  },
  {
    slug: "new-platform-to-link-digital-discovery-with-real-events-launched",
    title: "New platform to link digital discovery with real events launched",
    excerpt:
      "Funseekas.com, a new social events ecosystem, has launched to transform how Africans discover and experience live events. The platform creates community-driven connections that extend beyond ticket purchase.",
    source: "The Guardian Nigeria",
    author: "Ogunnoiki",
    date: "June 21, 2025",
    url: "https://guardian.ng/news/nigeria/metro/new-platform-to-link-digital-discovery-with-real-events-launched/",
    image: "/news/funseekas-launch.jpg",
    imageAlt: "Jide Ogunnoiki at the launch of Funseekas",
    imageCredit: "The Guardian Nigeria",
  },
  {
    slug: "2026-msp-salary-guide",
    title: "Bowman Williams benchmarks 2026 MSP salaries across 3,500 interviews and 3,000 roles filled",
    excerpt:
      "Salary data benchmarked from over 3,500 interviews with MSP professionals and 3,000 MSP jobs filled.",
    source: "Bowman Williams",
    author: "John Davenjay",
    date: "February 2026",
    url: "https://bowmanwilliams.com/msp-salary-guide/",
    image: "/news/msp-salary-guide.jpg",
    imageAlt: "Cover artwork for the 2026 MSP Salary Guide",
    imageCredit: "Bowman Williams",
  },
  {
    slug: "afrindependent-publications",
    title: "Afrindependent Institute publishes research advancing African economic sovereignty",
    excerpt:
      "Original research, essays, and frameworks advancing African intellectual and economic sovereignty through Africonomics.",
    source: "Afrindependent Institute",
    author: "Manuel Tacanho",
    date: "2026",
    url: "https://www.afrindependent.org/publications?filter=latest_pub",
    image: "/news/afrindependent-publications.jpg",
    imageAlt: "Open books arranged around a reader",
    imageCredit: "Afrindependent Institute",
  },
  {
    slug: "shantanu-agarwal-mati-carbon",
    title: "Time: The World’s Most Influential Rising Stars—Shantanu Agarwal",
    excerpt:
      "The entrepreneur turning crushed rock into climate action — and a lifeline for smallholder farmers",
    source: "TIME",
    author: "Wendy Schmidt",
    date: "September 30, 2025",
    url: "https://time.com/collections/time100-next-2025/7318851/shantanu-agarwal/",
    image: "/news/shantanu-agarwal.jpg",
    imageAlt: "Shantanu Agarwal on stage at the TIME100 event",
    imageCredit: "Jemal Countess/Getty Images for TIME",
    imagePosition: "center 24%",
  },
  {
    slug: "bezos-earth-fund-earthshot-prize-48-climate-solutions",
    title: "Bezos Earth Fund to accelerate 48 transformative climate and nature solutions in collaboration with The Earthshot Prize",
    excerpt:
      "A $4.8 million partnership will scale breakthrough innovations tackling climate change and nature loss across the globe, backing 16 solutions a year for three years sourced from The Earthshot Prize's global pool of nominations.",
    source: "Bezos Earth Fund",
    author: "Press Release",
    date: "February 4, 2026",
    url: "https://www.bezosearthfund.org/news-and-insights/bezos-earth-fund-to-accelerate-48-transformative-climate-and-nature-solutions-in-collaboration-with-the-earthshot-prize",
    image: "/news/earthshot-climate-solutions.jpg",
    imageAlt: "Rolling green hills in north-west England",
    imageCredit: "Shutterstock via Bezos Earth Fund",
  },
]

export function getNewsItems(): NewsItem[] {
  return [...newsItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function getNewsItemBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((item) => item.slug === slug)
}
