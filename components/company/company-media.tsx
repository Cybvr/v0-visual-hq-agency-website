"use client"

import { useState } from "react"
import { ExternalLink, Images, Plus } from "lucide-react"

import { GalleryDropzone } from "@/components/image-dropzone"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Project } from "@/lib/projects"

interface MediaItem {
  url: string
  label: string
  project: string
}

function derivedMedia(logoUrl: string | undefined, projects: Project[]): MediaItem[] {
  const items: MediaItem[] = []

  if (logoUrl) items.push({ url: logoUrl, label: "Company logo", project: "Company" })

  for (const project of projects) {
    const cover = project.imageUrl || project.thumbnailUrl
    if (cover) items.push({ url: cover, label: "Project cover", project: project.title })
    if (project.logoUrl) items.push({ url: project.logoUrl, label: "Project logo", project: project.title })
    for (const [index, url] of (project.gallery ?? []).entries()) {
      if (url) items.push({ url, label: `Gallery image ${index + 1}`, project: project.title })
    }
  }

  return items
}

export function CompanyMedia({
  logoUrl,
  projects,
  uploaded = [],
  onUploadedChange,
}: {
  logoUrl?: string
  projects: Project[]
  /** Media an admin added directly to the company (persisted on the organization). */
  uploaded?: string[]
  /** Present only for admins; wiring it in turns the section into an editor. */
  onUploadedChange?: (urls: string[]) => void
}) {
  const isAdmin = Boolean(onUploadedChange)
  const [addOpen, setAddOpen] = useState(false)
  const uploadedItems: MediaItem[] = uploaded
    .filter(Boolean)
    .map((url) => ({ url, label: "Uploaded media", project: "Company" }))

  // The uploaded media always shows in the grid; admins manage it through the
  // modal opened by the Add media button.
  const gallery = [
    ...new Map([...uploadedItems, ...derivedMedia(logoUrl, projects)].map((item) => [item.url, item])).values(),
  ]

  return (
    <section className="mt-4" aria-labelledby="company-media-heading">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <h2 id="company-media-heading" className="text-base font-semibold">Media</h2>
          <span className="text-sm text-muted-foreground">{gallery.length}</span>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Add media
          </Button>
        )}
      </div>

      {isAdmin && (
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add media</DialogTitle>
            </DialogHeader>
            <GalleryDropzone value={uploaded.filter(Boolean)} onChange={(urls) => onUploadedChange?.(urls)} />
          </DialogContent>
        </Dialog>
      )}

      {gallery.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-lg border border-dashed border-border py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted">
            <Images className="size-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-medium">No media yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Project covers and gallery images will appear here.</p>
        </div>
      ) : (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-[14px] border border-border/60 bg-card p-2 outline-none transition-colors hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`Open ${item.label} from ${item.project}`}
              >
                <div className="aspect-square overflow-hidden rounded-[10px] bg-muted">
                  {/* Media URLs may come from any configured storage host. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={`${item.label} from ${item.project}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex items-start justify-between gap-2 px-1.5 pb-1 pt-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.project}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.label}</p>
                  </div>
                  <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
