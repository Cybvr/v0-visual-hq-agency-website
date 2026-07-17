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
}

export const newsItems: NewsItem[] = [
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
    title: "2026 MSP Salary Guide",
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
    title: "Afrindependent Institute Publications",
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
