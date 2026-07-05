import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
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

export async function getUsers(): Promise<AppUser[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME))
  return snapshot.docs.map((d) => ({ ...(d.data() as object), uid: d.id })) as AppUser[]
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

  await setDoc(ref, base, { merge: true })

  const after = await getDoc(ref)
  return after.exists() ? ({ ...(after.data() as object), uid: after.id } as AppUser) : null
}
