import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export type UserRole = "admin" | "client"

export interface AppUser {
  /** Firestore document id === Firebase Auth uid */
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role?: UserRole
  company?: string
  /** The user's own dashboard URL segment, e.g. /dashboard/ada-obi */
  slug?: string
  /** Links a client user to their project/deliverable data. */
  clientId?: string
  /** Set once we've seeded a client's starter tasks, so we never re-seed. */
  tasksSeeded?: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
  // Preserve any other fields that exist on the doc so edits don't drop them
  [key: string]: unknown
}

const COLLECTION_NAME = "users"

/**
 * Words that are already dashboard sections. A user slug matching one of these
 * would sit behind the real page forever, so they're never handed out.
 */
const RESERVED_SLUGS = new Set([
  "agent",
  "drive",
  "email",
  "seo",
  "projects",
  "tasks",
  "portfolio",
  "users",
  "invoices",
  "contracts",
  "marketing",
  "manage",
  "settings",
  "account",
  "new",
])

export function slugifyUser(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

export async function getUserBySlug(slug: string): Promise<AppUser | null> {
  if (!slug) return null
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where("slug", "==", slug)))
  if (snapshot.empty) return null
  const first = snapshot.docs[0]
  return { ...(first.data() as object), uid: first.id } as AppUser
}

/**
 * Build a slug from a name or email that no other user holds. `forUid` is the
 * account claiming it, so re-saving your own slug isn't treated as a clash.
 */
export async function uniqueUserSlug(preferred: string, forUid: string): Promise<string> {
  const base = slugifyUser(preferred) || "user"
  let candidate = RESERVED_SLUGS.has(base) ? `${base}-1` : base

  for (let attempt = 2; attempt < 50; attempt += 1) {
    const taken = await getUserBySlug(candidate)
    if (!taken || taken.uid === forUid) return candidate
    candidate = `${base}-${attempt}`
  }
  // Every readable variant is spoken for, so fall back to something unique.
  return `${base}-${forUid.slice(0, 6).toLowerCase()}`
}

export async function getUsers(): Promise<AppUser[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME))
  return snapshot.docs.map((d) => ({ ...(d.data() as object), uid: d.id })) as AppUser[]
}

/**
 * The account owning a workspace. Several users can share a clientId, so this
 * returns the first match, which is enough to open their record.
 */
export async function getUserByClientId(clientId: string): Promise<AppUser | null> {
  if (!clientId) return null
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where("clientId", "==", clientId)))
  if (snapshot.empty) return null
  const first = snapshot.docs[0]
  return { ...(first.data() as object), uid: first.id } as AppUser
}

export async function getUser(uid: string): Promise<AppUser | null> {
  const snapshot = await getDoc(doc(db, COLLECTION_NAME, uid))
  if (!snapshot.exists()) return null
  return { ...(snapshot.data() as object), uid: snapshot.id } as AppUser
}

/** Create a user doc keyed by uid (uid must match the person's Firebase Auth uid). */
export async function createUser(uid: string, data: Omit<AppUser, "uid" | "createdAt" | "updatedAt">): Promise<void> {
  await setDoc(doc(db, COLLECTION_NAME, uid), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export async function updateUser(uid: string, data: Partial<Omit<AppUser, "uid" | "createdAt">>): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, uid), {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, uid))
}

/**
 * Called on every sign-in. Creates the users/{uid} doc on first login and
 * refreshes profile fields (email/name/photo) on return visits. Uses merge so
 * it NEVER overwrites `role` or any other field set elsewhere. Returns the
 * doc after the write so callers can read the current role.
 */
export async function upsertUserOnLogin(profile: {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}): Promise<AppUser | null> {
  const ref = doc(db, COLLECTION_NAME, profile.uid)
  const existing = await getDoc(ref)

  const base: Record<string, unknown> = {
    email: profile.email ?? "",
    displayName: profile.displayName ?? "",
    photoURL: profile.photoURL ?? "",
    updatedAt: Timestamp.now(),
  }
  if (!existing.exists()) {
    // First login: default everyone to "client". Admins are promoted manually.
    // Only set on create so a return login never demotes an admin.
    base.role = "client"
    base.createdAt = Timestamp.now()
  }
  // Every user needs a clientId to have a workspace: it's what tasks/projects
  // are scoped by and what the Firestore rules match on (myClientId()). Default
  // it to the uid so each account gets its own space; backfill older docs that
  // predate this. An admin can still point several users at one shared clientId.
  if (!existing.exists() || !existing.data()?.clientId) {
    base.clientId = profile.uid
  }

  // Same idea for the URL segment: new accounts get one, and older docs that
  // predate slugs are backfilled on their next login.
  if (!existing.exists() || !existing.data()?.slug) {
    const preferred = profile.displayName || (profile.email ?? "").split("@")[0] || "user"
    base.slug = await uniqueUserSlug(preferred, profile.uid)
  }

  await setDoc(ref, base, { merge: true })

  const after = await getDoc(ref)
  return after.exists() ? ({ ...(after.data() as object), uid: after.id } as AppUser) : null
}
