export interface NewsItem {
  slug: string
  title: string
  excerpt: string
  source: string
  author: string
  date: string
  url: string
}

export const newsItems: NewsItem[] = [
  {
    slug: "new-platform-to-link-digital-discovery-with-real-events-launched",
    title: "New platform to link digital discovery with real events launched",
    excerpt:
      "Funseekas.com, a new social events ecosystem, has launched to transform how Africans discover and experience live events. The platform creates community-driven connections that extend beyond ticket purchase.",
    source: "The Guardian Nigeria",
    author: "Ogunnoiki",
    date: "June 21, 2025",
    url: "https://guardian.ng/news/nigeria/metro/new-platform-to-link-digital-discovery-with-real-events-launched/",
  },
  {
    slug: "2026-msp-salary-guide",
    title: "2026 MSP Salary Guide",
    excerpt:
      "Salary data benchmarked from over 3,500 interviews with MSP professionals and 3,000 MSP jobs filled.",
    source: "Bowman Williams",
    author: "John Davenjay",
    date: "February 2026",
    url: "https://bowmanwilliams.com/msp-salary-guide/",
  },
  {
    slug: "afrindependent-publications",
    title: "Afrindependent Institute Publications",
    excerpt:
      "Original research, essays, and frameworks advancing African intellectual and economic sovereignty through Africonomics.",
    source: "Afrindependent Institute",
    author: "Manuel Tacanho",
    date: "2026",
    url: "https://www.afrindependent.org/publications?filter=latest_pub",
  },
]

export function getNewsItems(): NewsItem[] {
  return newsItems
}

export function getNewsItemBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((item) => item.slug === slug)
}
