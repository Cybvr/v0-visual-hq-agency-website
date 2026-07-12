"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Loader2, X } from "lucide-react"
import {
  createPortfolioProject,
  updatePortfolioProject,
  type PortfolioProject,
} from "@/lib/portfolio"
import { ImageDropzone, GalleryDropzone } from "@/components/image-dropzone"

const CATEGORIES = ["Branding", "Web Development", "Presentation Design"]

type FormState = {
  title: string
  slug: string
  excerpt: string
  description: string
  category: string[]
  location: string
  imageUrl: string
  logoUrl: string
  gallery: string[]
  client: string
  clientValuation: string
  earnings: string
  founders: string
  industry: string
  projectUrl: string
  status: string
  featured: boolean
  order: number
  tags: string[]
  technologies: string[]
}

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  description: "",
  category: [],
  location: "",
  imageUrl: "",
  logoUrl: "",
  gallery: [],
  client: "",
  clientValuation: "",
  earnings: "",
  founders: "",
  industry: "",
  projectUrl: "",
  status: "draft",
  featured: false,
  order: 0,
  tags: [],
  technologies: [],
}

interface ProjectFormProps {
  project?: PortfolioProject | null
  existingCategories?: string[]
  existingLocations?: string[]
  onSaved: (id: string) => void
  onCancel: () => void
}

export function ProjectForm({
  project,
  existingCategories = [],
  existingLocations = [],
  onSaved,
  onCancel,
}: ProjectFormProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM)
  const [newTech, setNewTech] = useState("")
  const [newCategory, setNewCategory] = useState("")

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        excerpt: project.excerpt || "",
        description: project.description || "",
        category: project.category || [],
        location: project.location || "",
        imageUrl: project.imageUrl || "",
        logoUrl: project.logoUrl || "",
        gallery: project.gallery || [],
        client: project.client || "",
        clientValuation: project.clientValuation || "",
        earnings: project.earnings || "",
        founders: project.founders || "",
        industry: project.industry || "",
        projectUrl: project.projectUrl || "",
        status: project.status?.trim().toLowerCase() === "published" ? "published" : "draft",
        featured: project.featured || false,
        order: project.order || 0,
        tags: project.tags || [],
        technologies: project.technologies || [],
      })
    } else {
      setFormData(EMPTY_FORM)
    }
    setNewTech("")
    setNewCategory("")
  }, [project])

  function handleChange(field: string, value: string | boolean | number) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "title" && !project) {
      setFormData((prev) => ({
        ...prev,
        slug: (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }))
    }
  }

  function toggleCategory(category: string) {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }))
  }

  function addCategory() {
    const value = newCategory.trim()
    if (value && !formData.category.includes(value)) {
      setFormData((prev) => ({ ...prev, category: [...prev.category, value] }))
    }
    setNewCategory("")
  }

  function removeCategory(category: string) {
    setFormData((prev) => ({ ...prev, category: prev.category.filter((c) => c !== category) }))
  }

  function addTechnology() {
    if (newTech.trim()) {
      setFormData((prev) => ({ ...prev, technologies: [...prev.technologies, newTech.trim()] }))
      setNewTech("")
    }
  }

  function removeTechnology(index: number) {
    setFormData((prev) => ({ ...prev, technologies: prev.technologies.filter((_, i) => i !== index) }))
  }

  function applyLocation(value: string) {
    handleChange("location", value.trim())
  }

  function clearLocation() {
    handleChange("location", "")
  }

  async function saveProject() {
    if (saving) return;
    setSaving(true)
    try {
      const dataToSave = {
        ...formData,
        location: formData.location.trim(),
        status: formData.status?.trim().toLowerCase() === "published" ? "published" : "draft",
      }
      if (project) {
        await updatePortfolioProject(project.id, dataToSave)
        onSaved(project.id)
      } else {
        const id = await createPortfolioProject(dataToSave)
        onSaved(id)
      }
    } catch (error) {
      console.error("Error saving project:", error)
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await saveProject()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveProject()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [formData, project, saving, onSaved])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={formData.slug} onChange={(e) => handleChange("slug", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            {formData.location && (
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-sm">
                  {formData.location}
                  <button
                    type="button"
                    onClick={clearLocation}
                    className="transition-colors hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Add a location"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyLocation(formData.location))}
              />
              <Button type="button" variant="outline" onClick={() => applyLocation(formData.location)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(existingLocations))
                .sort()
                .filter((location) => location && location !== formData.location)
                .map((location) => (
                  <Button
                    key={location}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyLocation(location)}
                  >
                    {location}
                  </Button>
                ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Categories</Label>
            {formData.category.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.category.map((cat) => (
                  <span key={cat} className="inline-flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                    {cat}
                    <button
                      type="button"
                      onClick={() => removeCategory(cat)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add a category"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
              />
              <Button type="button" variant="outline" onClick={addCategory}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...CATEGORIES, ...existingCategories]))
                .sort()
                .filter((cat) => !formData.category.includes(cat))
                .map((cat) => (
                  <Button key={cat} type="button" variant="outline" size="sm" onClick={() => toggleCategory(cat)}>
                    + {cat}
                  </Button>
                ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <ImageDropzone label="Cover Image" value={formData.imageUrl} onChange={(url) => handleChange("imageUrl", url)} />
            <ImageDropzone label="Logo" value={formData.logoUrl} onChange={(url) => handleChange("logoUrl", url)} />
          </div>

          <div className="space-y-1.5">
            <Label>Gallery Images</Label>
            <GalleryDropzone
              value={formData.gallery}
              onChange={(urls) => setFormData((prev) => ({ ...prev, gallery: urls }))}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="client">Client</Label>
              <Input id="client" value={formData.client} onChange={(e) => handleChange("client", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" value={formData.industry} onChange={(e) => handleChange("industry", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="projectUrl">Project URL</Label>
              <Input
                id="projectUrl"
                value={formData.projectUrl}
                onChange={(e) => handleChange("projectUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="founders">Founders</Label>
              <Input id="founders" value={formData.founders} onChange={(e) => handleChange("founders", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="clientValuation">Client Valuation</Label>
              <Input
                id="clientValuation"
                value={formData.clientValuation}
                onChange={(e) => handleChange("clientValuation", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="earnings">Earnings</Label>
              <Input id="earnings" value={formData.earnings} onChange={(e) => handleChange("earnings", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Technologies</Label>
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="e.g. Figma, React, Next.js"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
              />
              <Button type="button" variant="outline" onClick={addTechnology}>
                Add
              </Button>
            </div>
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(i)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => handleChange("order", Number.parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="status"
              checked={formData.status?.trim().toLowerCase() === "published"}
              onCheckedChange={(v) => handleChange("status", v ? "published" : "draft")}
            />
            <Label htmlFor="status">Published</Label>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="featured" checked={formData.featured} onCheckedChange={(v) => handleChange("featured", v)} />
            <Label htmlFor="featured">Featured project</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {project ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
