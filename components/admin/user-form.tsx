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
import { createUser, updateUser, type AppUser, type UserRole } from "@/lib/users"

type FormState = {
  email: string
  displayName: string
  company: string
  photoURL: string
  role: UserRole
}

const EMPTY_FORM: FormState = {
  email: "",
  displayName: "",
  company: "",
  photoURL: "",
  role: "client",
}

interface UserFormProps {
  user?: AppUser | null
  onSaved: (uid: string) => void
  onCancel: () => void
}

export function UserForm({ user, onSaved, onCancel }: UserFormProps) {
  const isEdit = Boolean(user)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingPhoto, setEditingPhoto] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email ?? "",
        displayName: user.displayName ?? "",
        company: user.company ?? "",
        photoURL: user.photoURL ?? "",
        role: user.role === "admin" ? "admin" : "client",
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setEditingPhoto(false)
    setError(null)
  }, [user])

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
      // create. The workspace (clientId) defaults to the uid so every account
      // gets its own space automatically.
      const uid = isEdit && user ? user.uid : crypto.randomUUID()
      const payload = {
        email: form.email.trim(),
        displayName: form.displayName.trim(),
        company: form.company.trim(),
        clientId: (isEdit && user?.clientId) || uid,
        photoURL: form.photoURL.trim(),
        role: form.role,
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
      setError(err instanceof Error ? err.message : "Failed to save user.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        {/* Avatar beside the name / email fields */}
        <div className="flex items-start gap-4">
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => setEditingPhoto((v) => !v)}
              className="group relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted"
              aria-label="Change picture"
            >
              {form.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="flex h-full w-full items-center justify-center">
                  <UserIcon className="h-6 w-6 text-muted-foreground" />
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setEditingPhoto((v) => !v)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Change picture
            </button>
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Name</Label>
              <Input id="displayName" value={form.displayName} onChange={(e) => set("displayName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </div>
          </div>
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

        <div className="grid gap-3 sm:grid-cols-2">
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
          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              placeholder="For client accounts"
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t border-border p-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Create User"}
        </Button>
      </div>
    </form>
  )
}
