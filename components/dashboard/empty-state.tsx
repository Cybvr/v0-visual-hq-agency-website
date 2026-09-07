import type { ComponentType, MouseEventHandler, ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Nothing here yet. One shape for every list page: an icon, a title, an
 * optional line of copy, and whatever action starts the first one.
 * `onClick` makes the whole block a target, for drive's click-to-upload.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onClick,
  className,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
  className?: string
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center rounded-[14px] border border-dashed border-border bg-card px-5 py-16 text-center",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <Icon className="mb-3 size-8 text-muted-foreground/60" aria-hidden="true" />
      <p className="font-bold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs font-normal text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/** The narrower case: something exists, but the current search/filter matched nothing. */
export function EmptySearchState({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-dashed border-border bg-card px-5 py-16 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {label}
    </div>
  )
}
