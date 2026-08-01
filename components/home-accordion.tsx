"use client"

import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PortfolioSection } from "@/components/portfolio-section"
import type { BrandItem } from "@/lib/brands"
import type { Capability } from "@/lib/capabilities"
import type { NewsItem } from "@/lib/news"

// Matches the row styling used by PortfolioSection's project list.
const listClass = "grid grid-cols-1 gap-y-8"
const rowClass = "border-b border-border pb-4"
const rowLinkClass =
  "block text-2xl text-foreground transition-colors hover:text-accent md:text-3xl line-clamp-1"

const triggerClass = "group text-left text-2xl hover:no-underline md:text-3xl"

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
          <span>1. VisualCNS builds software systems for modern businesses.</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          We design and engineer digital products across ecommerce, AI tooling, and experience platforms.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="products">
        <AccordionTrigger className={triggerClass}>
          <span>2. Products</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent>
          <ul className={listClass}>
            {products.map((p) => (
              <li key={p.slug} className={rowClass}>
                <Link href={p.href} className={rowLinkClass}>
                  {p.name} — {p.product}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="capabilities">
        <AccordionTrigger className={triggerClass}>
          <span>3. Capabilities</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent>
          <ul className={listClass}>
            {capabilities.map((c) => (
              <li key={c.slug} className={rowClass}>
                <Link href={`/capabilities/${c.slug}`} className={rowLinkClass}>
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="portfolio">
        <AccordionTrigger className={triggerClass}>
          <span>4. Portfolio</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent>
          <PortfolioSection showHero={false} inset />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="news">
        <AccordionTrigger className={triggerClass}>
          <span>5. News</span>
          <ToggleIcon />
        </AccordionTrigger>
        <AccordionContent>
          <ul className="grid grid-cols-1 gap-y-8">
            {news.map((item) => (
              <li key={item.slug} className="border-b border-border pb-4">
                <Link href={`/news/${item.slug}`} className="block group">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="h-16 w-24 shrink-0 overflow-hidden bg-muted">
                      <img
                        src={item.image || "/placeholder.svg?height=300&width=480&query=news"}
                        alt={item.imageAlt || item.title}
                        style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl text-foreground transition-colors group-hover:text-accent md:text-3xl line-clamp-1">
                        {item.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
