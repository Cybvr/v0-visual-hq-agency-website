"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { getUserBySlug, type AppUser } from "@/lib/users"

export default function UserDashboardPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug ?? ""
  const { user, appUser, isAdmin, loading } = useAuth()

  const [owner, setOwner] = useState<AppUser | null>(null)
  const [checking, setChecking] = useState(true)

  const isOwnSlug = appUser?.slug === slug

  useEffect(() => {
    let active = true
    // Your own dashboard needs no lookup. Anything else is only resolved so an
    // admin can open it, and to tell a wrong slug from a forbidden one.
    if (isOwnSlug || !slug) {
      setChecking(false)
      return
    }
    getUserBySlug(slug)
      .then((found) => {
        if (active) setOwner(found)
      })
      .catch(() => {
        if (active) setOwner(null)
      })
      .finally(() => {
        if (active) setChecking(false)
      })
    return () => {
      active = false
    }
  }, [slug, isOwnSlug])

  if (!user) return null

  if (loading || checking) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  if (!isOwnSlug && !(isAdmin && owner)) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn&apos;t exist, or has been removed.
        </p>
        <Link href="/dashboard" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
          Back home
        </Link>
      </main>
    )
  }

  return null
}
