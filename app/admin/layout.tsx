"use client"

import { useEffect, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, FolderKanban, HardDrive, LayoutDashboard, ListTodo, Loader2, LogOut, Megaphone, Users } from "lucide-react"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { DashboardShell, type NavLink } from "@/components/dashboard-shell"

const NAV_LINKS: NavLink[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: Briefcase },
  { label: "Tasks", href: "/admin/tasks", icon: ListTodo },
  { label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { label: "Drive", href: "/admin/drive", icon: HardDrive },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { label: "Users", href: "/admin/users", icon: Users },
]

function AdminShell({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) router.replace("/auth/login")
    else if (!isAdmin) router.replace("/dashboard")
  }, [loading, user, isAdmin, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <div>
          <h1 className="text-lg font-semibold">Admins only</h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {user.email} doesn&apos;t have admin access. Redirecting you to your dashboard&hellip;
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell title="VisualCNS" navLinks={NAV_LINKS} rootHref="/admin">
      {children}
    </DashboardShell>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  )
}
