"use client"
import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { getOrganizationByRef, organizationRef } from "@/lib/organizations"
import { legacyCompanyDestination } from "@/lib/portal-model"
import { PortalLoading, PortalNotice } from "@/components/portal/portal-shell"
function LegacyCompanyPage() {
  const { clientSlug } = useParams<{ clientSlug: string }>()
  const search = useSearchParams().toString()
  const router = useRouter()
  const [state, setState] = useState("loading")
  useEffect(() => {
    let active = true
    getOrganizationByRef(clientSlug).then(org => {
      if (!active) return
      if (org) router.replace(legacyCompanyDestination(organizationRef(org), search))
      else setState("missing")
    }).catch(() => { if (active) setState("error") })
    return () => { active = false }
  }, [clientSlug, search, router])
  if (state === "loading") return <PortalLoading />
  return <PortalNotice title={state === "missing" ? "Page not found" : "We couldn’t open this workspace"}>{state === "missing" ? "There’s no company at this address." : "Check your connection and refresh to try again."}</PortalNotice>
}
export default function PublicCompanyPage() { return <Suspense fallback={<PortalLoading />}><LegacyCompanyPage /></Suspense> }
