"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { DocumentActions } from "@/components/dashboard/document-actions"
import { EstimateDocument } from "@/components/dashboard/estimate-document"
import { getEstimate, type Estimate } from "@/lib/billing"
import { getBusinessProfile, type BusinessProfile } from "@/lib/business-profile"

export default function SharedEstimatePage() {
  const { id = "" } = useParams<{ id: string }>()
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [issuer, setIssuer] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    getEstimate(id)
      .then(async (record) => {
        if (!active) return
        const visible = record?.shareEnabled ? record : null
        setEstimate(visible)
        if (!active) return
        setLoading(false)
        // The issuer header is nice-to-have on top of the estimate itself, so
        // a failure here never blocks the document from showing.
        try {
          setIssuer(await getBusinessProfile())
        } catch {
          // Header just stays without issuer details.
        }
      })
      .catch(() => {
        if (active) {
          setEstimate(null)
          setLoading(false)
        }
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

  if (!estimate) {
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
          <DocumentActions />
        </div>
        <EstimateDocument estimate={estimate} issuer={issuer ?? undefined} />
        <p className="mt-6 text-center text-xs text-muted-foreground print:hidden">
          Shared by {issuer?.name ?? "Visualcns"} · {issuer?.website ?? "visualcns.com"}
        </p>
      </div>
    </main>
  )
}
