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

export type TaskStatus = "todo" | "in-progress" | "review" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  name: string
  /** Matches the clientId on a user's Firestore doc */
  clientId: string
  /** Client display name, denormalized for the table */
  client: string
  /** Firestore id of the project this task belongs to */
  projectId: string
  /** Project title, denormalized for the table */
  project: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  /** The body of the task - notes, links, the actual work */
  content: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export const taskStatusMeta: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "Backlog", className: "bg-[#e3d5c8] text-[#4a3e35]" },
  "in-progress": { label: "In progress", className: "bg-[#d3e5ef] text-[#183347]" },
  review: { label: "In Review", className: "bg-[#fdecc8] text-[#402c09]" },
  done: { label: "Done", className: "bg-[#dbeddb] text-[#1c3829]" },
}

export const taskPriorityMeta: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-amber-100 text-amber-700" },
  high: { label: "High", className: "bg-red-100 text-red-700" },
}

/**
 * Firestore normally hands back `createdAt` as a Timestamp instance, but data
 * written by other means (imports, the Console, an older schema) can come back
 * as a plain `{seconds, nanoseconds}` object, a Date, a number, or a string.
 * This coerces any of those to epoch millis so `.toMillis()` never throws.
 */
export function tsToMillis(value: unknown): number {
  if (!value) return 0
  if (value instanceof Timestamp) return value.toMillis()
  if (value instanceof Date) return value.getTime()
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  if (typeof value === "object") {
    const obj = value as { seconds?: number; _seconds?: number; nanoseconds?: number }
    const seconds = obj.seconds ?? obj._seconds
    if (typeof seconds === "number") return seconds * 1000 + Math.floor((obj.nanoseconds ?? 0) / 1e6)
  }
  return 0
}

/** Format a Firestore-ish timestamp value as a short date, or "—" if absent. */
export function formatTimestamp(value: unknown): string {
  const millis = tsToMillis(value)
  if (!millis) return "—"
  return new Date(millis).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const COLLECTION_NAME = "tasks"

export async function getTasks(): Promise<Task[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME))
  return snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as Task[]
}

export async function getTasksByClientId(clientId: string): Promise<Task[]> {
  if (!clientId) return []
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where("clientId", "==", clientId)))
  return snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as Task[]
}

export async function getTask(id: string): Promise<Task | null> {
  const snapshot = await getDoc(doc(db, COLLECTION_NAME, id))
  if (!snapshot.exists()) return null
  return { ...(snapshot.data() as object), id: snapshot.id } as Task
}

export async function createTask(data: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return ref.id
}

export async function updateTask(id: string, data: Partial<Omit<Task, "id" | "createdAt">>): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id))
}

// Starter tasks seeded for a brand-new client so their board isn't empty and
// they can see how the workspace works. Statuses are spread across the board
// columns on purpose. `dueInDays` is resolved to a real date at seed time.
interface DefaultTaskTemplate {
  name: string
  status: TaskStatus
  priority: TaskPriority
  content: string
  dueInDays?: number
}

const DEFAULT_TASKS: DefaultTaskTemplate[] = [
  {
    name: "👋 Welcome to your workspace",
    status: "done",
    priority: "low",
    content:
      "This is where you'll follow your projects and tasks. Use the Board and Table views above, and add your own tasks anytime with “New task”.",
  },
  {
    name: "Share your brand assets",
    status: "todo",
    priority: "high",
    content: "Upload your logo, fonts, and brand colours so we can get started on the right foot.",
    dueInDays: 3,
  },
  {
    name: "Book your kickoff call",
    status: "in-progress",
    priority: "medium",
    content: "Pick a time for a 30-minute kickoff so we can align on goals and timelines.",
    dueInDays: 5,
  },
  {
    name: "Review your first draft",
    status: "review",
    priority: "medium",
    content: "We'll drop the first draft here for your feedback and sign-off.",
    dueInDays: 10,
  },
]

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

/**
 * Creates the starter tasks for a client and returns them (with ids) so the
 * caller can render immediately without a refetch. Call once per client - the
 * caller is responsible for guarding against re-seeding (e.g. a flag on the
 * user doc), otherwise deleting every task would re-seed on the next load.
 */
export async function seedDefaultTasks(
  clientId: string,
  clientName: string,
  project?: { id: string; title: string },
): Promise<Task[]> {
  const created: Task[] = []
  // Sequential so createdAt increments and the intended order is preserved.
  for (const t of DEFAULT_TASKS) {
    const payload = {
      name: t.name,
      clientId,
      client: clientName,
      projectId: project?.id ?? "",
      project: project?.title ?? "",
      status: t.status,
      priority: t.priority,
      dueDate: t.dueInDays != null ? daysFromNow(t.dueInDays) : "",
      content: t.content,
    }
    const id = await createTask(payload)
    created.push({ ...payload, id })
  }
  return created
}
