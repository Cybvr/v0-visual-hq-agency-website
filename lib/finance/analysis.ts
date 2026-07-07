// QofE analysis flow data — business information entry (step 1) and
// document intake (step 2). Copy kept verbatim from the stitch exports.

// ---------------------------------------------------------------------------
// Business information entry
// ---------------------------------------------------------------------------

export const industrySectorOptions: string[] = [
  "Industrial Manufacturing",
  "SaaS & Technology",
  "Healthcare Services",
  "Consumer Retail",
  "Energy & Infrastructure",
]

export const reportingCurrencyOptions: string[] = [
  "USD ($)",
  "EUR (€)",
  "GBP (£)",
  "CAD ($)",
]

export interface BusinessInfoDefaults {
  companyNamePlaceholder: string
  sectorPlaceholder: string
  amountPlaceholder: string
  /** Sample entity name echoed in the save-confirmation dialog */
  savedEntityName: string
}

export const businessInfoDefaults: BusinessInfoDefaults = {
  companyNamePlaceholder: "e.g. Acme Manufacturing Corp",
  sectorPlaceholder: "Select Sector",
  amountPlaceholder: "0.00",
  savedEntityName: "Acme Manufacturing Corp",
}

// ---------------------------------------------------------------------------
// Document intake
// ---------------------------------------------------------------------------

export type IntakeFileStatus = "analyzing" | "completed" | "pending"

export interface IntakeFile {
  name: string
  /** Size / row-count meta line shown under the file name */
  meta: string
  /** Material Symbols Outlined icon name */
  icon: string
  /** Tint applied to the file-type icon */
  iconTone: "secondary" | "error"
  status: IntakeFileStatus
  /** Analysis progress percentage (only while status is "analyzing") */
  progress?: number
  /** Optional inline action label (e.g. completed files expose their mapping) */
  actionLabel?: string
}

export const intakeQueue: IntakeFile[] = [
  {
    name: "GL_Detail_2023.xlsx",
    meta: "12.4 MB • 42,000 Rows",
    icon: "table_chart",
    iconTone: "secondary",
    status: "analyzing",
    progress: 66,
  },
  {
    name: "Company_Tax_Returns.pdf",
    meta: "4.2 MB • 8 Pages",
    icon: "picture_as_pdf",
    iconTone: "error",
    status: "completed",
    actionLabel: "View Mapping",
  },
  {
    name: "Trial_Balance_Q3.xlsx",
    meta: "1.1 MB • Queued",
    icon: "table_chart",
    iconTone: "secondary",
    status: "pending",
  },
]

export const intakeQueueActiveLabel = "3 Files Active"

export const intakeRequirements: string[] = [
  "Ensure General Ledgers include date, account, and transaction reference.",
  "PDF Tax Returns must be original exports, not scanned images, for optimal OCR performance.",
]

export interface DocumentLensHighlight {
  title: string
  body: string
  imageSrc: string
  imageAlt: string
}

export const documentLensHighlight: DocumentLensHighlight = {
  title: "The Intelligence Advantage",
  body: 'Our AI-driven "Document Lens" doesn\'t just read files—it cross-references them. Upload a PDF bank statement and an Excel ledger, and we\'ll automatically flag reconciliation gaps before you even start your QofE report.',
  imageSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA-NwsK5V1w1A6Kjd0cN0H5daZ1Kx87XGNLahHNk6bw5pZ7IBJsBygvusvcpGyz-YSWvMFKjtAtvC11599i6N90fHg6D1Gn7OuhLfyVtVNiUhZPG8NGuBcPqC4aC5cr018dGN3AT5yJeWBWva_9DU9o0sTG44ZfkAHu9mybPYkpWANtqzAQ_dJE8O-TvqAmtjehieNT52Be5a3HaMvpoys1V8IPrsyTEuIYRdQo0Vtd80NeVHTHIZF0",
  imageAlt:
    "A sophisticated close-up of a digital dashboard displaying high-tech financial document scanning. Glowing blue lines and data points connect floating digital spreadsheets and PDF documents in a clean, minimalist 3D space. The lighting is sharp and professional, using a deep navy and ice-white palette to convey precision and institutional authority.",
}
