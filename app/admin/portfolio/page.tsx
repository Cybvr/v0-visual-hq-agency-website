"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { Plus, Trash2, FileText, Loader2, ArrowLeft } from "lucide-react"
import { getPortfolioProjects, deletePortfolioProject, type PortfolioProject } from "@/lib/portfolio"
import { ProjectForm } from "@/components/admin/project-form"
import { cn } from "@/lib/utils"

export default function AdminPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null)

  async function fetchProjects() {
    try {
      const data = await getPortfolioProjects()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
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
      await deletePortfolioProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (selectedId === id) setSelectedId(null)
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setDeleting(null)
    }
  }

  async function handleSaved(id: string) {
    await fetchProjects()
    setSelectedId(id)
  }

  const selectedProject = typeof selectedId === "string" && selectedId !== "new" ? projects.find((p) => p.id === selectedId) ?? null : null

  const allCategories = Array.from(new Set(projects.flatMap((p) => p.category || []))).sort()

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold text-xl truncate">Portfolio Admin</h1>
          </div>
          <Button className="shrink-0" onClick={() => setSelectedId("new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr] items-start">
          {/* List */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground mb-4">No projects yet.</p>
                  <Button onClick={() => setSelectedId("new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="divide-y">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "flex items-center gap-2 py-2.5 cursor-pointer group",
                      selectedId === project.id && "text-primary",
                    )}
                    onClick={() => setSelectedId(project.id)}
                  >
                    <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 min-w-0 truncate text-sm">{project.title}</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete project?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{project.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(project.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleting === project.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit / Create panel */}
          <div>
            {selectedId === null ? (
              <Card>
                <CardContent className="py-20 text-center text-muted-foreground">
                  Select a project to edit, or add a new one.
                </CardContent>
              </Card>
            ) : (
              <>
                <h2 className="font-semibold text-lg mb-4">
                  {selectedId === "new" ? "New Project" : `Edit: ${selectedProject?.title ?? ""}`}
                </h2>
                <ProjectForm
                  key={selectedId}
                  project={selectedId === "new" ? null : selectedProject}
                  existingCategories={allCategories}
                  onSaved={handleSaved}
                  onCancel={() => setSelectedId(null)}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
