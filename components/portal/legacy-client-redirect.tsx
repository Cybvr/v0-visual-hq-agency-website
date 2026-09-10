"use client"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { getOrganization, organizationRef } from "@/lib/organizations"
import { legacyDashboardDestination } from "@/lib/portal-model"
import { PortalLoading, PortalNotice } from "./portal-shell"

export function LegacyClientRedirect() {
  const { appUser } = useAuth()
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const router = useRouter()
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let active = true
    if (!appUser?.companyId) { router.replace("/portal"); return }
    getOrganization(appUser.companyId).then(org => {
      if (active) router.replace(org ? legacyDashboardDestination(organizationRef(org), pathname, search) : "/portal")
    }).catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [appUser?.companyId, pathname, search, router])
  return failed ? <PortalNotice title="We couldn’t open your portal">Refresh to try again.</PortalNotice> : <PortalLoading />
}
