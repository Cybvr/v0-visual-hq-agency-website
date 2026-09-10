"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { CompanyBanner } from "@/components/company/company-banner"
import { CompanyDocumentView } from "@/components/dashboard/company-document-view"
import { DocumentActions } from "@/components/dashboard/document-actions"
import { getBusinessProfile, type BusinessProfile } from "@/lib/business-profile"
import { getCompanyDocument, type CompanyDocument } from "@/lib/company-documents"
import { getOrganization, type Organization } from "@/lib/organizations"
import type { Project } from "@/lib/projects"

/** No login required: a shared document is public once sharing is on; drafts stay private. */
export default function SharedDocumentPage() {
  const { id } = useParams<{ id: string }>()
  const [record, setRecord] = useState<CompanyDocument | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [issuer, setIssuer] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    getCompanyDocument(id)
      .then(async (found) => {
        if (!active) return
        const visible = found && found.status !== "draft" && found.shareEnabled ? found : null
        setRecord(visible)
        setLoading(false)
        // The header is nice-to-have, so a failure here never hides the document.
        if (!visible) return
        const [orgResult, profileResult] = await Promise.allSettled([getOrganization(visible.clientId), getBusinessProfile()])
        if (!active) return
        if (orgResult.status === "fulfilled") setOrganization(orgResult.value)
        if (profileResult.status === "fulfilled") setIssuer(profileResult.value)
      })
      .catch(() => {
        if (active) {
          setRecord(null)
          setLoading(false)
        }
      })
    return () => { active = false }
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </main>
    )
  }

  if (!record) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <p className="text-sm text-muted-foreground">This link is no longer available.</p>
      </main>
    )
  }

  const companyName = organization?.name || record.client
  const coverProject: Project = {
    id: record.clientId,
    clientId: record.clientId,
    client: companyName,
    title: companyName,
    service: "",
    status: "in-progress",
    progress: 0,
    dueDate: "",
    thumbnailUrl: organization?.logoUrl,
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex justify-end print:hidden">
          <DocumentActions title={`${companyName} ${record.title}`} />
        </div>
        <div className="mb-6 print:hidden">
          <CompanyBanner name={companyName} categoryLabel={organization?.industry ?? ""} coverProject={coverProject} />
        </div>
        <CompanyDocumentView document={record} issuer={issuer ?? undefined} />
        <p className="mt-6 text-center text-xs text-muted-foreground print:hidden">Shared by VisualHQ</p>
      </div>
    </main>
  )
}
