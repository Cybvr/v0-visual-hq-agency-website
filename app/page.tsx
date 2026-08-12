import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { HomeAccordion } from "@/components/home-accordion"
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
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-8 md:px-20 md:pt-32">
        <section aria-label="Lagos video" className="mb-12 overflow-hidden bg-muted md:mb-16">
          <video
            className="aspect-video w-full object-cover"
            src="/lagos.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls
            preload="metadata"
            aria-label="Lagos video"
          />
        </section>
        <HomeAccordion products={products} capabilities={capabilities} news={news} />
      </main>
      <Footer />
    </div>
  )
}
