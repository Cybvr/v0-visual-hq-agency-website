"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// The business profile now lives under the account settings tabs. This keeps
// old links and bookmarks working by forwarding to the new home.
export default function BusinessSettingsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/account/business")
  }, [router])

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </main>
  )
}
