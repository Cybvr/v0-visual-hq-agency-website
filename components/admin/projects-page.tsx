"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CheckCircle2, Database, Eye, Loader2, Plus, Trash2 } from "lucide-react"
import { getProjects, deleteProject, projectSlug, projectStatusMeta, type Project } from "@/lib/projects"
import { migratePortfolioToProjects, type PortfolioMigrationResult } from "@/lib/migrate-portfolio"
import { ClientProjectForm } from "@/components/admin/client-project-form"
import { FilterBar, useFilterBar, type SortOption } from "@/components/dashboard/filter-bar"
import { cn } from "@/lib/utils"

const PROJECT_SORTS: SortOption<Project>[] = [
  { value: "title", label: "Project", get: (p) => p.title, ascLabel: "A–Z", descLabel: "Z–A" },
  { value: "client", label: "Client", get: (p) => p.client || p.clientId, ascLabel: "A–Z", descLabel: "Z–A" },
  {
    value: "status",
    label: "Status",
    get: (p) => projectStatusMeta[p.status]?.label ?? p.status,
    ascLabel: "A–Z",
    descLabel: "Z–A",
  },
  { value: "progress", label: "Progress", get: (p) => p.progress, ascLabel: "Lowest", descLabel: "Highest" },
  { value: "dueDate", label: "Due date", get: (p) => p.dueDate, ascLabel: "Soonest", descLabel: "Latest" },
]

function searchProject(p: Project) {
  return [p.title, p.client, p.clientId, p.service, projectStatusMeta[p.status]?.label]
}

export default function ProjectsAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<PortfolioMigrationResult | null>(null)
  const [migrationError, setMigrationError] = useState<string | null>(null)
  const initialClientId = searchParams.get("clientId") ?? ""
  const { results: visibleProjects, bar } = useFilterBar({
    items: projects,
    search: searchProject,
    sorts: PROJECT_SORTS,
    defaultSort: "title",
  })

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setCreating(true)
    }
  }, [searchParams])

  function clearNewProjectQuery() {
    if (!searchParams.get("new") && !searchParams.get("clientId")) return
    router.replace("/dashboard/projects")
  }

  async function fetchProjects() {
    setError(null)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError(err instanceof Error ? err.message : "Failed to load projects.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting project:", err)
    } finally {
      setDeleting(null)
    }
  }

  async function handleSaved() {
    await fetchProjects()
    setCreating(false)
    clearNewProjectQuery()
  }

  async function handleMigration() {
    if (migrating) return
    setMigrating(true)
    setMigrationResult(null)
    setMigrationError(null)
    try {
      const result = await migratePortfolioToProjects()
      await fetchProjects()
      setMigrationResult(result)
    } catch (migrationFailure) {
      console.error("Error migrating case studies:", migrationFailure)
      setMigrationError(
        migrationFailure instanceof Error
          ? migrationFailure.message
          : "The migration failed. Nothing was removed; check your connection and try again.",
      )
    } finally {
      setMigrating(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={loading || migrating}>
                {migrating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                {migrating ? "Adding case studies…" : "Add case studies to Projects"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add all case studies to Projects?</AlertDialogTitle>
                <AlertDialogDescription>
                  Each existing case study will become a Project and will be marked as a case study during the move.
                  Missing client workspaces will also be created. Running this again updates the same Projects instead
                  of creating duplicates. Portfolio will stay untouched as a backup.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => void handleMigration()}>Add to Projects</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      <div aria-live="polite">
        {migrationResult && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0 text-sm">
              <p className="font-medium">Case studies added to Projects</p>
              <p className="mt-1 text-emerald-800 dark:text-emerald-200">
                {migrationResult.caseStudies} processed; {migrationResult.projectsCreated} projects and{" "}
                {migrationResult.usersCreated} client workspaces created, {migrationResult.projectsUpdated} existing
                projects updated.
              </p>
            </div>
          </div>
        )}
        {migrationError && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">Case studies could not be migrated</p>
            <p className="mt-1">{migrationError}</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="mb-4 text-muted-foreground">No projects yet.</p>
            <Button onClick={() => setCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add the first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
        <FilterBar {...bar} placeholder="Search projects" />
        {visibleProjects.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              No projects match your search.
            </CardContent>
          </Card>
        ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProjects.map((p) => {
                const meta = projectStatusMeta[p.status] ?? projectStatusMeta["in-progress"]
                return (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/dashboard/projects/${projectSlug(p)}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{p.title}</span>
                        {p.isCaseStudy && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-200">
                            Case study
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.client || p.clientId}</TableCell>
                    <TableCell className="text-muted-foreground">{p.service || "—"}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", meta.className)}>
                        {meta.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.progress}%</TableCell>
                    <TableCell className="text-muted-foreground">{p.dueDate || "—"}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => router.push(`/dashboard/projects/${projectSlug(p)}`)}
                          aria-label={`Open ${p.title}`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              aria-label="Delete project"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete project?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently deletes &quot;{p.title}&quot;. Tasks under it are not deleted
                                automatically. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(p.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleting === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        )}
        </>
      )}

      <Sheet
        open={creating}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false)
            clearNewProjectQuery()
          }
        }}
      >
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-lg">
          <SheetHeader className="border-b">
            <SheetTitle>New project</SheetTitle>
            <SheetDescription>Create a project for a client.</SheetDescription>
          </SheetHeader>
          <div className="p-4">
            {creating && (
              <ClientProjectForm
                key="new"
                project={null}
                initialClientId={initialClientId}
                onSaved={handleSaved}
                onCancel={() => {
                  setCreating(false)
                  clearNewProjectQuery()
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </main>
  )
}
