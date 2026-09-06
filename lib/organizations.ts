import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp } from "firebase/firestore"
import { db } from "./firebase"

/**
 * The company a user belongs to: the actual tenant that owns projects,
 * invoices, contracts, and documents. Its id is the same `clientId` those
 * collections already key off, so nothing about them changes.
 */
export interface Organization {
  /** Firestore document id === the clientId used across projects/invoices/tasks. */
  id: string
  name: string
  logoUrl?: string
  industry?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

const COLLECTION_NAME = "organizations"

export async function getOrganization(id: string): Promise<Organization | null> {
  if (!id) return null
  const snapshot = await getDoc(doc(db, COLLECTION_NAME, id))
  if (!snapshot.exists()) return null
  return { ...(snapshot.data() as object), id: snapshot.id } as Organization
}

export async function getOrganizations(): Promise<Organization[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME))
  return snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as Organization[]
}

export async function createOrganization(
  id: string,
  data: Omit<Organization, "id" | "createdAt" | "updatedAt">,
): Promise<void> {
  await setDoc(doc(db, COLLECTION_NAME, id), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export async function updateOrganization(
  id: string,
  data: Partial<Omit<Organization, "id" | "createdAt">>,
): Promise<void> {
  await setDoc(
    doc(db, COLLECTION_NAME, id),
    { ...data, updatedAt: Timestamp.now() },
    { merge: true },
  )
}

export async function deleteOrganization(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id))
}
