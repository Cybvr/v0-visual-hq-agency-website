import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export type ProjectStatus = "in-progress" | "review" | "done" | "on-hold"

export interface Project {
  id: string
  /** Matches the clientId on a user's Firestore doc - which client owns this project */
  clientId: string
  client: string
  title: string
  service: string
  status: ProjectStatus
  progress: number
  dueDate: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export const projectStatusMeta: Record<ProjectStatus, { label: string; className: string }> = {
  "in-progress": { label: "In progress", className: "bg-blue-100 text-blue-700" },
  review: { label: "In review", className: "bg-amber-100 text-amber-700" },
  done: { label: "Done", className: "bg-emerald-100 text-emerald-700" },
  "on-hold": { label: "On hold", className: "bg-muted text-muted-foreground" },
}

const COLLECTION_NAME = "projects"

export async function getProjects(): Promise<Project[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME))
  return snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as Project[]
}

export async function getProjectsByClientId(clientId: string): Promise<Project[]> {
  if (!clientId) return []
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where("clientId", "==", clientId)))
  return snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as Project[]
}

export async function getProject(id: string): Promise<Project | null> {
  const snapshot = await getDoc(doc(db, COLLECTION_NAME, id))
  if (!snapshot.exists()) return null
  return { ...(snapshot.data() as object), id: snapshot.id } as Project
}

export async function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return ref.id
}

export async function updateProject(id: string, data: Partial<Omit<Project, "id" | "createdAt">>): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id))
}
