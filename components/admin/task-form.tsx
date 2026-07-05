"use client"

import type React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, Check, ChevronsUpDown, Plus } from "lucide-react"
import {
  createTask,
  updateTask,
  taskStatusMeta,
  taskPriorityMeta,
  type Task,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/tasks"
import { getProjects, getProjectsByClientId, createProject, type Project } from "@/lib/projects"
import { getUsers, type AppUser } from "@/lib/users"
import { cn } from "@/lib/utils"

type FormState = {
  name: string
  clientId: string
  projectId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  content: string
}

const EMPTY_FORM: FormState = {
  name: "",
  clientId: "",
  projectId: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  content: "",
}

function normalizeOptionLabel(value?: string | null) {
  return (value ?? "").trim().toLowerCase()
}

interface TaskFormProps {
  task?: Task | null
  /**
   * When set (client dashboard), the task is locked to this client: no client
   * picker, and only their projects load. Omit for the admin form.
   */
  fixedClient?: { clientId: string; clientName: string }
  /**
   * Seed values for a NEW task (ignored when editing). Lets a board column's
   * "+ New" open the form with that column's status preselected.
   */
  defaults?: { status?: TaskStatus }
  onSaved: (id: string) => void
  onCancel: () => void
}

export function TaskForm({ task, fixedClient, defaults, onSaved, onCancel }: TaskFormProps) {
  const isEdit = Boolean(task)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [clients, setClients] = useState<AppUser[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  
  const [projectOpen, setProjectOpen] = useState(false)
  const [projectQuery, setProjectQuery] = useState("")

  useEffect(() => {
    if (fixedClient) {
      // Client-scoped: reading all users is admin-only, so just load their projects.
      getProjectsByClientId(fixedClient.clientId)
        .then(setProjects)
        .catch((err) => console.error("Error loading form options:", err))
        .finally(() => setOptionsLoading(false))
      return
    }
    Promise.all([getUsers(), getProjects()])
      .then(([users, allProjects]) => {
        setClients(users.filter((u) => u.clientId))
        setProjects(allProjects)
      })
      .catch((err) => console.error("Error loading form options:", err))
      .finally(() => setOptionsLoading(false))
    // Depend on the id, not the object, so a new object literal each render doesn't refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedClient?.clientId])

  useEffect(() => {
    if (task) {
      setForm({
        name: task.name ?? "",
        clientId: task.clientId ?? fixedClient?.clientId ?? "",
        projectId: task.projectId ?? "",
        status: task.status ?? EMPTY_FORM.status,
        priority: task.priority ?? EMPTY_FORM.priority,
        dueDate: task.dueDate ?? "",
        content: task.content ?? "",
      })
    } else {
      setForm({
        ...EMPTY_FORM,
        clientId: fixedClient?.clientId ?? "",
        status: defaults?.status ?? EMPTY_FORM.status,
      })
    }
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, fixedClient?.clientId, defaults?.status])

  useEffect(() => {
    if (!task || optionsLoading) return

    setForm((prev) => {
      if (prev.clientId && prev.projectId) return prev

      let nextClientId = prev.clientId
      let nextProjectId = prev.projectId

      if (!nextProjectId && task.project) {
        const matchingProjects = projects.filter((project) => {
          if (nextClientId && project.clientId !== nextClientId) return false
          return normalizeOptionLabel(project.title) === normalizeOptionLabel(task.project)
        })
        const matchedProject = matchingProjects[0]
        if (matchedProject) {
          nextProjectId = matchedProject.id
          if (!nextClientId) nextClientId = matchedProject.clientId
        }
      }

      if (!nextClientId) {
        const matchedClient = clients.find((client) =>
          [client.company, client.displayName, client.email, client.clientId].some(
            (value) => normalizeOptionLabel(String(value ?? "")) === normalizeOptionLabel(task.client),
          ),
        )
        if (matchedClient?.clientId) nextClientId = matchedClient.clientId
      }

      if (nextClientId === prev.clientId && nextProjectId === prev.projectId) return prev
      return {
        ...prev,
        clientId: nextClientId,
        projectId: nextProjectId,
      }
    })
  }, [clients, optionsLoading, projects, task])

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const clientOptions = Array.from(
    new Map(
      clients.map((u) => [
        u.clientId as string,
        {
          clientId: u.clientId as string,
          label: u.company || u.displayName || u.email || (u.clientId as string),
        },
      ]),
    ).values(),
  )

  const selectedClientFallback =
    form.clientId && !clientOptions.some((option) => option.clientId === form.clientId)
      ? {
          clientId: form.clientId,
          label: task?.client || form.clientId,
        }
      : null

  const visibleClientOptions = selectedClientFallback ? [selectedClientFallback, ...clientOptions] : clientOptions

  // Only offer projects that belong to the chosen client.
  const clientProjects = projects.filter((p) => !form.clientId || p.clientId === form.clientId)

  async function handleCreateProject() {
    if (!form.clientId || !projectQuery.trim()) return
    setSaving(true)
    try {
      const title = projectQuery.trim()
      const clientUser = clients.find((c) => c.clientId === form.clientId)
      const clientName = fixedClient?.clientName || clientUser?.company || clientUser?.displayName || form.clientId
      const newProjectId = await createProject({
        clientId: form.clientId,
        client: clientName,
        title: title,
        service: "General",
        status: "in-progress",
        progress: 0,
        dueDate: "",
      })

      const newProject: Project = {
        id: newProjectId,
        clientId: form.clientId,
        client: clientName,
        title,
        service: "General",
        status: "in-progress",
        progress: 0,
        dueDate: "",
      }
      setProjects((prev) => [...prev, newProject])
      set("projectId", newProjectId)
      setProjectOpen(false)
      setProjectQuery("")
    } catch (err) {
      console.error("Failed to create project", err)
      setError("Failed to create project.")
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setError(null)

    if (!form.name.trim()) {
      setError("Task name is required.")
      return
    }
    if (!form.clientId) {
      setError("Pick a client.")
      return
    }
    if (!form.projectId) {
      setError("Pick a project.")
      return
    }

    const clientUser = clients.find((c) => c.clientId === form.clientId)
    const project = projects.find((p) => p.id === form.projectId)
    const payload = {
      name: form.name.trim(),
      clientId: form.clientId,
      client:
        fixedClient?.clientName || clientUser?.company || clientUser?.displayName || task?.client || form.clientId,
      projectId: form.projectId,
      project: project?.title || task?.project || "",
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate.trim(),
      content: form.content,
    }

    setSaving(true)
    try {
      if (isEdit && task) {
        await updateTask(task.id, payload)
        onSaved(task.id)
      } else {
        const id = await createTask(payload)
        onSaved(id)
      }
    } catch (err) {
      console.error("Error saving task:", err)
      setError(err instanceof Error ? err.message : "Failed to save task.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Task name</Label>
          <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>

        <div className={fixedClient ? "grid gap-3" : "grid gap-3 md:grid-cols-2"}>
          {!fixedClient && (
          <div className="space-y-1.5">
            <Label htmlFor="clientId">Client</Label>
            <Select
              value={form.clientId || undefined}
              onValueChange={(v) => {
                setForm((prev) => ({
                  ...prev,
                  clientId: v,
                  // Clear the project if it belongs to a different client.
                  projectId: projects.find((p) => p.id === prev.projectId)?.clientId === v ? prev.projectId : "",
                }))
              }}
            >
              <SelectTrigger id="clientId" className="w-full">
                <SelectValue placeholder={optionsLoading ? "Loading..." : "Select a client"} />
              </SelectTrigger>
              <SelectContent>
                {visibleClientOptions.map((c) => (
                  <SelectItem key={c.clientId} value={c.clientId}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          )}
          <div className="space-y-1.5 flex flex-col">
            <Label htmlFor="projectId" className="mb-1">Project</Label>
            <Popover open={projectOpen} onOpenChange={setProjectOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="projectId"
                  variant="outline"
                  role="combobox"
                  aria-expanded={projectOpen}
                  className="w-full justify-between px-3 font-normal"
                  disabled={!form.clientId || optionsLoading}
                >
                  <span className="truncate">
                    {(() => {
                      const selected = clientProjects.find((p) => p.id === form.projectId)
                      if (selected) return selected.title
                      if (optionsLoading) return "Loading..."
                      if (form.projectId) return task?.project || "Unknown project"
                      if (form.clientId) return "Select a project"
                      return "Pick a client first"
                    })()}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[300px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search projects..." 
                    value={projectQuery} 
                    onValueChange={setProjectQuery} 
                  />
                  <CommandList>
                    <CommandEmpty>
                      <div className="flex flex-col items-center gap-3 p-4 text-center text-sm">
                        <p className="text-muted-foreground">No project found.</p>
                        {projectQuery && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.preventDefault()
                              handleCreateProject()
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create "{projectQuery}"
                          </Button>
                        )}
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {clientProjects.map((project) => (
                        <CommandItem
                          key={project.id}
                          value={project.title}
                          onSelect={(currentValue) => {
                            const p = clientProjects.find((x) => x.title.toLowerCase() === currentValue.toLowerCase())
                            if (p) set("projectId", p.id)
                            setProjectOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.projectId === project.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {project.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select value={form.status || undefined} onValueChange={(v) => set("status", v as TaskStatus)}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(taskStatusMeta) as TaskStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {taskStatusMeta[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="priority">Priority</Label>
            <Select value={form.priority || undefined} onValueChange={(v) => set("priority", v as TaskPriority)}>
              <SelectTrigger id="priority" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(taskPriorityMeta) as TaskPriority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {taskPriorityMeta[p].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Due date</Label>
            <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder="Notes, links, details of the work..."
            rows={8}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}
