"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { DocumentActions } from "@/components/dashboard/document-actions"
import { InvoiceDocument } from "@/components/dashboard/invoice-document"
import { getInvoice, type Invoice } from "@/lib/billing"

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, appUser, isAdmin, isImpersonating } = useAuth()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!id || !user || !appUser) return
    let active = true
    setLoading(true)
    getInvoice(id)
      .then((record) => {
        if (!active) return
        if (!record) {
          setInvoice(null)
          return
        }
        const adminView = isAdmin && !isImpersonating
        const visible = adminView || (record.clientId === appUser.clientId && record.status !== "draft")
        setInvoice(visible ? record : null)
      })
      .catch((error) => {
        console.error("Error loading invoice:", error)
        if (active) setFailed(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [appUser, id, isAdmin, isImpersonating, user])

  if (!user) return null
  if (loading) return <div role="status" className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" aria-hidden="true" />Loading invoice…</div>

  if (failed || !invoice) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <Link href="/dashboard/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to invoices</Link>
        <p className="mt-12 text-sm text-muted-foreground">This invoice couldn’t be found or you don’t have access to it.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link href="/dashboard/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" />Back to invoices</Link>
        <DocumentActions url={invoice.url} />
      </div>

      <InvoiceDocument invoice={invoice} />
    </main>
  )
}
