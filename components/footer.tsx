import Image from "next/image"
import Link from "next/link"

const footerGroups = [
  {
    number: "01",
    title: "Product",
    links: [
      { name: "VisualHQ", href: "/brands/visualhq" },
      { name: "Pasive", href: "/brands/pasive" },
      { name: "Juju", href: "/brands/juju" },
      { name: "Waddi", href: "/brands/waddi" },
      { name: "Pricing", href: "/pricing" },
    ],
  },
  {
    number: "02",
    title: "Company",
    links: [
      { name: "Portfolio", href: "/portfolio" },
      { name: "News", href: "/news" },
      { name: "Careers", href: "https://pasive.co/jobs" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    number: "03",
    title: "Resources",
    links: [
      { name: "Capabilities", href: "/capabilities" },
      { name: "Industries", href: "/industries" },
    ],
  },
]

const socialLinks = [
  { name: "X", href: "https://x.com/visualhq" },
  { name: "GH", href: "https://github.com/visualhq" },
  { name: "LI", href: "https://www.linkedin.com/company/visualhq" },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_420px] md:items-end">
          <Link href="/" className="group inline-flex items-center gap-4" aria-label="VisualCNS home">
            <Image src="/visualhqlogo.svg" alt="" width={54} height={54} className="size-12 brightness-0 invert" />
            <h2 className="text-5xl leading-none tracking-tight text-primary-foreground md:text-7xl">
              VisualCNS
            </h2>
          </Link>

          <p className="max-w-md text-base leading-7 text-primary-foreground/70 md:ml-auto md:text-right md:text-xl">
            Software systems, product businesses, and AI-enabled tools built from Lagos for modern teams.
          </p>
        </div>

        <div className="my-14 border-t border-primary-foreground/15" />

        <div className="grid gap-10 md:grid-cols-4 md:gap-12">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-7 flex items-baseline gap-2 text-sm uppercase tracking-[0.18em] text-primary-foreground">
                <span className="font-mono text-xs text-accent">{group.number}</span>
                <span>{group.title}</span>
              </h3>
              <nav className="flex flex-col gap-4" aria-label={`${group.title} footer links`}>
                {group.links.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base text-primary-foreground/65 transition-colors hover:text-accent md:text-lg"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          <div>
            <h3 className="mb-7 flex items-baseline gap-2 text-sm uppercase tracking-[0.18em] text-primary-foreground">
              <span className="font-mono text-xs text-accent">04</span>
              <span>Stay looped in</span>
            </h3>
            <p className="mb-6 text-base leading-7 text-primary-foreground/65">
              Send a note when you are ready to build, price, or ship the next system.
            </p>
            <a
              href="mailto:hello@pasive.co?subject=VisualCNS%20project%20inquiry"
              className="group flex items-center justify-between border-b border-primary-foreground/70 pb-4 text-primary-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <span className="text-base text-primary-foreground/70 transition-colors group-hover:text-accent">
                hello@pasive.co
              </span>
              <span className="text-sm uppercase tracking-[0.18em]">Join -&gt;</span>
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-primary-foreground/15 pt-8 text-sm text-primary-foreground/55 md:flex-row md:items-center md:justify-between">
          <p>© {year} VisualCNS Systems · Privacy · Terms</p>
          <div className="flex gap-8 text-sm font-semibold tracking-[0.16em] text-primary-foreground">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-accent"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
