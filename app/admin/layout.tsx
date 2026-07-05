"use client"

import { useEffect, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { FolderKanban, Home, Loader2, LogOut, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Home", href: "/admin", icon: Home },
  { label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
]

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
}

function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-background md:flex">
      <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
        <Image src="/visualhqlogo.svg" alt="VisualHQ" width={26} height={26} />
        <span className="font-semibold">Admin</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive(pathname, link.href)
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          {user?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={user.displayName ?? "Account"}
              className="h-8 w-8 shrink-0 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="h-8 w-8 shrink-0 rounded-full bg-muted" />
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{user?.displayName ?? "Account"}</div>
            <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            aria-label="Sign out"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
      <div className="flex items-center gap-4">
        <Image src="/visualhqlogo.svg" alt="VisualHQ" width={24} height={24} />
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm",
              isActive(pathname, link.href) ? "font-semibold text-foreground" : "text-muted-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={signOut}
        aria-label="Sign out"
        className="h-8 w-8 text-muted-foreground"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}

function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      <div className="md:pl-60">{children}</div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  )
}
