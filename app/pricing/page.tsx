import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/pricing-section"

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-muted-foreground mb-2">Pricing</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your business needs. All plans include our commitment to quality and
              excellence.
            </p>
          </div>
          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
