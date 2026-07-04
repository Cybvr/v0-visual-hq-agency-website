"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { getBrandItems } from "@/lib/brands"

const brands = getBrandItems()

const productNavItems = brands
  .filter((item) => item.slug !== "visualhq")
  .map((item) => ({ name: item.name, href: item.href, description: item.description }))

const consultingNavItems = [
  { name: "VisualHQ", href: "/visualhq", description: "Who we are and what we do." },
  { name: "Portfolio", href: "/portfolio", description: "Explore our work and client projects." },
  { name: "Capabilities", href: "/capabilities", description: "Browse every VisualHQ capability." },
  { name: "Industries", href: "/industries", description: "See the markets VisualHQ builds for." },
]

const secondaryNavigation = [
  { name: "Pricing", href: "/pricing" },
  { name: "Careers", href: "https://pasive.co/jobs" },
  { name: "News", href: "/news" },
]

const bookNowHref = "/contact"

function Wordmark() {
  return (
    <span className="flex items-center gap-3">
      <Image src="/visualhqlogo.svg" alt="" width={28} height={28} className="size-7" priority />
      <span className="text-base font-semibold tracking-tight">VisualCoreNine</span>
    </span>
  )
}

function DesktopHoverMenu({
  label,
  items,
  isOpen,
  onOpen,
  onClose,
}: {
  label: string
  items: Array<{ name: string; href: string; description: string }>
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground outline-none transition-colors hover:text-accent focus-visible:text-accent"
      >
        {label}
        <ChevronDown className="size-3" />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-64 pt-4">
          <div className="rounded-2xl border border-border bg-background p-2 text-left text-foreground shadow-lg">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-start gap-1 rounded-xl px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-accent/15 focus:bg-accent/15"
              >
                <h3 className="text-sm">{item.name}</h3>
                <span className="text-xs leading-5 text-muted-foreground">{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [consultingOpen, setConsultingOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" aria-label="VisualHQ home">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-5">
            <DesktopHoverMenu
              label="Software"
              items={productNavItems}
              isOpen={productsOpen}
              onOpen={() => setProductsOpen(true)}
              onClose={() => setProductsOpen(false)}
            />
            <DesktopHoverMenu
              label="Consulting"
              items={consultingNavItems}
              isOpen={consultingOpen}
              onOpen={() => setConsultingOpen(true)}
              onClose={() => setConsultingOpen(false)}
            />
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <Button asChild className="hidden rounded-full px-5 text-xs font-semibold uppercase tracking-[0.18em] md:inline-flex">
          <Link href={bookNowHref}>Book Now</Link>
        </Button>

        <button
          className="flex size-10 items-center justify-center rounded-full md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-b border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-6 pb-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="products" className="border-border/70">
                <AccordionTrigger className="py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                  Software
                </AccordionTrigger>
                <AccordionContent className="grid gap-1 pb-3">
                  {productNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex flex-col items-start gap-1 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-accent/15"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <h3 className="text-sm">{item.name}</h3>
                      <span className="text-xs leading-5 text-muted-foreground">{item.description}</span>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="consulting" className="border-border/70">
                <AccordionTrigger className="py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                  Consulting
                </AccordionTrigger>
                <AccordionContent className="grid gap-1 pb-3">
                  {consultingNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex flex-col items-start gap-1 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-accent/15"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <h3 className="text-sm">{item.name}</h3>
                      <span className="text-xs leading-5 text-muted-foreground">{item.description}</span>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="mt-3 rounded-full text-sm font-semibold uppercase tracking-[0.18em]">
              <Link href={bookNowHref} onClick={() => setMobileMenuOpen(false)}>
                Book Now
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
