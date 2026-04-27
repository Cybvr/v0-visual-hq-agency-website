"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navigation = [
  { name: "Company", href: "/#company" },
  { name: "Portfolio", href: "/#portfolio" },
  { name: "Capabilities", href: "/#capabilities" },
  { name: "Industries", href: "/#industries" },
  { name: "Careers", href: "https://pasive.co/jobs" },
  { name: "News", href: "/#news" },
]

function VisualCoreNineWordmark() {
  return (
    <span className="flex items-center gap-3">
      <Image src="/visualhqlogo.svg" alt="" width={28} height={28} className="size-7" priority />
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
          <VisualCoreNineWordmark />
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {navigation.map((item) => (
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
