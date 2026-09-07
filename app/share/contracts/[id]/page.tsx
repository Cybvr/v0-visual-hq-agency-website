"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { ContractDocument } from "@/components/dashboard/contract-document"
import { DocumentActions } from "@/components/dashboard/document-actions"
import { getContract, type Contract } from "@/lib/billing"

/** No login required: issued company contracts are public; drafts stay private. */
export default function SharedContractPage() {
  const { id } = useParams<{ id: string }>()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    getContract(id)
      .then((record) => {
        if (active) setContract(record && record.status !== "draft" ? record : null)
      })
      .catch(() => {
        if (active) setContract(null)
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

  if (!contract) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <p className="text-sm text-muted-foreground">This link is no longer available.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex justify-end print:hidden">
          <DocumentActions url={contract.url} />
        </div>
        <ContractDocument contract={contract} />
        <p className="mt-6 text-center text-xs text-muted-foreground print:hidden">Shared by VisualHQ</p>
      </div>
    </main>
  )
}
