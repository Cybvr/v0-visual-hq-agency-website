"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A minimal native checkbox. Supports the indeterminate visual state (used by
 * table "select all" headers) via a ref effect, since HTML has no attribute.
 */
export function Checkbox({
  className,
  indeterminate,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }) {
  const ref = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate)
  }, [indeterminate])
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn("size-4 shrink-0 cursor-pointer accent-primary", className)}
      {...props}
    />
  )
}
