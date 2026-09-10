import Link from "next/link"
import { File, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Badge tints per document kind, shared by every surface that lists documents. */
export const DOC_BADGE = {
  document: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  invoice: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  contract: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  estimate: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
}

/**
 * A Drive-style document tile: a tall preview area with a muted file glyph, then
 * a coloured badge, title and subtitle. Reused by the company page and the
 * client portal. Pass `href` to render a link, or `onClick` for a button.
 */
export function DocTile({
  icon: Icon,
  badgeClass,
  title,
  subtitle,
  href,
  onClick,
}: {
  /** Footer badge icon; defaults to a plain file. */
  icon?: LucideIcon
  badgeClass: string
  title: string
  subtitle: string
  href?: string
  onClick?: () => void
}) {
  const BadgeIcon = Icon ?? File
  const className =
    "group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card text-left outline-none transition-colors hover:border-foreground/30 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

  const inner = (
    <>
      <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40">
        <File className="size-10 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex items-center gap-3 p-3">
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", badgeClass)}>
          <BadgeIcon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </>
  )

  if (href) return <Link href={href} className={className}>{inner}</Link>
  return <button type="button" onClick={onClick} className={className}>{inner}</button>
}
