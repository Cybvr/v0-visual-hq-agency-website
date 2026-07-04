import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getCapabilities } from "@/lib/capabilities"

export default function CapabilitiesPage() {
  const capabilities = getCapabilities()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-12 pb-24 pt-32 md:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Capabilities</p>
          <h1 className="mt-5 max-w-4xl text-balance text-5xl font-normal tracking-normal md:text-7xl">
            What VisualCoreNine knows how to <span className="text-accent">build</span>.
          </h1>
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {capabilities.map((capability) => (
              <Link
                key={capability.slug}
                href={`/capabilities/${capability.slug}`}
                className="group rounded-[2rem] border border-border p-7"
              >
                <h2 className="text-2xl font-semibold">{capability.title}</h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{capability.description}</p>
                <ArrowUpRight className="mt-8 size-7 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
