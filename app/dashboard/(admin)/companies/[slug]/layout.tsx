"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Pencil, Share2 } from "lucide-react"
import { toast } from "sonner"

import { CompanyProvider, useCompanyState } from "@/components/dashboard/company-context"
import { ProjectCover } from "@/components/project-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Project } from "@/lib/projects"
import { cn } from "@/lib/utils"

function Fact({ label, value, emptyLabel = "—" }: { label: string; value: string; emptyLabel?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1 text-sm", !value && "italic text-muted-foreground/70")}>{value || emptyLabel}</dd>
    </div>
  )
}

function CompanyLayoutBody({ children }: { children: ReactNode }) {
  const { loading, error, client, organization, people, workspaceId, name, categoryLabel } = useCompanyState()
  const router = useRouter()
  const pathname = usePathname()
  const isEditRoute = pathname?.endsWith("/edit") ?? false
  const [shareOpen, setShareOpen] = useState(false)

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  if (error || !client) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Link>
        <p className="mt-8 text-sm text-muted-foreground">{error ?? "This company could not be loaded."}</p>
      </main>
    )
  }

  const clientSlug = client.slug || workspaceId
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/dashboard/${clientSlug}` : `/dashboard/${clientSlug}`
  const coverProject: Project = {
    id: client.uid,
    clientId: workspaceId,
    client: name,
    title: name,
    service: "",
    status: "in-progress",
    progress: 0,
    dueDate: "",
    thumbnailUrl: organization?.logoUrl || client.photoURL,
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <Card>
          <CardContent>
            <button
              type="button"
              onClick={() =>
                window.history.length > 1 ? router.back() : router.push("/dashboard/companies")
              }
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </button>

            <div className="mt-4 size-20 overflow-hidden rounded-2xl">
              <ProjectCover project={coverProject} />
            </div>

            {!isEditRoute && (
              <div className="mt-3 flex items-center gap-2">
                <Button asChild size="sm">
                  <Link href={`/dashboard/companies/${clientSlug}/edit`}>
                    <Pencil className="size-4" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
                  <Share2 className="size-4" />
                  Share
                </Button>
              </div>
            )}

            <h1 className="mt-4 text-xl font-semibold">{name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{categoryLabel || "No category yet"}</p>

            <div className="mt-6 space-y-4 border-t border-border pt-4">
              <Fact label="Industry" value={organization?.industry ?? ""} emptyLabel="Not set" />
              <Fact label="Location" value={organization?.location ?? ""} emptyLabel="Not set" />
              <Fact label="People" value={`${people.length} ${people.length === 1 ? "person" : "people"}`} />
            </div>
          </CardContent>
        </Card>

        <div>{children}</div>
      </div>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share company workspace</DialogTitle>
            <DialogDescription>Share direct access to {name}&apos;s dashboard.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 pt-2">
            <Input
              readOnly
              value={shareUrl}
              className="font-mono text-xs"
              onClick={(event) => (event.target as HTMLInputElement).select()}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={() => {
                void navigator.clipboard.writeText(shareUrl)
                toast.success("Link copied to clipboard")
              }}
            >
              Copy link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default function CompanyLayout({ children }: { children: ReactNode }) {
  return (
    <CompanyProvider>
      <CompanyLayoutBody>{children}</CompanyLayoutBody>
    </CompanyProvider>
  )
}
