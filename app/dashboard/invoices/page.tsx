"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Eye, Loader2, Pencil, Plus, Trash2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { UserEditorSheet } from "@/components/dashboard/user-editor-sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  deleteInvoice,
  formatDate,
  formatMoney,
  getInvoices,
  getInvoicesByClientId,
  invoiceStatusMeta,
  type Invoice,
} from "@/lib/billing"
import { FilterBar, useFilterBar, type SortOption } from "@/components/dashboard/filter-bar"
import { cn } from "@/lib/utils"

const INVOICE_SORTS: SortOption<Invoice>[] = [
  { value: "issuedOn", label: "Issue date", get: (i) => i.issuedOn, ascLabel: "Oldest", descLabel: "Newest" },
  { value: "dueOn", label: "Due date", get: (i) => i.dueOn, ascLabel: "Soonest", descLabel: "Latest" },
  { value: "invoiceNumber", label: "Invoice no.", get: (i) => i.invoiceNumber, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "client", label: "Client", get: (i) => i.client || i.clientId, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "amount", label: "Amount", get: (i) => i.amount ?? 0, ascLabel: "Lowest", descLabel: "Highest" },
  {
    value: "status",
    label: "Status",
    get: (i) => invoiceStatusMeta[i.status]?.label ?? i.status,
    ascLabel: "A–Z",
    descLabel: "Z–A",
  },
]

function searchInvoice(i: Invoice) {
  return [i.invoiceNumber, i.client, i.clientId, i.project, i.poReference, invoiceStatusMeta[i.status]?.label]
}

export default function InvoicesPage() {
  const { user, appUser, isAdmin, isImpersonating } = useAuth()
  const clientId = appUser?.clientId ?? ""
  const adminView = isAdmin && !isImpersonating

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Invoice | null>(null)
  const [clientSheet, setClientSheet] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setError(false)
    try {
      setInvoices(adminView ? await getInvoices() : await getInvoicesByClientId(clientId))
    } catch (err) {
      console.error("Error loading invoices:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [adminView, clientId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function removeInvoice() {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      await deleteInvoice(confirmDelete.id)
      setInvoices((current) => current.filter((row) => row.id !== confirmDelete.id))
      setConfirmDelete(null)
    } catch (err) {
      console.error("Error deleting invoice:", err)
    } finally {
      setDeleting(false)
    }
  }

  const sorts = useMemo(
    () => (adminView ? INVOICE_SORTS : INVOICE_SORTS.filter((option) => option.value !== "client")),
    [adminView],
  )
  const { results: visibleInvoices, bar } = useFilterBar({
    items: invoices,
    search: searchInvoice,
    sorts,
    defaultSort: "issuedOn",
    defaultDirection: "desc",
  })

  if (!user) return null

  const unpaid = invoices.filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
  const outstanding = unpaid.reduce((total, invoice) => total + (invoice.amount ?? 0), 0)
  const currency = invoices[0]?.currency || "USD"

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-9 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Invoices</h1>
        </div>

        {adminView && (
          <Button asChild>
            <Link href="/dashboard/invoices/new">
              <Plus className="mr-2 size-4" aria-hidden="true" />
              New invoice
            </Link>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="mt-10 text-sm text-destructive">Couldn&apos;t load invoices right now.</p>
      ) : invoices.length === 0 ? (
        <div className="mt-8 rounded-[14px] border border-dashed border-border bg-card px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground">No invoices yet.</p>
          {adminView && (
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/invoices/new">
                <Plus className="mr-2 size-4" aria-hidden="true" />
                New invoice
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          {outstanding > 0 && (
            <p className="mt-6 rounded-[12px] bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-900 dark:text-amber-200">
              {formatMoney(outstanding, currency)} outstanding across {unpaid.length} invoice
              {unpaid.length === 1 ? "" : "s"}.
            </p>
          )}

          <div className="mt-6">
            <FilterBar {...bar} placeholder="Search invoices" />
            {visibleInvoices.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-border bg-card px-5 py-12 text-center">
                <p className="text-sm text-muted-foreground">No invoices match your search.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice no.</TableHead>
                    {adminView && <TableHead>Client</TableHead>}
                    <TableHead>Project</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-24 text-right">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleInvoices.map((invoice) => {
                    const meta = invoiceStatusMeta[invoice.status] ?? invoiceStatusMeta.draft
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={
                              adminView
                                ? `/dashboard/invoices/${invoice.id}/edit`
                                : `/dashboard/invoices/${invoice.id}`
                            }
                            className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {invoice.invoiceNumber}
                          </Link>
                        </TableCell>
                        {adminView && (
                          <TableCell>
                            {invoice.clientId ? (
                              <button
                                type="button"
                                onClick={() => setClientSheet(invoice.clientId)}
                                className="rounded-sm text-left outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                {invoice.client || "Client"}
                              </button>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        )}
                        <TableCell>
                          {invoice.projectId ? (
                            <Link
                              href={`/dashboard/projects/${invoice.projectId}`}
                              className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {invoice.project || "Project"}
                            </Link>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>{formatDate(invoice.issuedOn)}</TableCell>
                        <TableCell>{formatDate(invoice.dueOn)}</TableCell>
                        <TableCell>
                          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", meta.className)}>
                            {meta.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatMoney(invoice.amount, invoice.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-0.5">
                            <Link
                              href={`/dashboard/invoices/${invoice.id}`}
                              aria-label={`View invoice ${invoice.invoiceNumber}`}
                              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Eye className="size-4" aria-hidden="true" />
                            </Link>
                            {adminView && (
                              <>
                                <Link
                                  href={`/dashboard/invoices/${invoice.id}/edit`}
                                  aria-label={`Edit invoice ${invoice.invoiceNumber}`}
                                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <Pencil className="size-4" aria-hidden="true" />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDelete(invoice)}
                                  aria-label={`Delete invoice ${invoice.invoiceNumber}`}
                                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <Trash2 className="size-4" aria-hidden="true" />
                                </button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}

      {adminView && (
        <>

          <AlertDialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this invoice?</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmDelete?.invoiceNumber} will be removed for good. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault()
                    removeInvoice()
                  }}
                  disabled={deleting}
                >
                  {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {adminView && (
        <UserEditorSheet
          open={clientSheet !== null}
          clientId={clientSheet ?? ""}
          onClose={() => setClientSheet(null)}
          onSaved={() => setClientSheet(null)}
        />
      )}
    </main>
  )
}
