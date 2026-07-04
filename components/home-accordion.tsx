"use client"

import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { BrandItem } from "@/lib/brands"
import type { Capability } from "@/lib/capabilities"
import type { NewsItem } from "@/lib/news"

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
    <Accordion type="multiple" defaultValue={["intro"]} className="w-full">
      <AccordionItem value="intro">
        <AccordionTrigger className="text-left text-2xl hover:no-underline md:text-3xl">
          1. VisualCoreNine builds software systems for modern businesses.
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          We design and engineer digital products across ecommerce, AI tooling, and experience platforms.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="products">
        <AccordionTrigger className="text-left text-2xl hover:no-underline md:text-3xl">
          2. Products
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 text-muted-foreground">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={p.href} className="hover:text-foreground">
                  {p.name} — {p.product}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="capabilities">
        <AccordionTrigger className="text-left text-2xl hover:no-underline md:text-3xl">
          3. Capabilities
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 text-muted-foreground">
            {capabilities.map((c) => (
              <li key={c.slug}>
                <Link href={`/capabilities/${c.slug}`} className="hover:text-foreground">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="news">
        <AccordionTrigger className="text-left text-2xl hover:no-underline md:text-3xl">
          4. News
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 text-muted-foreground">
            {news.map((item) => (
              <li key={item.slug}>
                <Link href={`/news/${item.slug}`} className="hover:text-foreground">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
