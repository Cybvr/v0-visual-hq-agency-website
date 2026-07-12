"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProjectsView } from "@/components/dashboard/projects-view"
import { TasksView } from "@/components/dashboard/tasks-view"
import { DocumentsView } from "@/components/dashboard/documents-view"
import { getProjectsByClientId, type Project } from "@/lib/projects"
import { deleteTask, getTasksByClientId, updateTask, type Task } from "@/lib/tasks"
import { getDocumentsForClient, type SharedDocument } from "@/lib/documents"

export function ClientSectionPage({ section }: { section: "projects" | "tasks" | "drive" }) {
  const { appUser } = useAuth()
  const clientId = appUser?.clientId ?? ""
  const clientName = appUser?.company || appUser?.displayName || ""
  const uid = appUser?.uid ?? ""
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [documents, setDocuments] = useState<SharedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!clientId) { setLoading(false); return }
    setError(false)
    try {
      const [projectList, taskList, documentList] = await Promise.all([
        getProjectsByClientId(clientId),
        getTasksByClientId(clientId),
        getDocumentsForClient(clientId, uid),
      ])
      setProjects(projectList)
      setTasks(taskList)
      setDocuments(documentList)
    } catch (error) {
      console.error(`Error loading ${section}:`, error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [clientId, section, uid])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleDelete(id: string) {
    setDeleting(id)
    try { await deleteTask(id); setTasks((current) => current.filter((task) => task.id !== id)) }
    finally { setDeleting(null) }
  }

  async function handlePatch(id: string, patch: Partial<Task>) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...patch } : task))
    try { await updateTask(id, patch) } catch { await fetchData() }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6">
      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        : error ? <p className="py-12 text-sm text-destructive">Couldn&apos;t load this section.</p>
        : section === "projects" ? <ProjectsView projects={projects} />
        : section === "tasks" ? <TasksView tasks={tasks} projects={projects} clientId={clientId} clientName={clientName} deleting={deleting} onDelete={handleDelete} onPatch={handlePatch} onSaved={fetchData} />
        : <DocumentsView documents={documents} />}
    </main>
  )
}
