"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, X } from "lucide-react"
import { createPortfolioProject } from "@/lib/portfolio"

const CATEGORIES = ["Branding", "Web Development", "Presentation Design"]

export default function NewProjectPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: [] as string[],
    imageUrl: "",
    logoUrl: "",
    gallery: [] as string[],
    client: "",
    clientValuation: "",
    earnings: "",
    founders: "",
    industry: "",
    projectUrl: "",
    status: "Draft",
    featured: false,
    order: 0,
    tags: [] as string[],
    technologies: [] as string[],
  })
  const [newGalleryUrl, setNewGalleryUrl] = useState("")
  const [newTech, setNewTech] = useState("")

  function handleChange(field: string, value: string | boolean | number) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "title") {
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

  function addGalleryImage() {
    if (newGalleryUrl.trim()) {
      setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, newGalleryUrl.trim()] }))
      setNewGalleryUrl("")
    }
  }

  function removeGalleryImage(index: number) {
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }))
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await createPortfolioProject(formData)
      router.push("/admin")
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-xl">New Project</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" value={formData.slug} onChange={(e) => handleChange("slug", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant={formData.category.includes(cat) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Cover Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => handleChange("logoUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Image URL"
                  />
                  <Button type="button" variant="outline" onClick={addGalleryImage}>
                    Add
                  </Button>
                </div>
                {formData.gallery.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.gallery.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url || "/placeholder.svg"} alt="" className="w-16 h-16 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input id="client" value={formData.client} onChange={(e) => handleChange("client", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectUrl">Project URL</Label>
                  <Input
                    id="projectUrl"
                    value={formData.projectUrl}
                    onChange={(e) => handleChange("projectUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founders">Founders</Label>
                  <Input
                    id="founders"
                    value={formData.founders}
                    onChange={(e) => handleChange("founders", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientValuation">Client Valuation</Label>
                  <Input
                    id="clientValuation"
                    value={formData.clientValuation}
                    onChange={(e) => handleChange("clientValuation", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="earnings">Earnings</Label>
                  <Input
                    id="earnings"
                    value={formData.earnings}
                    onChange={(e) => handleChange("earnings", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleChange("order", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(v) => handleChange("featured", v)}
                />
                <Label htmlFor="featured">Featured project</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin">Cancel</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Project
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
