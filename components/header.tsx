"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navigation = [
  { name: "Products", href: "/#products" },
  { name: "Impact", href: "/#impact" },
  { name: "AI", href: "/#ai" },
  { name: "Careers", href: "/#careers" },
  { name: "Contact", href: "/contact" },
]

function CoreNineWordmark() {
  return (
    <span className="flex items-center gap-3">
      <span className="grid grid-cols-3 gap-1" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, index) => (
          <span key={index} className="block size-1.5 rounded-[2px] bg-foreground" />
        ))}
      </span>
      <span className="text-base font-semibold tracking-tight">VisualCoreNine</span>
    </span>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" aria-label="VisualCoreNine home">
          <CoreNineWordmark />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground transition-colors hover:text-primary"
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
            {navigation.map((item) => (
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
