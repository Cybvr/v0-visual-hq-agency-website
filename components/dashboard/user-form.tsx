"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
import { Camera, Loader2, User as UserIcon } from "lucide-react"
import { createOrganization, getOrganizations, type Organization } from "@/lib/organizations"
import { createUser, updateUser, type AppUser, type UserRole } from "@/lib/users"

type FormState = {
  email: string
  displayName: string
  company: string
  companyId: string
  photoURL: string
  role: UserRole
}

/** Sentinel companyId meaning "the user is typing a brand-new company name". */
const NEW_COMPANY = "__new__"

const EMPTY_FORM: FormState = {
  email: "",
  displayName: "",
  company: "",
  companyId: "",
  photoURL: "",
  role: "client",
}

interface UserFormProps {
  user?: AppUser | null
  fixedRole?: UserRole
  subjectNoun?: "user" | "client" | "company" | "contact"
  /**
   * Set when creating a person for a company that already exists: the new
   * user joins this workspace instead of getting one of its own, and no new
   * organization doc is created.
   */
  workspaceId?: string
  workspaceName?: string
  onSaved: (uid: string) => void
  onCancel: () => void
}

export function UserForm({ user, fixedRole, subjectNoun = "user", workspaceId, workspaceName, onSaved, onCancel }: UserFormProps) {
  const isEdit = Boolean(user)
  const joiningExisting = Boolean(workspaceId) && !isEdit
  const subjectLabel = subjectNoun === "company" ? "Company" : subjectNoun === "client" ? "Client" : subjectNoun === "contact" ? "Contact" : "User"
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingPhoto, setEditingPhoto] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [newCompanyName, setNewCompanyName] = useState("")

  // A person joining a fixed workspace, or a company record itself, doesn't
  // pick a company; everyone else (user/client/contact) chooses an existing one.
  const pickCompany = !joiningExisting && subjectNoun !== "company"

  useEffect(() => {
    if (!pickCompany) return
    let active = true
    getOrganizations()
      .then((orgs) => { if (active) setOrganizations(orgs) })
      .catch(() => { if (active) setOrganizations([]) })
    return () => { active = false }
  }, [pickCompany])

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email ?? "",
        displayName: user.displayName ?? "",
        company: user.company ?? "",
        companyId: user.companyId ?? "",
        photoURL: user.photoURL ?? "",
        role: fixedRole ?? (user.role === "admin" ? "admin" : "client"),
      })
    } else {
      setForm({ ...EMPTY_FORM, role: fixedRole ?? EMPTY_FORM.role })
    }
    setEditingPhoto(false)
    setNewCompanyName("")
    setError(null)
  }, [user, fixedRole])

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setError(null)
    setSaving(true)
    try {
      // No manual UID needed: reuse the existing doc id on edit, or mint one on
      // create. The workspace (companyId) defaults to the uid so every account
      // gets its own space automatically, unless it's joining one that
      // already exists.
      const uid = isEdit && user ? user.uid : crypto.randomUUID()
      const chosenCompanyId = form.companyId.trim()
      // Resolve the workspace this person belongs to, and whether to seed a
      // company. Only naming a brand-new company creates an organization;
      // a contact never does - it just links to a company or stands alone.
      let companyId: string
      let createOrg = false
      // Set when the person is linked to a brand-new company they just named,
      // so we seed that company's organization doc after saving the person.
      let newCompany = ""
      if (subjectNoun === "company") {
        companyId = (isEdit && user?.companyId) || uid
        createOrg = !isEdit
      } else if (joiningExisting) {
        companyId = workspaceId as string
      } else if (chosenCompanyId === NEW_COMPANY) {
        // user/client/contact naming a new company: mint an org id and seed it.
        newCompany = newCompanyName.trim()
        if (!newCompany) {
          setError("Enter a name for the new company.")
          setSaving(false)
          return
        }
        companyId = crypto.randomUUID()
        createOrg = true
      } else {
        // user/client/contact: the chosen company, or empty for a standalone contact
        companyId = chosenCompanyId
      }
      const payload = {
        email: form.email.trim(),
        displayName: form.displayName.trim(),
        // A person linked to a company doesn't carry its name themselves;
        // that lives on the organization doc.
        company: subjectNoun === "company" ? form.company.trim() : "",
        companyId,
        photoURL: form.photoURL.trim(),
        role: fixedRole ?? form.role,
      }
      if (createOrg) {
        // Seed the organization doc so the company shows up right away, without
        // needing the companies-page migration button. Covers both a brand-new
        // workspace and a contact linked to a company they just named.
        await createOrganization(companyId, {
          name: newCompany || payload.company || payload.displayName || payload.email || "Unnamed company",
          logoUrl: subjectNoun === "company" ? payload.photoURL : "",
          industry: "",
        })
      }
      if (isEdit && user) {
        // Spread the original doc first so any fields we don't edit are preserved.
        const { uid: _uid, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = user
        await updateUser(user.uid, { ...rest, ...payload })
        onSaved(user.uid)
      } else {
        await createUser(uid, payload)
        onSaved(uid)
      }
    } catch (err) {
      console.error("Error saving user:", err)
      setError(err instanceof Error ? err.message : `Failed to save ${subjectNoun}.`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setEditingPhoto((v) => !v)}
            className="group relative size-20 overflow-hidden rounded-full border border-border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Change picture"
          >
            {form.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <UserIcon className="h-8 w-8 text-muted-foreground" />
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => setEditingPhoto((v) => !v)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Change picture
          </button>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="displayName">Name</Label>
          <Input
            id="displayName"
            value={form.displayName}
            onChange={(e) => set("displayName", e.target.value)}
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="jane@company.com"
            required
          />
        </div>

        {editingPhoto && (
          <div className="space-y-1.5">
            <Label htmlFor="photoURL">Picture URL</Label>
            <Input
              id="photoURL"
              value={form.photoURL}
              onChange={(e) => set("photoURL", e.target.value)}
              placeholder="https://..."
            />
          </div>
        )}

        {joiningExisting ? (
          <p className="text-sm text-muted-foreground">
            Joining <span className="font-medium text-foreground">{workspaceName || "this company"}</span>&apos;s
            workspace.
          </p>
        ) : (
          <div className="space-y-4">
            {!fixedRole && (
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select value={form.role} onValueChange={(v) => set("role", v as UserRole)}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {subjectNoun === "company" ? (
              <div className="space-y-1.5">
                <Label htmlFor="company">Company name</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Select value={form.companyId || "none"} onValueChange={(v) => set("companyId", v === "none" ? "" : v)}>
                  <SelectTrigger id="company" className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No company</SelectItem>
                    {[...organizations].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" })).map((org) => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                    <SelectItem value={NEW_COMPANY}>+ Add new company</SelectItem>
                  </SelectContent>
                </Select>
                {form.companyId === NEW_COMPANY && (
                  <Input
                    autoFocus
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="New company name"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t border-border p-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : joiningExisting ? "Add Person" : `Create ${subjectLabel}`}
        </Button>
      </div>
    </form>
  )
}
