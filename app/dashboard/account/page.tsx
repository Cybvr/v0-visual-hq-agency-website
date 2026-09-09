"use client"

import { useAuth } from "@/components/auth-provider"
import { AccountNav } from "@/components/account/account-nav"
import { Button } from "@/components/ui/button"

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border py-3.5 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}

export default function AccountPage() {
  const { user, appUser, role, signOut } = useAuth()
  if (!user) return null

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-9 sm:px-6">
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
        Your sign-in details and the workspace this account belongs to.
      </p>

      <AccountNav />

      <section className="mt-7 rounded-[14px] border border-border bg-card px-5 py-1">
        <Row label="Email" value={appUser?.email || user.email || "Not set"} />
        <Row label="Name" value={appUser?.displayName || user.displayName || "Not set"} />
        <Row label="Workspace" value={appUser?.company || "Not set"} />
        <Row label="Access" value={role === "admin" ? "Admin" : "Client"} />
      </section>

      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        Your email and password are managed by your sign-in provider, so they can&apos;t be changed here. Your name and
        workspace live on the Profile tab.
      </p>

      <div className="mt-7 border-t border-border pt-6">
        <Button variant="outline" onClick={signOut}>
          Log out
        </Button>
      </div>
    </main>
  )
}
