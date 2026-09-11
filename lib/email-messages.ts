import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"

import { db } from "./firebase"

const COLLECTION_NAME = "emailMessages"

export type EmailMessageKind = "transactional" | "marketing"
export type EmailMessageStatus = "sent" | "failed"
export type EmailRecipient = {
  email: string
  name?: string
  companyId?: string
}

export type EmailMessageRecord = {
  id: string
  companyId: string
  createdBy: string
  providerId: string
  to: string
  subject: string
  createdAt: string
  from?: string
  replyTo?: string
  bodyHtml?: string
  bodyText?: string
  recipients?: EmailRecipient[]
  projectId?: string
  projectName?: string
  documentType?: string
  documentId?: string
  documentTitle?: string
  companyName?: string
  messageKind?: EmailMessageKind
  status?: EmailMessageStatus
}

export async function getEmailMessages(companyId: string): Promise<EmailMessageRecord[]> {
  if (!companyId) return []
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where("companyId", "==", companyId)))
  return snapshot.docs
    .map((message) => ({ ...(message.data() as Omit<EmailMessageRecord, "id">), id: message.id }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export async function getAllEmailMessages(): Promise<EmailMessageRecord[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME))
  return snapshot.docs
    .map((message) => ({ ...(message.data() as Omit<EmailMessageRecord, "id">), id: message.id }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export async function saveEmailMessage(message: EmailMessageRecord): Promise<void> {
  const record = Object.fromEntries(Object.entries(message).filter(([, value]) => value !== undefined))
  await setDoc(doc(db, COLLECTION_NAME, message.id), record, { merge: true })
}
