"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { CaseStudyForm } from "@/components/dashboard/case-study-form"
import { ProjectShareButton } from "@/components/dashboard/project-share-button"
import { TasksView } from "@/components/dashboard/tasks-view"
import { ProjectCover } from "@/components/project-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value || "—"}</dd>
    </div>
  )
}

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug ?? ""
  const router = useRouter()
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
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
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
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
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

  const tasksPanel = (
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
  )

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <Card>
          <CardContent>
            <BackLink />

            <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <ProjectCover project={project} />
            </div>

            <div className="mt-3">
              <ProjectShareButton project={project} stepCount={tasks.length} onChanged={fetchData} />
            </div>

            <h1 className="mt-4 text-xl font-semibold">{project.title}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-sm px-1.5 py-0">
                {project.service}
              </Badge>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", meta.className)}>{meta.label}</span>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-4">
              <Fact label="Client" value={project.client} />
              <Fact label="Last modified" value={formatTimestamp(project.updatedAt)} />
            </div>
          </CardContent>
        </Card>

        {isAdmin ? (
          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="case-study">Case study</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="mt-4">
              {tasksPanel}
            </TabsContent>
            <TabsContent value="case-study" className="mt-4">
              <CaseStudyForm
                project={project}
                onSaved={(patch) => {
                  setProject((current) => (current ? { ...current, ...patch } : current))
                  // The page is addressed by slug, so a renamed case study
                  // moves the URL with it rather than leaving a stale address.
                  if (patch.slug && patch.slug !== slug) router.replace(`/dashboard/projects/${patch.slug}`)
                }}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div>{tasksPanel}</div>
        )}
      </div>
    </main>
  )
}
