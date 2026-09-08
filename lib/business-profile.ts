import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { db } from "./firebase"
import { INVOICE_ISSUER, type InvoiceParty } from "./billing"

const COLLECTION_NAME = "settings"
const DOC_ID = "business"

export interface BusinessProfile extends InvoiceParty {
  logoUrl?: string
  updatedAt?: Timestamp
}

/**
 * Who invoices, estimates, and contracts are issued from - the "Prepared by"
 * block printed on every document. Edited once from the business settings
 * page instead of the INVOICE_ISSUER constant, which now only serves as the
 * fallback before anyone has saved a profile.
 */
export async function getBusinessProfile(): Promise<BusinessProfile> {
  try {
    const snapshot = await getDoc(doc(db, COLLECTION_NAME, DOC_ID))
    if (!snapshot.exists()) return { ...INVOICE_ISSUER }
    const data = snapshot.data() as Partial<BusinessProfile>
    return {
      name: data.name?.trim() || INVOICE_ISSUER.name,
      email: data.email ?? INVOICE_ISSUER.email,
      address: data.address ?? INVOICE_ISSUER.address,
      website: data.website ?? INVOICE_ISSUER.website,
      taxNumber: data.taxNumber,
      logoUrl: data.logoUrl,
    }
  } catch (error) {
    console.error("Error loading business profile:", error)
    return { ...INVOICE_ISSUER }
  }
}

export async function updateBusinessProfile(data: Partial<Omit<BusinessProfile, "updatedAt">>): Promise<void> {
  await setDoc(doc(db, COLLECTION_NAME, DOC_ID), { ...data, updatedAt: Timestamp.now() }, { merge: true })
}
