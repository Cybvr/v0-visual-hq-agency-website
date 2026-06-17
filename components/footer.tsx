import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin } from "lucide-react"
import { getCapabilities } from "@/lib/capabilities"
import { getIndustries } from "@/lib/industries"

const capabilities = getCapabilities()
const industries = getIndustries()

const productLinks = [
  { name: "VisualHQ", href: "/brands/visualhq" },
  { name: "Pasive", href: "/brands/pasive" },
  { name: "Juju", href: "/brands/juju" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="VisualCoreNine home">
              <Image
                src="/visualhqlogo.svg"
                alt=""
                width={30}
                height={30}
                className="size-7 brightness-0 invert"
              />
              <span className="text-lg font-semibold tracking-tight">VisualCoreNine</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-6 text-primary-foreground/70">
              VisualCoreNine builds software systems, product businesses, and AI-enabled tools from Lagos for modern
              teams.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
              Software
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
              Capabilities
            </h4>
            <nav className="flex flex-col gap-3">
              {capabilities.map((item) => (
                <Link
                  key={item.slug}
                  href={`/capabilities/${item.slug}`}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
              Industries
            </h4>
            <nav className="flex flex-col gap-3">
              {industries.map((item) => (
                <Link
                  key={item.slug}
                  href={`/industries/${item.slug}`}
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
              href="mailto:hello@pasive.co"
              className="flex items-center gap-2 transition-colors hover:text-primary-foreground"
            >
              <Mail className="size-4" />
              hello@pasive.co
            </a>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 flex-shrink-0" />
              <span>5 Ado Ibrahim Street, Sabo, Yaba</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 flex-shrink-0" />
              <span>30 N Gould St STE R, Sheridan, WY</span>
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
