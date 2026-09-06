import { getOrganizations, createOrganization } from "./organizations"
import { getUsers, type AppUser } from "./users"

export interface OrganizationMigrationResult {
  clientsScanned: number
  organizationsCreated: number
  organizationsExisting: number
}

function workspaceId(user: AppUser): string {
  return user.clientId || user.uid
}

function orgName(user: AppUser): string {
  return user.company || user.displayName || user.email || "Unnamed company"
}

/**
 * One-click, safe-to-rerun backfill: every distinct workspace behind a client
 * user gets an organizations/{clientId} doc, seeded from whichever of its
 * client users is the best-named. Existing organizations are left untouched,
 * so running this again after adding new clients only fills the gaps.
 */
export async function migrateClientsToOrganizations(): Promise<OrganizationMigrationResult> {
  const [users, organizations] = await Promise.all([getUsers(), getOrganizations()])
  const existingIds = new Set(organizations.map((org) => org.id))
  const clients = users.filter((user) => user.role === "client")

  const byWorkspace = new Map<string, AppUser[]>()
  for (const client of clients) {
    const id = workspaceId(client)
    if (!id) continue
    const group = byWorkspace.get(id) ?? []
    group.push(client)
    byWorkspace.set(id, group)
  }

  let created = 0
  let existing = 0

  for (const [id, group] of byWorkspace) {
    if (existingIds.has(id)) {
      existing += 1
      continue
    }
    // The client with a company name set speaks for the group; otherwise the
    // first one is as good a guess as any.
    const representative = group.find((client) => client.company?.trim()) ?? group[0]
    await createOrganization(id, {
      name: orgName(representative),
      logoUrl: representative.photoURL ?? "",
      industry: "",
    })
    created += 1
  }

  return {
    clientsScanned: clients.length,
    organizationsCreated: created,
    organizationsExisting: existing,
  }
}
