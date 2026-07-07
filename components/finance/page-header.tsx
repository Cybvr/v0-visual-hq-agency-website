interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-8 border-b border-(--fin-outline-variant) pb-6">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--fin-secondary)">
            {eyebrow}
          </p>
        )}
        <h1 className="fin-headline text-[40px] leading-[46px] text-(--fin-primary)">{title}</h1>
        {subtitle && <p className="mt-2 max-w-3xl text-sm leading-6 text-(--fin-on-surface-variant)">{subtitle}</p>}
      </div>
    </header>
  )
}
