"use client"

import { useEffect, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Eye, FolderKanban, HardDrive, LayoutDashboard, ListTodo, Loader2, LogOut, Megaphone, Users } from "lucide-react"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { DashboardShell, type NavLink } from "@/components/dashboard-shell"

const CLIENT_NAV: NavLink[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { label: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
  { label: "Drive", href: "/dashboard/drive", icon: HardDrive },
  { label: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
]

const ADMIN_NAV: NavLink[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { label: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: FolderKanban },
  { label: "Drive", href: "/dashboard/drive", icon: HardDrive },
  { label: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
  { label: "Users", href: "/dashboard/users", icon: Users },
]

function UnifiedDashboardShell({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const { user, appUser, role, isAdmin, isImpersonating, impersonatedUser, stopViewingAs, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) router.replace("/auth/login")
    else if (requireAdmin && !isAdmin) router.replace("/dashboard")
  }, [loading, user, isAdmin, requireAdmin, router])

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (requireAdmin && !isAdmin) return null

  if (role !== "client" && !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <Image src="/visualhqlogo.svg" alt="VisualHQ" width={36} height={36} />
        <div>
          <h1 className="text-lg font-semibold">No dashboard for this account</h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{user.email} isn&apos;t set up with a workspace yet.</p>
        </div>
        <Button variant="outline" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
      </div>
    )
  }

  return (
    <DashboardShell
      title="VisualCNS"
      subtitle={appUser?.company || undefined}
      navLinks={isAdmin && !isImpersonating ? ADMIN_NAV : CLIENT_NAV}
      rootHref="/dashboard"
      banner={isImpersonating ? (
        <div className="flex h-10 items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950 dark:text-amber-200 sm:px-6">
          <span className="flex min-w-0 items-center gap-2">
            <Eye className="h-4 w-4 shrink-0" />
            <span className="truncate">Viewing as <strong>{impersonatedUser?.displayName || impersonatedUser?.email}</strong></span>
          </span>
          <Button size="sm" variant="outline" className="h-7 shrink-0 border-amber-300 bg-white text-amber-900 dark:border-amber-500/40 dark:bg-transparent dark:text-amber-200" onClick={() => { stopViewingAs(); router.push("/dashboard/users") }}>Exit view</Button>
        </div>
      ) : undefined}
    >
      {children}
    </DashboardShell>
  )
}

export function UnifiedDashboardLayout({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  return <AuthProvider><UnifiedDashboardShell requireAdmin={requireAdmin}>{children}</UnifiedDashboardShell></AuthProvider>
}
