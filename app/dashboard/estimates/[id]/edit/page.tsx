"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { EstimateBuilder } from "@/components/dashboard/estimate-builder"
import { getEstimate, type Estimate } from "@/lib/billing"

export default function EditEstimatePage() {
  const router = useRouter()
  const { id = "" } = useParams<{ id: string }>()
  const { user, loading: authLoading, isAdmin, isImpersonating } = useAuth()
  const allowed = isAdmin && !isImpersonating
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!authLoading && user && !allowed) router.replace("/dashboard/estimates")
  }, [allowed, authLoading, router, user])

  useEffect(() => {
    if (!allowed || !id) return
    let active = true
    getEstimate(id)
      .then((found) => {
        if (!active) return
        if (found) setEstimate(found)
        else setMissing(true)
      })
      .catch(() => active && setMissing(true))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [allowed, id])

  if (!user || authLoading || !allowed || loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" /></div>
  }

  return <main className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">{missing ? <p className="text-sm text-destructive">That estimate no longer exists.</p> : <EstimateBuilder estimate={estimate} />}</main>
}
