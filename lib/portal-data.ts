import { collection, doc, getDoc, getDocs, query, serverTimestamp, where, writeBatch } from "firebase/firestore"
import { db } from "./firebase"
import type { PortalProject, PortalTask } from "./portal-model"
import type { Project } from "./projects"
import type { Task } from "./tasks"

export async function getPortalProjects(clientId: string): Promise<PortalProject[]> {
  const snapshot = await getDocs(query(collection(db, "portalProjects"), where("clientId", "==", clientId)))
  return snapshot.docs.map(d => ({ ...d.data(), id: d.id }) as PortalProject)
}

export async function getPortalTasks(clientId: string, projectId: string): Promise<PortalTask[]> {
  const snapshot = await getDocs(query(collection(db, "portalTasks"), where("clientId", "==", clientId), where("projectId", "==", projectId)))
  return snapshot.docs.map(d => ({ ...d.data(), id: d.id }) as PortalTask)
}

/** Explicit allowlist: internal descriptions, earnings and task bodies never travel. */
export function projectForPortal(project: Project, summary: string): Omit<PortalProject, "id"> {
  return { clientId: project.clientId, title: project.title, status: project.status, progress: project.progress, dueDate: project.dueDate || "", thumbnailUrl: project.thumbnailUrl || "", summary, legacySlug: project.slug || project.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") }
}

export async function publishPortalProject(project: Project, summary: string) {
  await writeBatch(db).set(doc(db, "portalProjects", project.id), projectForPortal(project, summary)).commit()
}

export async function unpublishPortalProject(projectId: string) {
  // Child access is also gated by the parent, including during large cleanups.
  await writeBatch(db).delete(doc(db, "portalProjects", projectId)).commit()
}

export async function publishPortalTask(task: Task, instructions: string, assigneeUid: string) {
  const data: Omit<PortalTask, "id"> = { clientId: task.clientId, projectId: task.projectId, name: task.name, status: task.status, dueDate: task.dueDate || "", instructions, assigneeUid }
  await writeBatch(db).set(doc(db, "portalTasks", task.id), data).commit()
}

export async function unpublishPortalTask(id: string) {
  await writeBatch(db).delete(doc(db, "portalTasks", id)).commit()
}

export async function completePortalTask(id: string, done: boolean) {
  const batch = writeBatch(db)
  const data = { status: done ? "done" : "todo", updatedAt: serverTimestamp() }
  batch.update(doc(db, "portalTasks", id), data)
  batch.update(doc(db, "tasks", id), data)
  await batch.commit()
}

/** Agency edits update an already-published projection, without publishing new fields. */
export async function syncPortalProject(id: string, patch: Partial<Project>) {
  const ref = doc(db, "portalProjects", id)
  const existing = await getDoc(ref)
  const batch = writeBatch(db).update(doc(db, "projects", id), { ...patch, updatedAt: serverTimestamp() })
  if (!existing.exists()) { await batch.commit(); return }
  if (patch.clientId && patch.clientId !== existing.data().clientId) { await batch.delete(ref).commit(); return }
  const safe: Record<string, string | number> = {}
  for (const key of ["title", "status", "progress", "dueDate", "thumbnailUrl"] as const) { const value = patch[key]; if (value !== undefined) safe[key] = value }
  if (Object.keys(safe).length) batch.update(ref, safe)
  await batch.commit()
}

export async function syncPortalTask(id: string, patch: Partial<Task>) {
  const ref = doc(db, "portalTasks", id)
  const existing = await getDoc(ref)
  const batch = writeBatch(db).update(doc(db, "tasks", id), { ...patch, updatedAt: serverTimestamp() })
  if (!existing.exists()) { await batch.commit(); return }
  if ((patch.clientId && patch.clientId !== existing.data().clientId) || (patch.projectId && patch.projectId !== existing.data().projectId)) {
    await batch.delete(ref).commit()
    return
  }
  const safe: Record<string, string> = {}
  for (const key of ["name", "status", "dueDate"] as const) { const value = patch[key]; if (value !== undefined) safe[key] = value }
  if (Object.keys(safe).length) batch.update(ref, safe)
  await batch.commit()
}

export async function deleteAgencyRecord(kind: "projects" | "tasks", id: string) {
  await writeBatch(db).delete(doc(db, kind, id)).delete(doc(db, kind === "projects" ? "portalProjects" : "portalTasks", id)).commit()
}
