"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ClientProjectCreateSheet } from "@/components/dashboard/client-project-create-sheet"
import { ProjectsView } from "@/components/dashboard/projects-view"
import { TemplatesView } from "@/components/dashboard/templates-view"
import { TasksView } from "@/components/dashboard/tasks-view"
import { DocumentsView } from "@/components/dashboard/documents-view"
import { getProjectsByClientId, type Project } from "@/lib/projects"
import { deleteTask, getTasksByClientId, updateTask, type Task } from "@/lib/tasks"
import { contractsAsDocuments, getDocumentsForClient, type SharedDocument } from "@/lib/documents"
import { getContractsByClientId } from "@/lib/billing"

export function ClientSectionPage({ section }: { section: "projects" | "tasks" | "drive" }) {
  const { appUser } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
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

  const creatingProject = section === "projects" && searchParams.get("new") === "1"

  async function handleProjectCreated() {
    await fetchData()
    router.replace("/dashboard/projects")
  }

  return (
    <>
      <main className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6">
        {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          : error ? <p className="py-12 text-sm text-destructive">Couldn&apos;t load this section.</p>
          : section === "projects" ? (
            <>
              <ProjectsView projects={projects} onChanged={fetchData} />
              <TemplatesView clientId={clientId} clientName={clientName} onCreated={fetchData} />
            </>
          )
          : section === "tasks" ? <TasksView tasks={tasks} projects={projects} clientId={clientId} clientName={clientName} deleting={deleting} onDelete={handleDelete} onPatch={handlePatch} onSaved={fetchData} />
          : <DocumentsView documents={documents} />}
      </main>
      {section === "projects" && (
        <ClientProjectCreateSheet
          open={creatingProject}
          clientId={clientId}
          clientName={clientName}
          onOpenChange={(open) => {
            if (!open) router.replace("/dashboard/projects")
          }}
          onCreated={handleProjectCreated}
        />
      )}
    </>
  )
}
