import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getNewsItems } from "@/lib/news"

const news = getNewsItems()

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-12 pb-24 pt-32 md:px-20">
        <h1 className="mb-12 text-2xl font-normal">News</h1>
        <ul className="divide-y divide-border">
          {news.map((item) => (
            <li key={item.slug}>
              <Link href={`/news/${item.slug}`} className="block py-6 hover:text-accent">
                <p className="text-xs text-muted-foreground">{item.source} — {item.date}</p>
                <p className="mt-1 font-normal">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  )
}
