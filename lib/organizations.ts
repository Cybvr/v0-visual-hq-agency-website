import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, Timestamp } from "firebase/firestore"
import { db } from "./firebase"
import { slugify } from "./projects"

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
  location?: string
  website?: string
  /** The public page's URL segment, e.g. visualcns.com/pan-atlantic-university */
  slug?: string
  /**
   * A redacted mirror of the workspace's people, kept in step whenever an
   * admin loads the company page - see CompanyProvider. This is what the
   * public page's Team section reads, so a real account's email never
   * leaves the (admin-only) users collection.
   */
  publicTeam?: PublicTeamMember[]
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface PublicTeamMember {
  uid: string
  name: string
  role?: string
  photoUrl?: string
}

const COLLECTION_NAME = "organizations"

/**
 * Top-level routes that already exist at the site root. A company slug
 * matching one of these would sit behind the real page forever, so it's
 * never handed out.
 */
const RESERVED_SLUGS = new Set([
  "about",
  "blog",
  "brands",
  "capabilities",
  "case-studies",
  "contact",
  "faq",
  "finance",
  "industries",
  "login",
  "portfolio",
  "pricing",
  "privacy",
  "ratecard",
  "signup",
  "templates",
  "terms",
  "visualhq",
  "share",
  "quotes",
  "estimates",
  "auth",
  "api",
  "dashboard",
  "offline",
  "manifest",
])

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

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  if (!slug) return null
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where("slug", "==", slug)))
  if (snapshot.empty) return null
  const first = snapshot.docs[0]
  return { ...(first.data() as object), id: first.id } as Organization
}

/**
 * Resolve an organization from a URL segment: the public page carries a slug,
 * but a raw id still resolves so older links, and organizations that predate
 * slugs, keep working.
 */
export async function getOrganizationByRef(ref: string): Promise<Organization | null> {
  if (!ref) return null
  return (await getOrganizationBySlug(ref)) ?? (await getOrganization(ref))
}

/** The URL segment for an organization, on its public page or in the dashboard. */
export function organizationRef(org: Organization): string {
  return org.slug || org.id
}

/**
 * Build a slug from a company name that no other organization holds. `forId`
 * is the org claiming it, so re-saving its own slug isn't treated as a clash.
 */
export async function uniqueOrganizationSlug(preferred: string, forId: string): Promise<string> {
  const base = slugify(preferred) || "company"
  let candidate = RESERVED_SLUGS.has(base) ? `${base}-1` : base

  for (let attempt = 2; attempt < 50; attempt += 1) {
    const taken = await getOrganizationBySlug(candidate)
    if (!taken || taken.id === forId) return candidate
    candidate = `${base}-${attempt}`
  }
  // Every readable variant is spoken for, so fall back to something unique.
  return `${base}-${forId.slice(0, 6).toLowerCase()}`
}

export async function createOrganization(
  id: string,
  data: Omit<Organization, "id" | "createdAt" | "updatedAt">,
): Promise<void> {
  const slug = data.slug || (await uniqueOrganizationSlug(data.name || id, id))
  await setDoc(doc(db, COLLECTION_NAME, id), {
    ...data,
    slug,
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
