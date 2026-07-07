import type { ReactNode } from "react"
import Link from "next/link"
import { House, ChevronRight } from "lucide-react"

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
    <header className="mb-8 border-b pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1
                const isHome = index === 0 && item.label === "Home"
                const content = isHome ? (
                  <>
                    <House aria-hidden="true" className="size-3.5" strokeWidth={2} />
                    <span className="sr-only">{item.label}</span>
                  </>
                ) : (
                  item.label
                )

                return (
                  <div key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                    {item.href && !isLast ? (
                      <Link href={item.href} className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
                        {content}
                      </Link>
                    ) : (
                      <span className={isLast ? "inline-flex items-center gap-1.5 text-foreground" : "inline-flex items-center gap-1.5"}>
                        {content}
                      </span>
                    )}
                    {!isLast && <ChevronRight aria-hidden="true" className="size-3 text-muted-foreground/60" />}
                  </div>
                )
              })}
            </nav>
          )}
          {showEyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl text-primary">{title}</h1>
          {subtitle && <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>}
          {meta && <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
