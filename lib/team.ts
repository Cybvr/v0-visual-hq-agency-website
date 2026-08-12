export interface TeamMember {
  name: string
  role: string
  image: string
  description: string
}

export const teamMembers: TeamMember[] = [
  {
    name: "Jide Pinheiro",
    role: "CEO, Founder",
    image: "/professional-african-man-portrait.png",
    description:
      "Products are stories of people's experiences, and this perspective drives Jide's approach to finding solutions through design, storytelling, software development, and architecture. With over 10 years of experience, he has crafted digital products for B2B and B2C markets that are accessible, intuitive, and friendly. Asides founding Visual Africa, Jide's brand design and communications portfolio includes over 20 high-profile brands, such as MTN, FirstBank, Wema Bank, Stanbic IBTC, Nigerian Breweries, CocaCola, LVMH, LG, Honeywell Group, Henkel, and Mixta Africa.",
  },
  {
    name: "Musa Asuku",
    role: "Design Director",
    image: "/professional-african-man-developer-portrait.jpg",
    description:
      "Musa is an expert in design, concept development, and art direction, bringing a unique perspective to every project. He has developed impactful brand identities for prominent companies, including ASCON Oil, Oando, TecnoOil, Seplat Energy, ARM Pension, and the FirstBank 120th Anniversary. His portfolio features collaborations with major brands across sectors, such as UAC, MTN, Zain, TEENSMATA (a USAID initiative), UNICEF, Oando, Dangote, Sterling Bank, Nigeria Breweries (Strongbow), and Honeywell Group.",
  },
  {
    name: "Muna Anazodo",
    role: "Director, Strategy",
    image: "/professional-african-woman.png",
    description:
      "Muna has years of experience in research, strategy, business development, project management, communications and social marketing. She has developed communications and corporate social responsibility strategy for various companies and organisations including UNICEF, Access Bank, Oando, NNPC, the Ministry of Finance, Purple/Voices4Change, Springster/Girl Effect and Wapic Insurance. Her interest in social development in the context of everyday realities has defined her career to date.",
  },
  {
    name: "Nnenna Okoro",
    role: "Project Manager",
    image: "/placeholder.svg",
    description:
      "Nnenna is a seasoned project manager with a focus on delivering impactful brand and communications projects. With a strategic approach, she expertly manages timelines, budgets, and cross-functional teams to ensure seamless project execution from concept to completion. Nnenna's experience spans various industries, where her keen eye for detail and commitment to excellence consistently drive successful outcomes.",
  },
  {
    name: "Ebere Okereke",
    role: "Head of Marketing",
    image: "/placeholder.svg",
    description:
      "Ebere leads marketing across brand, growth, and communications, translating strategy into campaigns that build audiences and move products. She brings a data-informed, story-first approach to positioning VisualCNS and its portfolio businesses in the market.",
  },
  {
    name: "Kola Olatunji",
    role: "Creative Director",
    image: "/placeholder.svg",
    description:
      "Kola sets the creative vision across brand and product work, shaping concepts from first idea to finished execution. He leads the design team in crafting identities and experiences that are distinctive, coherent, and built to last.",
  },
  {
    name: "Samuel Adekola",
    role: "Art Director",
    image: "/placeholder.svg",
    description:
      "Samuel directs the visual language of every project, translating strategy into art direction that is bold, consistent, and on-brand. He pairs a strong aesthetic sensibility with the discipline to carry an idea across every touchpoint.",
  },
  {
    name: "Lutfat Adeoye",
    role: "UX Designer",
    image: "/placeholder.svg",
    description:
      "Lutfat designs the flows and interfaces that make products feel effortless, grounding every decision in research and real user behaviour. She turns complex requirements into clear, usable, accessible experiences.",
  },
  {
    name: "Semudara Abayomi",
    role: "UX Designer",
    image: "/placeholder.svg",
    description:
      "Semudara shapes intuitive, human-centred product experiences, from wireframes to polished interaction detail. He works closely with design and engineering to ensure what ships is both usable and beautiful.",
  },
]

export function getTeamMembers(): TeamMember[] {
  return teamMembers
}
