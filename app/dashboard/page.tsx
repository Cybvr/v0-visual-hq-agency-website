"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { HomeBanner } from "@/components/dashboard/home-banner"
import { HomeTaskList } from "@/components/dashboard/home-task-list"
import { ProjectsView } from "@/components/dashboard/projects-view"
import { TemplatesView } from "@/components/dashboard/templates-view"
import { getProjectsByClientId, type Project } from "@/lib/projects"
import { getTasksByClientId, seedDefaultTasks, tsToMillis, type Task } from "@/lib/tasks"
import { updateUser } from "@/lib/users"

export default function DashboardPage() {
  const { user, appUser } = useAuth()
  const clientId = appUser?.clientId ?? ""
  const clientName = appUser?.company || appUser?.displayName || ""
  const uid = appUser?.uid
  const tasksSeeded = appUser?.tasksSeeded === true

  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const seedingRef = useRef(false)

  const fetchData = useCallback(async () => {
    if (!clientId) {
      setLoading(false)
      return
    }

    setError(null)

    try {
      const [nextProjects, nextTasks] = await Promise.all([
        getProjectsByClientId(clientId),
        getTasksByClientId(clientId),
      ])
      setProjects(nextProjects)

      let taskList = nextTasks

      if (taskList.length === 0 && !tasksSeeded && uid && !seedingRef.current) {
        seedingRef.current = true
        taskList = await seedDefaultTasks(
          clientId,
          clientName,
          nextProjects[0] ? { id: nextProjects[0].id, title: nextProjects[0].title } : undefined,
        )

        try {
          await updateUser(uid, { tasksSeeded: true })
        } catch (err) {
          console.error("Error marking tasks as seeded:", err)
        }
      }

      taskList.sort((a, b) => tsToMillis(b.createdAt) - tsToMillis(a.createdAt))
      setTasks(taskList)
    } catch (err) {
      console.error("Error loading dashboard data:", err)
      setError("Couldn't load your projects right now. Please try again shortly.")
    } finally {
      setLoading(false)
    }
  }, [clientId, clientName, uid, tasksSeeded])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  if (!user) return null

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-4 sm:px-6">
      <HomeBanner onTrial={appUser?.plan === undefined || appUser?.plan === "trial"} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="mt-10 text-sm text-destructive">{error}</p>
      ) : (
        <>
          <ProjectsView projects={projects} onChanged={fetchData} />
          <TemplatesView clientId={clientId} clientName={clientName} onCreated={fetchData} />
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
            <HomeTaskList
              tasks={tasks}
              clientId={clientId}
              clientName={clientName}
              onSaved={fetchData}
              className="mt-0"
            />
            <div className="overflow-hidden rounded-lg bg-card">
              <Image
                src="/images/visualcns-blue-campaign-ad-v4.png"
                alt="VisualCNS campaign artwork: Do something awesome for your brand"
                width={1536}
                height={1057}
                className="h-auto w-full"
              />
            </div>
          </div>
        </>
      )}
    </main>
  )
}
