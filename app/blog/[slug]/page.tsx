import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog"

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-12 pb-24 pt-32 md:px-20">
        <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground">← Blog</Link>
        <p className="mt-8 text-xs uppercase tracking-[0.14em] text-accent">
          {post.categories.join(" · ")}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
        <p className="mt-3 text-xs text-muted-foreground">
          {post.date}
          {post.readTime ? ` — ${post.readTime}` : null}
        </p>
        {post.image ? (
          <figure className="mt-8">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, calc(100vw - 6rem)"
                className="object-cover"
                style={{ objectPosition: post.imagePosition }}
              />
            </div>
            {post.imageCredit ? (
              <figcaption className="mt-2 text-xs text-muted-foreground">
                Image: {post.imageCredit}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        {post.body ? (
          <article className="mt-8 max-w-2xl">
            <p className="text-lg leading-8 text-foreground">{post.excerpt}</p>
            {post.body.map((section, i) => (
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
              {post.author} · {post.source}
            </p>
          </article>
        ) : (
          <div className="mt-8 max-w-2xl">
            <p className="text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-semibold hover:text-accent"
            >
              Read the full article →
            </a>
            <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
              {post.author} · {post.source}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
