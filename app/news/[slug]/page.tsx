import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getNewsItemBySlug, getNewsItems } from "@/lib/news"

export function generateStaticParams() {
  return getNewsItems().map((item) => ({ slug: item.slug }))
}

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getNewsItemBySlug(slug)
  if (!item) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-12 pb-24 pt-32 md:px-20">
        <Link href="/news" className="text-xs text-muted-foreground hover:text-foreground">← News</Link>
        <p className="mt-8 text-xs text-muted-foreground">{item.source} — {item.date}</p>
        <h1 className="mt-2 text-2xl font-bold">{item.title}</h1>
        <figure className="mt-8">
          <div className="relative aspect-video overflow-hidden bg-muted">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              priority
              sizes="(min-width: 1280px) 1152px, calc(100vw - 6rem)"
              className="object-cover"
              style={{ objectPosition: item.imagePosition }}
            />
          </div>
          <figcaption className="mt-2 text-xs text-muted-foreground">
            Image: {item.imageCredit}
          </figcaption>
        </figure>
        <p className="mt-4 text-muted-foreground">{item.excerpt}</p>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm font-semibold hover:text-accent"
        >
          Read full article →
        </a>
      </main>
      <Footer />
    </div>
  )
}
