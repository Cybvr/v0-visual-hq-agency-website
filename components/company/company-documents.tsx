import { ClipboardList, FileSignature, FileText, Receipt } from "lucide-react"

import {
  contractStatusMeta,
  estimateStatusMeta,
  formatMoney,
  invoiceStatusMeta,
  type Contract,
  type Estimate,
  type Invoice,
} from "@/lib/billing"
import { cn } from "@/lib/utils"

export type CompanyDocumentKind = "invoice" | "contract" | "estimate"

export function CompanyDocuments({
  invoices,
  contracts,
  estimates,
  onSelect,
}: {
  invoices: Invoice[]
  contracts: Contract[]
  estimates: Estimate[]
  onSelect: (kind: CompanyDocumentKind, id: string) => void
}) {
  const count = invoices.length + contracts.length + estimates.length

  return (
    <section className="mt-4" aria-labelledby="company-documents-heading">
      <div className="flex items-baseline gap-2">
        <h2 id="company-documents-heading" className="text-base font-semibold">Documents</h2>
        <span className="text-sm text-muted-foreground">{count}</span>
      </div>

      {count === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted">
            <FileText className="size-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-medium">No documents yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Invoices and contracts will appear here.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {invoices.map((invoice) => {
            const status = invoiceStatusMeta[invoice.status]
            return (
              <button
                key={`invoice-${invoice.id}`}
                type="button"
                onClick={() => onSelect("invoice", invoice.id)}
                className="flex items-start gap-4 rounded-[14px] border border-border/60 bg-card p-4 text-left outline-none transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Receipt className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{invoice.invoiceNumber || "Invoice"}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {invoice.project || invoice.issuedOn || "Invoice"}
                      </p>
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", status.className)}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{formatMoney(invoice.amount, invoice.currency)}</p>
                </div>
              </button>
            )
          })}

          {contracts.map((contract) => {
            const status = contractStatusMeta[contract.status]
            return (
              <button
                key={`contract-${contract.id}`}
                type="button"
                onClick={() => onSelect("contract", contract.id)}
                className="flex items-start gap-4 rounded-[14px] border border-border/60 bg-card p-4 text-left outline-none transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileSignature className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{contract.title || "Contract"}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {contract.project || contract.startsOn || "Contract"}
                      </p>
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", status.className)}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}

          {estimates.map((estimate) => {
            const status = estimateStatusMeta[estimate.status]
            return (
              <button
                key={`estimate-${estimate.id}`}
                type="button"
                onClick={() => onSelect("estimate", estimate.id)}
                className="flex items-start gap-4 rounded-[14px] border border-border/60 bg-card p-4 text-left outline-none transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ClipboardList className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{estimate.estimateNumber || estimate.title || "Estimate"}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {estimate.project || estimate.title || "Estimate"}
                      </p>
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", status.className)}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{formatMoney(estimate.amount, estimate.currency)}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
