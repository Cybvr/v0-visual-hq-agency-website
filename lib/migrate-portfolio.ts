import {
  collection,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"
import { getPortfolioProjects, type PortfolioProject } from "./portfolio"
import { getProjects, slugify, type Project } from "./projects"
import { getUsers, slugifyUser, type AppUser } from "./users"

export interface PortfolioMigrationResult {
  caseStudies: number
  usersCreated: number
  projectsCreated: number
  projectsUpdated: number
}

function comparable(value: string | undefined): string {
  return (value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

function emailLocalPart(value: string): string {
  return comparable(value).slice(0, 48) || "client"
}

function nextUnique(base: string, used: Set<string>, separator = "-"): string {
  let candidate = base
  let suffix = 2
  while (used.has(candidate)) {
    candidate = `${base}${separator}${suffix}`
    suffix += 1
  }
  used.add(candidate)
  return candidate
}

function findClientUser(users: AppUser[], clientName: string): AppUser | null {
  const clientKey = comparable(clientName)
  return users.find((user) => {
    return comparable(user.company) === clientKey
      || comparable(user.displayName) === clientKey
      || comparable(user.email?.split("@")[0]) === clientKey
  }) ?? null
}

function findMigratedProject(projects: Project[], portfolio: PortfolioProject): Project | null {
  const bySource = projects.find((project) => project.legacyPortfolioId === portfolio.id)
  if (bySource) return bySource

  const titleKey = comparable(portfolio.title)
  const clientKey = comparable(portfolio.client || portfolio.title)
  return projects.find((project) => {
    return comparable(project.title) === titleKey && comparable(project.client) === clientKey
  }) ?? null
}

function caseStudyFields(portfolio: PortfolioProject) {
  return {
    isCaseStudy: true,
    legacyPortfolioId: portfolio.id,
    caseStudyStatus: portfolio.status?.trim().toLowerCase() === "published" ? "published" as const : "draft" as const,
    excerpt: portfolio.excerpt ?? "",
    description: portfolio.description ?? "",
    category: portfolio.category ?? [],
    location: portfolio.location ?? "",
    imageUrl: portfolio.imageUrl ?? "",
    logoUrl: portfolio.logoUrl ?? "",
    gallery: portfolio.gallery ?? [],
    clientValuation: portfolio.clientValuation ?? "",
    earnings: portfolio.earnings ?? "",
    founders: portfolio.founders ?? "",
    industry: portfolio.industry ?? "",
    projectUrl: portfolio.projectUrl ?? "",
    featured: portfolio.featured ?? false,
    order: portfolio.order ?? 0,
    tags: portfolio.tags ?? [],
    technologies: portfolio.technologies ?? [],
  }
}

/**
 * Copies legacy portfolio documents into client-owned projects. The source
 * collection is deliberately left untouched until the public portfolio has
 * been switched over and verified. Re-running updates the same projects by
 * legacyPortfolioId instead of creating duplicates.
 */
export async function migratePortfolioToProjects(): Promise<PortfolioMigrationResult> {
  const [portfolioProjects, currentProjects, currentUsers] = await Promise.all([
    getPortfolioProjects(),
    getProjects(),
    getUsers(),
  ])

  if (portfolioProjects.length === 0) {
    return { caseStudies: 0, usersCreated: 0, projectsCreated: 0, projectsUpdated: 0 }
  }

  // One case-study write plus, at most, one new client write per source item.
  if (portfolioProjects.length * 2 > 450) {
    throw new Error("There are too many case studies for one safe migration. Split the migration before continuing.")
  }

  const batch = writeBatch(db)
  const now = Timestamp.now()
  const users = [...currentUsers]
  const projects = [...currentProjects]
  const usedEmails = new Set(users.flatMap((user) => user.email?.trim() ? [user.email.trim().toLowerCase()] : []))
  const usedUserSlugs = new Set(users.flatMap((user) => user.slug ? [user.slug] : []))
  const usedProjectSlugs = new Set(projects.flatMap((project) => project.slug ? [project.slug] : []))
  const result: PortfolioMigrationResult = {
    caseStudies: portfolioProjects.length,
    usersCreated: 0,
    projectsCreated: 0,
    projectsUpdated: 0,
  }

  for (const portfolio of portfolioProjects) {
    const clientName = portfolio.client?.trim() || portfolio.title.trim()
    let clientUser = findClientUser(users, clientName)

    if (!clientUser) {
      const userRef = doc(collection(db, "users"))
      const emailBase = emailLocalPart(clientName)
      const emailLocal = nextUnique(emailBase, new Set(Array.from(usedEmails).map((email) => email.split("@")[0])))
      const email = `${emailLocal}@visualcns.com`
      usedEmails.add(email)
      const userSlug = nextUnique(`${slugifyUser(clientName) || "client"}-client`, usedUserSlugs)

      clientUser = {
        uid: userRef.id,
        email,
        displayName: clientName,
        company: clientName,
        role: "client",
        clientId: userRef.id,
        slug: userSlug,
      }
      batch.set(userRef, {
        email,
        displayName: clientName,
        company: clientName,
        role: "client",
        clientId: userRef.id,
        slug: userSlug,
        createdAt: now,
        updatedAt: now,
      })
      users.push(clientUser)
      result.usersCreated += 1
    }

    const existingProject = findMigratedProject(projects, portfolio)
    const migratedFields = caseStudyFields(portfolio)

    if (existingProject) {
      batch.update(doc(db, "projects", existingProject.id), {
        ...migratedFields,
        thumbnailUrl: portfolio.imageUrl || existingProject.thumbnailUrl || "",
        updatedAt: now,
      })
      Object.assign(existingProject, migratedFields)
      result.projectsUpdated += 1
      continue
    }

    const projectRef = doc(collection(db, "projects"))
    const slugBase = slugify(`${portfolio.title}-${clientName}`) || projectRef.id.toLowerCase()
    const projectSlug = nextUnique(slugBase, usedProjectSlugs)
    const newProject: Project = {
      id: projectRef.id,
      clientId: clientUser.clientId || clientUser.uid,
      client: clientName,
      title: portfolio.title.trim(),
      service: (portfolio.category ?? []).join(", "),
      status: "done",
      progress: 100,
      dueDate: "",
      slug: projectSlug,
      thumbnailUrl: portfolio.imageUrl ?? "",
      isPublic: false,
      ...migratedFields,
    }
    const { id: _id, ...projectData } = newProject
    batch.set(projectRef, {
      ...projectData,
      createdAt: portfolio.createdAt ?? now,
      updatedAt: now,
    })
    projects.push(newProject)
    result.projectsCreated += 1
  }

  await batch.commit()
  return result
}
