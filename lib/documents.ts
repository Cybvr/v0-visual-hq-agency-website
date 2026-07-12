import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { db, storage } from "./firebase"

export interface SharedDocument {
  id: string
  title: string
  url: string
  description?: string
  clientId: string
  sharedWith?: string
  sharedWithUserIds?: string[]
  createdAt?: Timestamp
  type?: "link" | "image" | "file"
  thumbnailUrl?: string
}

export async function uploadFileToStorage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const path = `documents/${Date.now()}_${file.name}`
  const storageRef = ref(storage, path)
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      "state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      () => getDownloadURL(task.snapshot.ref).then(resolve).catch(reject),
    )
  })
}

const COLLECTION_NAME = "documents"

/** Every shared document — used by the admin Drive page. */
export async function getDocuments(): Promise<SharedDocument[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME))
  const docs = snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as SharedDocument[]
  return docs.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
}

/** The documents a client can see: theirs plus anything shared with everyone. */
export async function getDocumentsForClient(clientId: string, userId: string): Promise<SharedDocument[]> {
  const queries = [
    getDocs(query(collection(db, COLLECTION_NAME), where("clientId", "==", clientId))),
    getDocs(query(collection(db, COLLECTION_NAME), where("sharedWithUserIds", "array-contains", userId))),
  ]
  const snapshots = await Promise.all(queries)
  const byId = new Map<string, SharedDocument>()
  snapshots.forEach((snapshot) => snapshot.docs.forEach((item) => byId.set(item.id, { ...(item.data() as object), id: item.id } as SharedDocument)))
  return [...byId.values()].sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
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

export async function updateDocumentSharing(id: string, sharedWithUserIds: string[]): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    sharedWithUserIds,
    sharedWith: sharedWithUserIds.length ? "Selected users" : "Private",
  })
}
