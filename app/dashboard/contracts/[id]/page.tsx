"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { ContractDocument } from "@/components/dashboard/contract-document"
import { DocumentActions } from "@/components/dashboard/document-actions"
import { getBusinessProfile, type BusinessProfile } from "@/lib/business-profile"
import { getContract, type Contract } from "@/lib/billing"

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, appUser, isAdmin, isImpersonating } = useAuth()
  const [contract, setContract] = useState<Contract | null>(null)
  const [issuer, setIssuer] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!id || !user || !appUser) return
    let active = true
    setLoading(true)
    Promise.all([getContract(id), getBusinessProfile()])
      .then(([record, profile]) => {
        if (!active) return
        setIssuer(profile)
        if (!record) {
          setContract(null)
          return
        }
        const adminView = isAdmin && !isImpersonating
        const visible = adminView || (record.companyId === appUser.companyId && record.status !== "draft")
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

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard/contracts" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" />Back to contracts</Link>
        <DocumentActions url={contract.url} />
      </div>

      <ContractDocument contract={contract} issuer={issuer ?? undefined} />
    </main>
  )
}
