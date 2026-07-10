import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface SharedDocument {
  id: string
  title: string
  /** Link to the document (Google Doc, PDF, Figma, etc.). */
  url: string
  description?: string
  /**
   * Which client this is shared with. Empty string means "all clients" — it
   * shows up for everyone.
   */
  clientId: string
  /** The company/name we shared it with, kept for display in the admin list. */
  sharedWith?: string
  createdAt?: Timestamp
}

const COLLECTION_NAME = "documents"

/** Every shared document — used by the admin Drive page. */
export async function getDocuments(): Promise<SharedDocument[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME))
  const docs = snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as SharedDocument[]
  return docs.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
}

/** The documents a client can see: theirs plus anything shared with everyone. */
export async function getDocumentsForClient(clientId: string): Promise<SharedDocument[]> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTION_NAME), where("clientId", "in", clientId ? [clientId, ""] : [""])),
  )
  const docs = snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as SharedDocument[]
  return docs.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
}

export async function createDocument(data: Omit<SharedDocument, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return ref.id
}

export async function deleteDocument(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id))
}
