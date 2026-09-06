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
import { createProject, updateProject, projectStatusMeta, type Project, type ProjectStatus } from "@/lib/projects"
import { getUsers, type AppUser } from "@/lib/users"

type FormState = {
  clientId: string
  title: string
  service: string
  status: ProjectStatus
  progress: string
  dueDate: string
}

const EMPTY_FORM: FormState = {
  clientId: "",
  title: "",
  service: "",
  status: "in-progress",
  progress: "0",
  dueDate: "",
}

interface ClientProjectFormProps {
  project?: Project | null
  initialClientId?: string
  onSaved: (id: string) => void
  onCancel: () => void
}

export function ClientProjectForm({ project, initialClientId, onSaved, onCancel }: ClientProjectFormProps) {
  const isEdit = Boolean(project)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [clients, setClients] = useState<AppUser[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)

  useEffect(() => {
    getUsers()
      .then((users) => setClients(users.filter((u) => u.role === "client" && u.clientId)))
      .catch((err) => console.error("Error loading clients:", err))
      .finally(() => setClientsLoading(false))
  }, [])

  useEffect(() => {
    if (project) {
      setForm({
        clientId: project.clientId ?? "",
        title: project.title ?? "",
        service: project.service ?? "",
        status: project.status ?? EMPTY_FORM.status,
        progress: String(project.progress ?? 0),
        dueDate: project.dueDate ?? "",
      })
    } else {
      setForm({ ...EMPTY_FORM, clientId: initialClientId ?? "" })
    }
    setError(null)
  }, [project, initialClientId])

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setError(null)

    if (!form.clientId) {
      setError("Pick which client this project belongs to.")
      return
    }
    if (!form.title.trim()) {
      setError("Project title is required.")
      return
    }

    const clientUser = clients.find((c) => c.clientId === form.clientId)
    const payload = {
      clientId: form.clientId,
      client: clientUser?.company || clientUser?.displayName || project?.client || form.clientId,
      title: form.title.trim(),
      service: form.service.trim(),
      status: form.status,
      progress: Math.min(100, Math.max(0, Number(form.progress) || 0)),
      dueDate: form.dueDate.trim(),
    }

    setSaving(true)
    try {
      if (isEdit && project) {
        await updateProject(project.id, payload)
        onSaved(project.id)
      } else {
        const id = await createProject(payload)
        onSaved(id)
      }
    } catch (err) {
      console.error("Error saving project:", err)
      setError(err instanceof Error ? err.message : "Failed to save project.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="clientId">Client</Label>
            <Select value={form.clientId} onValueChange={(v) => set("clientId", v)}>
              <SelectTrigger id="clientId" className="w-full">
                <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client"} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.uid} value={c.clientId as string}>
                    {c.company || c.displayName || c.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!clientsLoading && clients.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No client users with a clientId yet. Add one under Users first.
              </p>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="service">Service</Label>
              <Input
                id="service"
                value={form.service}
                onChange={(e) => set("service", e.target.value)}
                placeholder="e.g. Branding, Marketing"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(projectStatusMeta) as ProjectStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {projectStatusMeta[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => set("progress", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
            </div>
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
          {isEdit ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
