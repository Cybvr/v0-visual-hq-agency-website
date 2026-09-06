import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void"
export type ContractStatus = "draft" | "sent" | "signed" | "expired"

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  /** Minor units, so 125000 is 1,250.00 */
  unitPrice: number
  /** Percentage, so 7.5 is 7.5% */
  taxRate: number
}

export interface InvoiceDiscount {
  type: "amount" | "percent"
  /** Minor units for "amount", a percentage for "percent" */
  value: number
}

export interface InvoiceParty {
  name: string
  email?: string
  address?: string
  taxNumber?: string
}

export interface Invoice {
  id: string
  /** Matches the clientId on a user's Firestore doc */
  clientId: string
  client: string
  /** Invoice number shown to the client, generated as INV-0001 upward */
  invoiceNumber: string
  /** Optional link back to the project this bills for */
  projectId?: string
  project?: string
  status: InvoiceStatus
  /** Who the invoice is addressed to, which is often not the account name */
  billTo?: InvoiceParty
  /** The client's own order number, printed so their finance team can match it */
  poReference?: string
  lineItems?: InvoiceLineItem[]
  discount?: InvoiceDiscount
  /** Total before tax and discount, in minor units */
  subtotal?: number
  /** Discount actually applied, in minor units */
  discountTotal?: number
  taxTotal?: number
  /** What has been settled so far, in minor units */
  amountPaid?: number
  /** The grand total, in minor units. Kept as `amount` so older rows still read. */
  amount: number
  currency: string
  issuedOn: string
  /** Days from issue to due. Drives dueOn rather than being typed by hand. */
  paymentTermsDays?: number
  dueOn: string
  notes?: string
  paymentInstructions?: string
  /** Where the client downloads or pays it */
  url?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Contract {
  id: string
  clientId: string
  client: string
  title: string
  projectId?: string
  project?: string
  status: ContractStatus
  /** The agreement itself as HTML, when it is written here rather than linked */
  body?: string
  /** Date the client signed, empty until they do */
  signedOn?: string
  startsOn?: string
  endsOn?: string
  url?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export const invoiceStatusMeta: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-blue-100 text-blue-700" },
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
  void: { label: "Void", className: "bg-muted text-muted-foreground line-through" },
}

export const contractStatusMeta: Record<ContractStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Awaiting signature", className: "bg-amber-100 text-amber-700" },
  signed: { label: "Signed", className: "bg-emerald-100 text-emerald-700" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground" },
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    }).format((amount ?? 0) / 100)
  } catch {
    return `${((amount ?? 0) / 100).toFixed(2)} ${currency || ""}`.trim()
  }
}

/** Who the invoice is from. Printed at the top of every invoice. */
export const INVOICE_ISSUER: InvoiceParty = {
  name: "VisualHQ",
  email: "hello@visualhq.co",
  address: "Lagos, Nigeria",
}

/** Bank details shown for whichever currency the invoice is raised in. */
export const PAYMENT_DETAILS: Record<string, string> = {
  USD: "Bank transfer in USD. Account details are on the invoice PDF.",
  NGN: "Bank transfer in NGN. Account details are on the invoice PDF.",
  GBP: "Bank transfer in GBP. Account details are on the invoice PDF.",
}

export const PAYMENT_TERM_OPTIONS = [
  { days: 0, label: "Due on receipt" },
  { days: 7, label: "Net 7" },
  { days: 14, label: "Net 14" },
  { days: 30, label: "Net 30" },
  { days: 60, label: "Net 60" },
] as const

export interface InvoiceTotals {
  subtotal: number
  discountTotal: number
  taxTotal: number
  total: number
}

/** Everything derived from the line items, all in minor units. */
export function computeTotals(
  lineItems: InvoiceLineItem[],
  discount?: InvoiceDiscount,
): InvoiceTotals {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + Math.round((item.quantity || 0) * (item.unitPrice || 0)),
    0,
  )

  const rawDiscount =
    discount?.type === "percent"
      ? Math.round((subtotal * (discount.value || 0)) / 100)
      : Math.round(discount?.value || 0)
  // Never discount past zero, and never below what the lines actually come to.
  const discountTotal = Math.max(0, Math.min(rawDiscount, subtotal))

  // Tax follows each line's own rate, reduced in proportion to any discount so
  // a discounted invoice isn't taxed on money the client never owed.
  const share = subtotal > 0 ? (subtotal - discountTotal) / subtotal : 0
  const taxTotal = lineItems.reduce((sum, item) => {
    const line = Math.round((item.quantity || 0) * (item.unitPrice || 0)) * share
    return sum + Math.round((line * (item.taxRate || 0)) / 100)
  }, 0)

  return { subtotal, discountTotal, taxTotal, total: subtotal - discountTotal + taxTotal }
}

/** The due date implied by the issue date and the chosen terms. */
export function dueDateFrom(issuedOn: string, termsDays: number): string {
  if (!issuedOn) return ""
  const issued = new Date(`${issuedOn}T00:00:00`)
  if (Number.isNaN(issued.getTime())) return ""
  issued.setDate(issued.getDate() + (termsDays || 0))
  return issued.toISOString().slice(0, 10)
}

export function formatDate(value?: string): string {
  if (!value) return "—"
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date)
}

const INVOICES = "invoices"
const CONTRACTS = "contracts"

function byNewest<T extends { createdAt?: Timestamp }>(rows: T[]): T[] {
  return rows.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
}

/** Drafts stay internal, so a client only ever sees what has actually been issued. */
function isVisibleToClient(status: InvoiceStatus | ContractStatus): boolean {
  return status !== "draft"
}

/** The field was once called `reference`, so older docs still carry it. */
function toInvoice(id: string, data: object): Invoice {
  const row = { ...data, id } as Invoice & { reference?: string }
  if (!row.invoiceNumber && row.reference) row.invoiceNumber = row.reference
  return row
}

export async function getInvoices(): Promise<Invoice[]> {
  const snapshot = await getDocs(collection(db, INVOICES))
  return byNewest(snapshot.docs.map((d) => toInvoice(d.id, d.data() as object)))
}

export async function getInvoicesByClientId(clientId: string): Promise<Invoice[]> {
  if (!clientId) return []
  const snapshot = await getDocs(
    query(collection(db, INVOICES), where("clientId", "==", clientId), where("status", "!=", "draft")),
  )
  const rows = snapshot.docs.map((d) => toInvoice(d.id, d.data() as object))
  return byNewest(rows.filter((row) => isVisibleToClient(row.status)))
}

/**
 * The next invoice number in the INV-0001 sequence, taken from the highest number
 * already used so a deleted invoice never hands its number to a new one.
 */
export async function nextInvoiceNumber(): Promise<string> {
  try {
    const existing = await getInvoices()
    const highest = existing.reduce((max, invoice) => {
      const match = /^INV-(\d+)$/i.exec((invoice.invoiceNumber ?? "").trim())
      if (!match) return max
      return Math.max(max, Number.parseInt(match[1], 10))
    }, 0)
    return `INV-${String(highest + 1).padStart(4, "0")}`
  } catch {
    return "INV-0001"
  }
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const snapshot = await getDoc(doc(db, INVOICES, id))
  if (!snapshot.exists()) return null
  return toInvoice(snapshot.id, snapshot.data() as object)
}

export async function createInvoice(data: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, INVOICES), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return ref.id
}

export async function updateInvoice(id: string, data: Partial<Omit<Invoice, "id" | "createdAt">>): Promise<void> {
  await updateDoc(doc(db, INVOICES, id), { ...data, updatedAt: Timestamp.now() })
}

export async function deleteInvoice(id: string): Promise<void> {
  await deleteDoc(doc(db, INVOICES, id))
}

export async function getContracts(): Promise<Contract[]> {
  const snapshot = await getDocs(collection(db, CONTRACTS))
  return byNewest(snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as Contract[])
}

export async function getContractsByClientId(clientId: string): Promise<Contract[]> {
  if (!clientId) return []
  const snapshot = await getDocs(
    query(collection(db, CONTRACTS), where("clientId", "==", clientId), where("status", "!=", "draft")),
  )
  const rows = snapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as Contract[]
  return byNewest(rows.filter((row) => isVisibleToClient(row.status)))
}

export async function getContract(id: string): Promise<Contract | null> {
  const snapshot = await getDoc(doc(db, CONTRACTS, id))
  if (!snapshot.exists()) return null
  return { ...(snapshot.data() as object), id: snapshot.id } as Contract
}

export async function createContract(data: Omit<Contract, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, CONTRACTS), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return ref.id
}

export async function updateContract(id: string, data: Partial<Omit<Contract, "id" | "createdAt">>): Promise<void> {
  await updateDoc(doc(db, CONTRACTS, id), { ...data, updatedAt: Timestamp.now() })
}

export async function deleteContract(id: string): Promise<void> {
  await deleteDoc(doc(db, CONTRACTS, id))
}
