"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { ImageDropzone } from "@/components/image-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getBusinessProfile, updateBusinessProfile, type BusinessProfile } from "@/lib/business-profile"

const EMPTY_FORM = { name: "", address: "", email: "", website: "", taxNumber: "", logoUrl: "" }

export default function BusinessSettingsPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let active = true
    getBusinessProfile().then((profile) => {
      if (!active) return
      setForm({
        name: profile.name ?? "",
        address: profile.address ?? "",
        email: profile.email ?? "",
        website: profile.website ?? "",
        taxNumber: profile.taxNumber ?? "",
        logoUrl: profile.logoUrl ?? "",
      })
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  function set<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      const payload: Partial<BusinessProfile> = {
        name: form.name.trim() || "VisualCNS",
        address: form.address.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        taxNumber: form.taxNumber.trim(),
        logoUrl: form.logoUrl.trim(),
      }
      await updateBusinessProfile(payload)
      setSaved(true)
    } catch (error) {
      console.error("Error saving business profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6 sm:px-6">
      <h1 className="text-xl font-semibold">Business profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The "Prepared by" details printed at the top of every invoice, estimate, and contract.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <ImageDropzone label="Logo" value={form.logoUrl} onChange={(url) => set("logoUrl", url)} />

        <div className="space-y-1.5">
          <Label htmlFor="name">Business name</Label>
          <Input id="name" value={form.name} onChange={(event) => set("name", event.target.value)} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            rows={2}
            value={form.address}
            onChange={(event) => set("address", event.target.value)}
            placeholder="Lagos, Nigeria"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => set("email", event.target.value)}
              placeholder="hello@visualcns.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={form.website}
              onChange={(event) => set("website", event.target.value)}
              placeholder="visualcns.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="taxNumber">Tax / registration number</Label>
          <Input
            id="taxNumber"
            value={form.taxNumber}
            onChange={(event) => set("taxNumber", event.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save
          </Button>
          {saved && <span className="text-xs text-muted-foreground">Saved</span>}
        </div>
      </form>
    </main>
  )
}
