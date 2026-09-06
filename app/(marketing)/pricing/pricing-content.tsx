import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PageHeading } from "@/components/page-heading"
import { PricingSection } from "@/components/pricing-section"

export function PricingContent() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 pt-32">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-8 md:px-20">
          <PageHeading title="Pricing" subtitle="Our standard scopes, timelines, and retainers." />

          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
