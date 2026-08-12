export interface TeamMember {
  name: string
  role: string
  image: string
  description: string
}

export const teamMembers: TeamMember[] = [
  {
    name: "Jide Pinheiro",
    role: "Founder & Creative Director",
    image: "/professional-african-man-portrait.png",
    description:
      "Sets the creative direction across every engagement, pairing brand strategy with a builder's eye for what ships. Founded VisualHQ to bring world-class design to African businesses.",
  },
  {
    name: "Adaeze Okonkwo",
    role: "Lead Designer",
    image: "/professional-african-woman.png",
    description:
      "Leads product and brand design end to end, turning ambiguous briefs into clear, usable interfaces. Obsessed with typography, systems, and the details users never notice but always feel.",
  },
  {
    name: "Tunde Bakare",
    role: "Senior Developer",
    image: "/professional-african-man-developer-portrait.jpg",
    description:
      "Builds the systems behind the work — fast, resilient, and maintainable. Bridges design and engineering so what gets designed is exactly what gets shipped.",
  },
]

export function getTeamMembers(): TeamMember[] {
  return teamMembers
}
