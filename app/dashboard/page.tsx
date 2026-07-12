"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProjectsView } from "@/components/dashboard/projects-view"
import { TasksView } from "@/components/dashboard/tasks-view"
import { getProjectsByClientId, type Project } from "@/lib/projects"
import { getTasksByClientId, deleteTask, updateTask, seedDefaultTasks, tsToMillis, type Task } from "@/lib/tasks"
import { getDocumentsForClient, type SharedDocument } from "@/lib/documents"
import { updateUser } from "@/lib/users"
import { DocumentsView } from "@/components/dashboard/documents-view"

export default function DashboardPage() {
  const { user, appUser } = useAuth()
  const clientId = appUser?.clientId ?? ""
  const clientName = appUser?.company || appUser?.displayName || ""
  const uid = appUser?.uid
  const tasksSeeded = appUser?.tasksSeeded === true

  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [documents, setDocuments] = useState<SharedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  // Guards against seeding twice (e.g. StrictMode's double-invoke in dev).
  const seedingRef = useRef(false)

  const fetchData = useCallback(async () => {
    if (!clientId) {
      setLoading(false)
      return
    }
    setError(null)
    try {
      const [p, t, d] = await Promise.all([
        getProjectsByClientId(clientId),
        getTasksByClientId(clientId),
        getDocumentsForClient(clientId, uid ?? ""),
      ])
      setProjects(p)
      setDocuments(d)

      let list = t
      // First-time clients get a few starter tasks so the board isn't empty.
      // The `tasksSeeded` flag on the user doc makes this a one-time thing, so
      // deleting every task later never re-seeds.
      if (list.length === 0 && !tasksSeeded && uid && !seedingRef.current) {
        seedingRef.current = true
        list = await seedDefaultTasks(clientId, clientName, p[0] ? { id: p[0].id, title: p[0].title } : undefined)
        try {
          await updateUser(uid, { tasksSeeded: true })
        } catch (err) {
          // Seeding worked; only the guard write failed. Log and move on -
          // the non-empty list keeps us from re-seeding this session anyway.
          console.error("Error marking tasks as seeded:", err)
        }
      }

      list.sort((a, b) => tsToMillis(b.createdAt) - tsToMillis(a.createdAt))
      setTasks(list)
    } catch (err) {
      console.error("Error loading dashboard data:", err)
      setError("Couldn't load your projects right now. Please try again shortly.")
    } finally {
      setLoading(false)
    }
  }, [clientId, clientName, uid, tasksSeeded])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error("Error deleting task:", err)
    } finally {
      setDeleting(null)
    }
  }

  // Inline table edits: apply optimistically, then persist. On failure, refetch
  // to snap back to the server's truth.
  async function handlePatch(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    try {
      await updateTask(id, patch)
    } catch (err) {
      console.error("Error updating task:", err)
      fetchData()
    }
  }

  if (!user) return null

  const firstName = appUser?.displayName?.split(" ")[0] ?? appUser?.company ?? user.displayName?.split(" ")[0] ?? "there"

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-xl font-semibold">Welcome, {firstName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Where your work stands and the latest tasks - all in one place.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="mt-10 text-sm text-destructive">{error}</p>
      ) : (
        <>
          <DocumentsView documents={documents} />
          <ProjectsView projects={projects} />
          <TasksView
            tasks={tasks}
            projects={projects}
            clientId={clientId}
            clientName={clientName}
            deleting={deleting}
            onDelete={handleDelete}
            onPatch={handlePatch}
            onSaved={fetchData}
          />
        </>
      )}
    </main>
  )
}
