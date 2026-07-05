"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { createUser, updateUser, type AppUser, type UserRole } from "@/lib/users"

type FormState = {
  uid: string
  email: string
  displayName: string
  company: string
  clientId: string
  photoURL: string
  role: UserRole
}

const EMPTY_FORM: FormState = {
  uid: "",
  email: "",
  displayName: "",
  company: "",
  clientId: "",
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

  useEffect(() => {
    if (user) {
      setForm({
        uid: user.uid,
        email: user.email ?? "",
        displayName: user.displayName ?? "",
        company: user.company ?? "",
        clientId: user.clientId ?? "",
        photoURL: user.photoURL ?? "",
        role: user.role === "admin" ? "admin" : "client",
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError(null)
  }, [user])

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setError(null)

    const uid = form.uid.trim()
    if (!uid) {
      setError("UID is required (must match the person's Firebase Auth uid).")
      return
    }

    setSaving(true)
    try {
      const payload = {
        email: form.email.trim(),
        displayName: form.displayName.trim(),
        company: form.company.trim(),
        // Default the workspace id to the uid when left blank, so the account
        // always resolves to a workspace (tasks/projects are scoped by clientId).
        clientId: form.clientId.trim() || uid,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="uid">Firebase Auth UID {isEdit && <span className="text-muted-foreground">(read-only)</span>}</Label>
            <Input
              id="uid"
              value={form.uid}
              onChange={(e) => set("uid", e.target.value)}
              placeholder="The person's Firebase Auth uid"
              disabled={isEdit}
              required
            />
            {!isEdit && (
              <p className="text-xs text-muted-foreground">
                Must match the uid Firebase assigns when they sign in with Google.
              </p>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
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
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Name</Label>
              <Input id="displayName" value={form.displayName} onChange={(e) => set("displayName", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select value={form.role} onValueChange={(v) => set("role", v)}>
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

          <div className="space-y-1.5">
            <Label htmlFor="clientId">Workspace ID (clientId)</Label>
            <Input
              id="clientId"
              value={form.clientId}
              onChange={(e) => set("clientId", e.target.value)}
              placeholder="Defaults to the user's UID"
            />
            <p className="text-xs text-muted-foreground">
              Scopes this user&apos;s tasks and projects. Leave blank to use their UID, or share one ID across users to
              give them a joint workspace.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="photoURL">Photo URL</Label>
            <Input id="photoURL" value={form.photoURL} onChange={(e) => set("photoURL", e.target.value)} placeholder="https://..." />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
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
