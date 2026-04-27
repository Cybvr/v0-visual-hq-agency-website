"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getBrandItems } from "@/lib/brands"
import { getCapabilities } from "@/lib/capabilities"
import { getIndustries } from "@/lib/industries"

const brands = getBrandItems()
const capabilities = getCapabilities()
const industries = getIndustries()

const primaryNavigation = [
  { name: "Company", href: "/#company" },
]

const secondaryNavigation = [
  { name: "Careers", href: "https://pasive.co/jobs" },
  { name: "News", href: "/#news" },
]

const brandNavigationItems = [
  {
    name: "All brands",
    href: "/brands",
    description: "Browse the VisualCoreNine brand ecosystem.",
  },
  ...brands.map((item) => ({
    name: item.name,
    href: item.href,
    description: item.description,
  })),
]

const capabilityNavigationItems = [
  {
    name: "All capabilities",
    href: "/capabilities",
    description: "Browse every VisualCoreNine capability.",
  },
  ...capabilities.map((item) => ({
    name: item.title,
    href: `/capabilities/${item.slug}`,
    description: item.description,
  })),
]

const industryNavigationItems = [
  {
    name: "All industries",
    href: "/industries",
    description: "See the markets VisualCoreNine builds for.",
  },
  ...industries.map((item) => ({
    name: item.name,
    href: `/industries/${item.slug}`,
    description: item.description,
  })),
]

function VisualCoreNineWordmark() {
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
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground outline-none transition-colors hover:text-primary focus-visible:text-primary"
      >
        {label}
        <ChevronDown className="size-3" />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-80 pt-4">
          <div className="rounded-2xl border border-border bg-background p-2 text-left text-foreground shadow-lg">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-start gap-1 rounded-xl px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-secondary focus:bg-secondary"
              >
                <span className="font-semibold">{item.name}</span>
                <span className="text-xs leading-5 text-muted-foreground">{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileAccordionSection({
  value,
  label,
  items,
  onNavigate,
}: {
  value: string
  label: string
  items: Array<{ name: string; href: string; description: string }>
  onNavigate: () => void
}) {
  return (
    <AccordionItem value={value} className="border-border/70">
      <AccordionTrigger className="py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
        {label}
      </AccordionTrigger>
      <AccordionContent className="grid gap-1 pb-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-start gap-1 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
            onClick={onNavigate}
          >
            <span className="font-semibold">{item.name}</span>
            <span className="text-xs leading-5 text-muted-foreground">{item.description}</span>
          </Link>
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState<"brands" | "capabilities" | "industries" | null>(
    null,
  )

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" aria-label="VisualCoreNine home">
          <VisualCoreNineWordmark />
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {primaryNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
          <DesktopHoverMenu
            label="Brands"
            items={brandNavigationItems}
            isOpen={desktopDropdownOpen === "brands"}
            onOpen={() => setDesktopDropdownOpen("brands")}
            onClose={() => setDesktopDropdownOpen(null)}
          />
          <DesktopHoverMenu
            label="Capabilities"
            items={capabilityNavigationItems}
            isOpen={desktopDropdownOpen === "capabilities"}
            onOpen={() => setDesktopDropdownOpen("capabilities")}
            onClose={() => setDesktopDropdownOpen(null)}
          />
          <DesktopHoverMenu
            label="Industries"
            items={industryNavigationItems}
            isOpen={desktopDropdownOpen === "industries"}
            onOpen={() => setDesktopDropdownOpen("industries")}
            onClose={() => setDesktopDropdownOpen(null)}
          />
          {secondaryNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>

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
            {primaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Accordion type="single" collapsible className="w-full">
              <MobileAccordionSection
                value="brands"
                label="Brands"
                items={brandNavigationItems}
                onNavigate={() => setMobileMenuOpen(false)}
              />
              <MobileAccordionSection
                value="capabilities"
                label="Capabilities"
                items={capabilityNavigationItems}
                onNavigate={() => setMobileMenuOpen(false)}
              />
              <MobileAccordionSection
                value="industries"
                label="Industries"
                items={industryNavigationItems}
                onNavigate={() => setMobileMenuOpen(false)}
              />
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
          </nav>
        </div>
      )}
    </header>
  )
}
