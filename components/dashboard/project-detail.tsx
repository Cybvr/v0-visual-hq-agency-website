"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, Pencil } from "lucide-react"

import { CaseStudyForm } from "@/components/dashboard/case-study-form"
import { CaseStudyOverview } from "@/components/dashboard/case-study-overview"
import { ContextualEmailButton } from "@/components/dashboard/contextual-email-button"
import { ProjectShareButton } from "@/components/dashboard/project-share-button"
import { TasksView } from "@/components/dashboard/tasks-view"
import { ProjectCover } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { deleteProjectWithTasks, projectStatusMeta, type Project } from "@/lib/projects"
import { deleteTask, getTasksByCompanyId, tsToMillis, updateTask, type Task } from "@/lib/tasks"
import { cn } from "@/lib/utils"
import { portalPath } from "@/lib/portal-model"

interface ProjectDetailProps {
  project: Project
  isAdmin: boolean
  publicView?: boolean
  companyId?: string
  clientName?: string
  backLabel?: string
  onBack: () => void
  onProjectPatched?: (patch: Partial<Project>) => void
  onProjectDeleted?: () => void | Promise<void>
}

/**
 * The full single-project workspace: cover, share/view actions, and the
 * Overview/Tasks tabs for admins. Shared by the standalone
 * /dashboard/projects/[slug] page and the company page's inline project view,
 * so task fetching and mutation lives here once instead of in both places.
 */
export function ProjectDetail({
  project,
  isAdmin,
  publicView = false,
  companyId = "",
  clientName = "",
  backLabel = "Back",
  onBack,
  onProjectPatched,
  onProjectDeleted,
}: ProjectDetailProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)
  const [tab, setTab] = useState<"overview" | "tasks">("overview")
  const [editing, setEditing] = useState(false)

  const fetchTasks = useCallback(async () => {
    if (publicView) {
      setTasks([])
      return
    }
    // Tasks are fetched by client and narrowed here, reusing the same query
    // the rest of the dashboard already runs.
    const all = await getTasksByCompanyId(project.companyId)
    const mine = all.filter((task) => task.projectId === project.id)
    mine.sort((a, b) => tsToMillis(b.createdAt) - tsToMillis(a.createdAt))
    setTasks(mine)
  }, [project.companyId, project.id, publicView])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

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
      await fetchTasks()
    }
  }

  async function handleDeleteProject() {
    if (!onProjectDeleted) return
    await deleteProjectWithTasks(project.id)
    await onProjectDeleted()
  }

  const meta = projectStatusMeta[project.status]

  const tasksPanel = (
    <TasksView
      tasks={tasks}
      projects={[project]}
      companyId={project.companyId || companyId}
      clientName={project.client || clientName}
      deleting={deleting}
      onDelete={handleDelete}
      onPatch={handlePatch}
      onSaved={fetchTasks}
    />
  )

  const category = project.category ?? []
  // "Back to Projects" -> "Projects", so the crumb reads "Projects / Title"
  // instead of repeating the word "Back".
  const crumb = backLabel.replace(/^Back(\s+to)?\s*/i, "").trim()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label={backLabel}
            title={backLabel}
            className="inline-flex items-center justify-center text-muted-foreground outline-none transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <span className="text-xs text-muted-foreground">
            {crumb && `${crumb} / `}
            {project.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && tab === "overview" && (
            <Button
              type="button"
              size="icon"
              variant={editing ? "outline" : "default"}
              onClick={() => setEditing((current) => !current)}
              aria-label={editing ? "Cancel editing" : "Edit project"}
              title={editing ? "Cancel editing" : "Edit project"}
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          )}
          {isAdmin && (
            <ContextualEmailButton
              label="Send project update"
              context={{
                companyId: project.companyId || companyId,
                companyName: project.client || clientName,
                projectId: project.id,
                projectName: project.title,
                documentType: "project",
                documentId: project.id,
                subject: `${project.title} update`,
                ctaText: "Open project workspace",
                ctaUrl: `${portalPath(project.companyId || companyId)}/projects/${encodeURIComponent(project.slug || project.id)}`,
              }}
            />
          )}
          {!publicView && <ProjectShareButton project={project} stepCount={tasks.length} onChanged={fetchTasks} />}
        </div>
      </div>

      {isAdmin || publicView ? (
        <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
          <nav className="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
            {(
              publicView
                ? ([{ key: "overview", label: "Overview" }] as const)
                : ([
                    { key: "overview", label: "Overview" },
                    { key: "tasks", label: "Tasks" },
                  ] as const)
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  "shrink-0 rounded-md px-3 py-2 text-left text-sm font-medium outline-none transition-colors",
                  tab === item.key
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0">
            {tab === "overview" ? (
              editing && isAdmin ? (
                <CaseStudyForm
                  project={project}
                  onSaved={(patch) => {
                    onProjectPatched?.(patch)
                    setEditing(false)
                  }}
                  onDelete={handleDeleteProject}
                />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-lg">
                      <ProjectCover project={project} />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold">{project.title}</h1>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {category.length > 0 && (
                          <span className="text-sm text-muted-foreground">{category.join(", ")}</span>
                        )}
                        {!publicView && (
                          <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", meta.className)}>
                            {meta.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <CaseStudyOverview project={project} />
                </div>
              )
            ) : (
              tasksPanel
            )}
          </div>
        </div>
      ) : (
        <div className="min-w-0">{tasksPanel}</div>
      )}
    </div>
  )
}
