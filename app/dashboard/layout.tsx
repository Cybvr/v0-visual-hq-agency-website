"use client"

import { useEffect, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, LayoutDashboard, Loader2, LogOut, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { DashboardShell, type NavLink } from "@/components/dashboard-shell"

const NAV_LINKS: NavLink[] = [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]

function ClientDashboard({ children }: { children: ReactNode }) {
  const { user, appUser, role, isAdmin, isImpersonating, impersonatedUser, stopViewingAs, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login")
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Access is by role: clients (and admins previewing) get in. Anyone whose
  // user doc has no client/admin role sees a clear "no workspace" message.
  const hasAccess = role === "client" || isAdmin

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <Image src="/visualhqlogo.svg" alt="VisualHQ" width={36} height={36} />
        <div>
          <h1 className="text-lg font-semibold">No dashboard for this account</h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {user.email} isn&apos;t set up with a client workspace yet. If you think this is a mistake, contact your
            VisualHQ manager.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
          <Button asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell
      title="VisualCNS"
      subtitle={appUser?.company || undefined}
      navLinks={NAV_LINKS}
      rootHref="/dashboard"
      navExtra={
        isAdmin ? (
          <Link
            href="/admin"
            className="mt-2 flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <ShieldCheck className="h-4 w-4" />
            Back to admin
          </Link>
        ) : null
      }
    >
      {isImpersonating && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 sm:px-6">
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4 shrink-0" />
            Viewing as{" "}
            <strong className="font-semibold">
              {impersonatedUser?.displayName || impersonatedUser?.email || impersonatedUser?.uid}
            </strong>
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
            onClick={() => {
              stopViewingAs()
              router.push("/admin/users")
            }}
          >
            Exit view
          </Button>
        </div>
      )}
      {children}
    </DashboardShell>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ClientDashboard>{children}</ClientDashboard>
    </AuthProvider>
  )
}
