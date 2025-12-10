import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface PortfolioProject {
  id: string
  title: string
  slug: string
  description: string
  category: string[]
  imageUrl: string
  logoUrl: string
  gallery: string[]
  client: string
  clientValuation: string
  earnings: string
  founders: string
  industry: string
  projectUrl: string
  status: string
  featured: boolean
  order: number
  tags: string[]
  technologies: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

const COLLECTION_NAME = "portfolio"

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PortfolioProject[]
}

export async function getFeaturedProjects(maxCount = 3): Promise<PortfolioProject[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("featured", "==", true),
    where("status", "==", "published"),
    orderBy("order", "asc"),
    limit(maxCount),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PortfolioProject[]
}

export async function getPortfolioProject(id: string): Promise<PortfolioProject | null> {
  const docRef = doc(db, COLLECTION_NAME, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as PortfolioProject
}

export async function createPortfolioProject(
  data: Omit<PortfolioProject, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updatePortfolioProject(
  id: string,
  data: Partial<Omit<PortfolioProject, "id" | "createdAt">>,
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deletePortfolioProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}
