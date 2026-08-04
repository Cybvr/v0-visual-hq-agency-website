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
            <AccordionTrigger className="text-left text-2xl font-normal hover:no-underline md:text-3xl">
              1. VisualHQ is a software and technology consulting firm.
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Founded in Lagos. We help businesses work out what to build, then build it and keep it running.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="what">
            <AccordionTrigger className="text-left text-2xl font-normal hover:no-underline md:text-3xl">
              2. What we do
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Product design, engineering, and systems architecture, usually all three on the same project. Some clients arrive with an idea and nothing else. Others have a platform that already works and is straining under it.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="why">
            <AccordionTrigger className="text-left text-2xl font-normal hover:no-underline md:text-3xl">
              3. Why VisualHQ
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              We know the market we work in, and we hold the same engineering standards we would anywhere else. We build for the version of the relationship that continues past launch, because that is when most of the real work shows up.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
      <Footer />
    </div>
  )
}
