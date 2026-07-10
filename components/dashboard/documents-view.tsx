"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, FileText } from "lucide-react"
import type { SharedDocument } from "@/lib/documents"

export function DocumentsView({ documents }: { documents: SharedDocument[] }) {
  if (documents.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Documents</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="group block">
            <Card className="transition-colors group-hover:border-foreground/20">
              <CardContent className="flex items-start gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="truncate">{doc.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  {doc.description && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{doc.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  )
}
