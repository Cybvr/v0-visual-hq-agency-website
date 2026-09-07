"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { DocumentActions } from "@/components/dashboard/document-actions"
import { EstimateDocument } from "@/components/dashboard/estimate-document"
import { getEstimate, type Estimate } from "@/lib/billing"

export default function SharedEstimatePage() {
  const { id = "" } = useParams<{ id: string }>()
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    getEstimate(id)
      .then((record) => active && setEstimate(record?.shareEnabled ? record : null))
      .catch(() => active && setEstimate(null))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-muted/30"><Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" /></main>
  if (!estimate) return <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4"><p className="text-sm text-muted-foreground">This link is no longer available.</p></main>

  return <main className="min-h-screen bg-muted/30 px-4 py-10 sm:py-16"><div className="mx-auto max-w-5xl"><div className="mb-6 flex justify-end print:hidden"><DocumentActions /></div><EstimateDocument estimate={estimate} /><p className="mt-6 text-center text-xs text-muted-foreground print:hidden">Shared by Visualcns · visualcns.com</p></div></main>
}
