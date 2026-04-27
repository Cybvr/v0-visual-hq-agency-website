import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getBrandItems } from "@/lib/brands"

export default function BrandsPage() {
  const items = getBrandItems()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Brands</p>
          <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold tracking-normal md:text-7xl">
            The VisualCoreNine brands are the product ecosystem.
          </h1>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {items.map((item) => (
              <Link key={item.slug} href={item.href} className="group rounded-[2rem] border border-border p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{item.product}</p>
                <h2 className="mt-5 text-3xl font-semibold">{item.name}</h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
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
