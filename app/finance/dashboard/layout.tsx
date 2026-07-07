"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { LogIn, Loader2 } from "lucide-react"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { BrandLockup } from "@/components/brand-lockup"
import { FinanceAppShell } from "@/components/finance/finance-app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function FinanceWorkspace({ children }: { children: ReactNode }) {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md shadow-none">
          <CardContent className="px-8 py-10 text-center">
            <div className="mb-6 flex flex-col items-center gap-2">
              <BrandLockup logoSize={32} />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Finance</span>
            </div>
            <h1 className="mb-3 text-3xl text-primary">Workspace sign in</h1>
            <p className="mb-8 text-sm text-muted-foreground">
              Access your deal pipeline, QofE analyses, and LP reporting. Restricted to authorized team members.
            </p>
            <Button onClick={signInWithGoogle} className="w-full" size="lg">
              <LogIn className="size-4" />
              Continue with Google
            </Button>
            <p className="mt-6 text-xs text-muted-foreground">
              Looking for the product overview?{" "}
              <Link href="/finance" className="font-semibold text-primary hover:underline">
                Back to VisualCNS Finance
              </Link>
            </p>
          </CardContent>
        </Card>
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
