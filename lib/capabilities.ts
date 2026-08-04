export interface Capability {
  slug: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  /** Long-form copy for the capability detail page, one string per paragraph. */
  body?: string[]
  /** What an engagement in this capability typically covers. */
  includes?: string[]
}

export const capabilities: Capability[] = [
  {
    slug: "product-engineering",
    title: "Product Engineering",
    description: "Full-stack web and mobile systems for teams that need working software on a real schedule.",
    image: "/marketing/mvp-build.jpg",
    imageAlt: "Product team reviewing an early build",
    body: [
      "Most projects reach us as a prototype, a spreadsheet that grew teeth, or a codebase someone else left behind. The job is getting from there to something that runs in production and holds up when real users arrive.",
      "We work across the whole stack: interface, API, data model, deployment, and the unglamorous operational work that decides whether a product is still healthy six months later. Where there is a choice, we take the boring, well-documented option. Novel tooling is a cost that someone pays later, and that someone is usually the client's own team.",
      "We build and run our own products too, so we are rarely arguing about maintenance in the abstract. Whatever we hand over, we build as though we were the ones keeping it alive.",
    ],
    includes: [
      "Discovery and scoping, including a written technical plan before anyone opens an editor",
      "Web and mobile builds, from first screen to production deploy",
      "API and data model design",
      "Rebuilds and rescues of existing codebases",
      "Handover documentation and time with your engineers",
    ],
  },
  {
    slug: "business-automation",
    title: "Business Automation",
    description: "Internal tools, workflows, dashboards, and integrations that make operations calmer and repeatable.",
    image: "/marketing/systems.png",
    imageAlt: "Connected operational systems",
    body: [
      "Most operations teams are held together by spreadsheets, group chats, and one person who remembers how everything works. That arrangement is fine until that person takes leave.",
      "We start by mapping what actually happens, which is usually not what the process document says. Then we automate the parts that are repetitive and reversible, and leave the judgment calls with the people who should be making them. The aim is not to remove staff. It is to stop them retyping the same order into three different systems.",
      "A good share of this work is unglamorous integration between tools a business already pays for. We will tell you when that is the whole answer and no new software is needed.",
    ],
    includes: [
      "Process mapping and a plain-language write-up of how the work runs today",
      "Internal dashboards and admin tools",
      "Integrations between systems you already use",
      "Scheduled jobs, alerts, and reporting",
      "Training, so the tool survives without us",
    ],
  },
  {
    slug: "ai-enablement",
    title: "AI Enablement",
    description: "Practical AI features and agents that speed up work a team already does.",
    image: "/marketing/built-around-you.png",
    imageAlt: "AI tooling built around a team's workflow",
    body: [
      "Most AI conversations start with the technology and work backwards to a problem. We prefer to go the other way. Find the task that is repetitive, high volume, and cheap to check, and put a model on that one first.",
      "In practice that looks like retrieval over a company's own documents, drafting and summarizing tools, classification and routing, and agents kept on a short leash with a narrow scope. Each of them needs a way for a person to see what the system did and correct it.",
      "We build AI products of our own, including Juju and ColussusIQ, and it has made us more skeptical rather than less. Part of this work is saying when a model is the wrong tool and a query, a form, or a plain rule would do the same job for less money.",
    ],
    includes: [
      "An assessment of where AI would save real time, and where it would not",
      "Retrieval and search over internal documents",
      "Drafting, summarizing, and classification features inside existing products",
      "Scoped agents with human review built in",
      "Evaluation and monitoring, so quality gets measured rather than assumed",
    ],
  },
  {
    slug: "brand-systems",
    title: "Brand Systems",
    description: "Identity, interface, and content systems that keep a product looking like one product.",
    image: "/marketing/website-launch.jpg",
    imageAlt: "Brand and interface system at launch",
    body: [
      "Brand for a software company is not the logo. It is the type scale, the spacing, the tone of the error messages, and whether the fifth screen looks like it came from the same company as the first.",
      "The usual failure is drift. A product gets built over two years by different people under deadline, and ends up with four button styles and three ways of writing a date. We fix that with a small set of decisions, written down and shipped as code rather than as a PDF nobody opens.",
      "Where the work touches marketing, we treat the words as part of the system. Naming, empty states, and onboarding copy do more for how a product feels than another round of color exploration.",
    ],
    includes: [
      "Identity work: wordmark, type, color, and usage rules",
      "Design tokens and a component library your engineers can install",
      "Interface patterns for the screens that get reused most",
      "Voice and copy guidance, including error and empty states",
      "Marketing site and launch assets",
    ],
  },
]

export function getCapabilities(): Capability[] {
  return capabilities
}

export function getCapabilityBySlug(slug: string): Capability | undefined {
  return capabilities.find((capability) => capability.slug === slug)
}
