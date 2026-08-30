"use client"

import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PortfolioSection } from "@/components/portfolio-section"
import type { BrandItem } from "@/lib/brands"
import type { Capability } from "@/lib/capabilities"
import type { NewsItem } from "@/lib/news"

// Shared by the Products, Capabilities, and News lists. Portfolio deliberately
// breaks the pattern: it renders PortfolioSection's mosaic so the work itself
// carries that section rather than another row of thumbnails.
const listClass = "grid grid-cols-1 gap-y-8"

const triggerClass = "group text-left text-2xl hover:no-underline md:text-3xl"

// Thumbnail + title row shared by Products, Capabilities, and News.
function MediaRow({
  href,
  title,
  image,
  imageAlt,
  imagePosition,
  fit = "cover",
}: {
  href: string
  title: string
  image?: string
  imageAlt?: string
  imagePosition?: string
  fit?: "cover" | "contain"
}) {
  return (
    <li className="border-b border-border pb-4">
      <Link href={href} className="block group">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-16 w-24 shrink-0 overflow-hidden bg-muted">
            <img
              src={image || "/placeholder.svg?height=300&width=480&query=visualcns"}
              alt={imageAlt || title}
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
              className={
                fit === "contain"
                  ? "h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  : "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              }
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl text-foreground transition-colors group-hover:text-accent md:text-3xl line-clamp-1">
              {title}
            </h2>
          </div>
        </div>
      </Link>
    </li>
  )
}

// Right-aligned affordance: "+" when the item is closed, "−" when it is open.
function ToggleIcon() {
  return (
    <span
      aria-hidden
      className="ml-6 shrink-0 font-mono text-2xl leading-none text-muted-foreground transition-colors group-hover:text-accent md:text-3xl"
    >
      <span className="group-data-[state=open]:hidden">+</span>
      <span className="hidden group-data-[state=open]:inline">−</span>
    </span>
  )
}

export function HomeAccordion({
  products,
  capabilities,
  news,
}: {
  products: BrandItem[]
  capabilities: Capability[]
  news: NewsItem[]
}) {
  return (
    <Accordion type="single" collapsible defaultValue="intro" className="w-full">
      <AccordionItem value="intro">
        <AccordionTrigger className={triggerClass}>
          <span>1. About</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          A global creative consultancy that develops digital experiences, brand systems, and technology solutions for
          modern businesses.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="portfolio">
        <AccordionTrigger className={triggerClass}>
          <span>2. Case Studies</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent>
          <PortfolioSection showHero={false} inset limit={6} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="products">
        <AccordionTrigger className={triggerClass}>
          <span>3. Products</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent>
          <ul className={listClass}>
            {products.map((p) => (
              <MediaRow
                key={p.slug}
                href={p.href}
                title={`${p.name} — ${p.product}`}
                image={p.screenshot || p.logo}
                imageAlt={`${p.name} ${p.product}`}
                // Logos need breathing room; product screenshots can fill the frame.
                fit={p.screenshot ? "cover" : "contain"}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="capabilities">
        <AccordionTrigger className={triggerClass}>
          <span>4. Services</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent>
          <ul className={listClass}>
            {capabilities.map((c) => (
              <MediaRow
                key={c.slug}
                href={`/capabilities/${c.slug}`}
                title={c.title}
                image={c.image}
                imageAlt={c.imageAlt}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="news">
        <AccordionTrigger className={triggerClass}>
          <span>5. Latest News and Insights</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent>
          <ul className={listClass}>
            {news.map((item) => (
              <MediaRow
                key={item.slug}
                href={`/news/${item.slug}`}
                title={item.title}
                image={item.image}
                imageAlt={item.imageAlt}
                imagePosition={item.imagePosition}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
