"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"

import { useCompany } from "@/components/dashboard/company-context"
import { ImageDropzone } from "@/components/image-dropzone"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateOrganization } from "@/lib/organizations"
import { deleteUser, updateUser, userRef } from "@/lib/users"

export default function CompanyEditPage() {
  const router = useRouter()
  const { client, organization, workspaceId, reload } = useCompany()

  const [form, setForm] = useState({
    name: organization?.name || client.company || "",
    logoUrl: organization?.logoUrl || client.photoURL || "",
    industry: organization?.industry ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function set<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setSaveError(null)
    try {
      await Promise.all([
        updateOrganization(workspaceId, {
          name: form.name.trim() || "Unnamed company",
          logoUrl: form.logoUrl.trim(),
          industry: form.industry.trim(),
        }),
        // Kept in step so the fallback name (used before an org doc existed)
        // doesn't go stale.
        updateUser(client.uid, { company: form.name.trim() }),
      ])
      await reload()
      router.push(`/dashboard/companies/${userRef(client)}`)
    } catch (error) {
      console.error("Error saving company:", error)
      setSaveError(error instanceof Error ? error.message : "The company could not be saved.")
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)
    try {
      await deleteUser(client.uid)
      router.push("/dashboard/companies")
    } catch (deleteError) {
      console.error("Error deleting company:", deleteError)
      setSaveError(deleteError instanceof Error ? deleteError.message : "The company could not be removed.")
      setDeleting(false)
      setPendingDelete(false)
    }
  }

  const displayName = form.name || "this company"

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md space-y-8">
        <div className="space-y-5 px-1">
          <ImageDropzone label="Logo" value={form.logoUrl} onChange={(url) => set("logoUrl", url)} />
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(event) => set("name", event.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={form.industry}
              onChange={(event) => set("industry", event.target.value)}
              placeholder="Agriculture, Fintech…"
            />
          </div>
        </div>

        {saveError && <p className="px-1 text-sm text-destructive">{saveError}</p>}

        <div className="flex items-center justify-end gap-2 px-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/companies/${userRef(client)}`)}
            disabled={saving || deleting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving || deleting}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setPendingDelete(true)}
            disabled={saving || deleting}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </form>

      <AlertDialog open={pendingDelete} onOpenChange={(open) => !open && !deleting && setPendingDelete(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove company?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {displayName}&apos;s account. Their projects, tasks, and documents will remain in the
              database, but the company will no longer appear here. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault()
                void handleDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Removing…" : "Remove Company"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
