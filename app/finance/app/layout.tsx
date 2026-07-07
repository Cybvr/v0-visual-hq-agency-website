"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { BrandLockup } from "@/components/brand-lockup"
import { FinanceAppShell } from "@/components/finance/finance-app-shell"

function FinanceWorkspace({ children }: { children: ReactNode }) {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--fin-surface)">
        <Loader2 className="h-8 w-8 animate-spin text-(--fin-outline)" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="fin-hero-gradient flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[8px] border border-(--fin-outline-variant) bg-white p-10 text-center shadow-xl">
          <div className="mb-6 flex flex-col items-center gap-2">
            <BrandLockup logoSize={32} />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-(--fin-secondary)">Finance</span>
          </div>
          <h1 className="fin-headline mb-3 text-3xl text-(--fin-primary)">Workspace sign in</h1>
          <p className="mb-8 text-sm text-(--fin-on-surface-variant)">
            Access your deal pipeline, QofE analyses, and LP reporting. Restricted to authorized team members.
          </p>
          <button
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-(--fin-primary) px-6 py-3.5 text-sm font-semibold text-(--fin-on-primary) shadow-sm transition-all hover:opacity-90 active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            Continue with Google
          </button>
          <p className="mt-6 text-xs text-(--fin-on-surface-variant)">
            Looking for the product overview?{" "}
            <Link href="/finance" className="font-semibold text-(--fin-secondary) hover:underline">
              Back to VisualCNS Finance
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return <FinanceAppShell>{children}</FinanceAppShell>
}

export default function FinanceAppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FinanceWorkspace>{children}</FinanceWorkspace>
    </AuthProvider>
  )
}
