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
import { Plus, Pencil, Trash2, ExternalLink, Loader2, ArrowLeft } from "lucide-react"
import { getPortfolioProjects, deletePortfolioProject, type PortfolioProject } from "@/lib/portfolio"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

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
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-12">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold text-xl truncate">Portfolio Admin</h1>
          </div>
          <Button asChild className="shrink-0">
            <Link href="/admin/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No projects yet.</p>
              <Button asChild>
                <Link href="/admin/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0">
                    {/* Thumbnail */}
                    <div className="w-full h-28 sm:w-20 sm:h-14 bg-muted overflow-hidden shrink-0">
                      <img
                        src={project.imageUrl || "/placeholder.svg?height=56&width=80&query=project"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-medium">{project.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{project.category?.join(", ")}</p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 px-4 pb-3 sm:px-3 sm:pb-0 sm:pr-3 shrink-0">
                      {project.projectUrl && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/${project.id}`}>
                          <Pencil className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
