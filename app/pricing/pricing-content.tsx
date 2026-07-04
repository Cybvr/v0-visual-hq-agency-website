import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PricingSection } from "@/components/pricing-section"

export function PricingContent() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Pricing</p>
            <h1 className="font-serif text-4xl font-normal leading-tight md:text-6xl">
              Pricing for product, <span className="text-accent">platform</span>, and support work.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Explore our standard scopes, timelines, and retainers before booking a discovery call for your project.
            </p>
          </div>

          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
