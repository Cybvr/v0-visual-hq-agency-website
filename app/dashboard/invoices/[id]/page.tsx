"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { DocumentActions } from "@/components/dashboard/document-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  INVOICE_ISSUER,
  formatDate,
  formatMoney,
  getInvoice,
  invoiceStatusMeta,
  type Invoice,
} from "@/lib/billing"
import { cn } from "@/lib/utils"

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
      <main className="mx-auto w-full max-w-5xl px-4 pb-12 pt-6 sm:px-6">
        <Link href="/dashboard/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to invoices</Link>
        <p className="mt-12 text-sm text-muted-foreground">This invoice couldn’t be found or you don’t have access to it.</p>
      </main>
    )
  }

  const meta = invoiceStatusMeta[invoice.status] ?? invoiceStatusMeta.draft
  const balance = Math.max(0, invoice.amount - (invoice.amountPaid ?? 0))

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-12 pt-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link href="/dashboard/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" />Back to invoices</Link>
        <DocumentActions url={invoice.url} />
      </div>

      <article className="overflow-hidden rounded-[16px] border border-border bg-card print:border-0">
        <header className="flex flex-col gap-8 border-b border-border px-6 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-10">
          <div>
            <p className="text-lg font-semibold">{INVOICE_ISSUER.name}</p>
            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-muted-foreground">{INVOICE_ISSUER.address}</p>
            {INVOICE_ISSUER.email && <p className="text-sm text-muted-foreground">{INVOICE_ISSUER.email}</p>}
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-muted-foreground">Invoice</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">{invoice.invoiceNumber}</h1>
            <span className={cn("mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium", meta.className)}>{meta.label}</span>
          </div>
        </header>

        <div className="grid gap-8 px-6 py-8 sm:grid-cols-2 sm:px-10">
          <section>
            <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Bill to</h2>
            <p className="mt-2 font-medium">{invoice.billTo?.name || invoice.client || "—"}</p>
            {invoice.billTo?.email && <p className="mt-1 text-sm text-muted-foreground">{invoice.billTo.email}</p>}
            {invoice.billTo?.address && <p className="mt-1 whitespace-pre-line text-sm leading-6 text-muted-foreground">{invoice.billTo.address}</p>}
            {invoice.project && <p className="mt-3 text-sm text-muted-foreground">Project: {invoice.project}</p>}
          </section>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:justify-self-end sm:text-right">
            <div><dt className="text-xs text-muted-foreground">Issued</dt><dd className="mt-1 text-sm font-medium">{formatDate(invoice.issuedOn)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Due</dt><dd className="mt-1 text-sm font-medium">{formatDate(invoice.dueOn)}</dd></div>
            {invoice.poReference && <div className="col-span-2"><dt className="text-xs text-muted-foreground">PO reference</dt><dd className="mt-1 text-sm font-medium">{invoice.poReference}</dd></div>}
          </dl>
        </div>

        {invoice.lineItems && invoice.lineItems.length > 0 && (
          <div className="overflow-x-auto border-y border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatMoney(item.unitPrice, invoice.currency)}</TableCell>
                    <TableCell className="text-right">{formatMoney(Math.round(item.quantity * item.unitPrice), invoice.currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="grid gap-8 px-6 py-8 sm:grid-cols-2 sm:px-10">
          <div className="space-y-5 text-sm leading-6 text-muted-foreground">
            {invoice.notes && <div><h2 className="font-medium text-foreground">Note</h2><p className="mt-1 whitespace-pre-line">{invoice.notes}</p></div>}
            {invoice.paymentInstructions && <div><h2 className="font-medium text-foreground">Payment instructions</h2><p className="mt-1 whitespace-pre-line">{invoice.paymentInstructions}</p></div>}
          </div>
          <dl className="space-y-3 sm:justify-self-end sm:min-w-64">
            {typeof invoice.subtotal === "number" && <div className="flex justify-between gap-8 text-sm"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatMoney(invoice.subtotal, invoice.currency)}</dd></div>}
            {(invoice.discountTotal ?? 0) > 0 && <div className="flex justify-between gap-8 text-sm"><dt className="text-muted-foreground">Discount</dt><dd>−{formatMoney(invoice.discountTotal ?? 0, invoice.currency)}</dd></div>}
            {(invoice.taxTotal ?? 0) > 0 && <div className="flex justify-between gap-8 text-sm"><dt className="text-muted-foreground">Tax</dt><dd>{formatMoney(invoice.taxTotal ?? 0, invoice.currency)}</dd></div>}
            <div className="flex justify-between gap-8 border-t border-border pt-3 font-semibold"><dt>Total</dt><dd>{formatMoney(invoice.amount, invoice.currency)}</dd></div>
            {(invoice.amountPaid ?? 0) > 0 && <div className="flex justify-between gap-8 text-sm"><dt className="text-muted-foreground">Paid</dt><dd>−{formatMoney(invoice.amountPaid ?? 0, invoice.currency)}</dd></div>}
            <div className="flex justify-between gap-8 border-t border-border pt-3 text-lg font-semibold"><dt>Balance due</dt><dd>{formatMoney(balance, invoice.currency)}</dd></div>
          </dl>
        </div>
      </article>
    </main>
  )
}
