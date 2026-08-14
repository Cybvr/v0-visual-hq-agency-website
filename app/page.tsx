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
      <main>
        <section aria-label="Lagos video" className="relative h-screen min-h-[30rem] w-full overflow-hidden bg-muted supports-[height:100svh]:h-[100svh]">
          <video
            className="size-full object-cover"
            src="/lagos.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Lagos video"
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-8 sm:pb-10 md:px-20 md:pb-12">
            <h1 className="text-5xl leading-[0.9] tracking-[-0.03em] text-white sm:text-6xl md:text-8xl">
              Dream. Execute
            </h1>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-8 md:px-20 md:pt-16">
          <HomeAccordion products={products} capabilities={capabilities} news={news} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
