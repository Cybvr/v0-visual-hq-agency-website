"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { ProjectShareButton } from "@/components/dashboard/project-share-button"
import { TasksView } from "@/components/dashboard/tasks-view"
import { Badge } from "@/components/ui/badge"
import { getProjectBySlug, projectStatusMeta, type Project } from "@/lib/projects"
import { deleteTask, formatTimestamp, getTasksByClientId, tsToMillis, updateTask, type Task } from "@/lib/tasks"
import { cn } from "@/lib/utils"

/** Goes back a step in history, falling back to the dashboard on a cold open. */
function BackLink() {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/dashboard"))}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back
    </button>
  )
}

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
        <BackLink />
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
      <section className="overflow-hidden rounded-lg bg-card">
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="pt-1">
              <BackLink />
            </div>
            <span className="mt-1.5 h-4 w-px shrink-0 bg-border" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold">{project.title}</h1>
              <Badge variant="secondary" className="mt-1.5 rounded-sm px-1.5 py-0">
                {project.service}
              </Badge>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", meta.className)}>{meta.label}</span>
            <ProjectShareButton project={project} stepCount={tasks.length} onChanged={fetchData} />
          </div>
        </div>
        <dl className="grid gap-4 border-t border-border/70 px-5 py-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Client</dt>
            <dd className="mt-1 font-medium">{project.client || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Last modified</dt>
            <dd className="mt-1 font-medium">{formatTimestamp(project.updatedAt)}</dd>
          </div>
        </dl>
      </section>

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
