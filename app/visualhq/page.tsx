"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function VisualHQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-12 pb-24 pt-32 md:px-20">
        <Accordion type="multiple" defaultValue={["who"]} className="w-full">
          <AccordionItem value="who">
            <AccordionTrigger className="text-left text-2xl font-bold hover:no-underline md:text-3xl">
              1. VisualHQ is a software and technology consulting firm.
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Founded in Lagos, we help businesses design and build digital systems — from product strategy to production-ready software.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="what">
            <AccordionTrigger className="text-left text-2xl font-bold hover:no-underline md:text-3xl">
              2. What we do
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              We work across the full stack — product design, engineering, and systems architecture. Our engagements range from early-stage builds to scaling existing platforms.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="why">
            <AccordionTrigger className="text-left text-2xl font-bold hover:no-underline md:text-3xl">
              3. Why VisualHQ
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              We combine local market knowledge with international engineering standards. Every project is treated as a long-term partnership, not a transaction.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
      <Footer />
    </div>
  )
}
