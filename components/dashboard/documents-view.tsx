"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import type { SharedDocument } from "@/lib/documents"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function DocumentPreview({ document }: { document: SharedDocument }) {
  const isImage = document.type === "image" || /\.(png|jpe?g|gif|webp)(\?|$)/i.test(document.url)
  if (isImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={document.thumbnailUrl ?? document.url} alt={document.title} className="h-full w-full object-cover" />
  }
  return <div className="flex h-full w-full items-center justify-center bg-background"><FileText className="h-12 w-12 text-blue-600" /></div>
}

export function DocumentsView({ documents }: { documents: SharedDocument[] }) {
  const [previewDocument, setPreviewDocument] = useState<SharedDocument | null>(null)

  return (
    <section id="drive" className="mt-10 scroll-mt-20">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Drive</h2>
      {documents.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No files have been shared with you yet.</p>}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((document) => (
          <button
            key={document.id}
            type="button"
            onClick={() => setPreviewDocument(document)}
            className="group overflow-hidden rounded-2xl border border-transparent bg-[#edf2f8] p-3 text-left transition-colors hover:bg-[#e4eaf1] dark:bg-muted dark:hover:bg-muted/80"
          >
            <div className="flex min-w-0 items-center gap-3 px-1 pb-3">
              <FileText className="h-5 w-5 shrink-0 text-blue-600" />
              <span className="truncate text-sm font-medium">{document.title}</span>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-background"><DocumentPreview document={document} /></div>
          </button>
        ))}
      </div>

      <Dialog open={previewDocument !== null} onOpenChange={(open) => { if (!open) setPreviewDocument(null) }}>
        <DialogContent className="h-[88vh] max-w-5xl grid-rows-[auto_1fr] gap-0 overflow-hidden rounded-2xl p-0">
          <DialogHeader className="border-b px-6 py-4 pr-14">
            <DialogTitle className="truncate">{previewDocument?.title}</DialogTitle>
            <DialogDescription>File preview</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 bg-muted/50 p-4">
            {previewDocument && (
              previewDocument.type === "image" || /\.(png|jpe?g|gif|webp)(\?|$)/i.test(previewDocument.url)
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={previewDocument.url} alt={previewDocument.title} className="h-full w-full object-contain" />
                : <iframe src={previewDocument.url} title={previewDocument.title} className="h-full w-full rounded-lg border bg-background" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
