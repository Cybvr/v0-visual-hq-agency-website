import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PortfolioSection } from "@/components/portfolio-section"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <PortfolioSection />

      {/* CTA Section */}
      <section className="py-20 px-12 bg-foreground text-primary-foreground md:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Have a project in mind?</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            We'd love to hear about it. Let's discuss how we can help bring your vision to life.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/contact">Start a Project</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
