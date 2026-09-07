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

export function DashboardHome() {
  const { user, appUser } = useAuth()
  const clientId = appUser?.clientId ?? ""
  const clientName = appUser?.company || appUser?.displayName || ""
  const uid = appUser?.uid
  const tasksSeeded = appUser?.tasksSeeded === true

  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Guards against seeding twice (e.g. StrictMode's double-invoke in dev).
  const seedingRef = useRef(false)

  const fetchData = useCallback(async () => {
    if (!clientId) {
      setLoading(false)
      return
    }
    setError(null)
    try {
      const [p, t] = await Promise.all([
        getProjectsByClientId(clientId),
        getTasksByClientId(clientId),
      ])
      setProjects(p)

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

  if (!user) return null

  const firstName = appUser?.displayName?.split(" ")[0] ?? appUser?.company ?? user.displayName?.split(" ")[0] ?? "there"

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-12 pt-6 sm:px-6">
      <HomeBanner firstName={firstName} onTrial={appUser?.plan === undefined || appUser?.plan === "trial"} />

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
