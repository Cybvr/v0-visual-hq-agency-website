/**
 * Backfill step of the clientId -> companyId rename.
 *
 * Copies `clientId` into a new `companyId` field on every document that has one,
 * across all collections that key off it. It never touches `clientId`, so the
 * live site (still reading clientId) keeps working while this runs and after.
 * Run this BEFORE deploying the code and rules that read companyId.
 *
 * Usage:
 *   node --env-file=.env.local scripts/backfill-company-id.mjs         # apply
 *   node --env-file=.env.local scripts/backfill-company-id.mjs --dry   # preview only
 */
import { applicationDefault, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Every collection whose documents carry a clientId.
const COLLECTIONS = [
  "users",
  "projects",
  "tasks",
  "invoices",
  "contracts",
  "estimates",
  "companyDocuments",
  "documents",
  "approvals",
  "comments",
  "portalProjects",
  "portalTasks",
  "portalComments",
]

const DRY_RUN = process.argv.includes("--dry")
const BATCH_LIMIT = 400

// Uses Google Application Default Credentials. Set GOOGLE_APPLICATION_CREDENTIALS
// to a service-account JSON file, or run this from an environment already
// authenticated with Google Cloud. Admin access is required because the normal
// browser Firestore SDK is subject to the rules being migrated.
const app = initializeApp({
  credential: applicationDefault(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
})
const db = getFirestore(app)

async function backfillCollection(name) {
  const snapshot = await db.collection(name).get()
  let batch = db.batch()
  let pending = 0
  let updated = 0
  let skipped = 0

  for (const snap of snapshot.docs) {
    const data = snap.data()
    // Nothing to copy, or already carries companyId: leave it.
    if (data.clientId == null || data.companyId != null) { skipped += 1; continue }

    if (!DRY_RUN) {
      batch.set(snap.ref, { companyId: data.clientId }, { merge: true })
      pending += 1
      if (pending >= BATCH_LIMIT) { await batch.commit(); batch = db.batch(); pending = 0 }
    }
    updated += 1
  }

  if (!DRY_RUN && pending > 0) await batch.commit()
  console.log(`${name}: ${updated} ${DRY_RUN ? "would be updated" : "updated"}, ${skipped} skipped (of ${snapshot.size})`)
  return updated
}

async function main() {
  console.log(DRY_RUN ? "DRY RUN — no writes\n" : "Applying companyId backfill\n")
  let total = 0
  for (const name of COLLECTIONS) {
    try {
      total += await backfillCollection(name)
    } catch (error) {
      console.error(`${name}: failed — ${error?.message ?? error}`)
    }
  }
  console.log(`\nDone. ${total} document(s) ${DRY_RUN ? "would be" : ""} updated.`)
  process.exit(0)
}

main().catch((error) => { console.error(error); process.exit(1) })
