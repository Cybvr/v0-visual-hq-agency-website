import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { getNewsItems } from "@/lib/news"

const news = getNewsItems()

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-12 pb-24 pt-32 md:px-20">
        <h1 className="mb-12 text-2xl font-normal">News</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="block">
              <Card className="h-full gap-0 overflow-hidden p-0 transition-colors hover:border-accent">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                    style={{ objectPosition: item.imagePosition }}
                  />
                </div>
                <CardHeader className="py-6">
                  <p className="text-xs text-muted-foreground">
                    {item.source} — {item.date}
                  </p>
                  <CardTitle className="mt-1 text-base font-normal">{item.title}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
