import Link from "next/link"
import { Mail, MapPin } from "lucide-react"

const productLinks = [
  { name: "VisualHQ", href: "/about" },
  { name: "Passive", href: "https://pasive.co" },
  { name: "Juju", href: "https://jujuapp.co" },
]

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="VisualCoreNine home">
              <span className="grid grid-cols-3 gap-1" aria-hidden="true">
                {Array.from({ length: 9 }).map((_, index) => (
                  <span key={index} className="block size-1.5 rounded-[2px] bg-primary-foreground" />
                ))}
              </span>
              <span className="text-lg font-semibold tracking-tight">VisualCoreNine</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-6 text-primary-foreground/70">
              VisualCoreNine builds software systems, product businesses, and AI-enabled tools from Lagos for modern
              teams.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
              Products
            </h4>
            <nav className="flex flex-col gap-3">
              {productLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
              Company
            </h4>
            <nav className="flex flex-col gap-3">
              {companyLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-primary-foreground/10 pt-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/60">
            <a
              href="mailto:jide.pinheiro@gmail.com"
              className="flex items-center gap-2 transition-colors hover:text-primary-foreground"
            >
              <Mail className="size-4" />
              jide.pinheiro@gmail.com
            </a>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 flex-shrink-0" />
              <span>Polystar 2nd Roundabout, Lekki Phase 1, Lagos 105102, Nigeria</span>
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/50">
            © {new Date().getFullYear()} VISUAL CORE NINE SYSTEMS
          </p>
        </div>
      </div>
    </footer>
  )
}
