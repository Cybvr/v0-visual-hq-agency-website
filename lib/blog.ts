// A section of an original, VisualCNS-authored blog post. Curated posts omit
// `body` and link out to the source; our own pieces carry the full text here.
export interface BlogSection {
  heading?: string
  paragraphs: string[]
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  categories: string[]
  source: string
  author: string
  date: string
  readTime?: string
  url: string
  image?: string
  imageAlt?: string
  imageCredit?: string
  imagePosition?: string
  // When present, the detail page renders this in full instead of linking out.
  body?: BlogSection[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "a-brand-is-more-than-a-logo",
    title: "A brand is more than a logo",
    excerpt:
      "A logo helps people recognise a business. It does not explain what the business believes, how it behaves, or why someone should trust it. That work comes from a clear brand system.",
    categories: ["Brand design"],
    source: "VisualCNS",
    author: "VisualCNS Editorial",
    date: "August 30, 2026",
    readTime: "5 min read",
    url: "/blog/a-brand-is-more-than-a-logo",
    image: "/services/brand-design.png",
    imageAlt: "Black woman sketching brand ideas at a desk",
    body: [
      {
        heading: "Start with the decision",
        paragraphs: [
          "A useful brand system begins with a choice. Who are you trying to reach, what do you want them to understand, and what should they feel confident doing next? Those questions give the visual work somewhere to go.",
          "Without that clarity, a brand can look polished and still feel interchangeable. The colours, type, images, and language need to point in the same direction.",
        ],
      },
      {
        heading: "Make it easy to use",
        paragraphs: [
          "The best brand guidelines are practical. They help a team make a landing page, write a social post, present a proposal, or brief a new designer without starting from zero each time.",
          "That means showing the system in real situations, not only collecting swatches and logo rules in a document nobody opens.",
        ],
      },
    ],
  },
  {
    slug: "good-product-design-removes-small-moments-of-doubt",
    title: "Good product design removes small moments of doubt",
    excerpt:
      "People notice product friction in small ways: a button that does not say what it does, a form that asks for too much, or a screen that leaves them wondering what happens next.",
    categories: ["Product and experience design"],
    source: "VisualCNS",
    author: "VisualCNS Editorial",
    date: "August 28, 2026",
    readTime: "6 min read",
    url: "/blog/good-product-design-removes-small-moments-of-doubt",
    image: "/services/product-experience-design.png",
    imageAlt: "Black man reviewing wireframes on a laptop",
    body: [
      {
        heading: "Clarity is part of the experience",
        paragraphs: [
          "A product does not need to explain every detail at once. It does need to make the next useful action obvious. Clear labels, sensible defaults, and feedback after an action do more for trust than extra decoration.",
          "This is why product design starts with the work a person is trying to finish. The interface should support that work instead of making people learn the interface first.",
        ],
      },
      {
        heading: "Test the parts people skip",
        paragraphs: [
          "Teams often test the happy path and miss the moments around it. What happens when someone changes their mind, enters an unusual value, loses connection, or returns a week later?",
          "Those edges are where confidence is won. A good experience gives people a clear way forward when the first attempt does not go to plan.",
        ],
      },
    ],
  },
  {
    slug: "campaigns-need-somewhere-to-go",
    title: "Campaigns need somewhere to go",
    excerpt:
      "A strong campaign can earn attention and still underperform if the landing page, follow-up, or next step does not carry the idea forward.",
    categories: ["Campaign and content design"],
    source: "VisualCNS",
    author: "VisualCNS Editorial",
    date: "August 26, 2026",
    readTime: "5 min read",
    url: "/blog/campaigns-need-somewhere-to-go",
    image: "/services/campaign-content-design.png",
    imageAlt: "Black woman reviewing campaign layouts",
    body: [
      {
        heading: "The idea has to survive the handoff",
        paragraphs: [
          "A campaign rarely lives in one format. The thought needs to make sense in a short video, a social post, a landing page, and the message someone receives after they respond.",
          "That does not mean every asset should look identical. It means the audience should recognise the same point of view wherever they meet it.",
        ],
      },
      {
        heading: "Plan the next step early",
        paragraphs: [
          "Before a campaign goes live, decide what attention is meant to become. Is the next step a conversation, a sign-up, a visit, or a useful piece of information?",
          "When that answer is clear, creative and conversion work stop competing with each other. They become parts of the same experience.",
        ],
      },
    ],
  },
  {
    slug: "customer-relationships-live-in-the-handoffs",
    title: "Customer relationships live in the handoffs",
    excerpt:
      "Customers experience a business through the spaces between teams. A missed reply, repeated question, or broken promise can undo the care shown everywhere else.",
    categories: ["CRM and relationship design"],
    source: "VisualCNS",
    author: "VisualCNS Editorial",
    date: "August 24, 2026",
    readTime: "5 min read",
    url: "/blog/customer-relationships-live-in-the-handoffs",
    image: "/services/crm-relationship-design.png",
    imageAlt: "Two Black colleagues discussing a customer workflow",
    body: [
      {
        heading: "Map what the customer actually sees",
        paragraphs: [
          "A CRM is more than a place to store names. It is the record that helps a team remember what was promised, what has happened, and what needs attention next.",
          "Start by following a real customer journey from first contact to follow-up. The gaps usually become visible quickly, especially where one person or system hands work to another.",
        ],
      },
      {
        heading: "Keep the human part visible",
        paragraphs: [
          "Automation is useful when it removes waiting and repetition. It becomes frustrating when a person cannot reach someone, correct an error, or get an answer that fits their situation.",
          "The goal is a smoother relationship, not a louder sequence of messages. Every automated step should make the next human decision easier.",
        ],
      },
    ],
  },
  {
    slug: "not-every-good-idea-needs-to-become-a-company",
    title: "Not every good idea needs to become a company",
    excerpt:
      "An early idea needs a useful test before it needs a name, a pitch deck, or a full product. Small experiments can reveal whether the problem is real and worth pursuing.",
    categories: ["VisualCNS Ventures"],
    source: "VisualCNS",
    author: "VisualCNS Editorial",
    date: "August 22, 2026",
    readTime: "4 min read",
    url: "/blog/not-every-good-idea-needs-to-become-a-company",
    image: "/services/visualcns-ventures.png",
    imageAlt: "Black man looking out from a loft window",
    body: [
      {
        heading: "Find the smallest honest test",
        paragraphs: [
          "The first question is not whether an idea sounds exciting. It is whether someone has the problem, recognises it, and will change their behaviour to solve it.",
          "A conversation, prototype, or manual version of the service can teach you more than a long planning cycle. The test should be small enough to run and clear enough to learn from.",
        ],
      },
      {
        heading: "Keep the option open",
        paragraphs: [
          "A test does not need to prove the whole future. It only needs to show what deserves another step and what should be left alone for now.",
          "That discipline protects good ideas from being buried under premature complexity. It also leaves room to change the shape of the opportunity as you learn.",
        ],
      },
    ],
  },
  {
    slug: "ai-works-best-when-the-workflow-is-clear",
    title: "AI works best when the workflow is clear",
    excerpt:
      "Adding AI to a messy process usually creates a faster version of the same mess. The better starting point is to understand the work, the decisions, and the places where people lose time.",
    categories: ["AI design"],
    source: "VisualCNS",
    author: "VisualCNS Editorial",
    date: "August 20, 2026",
    readTime: "6 min read",
    url: "/blog/ai-works-best-when-the-workflow-is-clear",
    image: "/services/ai-design.png",
    imageAlt: "Black woman working with an AI interface on a laptop",
    body: [
      {
        heading: "Start with the work, not the tool",
        paragraphs: [
          "A useful AI feature begins with a job that already exists. Where does someone gather information, compare options, write a first draft, or repeat the same update across tools?",
          "Once that path is visible, it becomes easier to decide where AI can help and where a person should remain in control.",
        ],
      },
      {
        heading: "Design for review",
        paragraphs: [
          "People need to know what the system did, what it used, and what they can change. Review is not a failure of automation. It is part of making the result useful and trustworthy.",
          "The strongest AI experiences make the work lighter without hiding the important decisions behind a black box.",
        ],
      },
    ],
  },
  {
    slug: "effective-ways-to-boost-your-visibility-with-influencers",
    title: "Effective Ways to Boost Your Visibility with Influencers",
    excerpt:
      "Are you planning to boost your visibility with influencers? The right creator can put your brand in front of a highly relevant audience, build credibility, and turn attention into measurable growth.",
    categories: ["Influencer Marketing"],
    source: "Dotts Media House",
    author: "Dotts Media House",
    date: "August 26, 2026",
    readTime: "5 min read",
    url: "https://dottsmediahouse.com/effective-ways-to-boost-your-visibility-with-influencers/",
    image: "/blog/effective-ways-to-boost-your-visibility-with-influencers.png",
    imageAlt: "Black influencer filming an unboxing in a sunlit apartment",
  },
  {
    slug: "types-of-media-buying",
    title: "What Are the Different Types of Media Buying?",
    excerpt:
      "Media Buying types in this sense refer to the different ways brands purchase advertising space, airtime or digital inventory to reach specific audiences and achieve their campaign goals.",
    categories: ["Media Buying"],
    source: "Dotts Media House",
    author: "Dotts Media House",
    date: "August 25, 2026",
    readTime: "6 min read",
    url: "https://dottsmediahouse.com/types-of-media-buying/",
    image: "/blog/types-of-media-buying.png",
    imageAlt: "Digital billboard and campaign placements above a busy Lagos street",
  },
  {
    slug: "traditional-vs-digital-media-buying-the-best-fit-for-your-brand",
    title: "Traditional vs Digital Media Buying: The Best Fit for Your Brand?",
    excerpt:
      "Traditional vs Digital Media Buying: which should your brand invest in? The answer is rarely as simple as choosing one over the other. Television, radio, print and digital each carry their own strengths.",
    categories: ["Media Buying"],
    source: "Dotts Media House",
    author: "Dotts Media House",
    date: "August 20, 2026",
    readTime: "7 min read",
    url: "https://dottsmediahouse.com/traditional-vs-digital-media-buying-the-best-fit-for-your-brand/",
    image: "/blog/traditional-vs-digital-media-buying.png",
    imageAlt: "Newspaper and smartphone showing the same fictional campaign",
  },
  {
    slug: "media-buying-strategies-to-maximise-advertising-roi",
    title: "Media Buying Strategies to Maximise Advertising ROI",
    excerpt:
      "Brands can spend heavily on advertising and still struggle to see meaningful returns. Media Buying Strategies to Maximise Advertising ROI are therefore not about simply spending more, but spending smarter.",
    categories: ["Media Buying"],
    source: "Dotts Media House",
    author: "Dotts Media House",
    date: "August 18, 2026",
    readTime: "7 min read",
    url: "https://dottsmediahouse.com/media-buying-strategies-to-maximise-advertising-roi/",
    image: "/blog/media-buying-strategies-to-maximise-advertising-roi.png",
    imageAlt: "Media strategist reviewing campaign dashboards at a cluttered desk",
  },
  {
    slug: "media-planning-and-media-buying-understanding-the-key-differences",
    title: "Media Planning and Buying: Understanding the Key Differences",
    excerpt:
      "What happens when a brand has a strong media strategy but poor execution, or secures great advertising placements without a clear strategy? In both cases, results fall short of their potential.",
    categories: ["Marketing Campaigns", "Media Buying"],
    source: "Dotts Media House",
    author: "Dotts Media House",
    date: "August 17, 2026",
    readTime: "6 min read",
    url: "https://dottsmediahouse.com/media-planning-and-media-buying-understanding-the-key-differences/",
    image: "/blog/media-planning-and-media-buying.png",
    imageAlt: "Two colleagues planning media placements around a table",
  },
  {
    slug: "why-your-brands-social-media-isnt-working",
    title: "Why Your Brand’s Social Media Isn’t Working (And How to Fix It)",
    excerpt:
      "Social media has become one of the most powerful channels for building brand awareness, engaging customers, and driving business growth. However, from our feedback, many brands still struggle to make it work.",
    categories: ["Digital Marketing", "Social Media Marketing"],
    source: "Dotts Media House",
    author: "Dotts Media House",
    date: "August 10, 2026",
    readTime: "8 min read",
    url: "https://dottsmediahouse.com/why-your-brands-social-media-isnt-working/",
    image: "/blog/why-your-brands-social-media-isnt-working.png",
    imageAlt: "Black founder checking her phone in a small product boutique",
  },
  // News — formerly the standalone /news section, now a blog category.
  {
    slug: "africa-agentic-ai-role",
    title: "Africa's part in agentic AI: the continent isn't just a market, it's a builder",
    excerpt:
      "Agentic AI — software that reasons, plans, and acts on its own — is reshaping how products get built. Africa's young, mobile-first, multilingual talent base gives the continent a distinct role in that shift: not only as a place agents are deployed, but as a place they are designed, trained, and governed.",
    categories: ["News"],
    source: "VisualCNS",
    author: "VisualCNS Editorial",
    date: "August 12, 2026",
    url: "/blog/africa-agentic-ai-role",
    image: "/blog/africa-agentic-ai-role.jpg",
    imageAlt: "Three young engineers watching an AI agent run on a monitor in a Lagos office",
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
    categories: ["News"],
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
    categories: ["News"],
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
    categories: ["News"],
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
    categories: ["News"],
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
    categories: ["News"],
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
    categories: ["News"],
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
    categories: ["News"],
    source: "Bezos Earth Fund",
    author: "Press Release",
    date: "February 4, 2026",
    url: "https://www.bezosearthfund.org/news-and-insights/bezos-earth-fund-to-accelerate-48-transformative-climate-and-nature-solutions-in-collaboration-with-the-earthshot-prize",
    image: "/news/earthshot-climate-solutions.jpg",
    imageAlt: "Rolling green hills in north-west England",
    imageCredit: "Shutterstock via Bezos Earth Fund",
  },
]

export function getBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getBlogCategories(): string[] {
  return [...new Set(blogPosts.flatMap((post) => post.categories))].sort()
}
