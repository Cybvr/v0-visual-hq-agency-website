"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth-provider"
import { DashboardHome } from "@/components/dashboard/dashboard-home"

export default function DashboardPage() {
  const { appUser, loading } = useAuth()
  const router = useRouter()
  const slug = appUser?.slug

  // Everyone has their own dashboard URL, so send them to it. Until the slug
  // has been backfilled this page still renders the dashboard as it always did.
  useEffect(() => {
    if (!loading && slug) router.replace(`/dashboard/${slug}`)
  }, [loading, slug, router])

  return <DashboardHome />
}
