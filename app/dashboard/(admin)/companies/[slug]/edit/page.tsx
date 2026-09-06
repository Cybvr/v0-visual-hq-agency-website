"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"

import { ClientHeader } from "@/components/dashboard/client-header"
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
import { getOrganization, updateOrganization, type Organization } from "@/lib/organizations"
import { deleteUser, getUserByRef, uniqueUserSlug, updateUser, userRef, type AppUser } from "@/lib/users"

type FormState = {
  // Company (organization)
  name: string
  logoUrl: string
  industry: string
  // Contact (user)
  displayName: string
  email: string
  slug: string
}

function formFrom(client: AppUser, org: Organization | null): FormState {
  return {
    name: org?.name || client.company || "",
    logoUrl: org?.logoUrl || client.photoURL || "",
    industry: org?.industry ?? "",
    displayName: client.displayName ?? "",
    email: client.email ?? "",
    slug: client.slug ?? "",
  }
}

export default function ClientEditRoute() {
  const params = useParams<{ slug: string }>()
  const ref = params?.slug ?? ""
  const router = useRouter()

  const [client, setClient] = useState<AppUser | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [form, setForm] = useState<FormState | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [pendingDelete, setPendingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    if (!ref) return
    setLoadError(null)
    try {
      const found = await getUserByRef(ref)
      if (!found) {
        setLoadError("That company doesn't exist, or it has been removed.")
        return
      }
      const workspace = found.clientId || found.uid
      const org = await getOrganization(workspace)
      setClient(found)
      setOrganization(org)
      setForm(formFrom(found, org))
    } catch (error) {
      console.error("Error loading client:", error)
      setLoadError(error instanceof Error ? error.message : "This company could not be loaded.")
    } finally {
      setLoading(false)
    }
  }, [ref])

  useEffect(() => {
    void load()
  }, [load])

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => (current ? { ...current, [field]: value } : current))
  }

  function close(at: string) {
    router.push(`/dashboard/companies/${at}`)
  }

  async function handleDelete() {
    if (!client || deleting) return
    setDeleting(true)
    try {
      await deleteUser(client.uid)
      router.push("/dashboard/companies")
    } catch (deleteError) {
      console.error("Error deleting client:", deleteError)
      setSaveError(deleteError instanceof Error ? deleteError.message : "The company could not be removed.")
      setDeleting(false)
      setPendingDelete(false)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!client || !form || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      const workspace = client.clientId || client.uid
      // A blank address falls back to the company name or the contact's own
      // name, and either way it is checked against the other accounts so two
      // clients never share a URL.
      const preferred = form.slug.trim() || form.name.trim() || form.displayName.trim() || form.email
      const slug = await uniqueUserSlug(preferred, client.uid)

      const userPayload = {
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        // Kept in step with the organization's name so anything still reading
        // it off the user doc doesn't go stale.
        company: form.name.trim(),
        slug,
        clientId: workspace,
      }
      const orgPayload = {
        name: form.name.trim() || "Unnamed company",
        logoUrl: form.logoUrl.trim(),
        industry: form.industry.trim(),
      }

      // Spread the stored doc first so fields this page does not edit survive.
      const { uid: _uid, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = client
      await Promise.all([
        updateUser(client.uid, { ...rest, ...userPayload }),
        updateOrganization(workspace, orgPayload),
      ])
      close(slug)
    } catch (error) {
      console.error("Error saving client:", error)
      setSaveError(error instanceof Error ? error.message : "The company could not be saved.")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  if (loadError || !client || !form) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm text-muted-foreground">{loadError ?? "This company could not be loaded."}</p>
      </main>
    )
  }

  const clientDisplayName = form.name || client.displayName || client.email || "this company"

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6">
      <ClientHeader
        client={client}
        orgName={form.name}
        orgLogoUrl={form.logoUrl}
        subtitle="Edit company and contact details"
        backHref={`/dashboard/companies/${userRef(client)}`}
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        <div>
          <h2 className="px-1 text-sm font-semibold">Company</h2>
          <div className="mt-3 grid gap-5 px-1 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
            <ImageDropzone label="Logo" value={form.logoUrl} onChange={(url) => set("logoUrl", url)} />
            <div className="grid gap-5 sm:grid-cols-2">
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
          </div>
        </div>

        <div>
          <h2 className="px-1 text-sm font-semibold">Contact</h2>
          <div className="mt-3 grid gap-5 px-1 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Contact name</Label>
              <Input
                id="displayName"
                value={form.displayName}
                onChange={(event) => set("displayName", event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(event) => set("email", event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Dashboard address</Label>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-muted-foreground">/dashboard/</span>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(event) => set("slug", event.target.value)}
                  placeholder="ada-obi"
                />
              </div>
            </div>
          </div>
        </div>

        {saveError && <p className="px-1 text-sm text-destructive">{saveError}</p>}

        <div className="flex items-center justify-end gap-2 px-1">
          <Button type="button" variant="outline" onClick={() => close(userRef(client))} disabled={saving || deleting}>
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
              This removes {clientDisplayName}&apos;s account. Their projects, tasks, and documents will remain in the
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
    </main>
  )
}
