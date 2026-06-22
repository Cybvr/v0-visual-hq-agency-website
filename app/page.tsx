import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { HomeAccordion } from "@/components/home-accordion"
import { PortfolioSection } from "@/components/portfolio-section"
import { getBrandItems } from "@/lib/brands"
import { getCapabilities } from "@/lib/capabilities"
import { getNewsItems } from "@/lib/news"

const capabilities = getCapabilities()
const products = getBrandItems().filter((b) => b.slug !== "visualhq")
const news = getNewsItems()

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-12 pb-8 pt-32 md:px-20">
        <HomeAccordion products={products} capabilities={capabilities} news={news} />
      </main>
      <div className="-mt-24 md:-mt-28">
        <PortfolioSection />
      </div>
      <Footer />
    </div>
  )
}
