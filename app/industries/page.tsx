import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getIndustries } from "@/lib/industries"

export default function IndustriesPage() {
  const industries = getIndustries()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Industries</p>
          <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold tracking-normal md:text-7xl">
            Built for operators, founders, and creative teams.
          </h1>
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group rounded-[2rem] border border-border p-7"
              >
                <h2 className="text-2xl font-semibold">{industry.name}</h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{industry.description}</p>
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
