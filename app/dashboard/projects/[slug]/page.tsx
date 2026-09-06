"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { TasksView } from "@/components/dashboard/tasks-view"
import { getProjectBySlug, projectStatusMeta, type Project } from "@/lib/projects"
import { deleteTask, getTasksByClientId, tsToMillis, updateTask, type Task } from "@/lib/tasks"
import { cn } from "@/lib/utils"

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug ?? ""
  const { user, appUser, isAdmin } = useAuth()
  const clientId = appUser?.clientId ?? ""
  const clientName = appUser?.company || appUser?.displayName || ""

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!slug) return
    setError(false)
    try {
      const found = await getProjectBySlug(slug)
      setProject(found)

      if (found) {
        // Tasks are fetched by client and narrowed here, reusing the same query
        // the rest of the dashboard already runs.
        const all = await getTasksByClientId(found.clientId)
        const mine = all.filter((task) => task.projectId === found.id)
        mine.sort((a, b) => tsToMillis(b.createdAt) - tsToMillis(a.createdAt))
        setTasks(mine)
      }
    } catch (err) {
      console.error("Error loading project:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteTask(id)
      setTasks((current) => current.filter((task) => task.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  async function handlePatch(id: string, patch: Partial<Task>) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)))
    try {
      await updateTask(id, patch)
    } catch {
      await fetchData()
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  // A client should only ever reach their own projects, even by typing a slug.
  const forbidden = project !== null && !isAdmin && project.clientId !== clientId

  if (error || !project || forbidden) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <p className="mt-8 text-sm text-muted-foreground">
          {error
            ? "Couldn't load this project right now. Please try again shortly."
            : "That project doesn't exist, or you don't have access to it."}
        </p>
      </main>
    )
  }

  const meta = projectStatusMeta[project.status]

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">{project.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{project.service}</p>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", meta.className)}>
          {meta.label}
        </span>
      </div>

      <div className="mt-6 rounded-[14px] border border-border/60 bg-card p-5">
        <div className="flex items-end justify-between gap-4 text-sm">
          <span className="font-medium">{project.progress}% complete</span>
          <span className="text-muted-foreground">Due {project.dueDate}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className="mt-8">
        <TasksView
          tasks={tasks}
          projects={[project]}
          clientId={project.clientId || clientId}
          clientName={project.client || clientName}
          deleting={deleting}
          onDelete={handleDelete}
          onPatch={handlePatch}
          onSaved={fetchData}
        />
      </div>
    </main>
  )
}
