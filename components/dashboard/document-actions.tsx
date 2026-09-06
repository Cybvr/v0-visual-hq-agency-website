"use client"

import { ExternalLink, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Print and download for a printable record. Saving as PDF goes through the
 * browser's own print dialog, so both buttons open the same sheet.
 */
export function DocumentActions({
  /** Set when the record is a link to a file held elsewhere. */
  url,
  className,
}: {
  url?: string
  className?: string
}) {
  return (
    <div className={className ?? "flex items-center gap-2 print:hidden"}>
      {url && (
        <Button asChild variant="outline" size="sm">
          <a href={url} target="_blank" rel="noreferrer">
            Open original
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </Button>
      )}
      <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="size-3.5" aria-hidden="true" />
        Print or save as PDF
      </Button>
    </div>
  )
}
