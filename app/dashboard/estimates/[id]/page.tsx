"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2, Pencil } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { DocumentActions } from "@/components/dashboard/document-actions"
import { EstimateDocument } from "@/components/dashboard/estimate-document"
import { Button } from "@/components/ui/button"
import { getEstimate, type Estimate } from "@/lib/billing"

export default function EstimateDetailPage() {
  const { id = "" } = useParams<{ id: string }>()
  const { user, appUser, isAdmin, isImpersonating } = useAuth()
  const adminView = isAdmin && !isImpersonating
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!id || !user || !appUser) return
    let active = true
    getEstimate(id)
      .then((record) => {
        if (!active) return
        const visible = record && (adminView || (record.clientId === appUser.clientId && record.status !== "draft"))
        setEstimate(visible ? record : null)
      })
      .catch((error) => {
        console.error("Error loading estimate:", error)
        if (active) setFailed(true)
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [adminView, appUser, id, user])

  if (!user) return null
  if (loading) return <div role="status" className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" aria-hidden="true" />Loading estimate…</div>
  if (failed || !estimate) return <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6"><Link href="/dashboard/estimates" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Back to estimates</Link><p className="mt-12 text-sm text-muted-foreground">This estimate couldn’t be found or you don’t have access to it.</p></main>

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard/estimates" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Back to estimates</Link>
        <div className="flex items-center gap-2">
          {adminView && <Button asChild variant="outline" size="sm"><Link href={`/dashboard/estimates/${estimate.id}/edit`}><Pencil className="size-3.5" aria-hidden="true" />Edit estimate</Link></Button>}
          <DocumentActions />
        </div>
      </div>
      <EstimateDocument estimate={estimate} />
    </main>
  )
}
