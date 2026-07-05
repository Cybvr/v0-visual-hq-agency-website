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
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react"
import { getProjects, deleteProject, projectStatusMeta, type Project } from "@/lib/projects"
import { ClientProjectForm } from "@/components/admin/client-project-form"
import { cn } from "@/lib/utils"

export default function ProjectsAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null)
  const initialClientId = searchParams.get("clientId") ?? ""

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setSelectedId("new")
    }
  }, [searchParams])

  function clearNewProjectQuery() {
    if (!searchParams.get("new") && !searchParams.get("clientId")) return
    router.replace("/admin/projects")
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
      if (selectedId === id) setSelectedId(null)
    } catch (err) {
      console.error("Error deleting project:", err)
    } finally {
      setDeleting(null)
    }
  }

  async function handleSaved() {
    await fetchProjects()
    setSelectedId(null)
    clearNewProjectQuery()
  }

  const selectedProject =
    typeof selectedId === "string" && selectedId !== "new" ? projects.find((p) => p.id === selectedId) ?? null : null

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Client projects, live from the Firestore <code className="rounded bg-muted px-1 py-0.5 text-xs">projects</code> collection.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => setSelectedId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
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
            <Button onClick={() => setSelectedId("new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add the first project
            </Button>
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
              {projects.map((p) => {
                const meta = projectStatusMeta[p.status] ?? projectStatusMeta["in-progress"]
                return (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => setSelectedId(p.id)}>
                    <TableCell className="font-medium">{p.title}</TableCell>
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
                          onClick={() => setSelectedId(p.id)}
                          aria-label="Edit project"
                        >
                          <Pencil className="h-3.5 w-3.5" />
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

      <Sheet
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null)
            clearNewProjectQuery()
          }
        }}
      >
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-lg">
          <SheetHeader className="border-b">
            <SheetTitle>{selectedId === "new" ? "New project" : "Edit project"}</SheetTitle>
            <SheetDescription>
              {selectedId === "new" ? "Create a project for a client." : selectedProject?.title ?? ""}
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            {selectedId !== null && (
              <ClientProjectForm
                key={selectedId}
                project={selectedId === "new" ? null : selectedProject}
                initialClientId={selectedId === "new" ? initialClientId : undefined}
                onSaved={handleSaved}
                onCancel={() => {
                  setSelectedId(null)
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
