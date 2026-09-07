"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { DocumentActions } from "@/components/dashboard/document-actions"
import { InvoiceDocument } from "@/components/dashboard/invoice-document"
import { getInvoice, type Invoice } from "@/lib/billing"

/** No login required: issued company invoices are public; drafts stay private. */
export default function SharedInvoicePage() {
  const { id } = useParams<{ id: string }>()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    getInvoice(id)
      .then((record) => {
        if (active) setInvoice(record && record.status !== "draft" ? record : null)
      })
      .catch(() => {
        if (active) setInvoice(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </main>
    )
  }

  if (!invoice) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <p className="text-sm text-muted-foreground">This link is no longer available.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex justify-end print:hidden">
          <DocumentActions url={invoice.url} />
        </div>
        <InvoiceDocument invoice={invoice} />
        <p className="mt-6 text-center text-xs text-muted-foreground print:hidden">Shared by VisualHQ</p>
      </div>
    </main>
  )
}
