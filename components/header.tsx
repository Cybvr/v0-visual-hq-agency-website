"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { BrandLockup } from "@/components/brand-lockup"
import { Button } from "@/components/ui/button"
import { getBrandItems } from "@/lib/brands"

import "./header.css"

const brands = getBrandItems()

const productNavItems = brands
  .filter((item) => item.slug !== "visualhq")
  .map((item) => ({ name: item.name, href: item.href, description: item.description }))

const consultingNavItems = [
  { name: "VisualHQ", href: "/visualhq", description: "Who we are and what we do." },
  { name: "About", href: "/about", description: "Our story, values, and team." },
  { name: "Portfolio", href: "/portfolio", description: "Explore our work and client projects." },
  { name: "Capabilities", href: "/capabilities", description: "Browse every VisualHQ capability." },
  { name: "Industries", href: "/industries", description: "See the markets VisualHQ builds for." },
]

const bookNowHref = "/contact"

type IndexRow =
  | { number: string; title: string; items: Array<{ name: string; href: string }>; href?: never }
  | { number: string; title: string; href: string; items?: never }

/** Same destinations the hover menus carried, reorganised as a single numbered index. */
const INDEX_ROWS: IndexRow[] = [
  { number: "01", title: "Software", items: productNavItems },
  { number: "02", title: "Consulting", items: consultingNavItems },
  { number: "03", title: "Pricing", href: "/pricing" },
  { number: "04", title: "News", href: "/news" },
  { number: "05", title: "Careers", href: "https://pasive.co/jobs" },
  { number: "06", title: "Sign In", href: "/auth/login" },
]

const MONO_LABEL = "font-mono text-[0.6875rem] uppercase tracking-[0.24em]"

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const overlaysHero = pathname === "/" && !open && !scrolled

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24)

    updateHeader()
    window.addEventListener("scroll", updateHeader, { passive: true })
    return () => window.removeEventListener("scroll", updateHeader)
  }, [])

  // Any navigation dismisses the index.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const root = headerRef.current
    if (!root) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        return
      }
      if (event.key !== "Tab" || !root) return

      // Focus stays inside the header while the index owns the viewport.
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((node) => node.offsetParent !== null)
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open])

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    // When the index is open the header owns the viewport, so the panel can be a
    // flex child instead of chasing the bar's height with a hard-coded offset.
    <header ref={headerRef} className={`fixed inset-x-0 top-0 z-50 flex flex-col ${open ? "bottom-0" : ""}`}>
      <div
        className={`shrink-0 border-b transition-colors duration-300 ${
          overlaysHero
            ? "border-white/20 bg-transparent text-white"
            : "border-border bg-background/90 text-foreground backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8 md:px-20 md:py-5">
          <Link href="/" aria-label="VisualCNS home">
            <BrandLockup logoSize={28} gapClassName="gap-1" invert={overlaysHero} />
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <Button asChild className={`hidden px-5 sm:inline-flex ${MONO_LABEL}`}>
              <Link href={bookNowHref}>Book Now</Link>
            </Button>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-index"
              className={`group flex items-center gap-2 outline-none transition-colors hover:text-accent focus-visible:text-accent ${
                overlaysHero ? "text-white drop-shadow-sm" : "text-foreground"
              } ${MONO_LABEL}`}
            >
              {open ? "Close" : "Index"}
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          id="site-index"
          role="dialog"
          aria-modal="true"
          aria-label="Site index"
          className="hdr-panel min-h-0 flex-1 overflow-y-auto bg-background"
        >
          <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-8 md:px-20 md:pt-10">
            <ul>
              {INDEX_ROWS.map((row, rowIndex) => (
                <li
                  key={row.number}
                  className="hdr-row border-t border-border"
                  style={{ "--i": rowIndex } as CSSProperties}
                >
                  {row.href ? (
                    <Link
                      href={row.href}
                      onClick={() => setOpen(false)}
                      aria-current={isCurrent(row.href) ? "page" : undefined}
                      className="group grid grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-baseline gap-x-4 py-6 outline-none md:grid-cols-[4rem_minmax(0,1fr)_2rem] md:gap-x-10 md:py-8"
                    >
                      <span
                        className={`font-mono text-xs tabular-nums transition-colors group-hover:text-accent ${
                          isCurrent(row.href) ? "text-accent" : "text-muted-foreground"
                        }`}
                      >
                        {row.number}
                      </span>
                      <span className="text-3xl tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent md:text-5xl">
                        {row.title}
                      </span>
                      <ArrowUpRight className="size-5 justify-self-end text-muted-foreground transition-[transform,color] duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent motion-reduce:transition-none" />
                    </Link>
                  ) : (
                    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-4 py-6 md:grid-cols-[4rem_minmax(0,20rem)_minmax(0,1fr)] md:gap-x-10 md:py-8">
                      <span className="col-start-1 row-start-1 font-mono text-xs tabular-nums text-muted-foreground">
                        {row.number}
                      </span>
                      <span className="col-start-2 row-start-1 text-3xl tracking-[-0.02em] text-foreground md:text-5xl">
                        {row.title}
                      </span>
                      <ul className="col-start-2 row-start-2 flex flex-wrap gap-x-6 gap-y-3 md:col-start-3 md:row-start-1 md:justify-end">
                        {row.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              aria-current={isCurrent(item.href) ? "page" : undefined}
                              className={`transition-colors hover:text-accent ${MONO_LABEL} ${
                                isCurrent(item.href) ? "text-accent" : "text-muted-foreground"
                              }`}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-border pt-8 sm:hidden">
              <Button asChild className={`w-full px-5 ${MONO_LABEL}`}>
                <Link href={bookNowHref} onClick={() => setOpen(false)}>
                  Book Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
