"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { contractStatusMeta, formatDate, getContract, type Contract } from "@/lib/billing"
import { cn } from "@/lib/utils"

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, appUser, isAdmin, isImpersonating } = useAuth()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!id || !user || !appUser) return
    let active = true
    setLoading(true)
    getContract(id)
      .then((record) => {
        if (!active) return
        if (!record) {
          setContract(null)
          return
        }
        const adminView = isAdmin && !isImpersonating
        const visible = adminView || (record.clientId === appUser.clientId && record.status !== "draft")
        setContract(visible ? record : null)
      })
      .catch((error) => {
        console.error("Error loading contract:", error)
        if (active) setFailed(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [appUser, id, isAdmin, isImpersonating, user])

  if (!user) return null
  if (loading) return <div role="status" className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" aria-hidden="true" />Loading contract…</div>

  if (failed || !contract) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <Link href="/dashboard/contracts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to contracts</Link>
        <p className="mt-12 text-sm text-muted-foreground">This contract couldn’t be found or you don’t have access to it.</p>
      </main>
    )
  }

  const meta = contractStatusMeta[contract.status] ?? contractStatusMeta.draft

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard/contracts" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" />Back to contracts</Link>
        <div className="flex items-center gap-2">
          {contract.url && <Button asChild variant="outline" size="sm"><a href={contract.url} target="_blank" rel="noreferrer">Open original<ExternalLink className="size-4" /></a></Button>}
        </div>
      </div>

      <article className="mx-auto min-h-[70vh] border border-neutral-200 bg-white px-6 py-10 text-neutral-950 shadow-sm sm:px-14 sm:py-14 print:border-0 print:shadow-none">
        <header className="border-b border-neutral-300 pb-8 text-center">
          <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", meta.className)}>{meta.label}</span>
          <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{contract.title}</h1>
          <p className="mt-3 text-sm text-neutral-500">Contract record</p>
        </header>

        <section className="py-10">
          <p className="max-w-2xl text-base leading-8 text-neutral-700">
            This agreement is recorded for <strong className="font-semibold text-neutral-950">{contract.client || "the client"}</strong>{contract.project ? <> in connection with <strong className="font-semibold text-neutral-950">{contract.project}</strong></> : null}.
          </p>
          {contract.body && (
            <div
              className="mt-8 text-base text-neutral-700 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-2 [&_p]:leading-7 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:border-neutral-300 [&_h2]:text-neutral-950 [&_h3]:text-neutral-950"
              dangerouslySetInnerHTML={{ __html: contract.body }}
            />
          )}

          <dl className="mt-10 grid gap-8 border-y border-neutral-200 py-8 sm:grid-cols-3">
            <div><dt className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">Effective date</dt><dd className="mt-2 text-sm font-medium">{formatDate(contract.startsOn)}</dd></div>
            <div><dt className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">End date</dt><dd className="mt-2 text-sm font-medium">{formatDate(contract.endsOn)}</dd></div>
            <div><dt className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">Signed date</dt><dd className="mt-2 text-sm font-medium">{formatDate(contract.signedOn)}</dd></div>
          </dl>
        </section>

        <footer className="mt-20 flex items-end justify-between gap-8 border-t border-neutral-300 pt-8 text-sm text-neutral-500">
          <div><p className="font-medium text-neutral-950">{contract.client || "Client"}</p><p className="mt-1">Contract party</p></div>
          <p className="text-right">{contract.status === "signed" ? `Signed ${formatDate(contract.signedOn)}` : meta.label}</p>
        </footer>
      </article>
    </main>
  )
}
