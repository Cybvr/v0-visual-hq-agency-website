"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { ProjectCover } from "@/components/project-card"
import type { Project } from "@/lib/projects"
import type { AppUser } from "@/lib/users"
import { cn } from "@/lib/utils"

export function clientName(client: AppUser): string {
  return client.company || client.displayName || client.email || "Unnamed client"
}

export function ClientHeader({
  client,
  orgName,
  orgLogoUrl,
  subtitle,
  backHref,
  actions,
  className,
}: {
  client: AppUser
  /** The organization's own name/logo, when one exists, take priority over the user's. */
  orgName?: string
  orgLogoUrl?: string
  subtitle?: string
  backHref?: string
  actions?: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  const name = orgName || clientName(client)
  const workspaceId = client.clientId || client.uid

  const coverProject: Project = {
    id: client.uid,
    clientId: workspaceId,
    client: name,
    title: name,
    service: "",
    status: "in-progress",
    progress: 0,
    dueDate: "",
    thumbnailUrl: orgLogoUrl || client.photoURL,
  }

  function handleBack() {
    if (backHref) {
      router.push(backHref)
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/dashboard/companies")
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Row 1: back + actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </button>

        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Row 2: avatar + name + subtitle */}
      <div className="flex items-center gap-4">
        <div className="size-14 shrink-0 overflow-hidden rounded-xl">
          <ProjectCover project={coverProject} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{name}</h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
