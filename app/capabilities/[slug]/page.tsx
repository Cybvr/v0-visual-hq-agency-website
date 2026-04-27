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
      <main className="px-6 pb-24 pt-32">
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
        </div>
      </main>
      <Footer />
    </div>
  )
}
