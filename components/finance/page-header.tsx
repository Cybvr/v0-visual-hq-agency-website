import type { ReactNode } from "react"
import Link from "next/link"
import { House } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  /** Small section label above the title (e.g. "Analysis"). Omit on section-root pages where the title is the section. */
  eyebrow?: string
  title: string
  subtitle?: string
  /** Metadata row rendered under the title — e.g. deal status/size/sector pills. */
  meta?: ReactNode
  /** Right-aligned actions, e.g. an export button. */
  actions?: ReactNode
}

export function PageHeader({ breadcrumbs, eyebrow, title, subtitle, meta, actions }: PageHeaderProps) {
  const showEyebrow = eyebrow && (!breadcrumbs || breadcrumbs.length === 0)

  return (
    <header className="mb-8 border-b border-(--fin-outline-variant) pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-(--fin-on-surface-variant)"
            >
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1

                return (
                  <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                    {item.href && !isLast ? (
                      <Link href={item.href} className="transition-colors hover:text-(--fin-secondary)">
                        {index === 0 && item.label === "Home" ? (
                          <>
                            <House aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                            <span className="sr-only">{item.label}</span>
                          </>
                        ) : (
                          item.label
                        )}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-(--fin-primary)" : undefined}>
                        {index === 0 && item.label === "Home" ? (
                          <>
                            <House aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                            <span className="sr-only">{item.label}</span>
                          </>
                        ) : (
                          item.label
                        )}
                      </span>
                    )}
                    {!isLast && <span className="text-(--fin-outline)">&gt;</span>}
                  </div>
                )
              })}
            </nav>
          )}
          {showEyebrow && (
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--fin-secondary)">
              {eyebrow}
            </p>
          )}
          <h1 className="fin-headline text-[40px] leading-[46px] text-(--fin-primary)">{title}</h1>
          {subtitle && <p className="mt-2 max-w-3xl text-sm leading-6 text-(--fin-on-surface-variant)">{subtitle}</p>}
          {meta && <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
      </div>
    </header>
  )
}
