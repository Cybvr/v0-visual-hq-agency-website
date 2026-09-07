"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"

import { GalleryDropzone, ImageDropzone } from "@/components/image-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { projectSlug, slugify, updateProject, type Project } from "@/lib/projects"

/** "brand, product" <-> ["brand", "product"], so list fields edit as plain text. */
function listToText(value?: string[]): string {
  return (value ?? []).join(", ")
}

function textToList(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

type FormState = {
  isCaseStudy: boolean
  caseStudyStatus: "draft" | "published"
  featured: boolean
  title: string
  slug: string
  client: string
  excerpt: string
  description: string
  category: string
  industry: string
  location: string
  founders: string
  clientValuation: string
  earnings: string
  projectUrl: string
  imageUrl: string
  logoUrl: string
  gallery: string[]
  technologies: string
  tags: string
}

function formStateFrom(project: Project): FormState {
  return {
    isCaseStudy: project.isCaseStudy ?? false,
    caseStudyStatus: project.caseStudyStatus === "published" ? "published" : "draft",
    featured: project.featured ?? false,
    title: project.title ?? "",
    slug: projectSlug(project),
    client: project.client ?? "",
    excerpt: project.excerpt ?? "",
    description: project.description ?? "",
    category: listToText(project.category),
    industry: project.industry ?? "",
    location: project.location ?? "",
    founders: project.founders ?? "",
    clientValuation: project.clientValuation ?? "",
    earnings: project.earnings ?? "",
    projectUrl: project.projectUrl ?? "",
    imageUrl: project.imageUrl || project.thumbnailUrl || "",
    logoUrl: project.logoUrl ?? "",
    gallery: project.gallery ?? [],
    technologies: listToText(project.technologies),
    tags: listToText(project.tags),
  }
}

/**
 * Everything the public case study renders, edited on the project that carries
 * it. Publishing here is what puts the project on /case-studies.
 */
export function CaseStudyForm({
  project,
  onSaved,
}: {
  project: Project
  onSaved?: (patch: Partial<Project>) => void
}) {
  const [form, setForm] = useState<FormState>(() => formStateFrom(project))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(formStateFrom(project))
    setError(null)
    setSaved(false)
    // Only a different project reloads the fields, so a save that echoes the
    // same project back doesn't wipe anything still being typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id])

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      const patch: Partial<Project> = {
        isCaseStudy: form.isCaseStudy,
        caseStudyStatus: form.caseStudyStatus,
        featured: form.featured,
        title: form.title.trim(),
        slug: slugify(form.slug) || slugify(form.title),
        client: form.client.trim(),
        excerpt: form.excerpt.trim(),
        description: form.description.trim(),
        category: textToList(form.category),
        industry: form.industry.trim(),
        location: form.location.trim(),
        founders: form.founders.trim(),
        clientValuation: form.clientValuation.trim(),
        earnings: form.earnings.trim(),
        projectUrl: form.projectUrl.trim(),
        imageUrl: form.imageUrl.trim(),
        logoUrl: form.logoUrl.trim(),
        gallery: form.gallery,
        technologies: textToList(form.technologies),
        tags: textToList(form.tags),
      }
      // The marketing grid reads imageUrl and the dashboard cards read
      // thumbnailUrl, so the cover keeps both in step.
      if (patch.imageUrl) patch.thumbnailUrl = patch.imageUrl
      await updateProject(project.id, patch)
      setForm((current) => ({ ...current, slug: patch.slug ?? current.slug }))
      setSaved(true)
      onSaved?.(patch)
    } catch (saveError) {
      console.error("Error saving case study:", saveError)
      setError(saveError instanceof Error ? saveError.message : "The case study could not be saved.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4">
              <p className="text-sm font-medium">Show in case studies</p>
              <Switch
                checked={form.isCaseStudy}
                onCheckedChange={(checked) => set("isCaseStudy", checked)}
                aria-label="Show in case studies"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="caseStudyStatus">Publication</Label>
                <Select
                  value={form.caseStudyStatus}
                  onValueChange={(value) => set("caseStudyStatus", value as "draft" | "published")}
                >
                  <SelectTrigger id="caseStudyStatus" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="featured">Featured</Label>
                <div className="flex h-9 items-center gap-2">
                  <Switch
                    id="featured"
                    checked={form.featured}
                    onCheckedChange={(checked) => set("featured", checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {form.featured ? "Featured" : "Not featured"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Story</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Headline</Label>
                <Input id="title" required value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="caseStudySlug">Address</Label>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-sm text-muted-foreground">/case-studies/</span>
                  <Input id="caseStudySlug" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Facts</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="Brand, Product"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" value={form.industry} onChange={(e) => set("industry", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="founders">Founders</Label>
                <Input id="founders" value={form.founders} onChange={(e) => set("founders", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientValuation">Valuation</Label>
                <Input
                  id="clientValuation"
                  value={form.clientValuation}
                  onChange={(e) => set("clientValuation", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="earnings">Earnings</Label>
                <Input id="earnings" value={form.earnings} onChange={(e) => set("earnings", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="projectUrl">Live site</Label>
                <Input
                  id="projectUrl"
                  value={form.projectUrl}
                  onChange={(e) => set("projectUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="technologies">Technologies</Label>
                <Input
                  id="technologies"
                  value={form.technologies}
                  onChange={(e) => set("technologies", e.target.value)}
                  placeholder="Next.js, Figma"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Media</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <ImageDropzone label="Cover" value={form.imageUrl} onChange={(url) => set("imageUrl", url)} />
              <ImageDropzone label="Client logo" value={form.logoUrl} onChange={(url) => set("logoUrl", url)} />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium leading-none">Gallery</p>
              <GalleryDropzone value={form.gallery} onChange={(urls) => set("gallery", urls)} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap items-center justify-end gap-3">
            {saved && <span className="text-xs text-muted-foreground">Saved</span>}
            {form.slug && (
              <Button variant="outline" asChild>
                <a href={`/case-studies/${form.slug}`} target="_blank" rel="noopener noreferrer">
                  Preview
                  <ExternalLink className="ml-2 size-4" />
                </a>
              </Button>
            )}
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save
            </Button>
          </div>
    </form>
  )
}
