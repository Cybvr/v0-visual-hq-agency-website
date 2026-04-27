import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getBrandItems } from "@/lib/brands"
import { getCapabilities } from "@/lib/capabilities"
import { getIndustries } from "@/lib/industries"

const capabilities = getCapabilities()
const products = getBrandItems()
const industries = getIndustries()

function CoreNineMark() {
  return (
    <div className="grid grid-cols-3 gap-2" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} className="block size-4 rounded-[4px] bg-foreground md:size-5" />
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <section className="flex min-h-screen flex-col px-6 pb-8 pt-28">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center text-center">

            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-normal md:text-6xl lg:text-7xl">
              VisualCoreNine builds software systems for modern businesses.
            </h1>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="rounded-full px-6 font-semibold" asChild>
                <Link href="#products">
                  Explore products
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full bg-transparent px-6 font-semibold" asChild>
                <Link href="/contact">Work with VisualHQ</Link>
              </Button>
            </div>
          </div>

        </section>

        <section id="products" className="scroll-mt-24 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Products</p>
              <h2 className="mx-auto mt-4 max-w-2xl text-balance text-xl font-semibold tracking-normal sm:text-2xl md:text-4xl">
                A simple ecosystem for building, operating, and creating.
              </h2>
            </div>

            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:mt-14 md:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.name}
                  href={product.href}
                  className="group flex flex-col items-center justify-center gap-3 px-2 py-4 text-center text-foreground transition-colors hover:text-primary sm:gap-5 sm:px-6 sm:py-8"
                >
                  <div className="flex size-10 items-center justify-center sm:size-16">
                    <Image
                      src={product.logo}
                      alt=""
                      width={64}
                      height={64}
                      className="max-h-10 w-auto object-contain sm:max-h-16"
                    />
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm md:text-base">
                    {product.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="capabilities" className="scroll-mt-24 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Capabilities
                </p>
                <h2 className="mt-4 text-balance text-4xl font-semibold tracking-normal md:text-5xl">
                  What the ecosystem knows how to build.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {capabilities.map((capability) => (
                  <Link key={capability.slug} href={`/capabilities/${capability.slug}`} className="border-t border-border pt-6">
                    <h3 className="text-xl font-semibold">{capability.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{capability.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="industries" className="scroll-mt-24 bg-secondary px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Industries</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-normal md:text-5xl">
                Built for operators, founders, and creative teams.
              </h2>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-4">
              {industries.map((industry) => (
                <Link key={industry.slug} href={`/industries/${industry.slug}`} className="rounded-[2rem] bg-background p-7">
                  <h3 className="text-xl font-semibold">{industry.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{industry.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
