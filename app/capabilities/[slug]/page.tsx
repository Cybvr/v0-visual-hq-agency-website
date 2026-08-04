import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getCapabilities, getCapabilityBySlug } from "@/lib/capabilities"

export function generateStaticParams() {
  return getCapabilities().map((capability) => ({ slug: capability.slug }))
}

export default async function CapabilityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const capability = getCapabilityBySlug(slug)

  if (!capability) notFound()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-12 pb-24 pt-32 md:px-20">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/capabilities">
              <ArrowLeft className="size-4" />
              Capabilities
            </Link>
          </Button>
          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Capability</p>
          <h1 className="mt-5 text-balance text-5xl font-semibold tracking-normal md:text-7xl">{capability.title}</h1>
          <p className="mt-8 text-xl leading-8 text-muted-foreground">{capability.description}</p>

          {capability.image ? (
            <div className="mt-12 aspect-[16/7] overflow-hidden bg-muted">
              <img
                src={capability.image}
                alt={capability.imageAlt || capability.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          {capability.body?.length ? (
            <div className="mt-12 space-y-6 text-lg leading-8">
              {capability.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {capability.includes?.length ? (
            <div className="mt-16 border-t border-border pt-10">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                What the work usually covers
              </h2>
              <ul className="mt-8 grid gap-y-4">
                {capability.includes.map((item) => (
                  <li key={item} className="border-b border-border pb-4 text-lg leading-8">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-16 border-t border-border pt-10">
            <p className="text-lg leading-8 text-muted-foreground">
              If this is the kind of work you need,{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-4 hover:text-accent">
                tell us what you are building
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
