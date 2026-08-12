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
        {item.body ? (
          <article className="mt-8 max-w-2xl">
            <p className="text-lg leading-8 text-foreground">{item.excerpt}</p>
            {item.body.map((section, i) => (
              <section key={i} className="mt-8">
                {section.heading ? (
                  <h2 className="mb-4 text-xl font-bold">{section.heading}</h2>
                ) : null}
                {section.paragraphs.map((paragraph, j) => (
                  <p key={j} className="mt-4 leading-7 text-muted-foreground first:mt-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
            <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
              {item.author} · {item.source}
            </p>
          </article>
        ) : (
          <>
            <p className="mt-4 text-muted-foreground">{item.excerpt}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-semibold hover:text-accent"
            >
              Read full article →
            </a>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
