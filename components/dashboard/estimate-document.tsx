import Image from "next/image"
import type { ReactNode } from "react"

import { INVOICE_ISSUER, estimateStatusMeta, formatDate, formatMoney, type Estimate, type InvoiceParty } from "@/lib/billing"
import { cn } from "@/lib/utils"

type DocumentIssuer = InvoiceParty & { logoUrl?: string }

function TextLines({ value }: { value?: string }) {
  const lines = value?.split("\n").map((line) => line.trim()).filter(Boolean) ?? []
  if (lines.length === 0) return <p className="mt-3 text-sm text-neutral-400">—</p>
  return (
    <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
      {lines.map((line, index) => (
        <li key={`${line}-${index}`} className="flex gap-2">
          <span className="mt-[0.7em] size-1 shrink-0 rounded-full bg-blue-700" aria-hidden="true" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

/** The printable estimate shared by the signed-in detail page and its public link. */
export function EstimateDocument({
  estimate,
  issuer = INVOICE_ISSUER,
  acceptanceAction,
}: {
  estimate: Estimate
  issuer?: DocumentIssuer
  acceptanceAction?: ReactNode
}) {
  const meta = estimateStatusMeta[estimate.status] ?? estimateStatusMeta.draft
  const optionalTotal = estimate.lineItems.reduce((sum, item) => sum + (item.optional ? item.amount : 0), 0)

  return (
    <article className="mx-auto overflow-hidden rounded-[16px] border border-neutral-200 bg-white text-neutral-950 shadow-sm print:rounded-none print:border-0 print:shadow-none">
      <header className="flex flex-col gap-10 border-b border-neutral-200 px-6 py-9 sm:flex-row sm:items-start sm:justify-between sm:px-10 sm:py-11">
        <div>
          <div className="flex items-center gap-3">
            {issuer.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={issuer.logoUrl} alt="" width={30} height={30} className="size-[30px] rounded object-cover" />
            ) : (
              <Image src="/visualhqlogo.svg" alt="" width={30} height={30} />
            )}
            <p className="text-xl font-semibold tracking-[-0.02em]">{issuer.name}</p>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-500">{issuer.address}</p>
          {issuer.email && <p className="text-sm text-neutral-500">{issuer.email}</p>}
          {issuer.phone && <p className="text-sm text-neutral-500">{issuer.phone}</p>}
          {issuer.website && <p className="text-sm text-neutral-500">{issuer.website}</p>}
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-950">Estimate</p>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex gap-3 sm:justify-end"><dt className="text-neutral-500">Estimate no.</dt><dd className="font-medium">{estimate.estimateNumber}</dd></div>
            <div className="flex gap-3 sm:justify-end"><dt className="text-neutral-500">Issue date</dt><dd>{formatDate(estimate.issuedOn)}</dd></div>
            <div className="flex gap-3 sm:justify-end"><dt className="text-neutral-500">Valid until</dt><dd>{formatDate(estimate.validUntil)}</dd></div>
          </dl>
          <span className={cn("mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-medium", meta.className)}>{meta.label}</span>
        </div>
      </header>

      <section className="grid gap-8 px-6 py-8 sm:grid-cols-2 sm:px-10">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-700">Prepared for</h2>
          <p className="mt-2 font-semibold">{estimate.preparedFor?.name || estimate.client}</p>
          {estimate.preparedFor?.email && <p className="mt-1 text-sm text-neutral-500">{estimate.preparedFor.email}</p>}
          {estimate.preparedFor?.address && <p className="mt-1 whitespace-pre-line text-sm leading-6 text-neutral-500">{estimate.preparedFor.address}</p>}
          {estimate.project && <p className="mt-2 text-sm text-neutral-500">{estimate.project}</p>}
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-700">Prepared by</h2>
          <p className="mt-2 font-semibold">{issuer.name}</p>
          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-neutral-500">{issuer.address}</p>
          {issuer.email && <p className="text-sm text-neutral-500">{issuer.email}</p>}
          {issuer.phone && <p className="text-sm text-neutral-500">{issuer.phone}</p>}
          {issuer.website && <p className="text-sm text-neutral-500">{issuer.website}</p>}
        </div>
      </section>

      <section className="px-6 pb-9 sm:px-10">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">{estimate.title}</h1>
        <div className="mt-4 h-0.5 bg-blue-700" />
        {estimate.scope ? (
          <div
            className="mt-4 max-w-[75ch] text-sm leading-6 text-neutral-700 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: estimate.scope }}
          />
        ) : null}
      </section>

      <div className="overflow-x-auto border-y border-neutral-200">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-[0.08em] text-neutral-500">
            <tr>
              <th className="px-6 py-3 font-medium sm:px-10">Description</th>
              <th className="px-4 py-3 font-medium">Billing</th>
              <th className="px-6 py-3 text-right font-medium sm:px-10">Amount ({estimate.currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {estimate.lineItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 align-top sm:px-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{item.description}</span>
                    {item.optional && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-700">Optional</span>}
                  </div>
                  {item.details && <p className="mt-1 max-w-[65ch] text-xs leading-5 text-neutral-500">{item.details}</p>}
                </td>
                <td className="px-4 py-4 align-top text-neutral-600">{item.billing || "One-time"}</td>
                <td className="px-6 py-4 text-right align-top font-medium sm:px-10">{formatMoney(item.amount, estimate.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="grid gap-8 px-6 py-8 sm:grid-cols-[1fr_18rem] sm:px-10">
        <p className="max-w-[65ch] text-sm leading-6 text-neutral-500">Optional items can be approved separately and will be added only if selected.</p>
        <dl className="space-y-3">
          <div className="flex justify-between gap-8 border-t border-neutral-300 pt-3 font-semibold"><dt>Base estimate</dt><dd>{formatMoney(estimate.amount, estimate.currency)}</dd></div>
          {optionalTotal > 0 && <div className="flex justify-between gap-8 text-sm text-neutral-500"><dt>Optional additions</dt><dd>{formatMoney(optionalTotal, estimate.currency)}</dd></div>}
        </dl>
      </section>

      <section className="grid gap-10 border-t border-neutral-200 px-6 py-9 sm:grid-cols-2 sm:px-10">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-700">Terms</h2>
          <TextLines value={estimate.terms} />
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-700">Payment details</h2>
          <TextLines value={estimate.paymentDetails} />
        </div>
      </section>

      {acceptanceAction && (
        <section className="flex justify-end border-t border-neutral-200 px-6 py-6 sm:px-10 print:hidden">
          {acceptanceAction}
        </section>
      )}

      {estimate.notes && (
        <section className="px-6 py-6 sm:px-10">
          <p className="max-w-[75ch] text-xs italic leading-5 text-neutral-500">{estimate.notes}</p>
        </section>
      )}

      <footer className="border-t border-neutral-200 px-6 py-6 text-sm leading-6 text-neutral-600 sm:px-10">
        <p>{issuer.address}</p>
        {issuer.email && <p>{issuer.email}</p>}
        {issuer.phone && <p>{issuer.phone}</p>}
        {issuer.website && <p>{issuer.website}</p>}
      </footer>
    </article>
  )
}
