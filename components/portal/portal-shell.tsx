"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Eye, LogOut, Loader2 } from "lucide-react"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { getOrganizationByRef } from "@/lib/organizations"
import { safeExternalUrl } from "@/lib/portal-model"

export function PortalLoading() {
  return <div role="status" className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" aria-hidden="true" />Loading your workspace…</div>
}

export function PortalNotice({ title, children }: { title: string; children: ReactNode }) {
  return <div className="mx-auto max-w-lg px-6 py-24 text-center"><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><div className="mt-3 text-sm leading-6 text-muted-foreground">{children}</div></div>
}

function Shell({ children }: { children: ReactNode }) {
  const { user, appUser, loading, isAdmin, isImpersonating, stopViewingAs, signOut } = useAuth()
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const router = useRouter()
  const { companySlug } = useParams<{ companySlug?: string }>()
  const [company, setCompany] = useState<{ name: string; logoUrl?: string } | null>(null)
  useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname + (search ? `?${search}` : ""))}`)
  }, [loading, user, pathname, search, router])
  useEffect(() => {
    if (!companySlug) { setCompany(null); return }
    let active = true
    getOrganizationByRef(companySlug)
      .then((org) => { if (active) setCompany(org ? { name: org.name, logoUrl: org.logoUrl } : null) })
      .catch(() => { if (active) setCompany(null) })
    return () => { active = false }
  }, [companySlug])
  if (loading || !user) return <PortalLoading />
  return <div className="portal-surface min-h-screen bg-background text-foreground [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans">
    {isAdmin && <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 bg-amber-50 px-5 py-2 text-sm text-amber-950 print:hidden">
      <span className="flex items-center gap-2"><Eye className="size-4" />{isImpersonating ? `Viewing as ${appUser?.displayName || appUser?.email || "client"}` : "Client portal preview"}</span>
      <Button size="sm" variant="ghost" onClick={() => { stopViewingAs(); router.push("/dashboard/companies") }}><ArrowLeft className="size-4" />Back to agency</Button>
    </div>}
    <header className="border-b border-border print:hidden"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-10">
      <Link href="/portal" className="inline-flex min-w-0 items-center gap-3 rounded-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
        {company ? (
          <>
            {safeExternalUrl(company.logoUrl) ? <img src={company.logoUrl} alt="" className="size-8 shrink-0 rounded-lg border border-border object-contain p-1" /> : <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold" aria-hidden="true">{company.name.slice(0, 1).toUpperCase()}</span>}
            <span className="truncate">{company.name}</span>
          </>
        ) : (
          <><img src="/visualhqlogo.svg" alt="" className="size-7" /><span>Client portal</span></>
        )}
      </Link>
      <div className="flex items-center gap-3"><span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:block">{appUser?.displayName || user.email}</span><Button variant="ghost" size="sm" onClick={() => void signOut()}><LogOut className="size-4" />Sign out</Button></div>
    </div></header>
    {appUser ? children : <PortalNotice title="We couldn’t load your account">Sign out and try again. If this continues, contact your agency to check your access.</PortalNotice>}
    <footer className="mx-auto max-w-7xl px-5 pb-8 pt-12 text-xs text-muted-foreground sm:px-10 print:hidden">Your workspace with VisualCNS</footer>
  </div>
}

export function PortalShell({ children }: { children: ReactNode }) {
  return <AuthProvider><Shell>{children}</Shell></AuthProvider>
}
