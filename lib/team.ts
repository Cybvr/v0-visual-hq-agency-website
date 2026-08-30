export interface TeamMember {
  name: string
  role: string
  image: string
  description: string
  profileUrl?: string
}

export const teamMembers: TeamMember[] = [
  {
    name: "Jide Pinheiro",
    role: "CEO, Founder",
    image: "/team/jide-pinheiro-bw.png",
    description:
      "Products are stories of people's experiences, and this perspective drives Jide's approach to finding solutions through design, storytelling, software development, and architecture. With over 10 years of experience, he has crafted digital products for B2B and B2C markets that are accessible, intuitive, and friendly. Asides founding Visual Africa, Jide's brand design and communications portfolio includes over 20 high-profile brands, such as MTN, FirstBank, Wema Bank, Stanbic IBTC, Nigerian Breweries, CocaCola, LVMH, LG, Honeywell Group, Henkel, and Mixta Africa.",
  },
  {
    name: "Musa Asuku",
    role: "Design Director",
    image: "/team/musa-asuku-bw.png",
    description:
      "Musa is an expert in design, concept development, and art direction, bringing a unique perspective to every project. He has developed impactful brand identities for prominent companies, including ASCON Oil, Oando, TecnoOil, Seplat Energy, ARM Pension, and the FirstBank 120th Anniversary. His portfolio features collaborations with major brands across sectors, such as UAC, MTN, Zain, TEENSMATA (a USAID initiative), UNICEF, Oando, Dangote, Sterling Bank, Nigeria Breweries (Strongbow), and Honeywell Group.",
  },
  {
    name: "Muna Anazodo",
    role: "Director, Strategy",
    image: "/team/muna-anazodo-bw.png",
    description:
      "Muna has years of experience in research, strategy, business development, project management, communications and social marketing. She has experience working with UNICEF, Access Bank, NNPC, The World Bank, Adei Institute of Technology, Girl Effect and CSR-in-Action. She has experience working on training AI models in business and strategy as a domain expert for projects with Mercor, Micro1 and Cometis AG.",
  },
  {
    name: "Chuka J. Uzo",
    role: "Data Engineer & AI Solutions Developer",
    image: "/team/chuka-uzo-bw.png",
    description:
      "Chuka is a data engineer and AI solutions developer based in Lagos. His work focuses on lightweight language models, AI infrastructure, and systems observability.",
    profileUrl: "https://ng.linkedin.com/in/chuka-j-uzo",
  },
  {
    name: "Nnenna Okoro",
    role: "Project Manager",
    image: "/team/nnenna-okoro-bw.png",
    description:
      "Nnenna is a seasoned project manager with a focus on delivering impactful brand and communications projects. With a strategic approach, she expertly manages timelines, budgets, and cross-functional teams to ensure seamless project execution from concept to completion. Nnenna's experience spans various industries, where her keen eye for detail and commitment to excellence consistently drive successful outcomes.",
  },
  {
    name: "Ebere Okereke",
    role: "Head of Marketing",
    image: "/team/ebere-okereke-bw.png",
    description:
      "Ebere leads marketing across brand, growth, and communications, translating strategy into campaigns that build audiences and move products. She brings a data-informed, story-first approach to positioning VisualCNS and its portfolio businesses in the market.",
  },
  {
    name: "Kola Olatunji",
    role: "Founder, DÚDÚ Creatives",
    image: "/team/kola-olatunji-bw.png",
    description:
      "Kola is a Pan-African creative strategist, filmmaker, and communications leader. As the founder of DÚDÚ Creatives, he leads film, video production, brand consulting, and cultural programming that brings African stories and music communities to life.",
    profileUrl: "https://www.linkedin.com/in/kolawole-olatunji-002531179",
  },
  {
    name: "Samuel Adekola",
    role: "Visual Communication Designer",
    image: "/team/samuel-adekola-bw.png",
    description:
      "Samuel is a visual communication designer focused on presentations, documents, brand design, and clear visual systems. His work turns ideas into compelling visuals that help brands communicate with clarity.",
    profileUrl: "https://www.behance.net/sammystrings",
  },
  {
    name: "Lutfat Adeoye",
    role: "Brand & UX Designer",
    image: "/team/lutfat-adeoye-bw.png",
    description:
      "Lutfat is a brand and UX designer who treats design as more than aesthetics. She combines user experience, research, and visual identity to make complex ideas meaningful and usable.",
    profileUrl: "https://www.behance.net/lutfatadeoye",
  },
  {
    name: "Abayomi Semudara",
    role: "Product Designer",
    image: "/team/abayomi-semudara-bw.png",
    description:
      "Abayomi is a product designer based in Lagos. He focuses on strong ideas and brilliant creative work that solve business and organisational objectives.",
    profileUrl: "https://www.behance.net/semudaraabayomi",
  },
]

export function getTeamMembers(): TeamMember[] {
  return teamMembers
}
