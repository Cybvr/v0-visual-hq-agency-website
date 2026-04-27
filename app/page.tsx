import Link from "next/link"
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, Code2, Newspaper, Sparkles } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getCapabilities } from "@/lib/capabilities"
import { getCompanyPortfolioItems } from "@/lib/company-portfolio"
import { getIndustries } from "@/lib/industries"

const capabilities = getCapabilities()
const companyPortfolioItems = getCompanyPortfolioItems()
const industries = getIndustries()

const products = [
  {
    name: "VisualHQ",
    href: "/about",
    description:
      "Software development consulting for companies that need reliable digital products, platforms, and internal systems.",
    icon: Code2,
    links: [
      { label: "Work", href: "/portfolio" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    name: "Pasive",
    href: "https://pasive.co",
    description: "Ecommerce tools for businesses that need clearer storefronts, smoother ordering, and better sales flows.",
    icon: BriefcaseBusiness,
    links: [],
  },
  {
    name: "Juju",
    href: "https://jujuapp.co",
    description: "AI Marketing Suite for teams creating campaigns, content, and growth workflows with sharper speed.",
    icon: Sparkles,
    links: [],
  },
]

const companyFocus = [
  {
    id: "company",
    title: "Company",
    description:
      "VisualCoreNine is the mother brand for a focused ecosystem of software, automation, and AI-enabled products.",
    icon: Building2,
  },
  {
    id: "careers",
    title: "Careers",
    description:
      "VisualCoreNine is shaped as a small, product-minded team for builders who care about systems, taste, and execution.",
    icon: BriefcaseBusiness,
  },
  {
    id: "news",
    title: "News",
    description:
      "Updates from the VisualCoreNine ecosystem, including product launches, company notes, and new work from VisualHQ.",
    icon: Newspaper,
  },
]

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

          <nav
            className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-12"
            aria-label="VisualCoreNine products"
          >
            {products.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground transition-colors hover:text-primary"
              >
                {product.name}
              </Link>
            ))}
          </nav>
        </section>

        <section id="products" className="scroll-mt-24 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Products</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-normal md:text-6xl">
                A simple ecosystem for building, operating, and creating.
              </h2>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-6">
              {products.map((product) => (
                <Link
                  key={product.name}
                  href={product.href}
                  className="group grid gap-6 rounded-[3rem] bg-secondary px-7 py-8 transition-colors hover:bg-accent md:grid-cols-[auto_1fr_auto] md:items-center md:px-10"
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-background text-primary shadow-sm">
                    <product.icon className="size-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-semibold md:text-3xl">{product.name}</h3>
                      {product.name === "VisualHQ" && (
                        <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Consulting
                        </span>
                      )}
                    </div>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{product.description}</p>
                    {product.links.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-4">
                        {product.links.map((item) => (
                          <span key={item.label} className="text-sm font-semibold text-foreground/75">
                            {item.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowUpRight className="size-8 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
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
                  <div key={capability.title} className="border-t border-border pt-6">
                    <h3 className="text-xl font-semibold">{capability.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{capability.description}</p>
                  </div>
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
                <div key={industry.name} className="rounded-[2rem] bg-background p-7">
                  <h3 className="text-xl font-semibold">{industry.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{industry.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className="scroll-mt-24 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Portfolio</p>
                <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-normal md:text-5xl">
                  The VisualCoreNine portfolio is the product ecosystem.
                </h2>
              </div>
              <Button variant="outline" className="rounded-full bg-transparent" asChild>
                <Link href="/portfolio">
                  VisualHQ work
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {companyPortfolioItems.map((item) => (
                <Link key={item.name} href={item.href} className="group rounded-[2rem] border border-border p-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{item.product}</p>
                  <h3 className="mt-5 text-3xl font-semibold">{item.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <ArrowUpRight className="mt-8 size-7 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {companyFocus.map((item) => (
              <section key={item.id} id={item.id} className="scroll-mt-24 border-t border-border pt-8">
                <item.icon className="size-7 text-primary" />
                <h2 className="mt-6 text-2xl font-semibold">{item.title}</h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </section>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
