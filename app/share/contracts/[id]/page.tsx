"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { CompanyBanner } from "@/components/company/company-banner"
import { ContractDocument } from "@/components/dashboard/contract-document"
import { DocumentActions } from "@/components/dashboard/document-actions"
import { getContract, type Contract } from "@/lib/billing"
import { getOrganization, type Organization } from "@/lib/organizations"
import type { Project } from "@/lib/projects"

/** No login required: issued company contracts are public; drafts stay private. */
export default function SharedContractPage() {
  const { id } = useParams<{ id: string }>()
  const [contract, setContract] = useState<Contract | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    getContract(id)
      .then(async (record) => {
        if (!active) return
        const visible = record && record.status !== "draft" ? record : null
        setContract(visible)
        setLoading(false)
        // The org header is nice-to-have on top of the contract itself, so a
        // failure here never blocks the document from showing.
        if (!visible) return
        try {
          const org = await getOrganization(visible.clientId)
          if (active) setOrganization(org)
        } catch {
          // Header just stays without a logo/industry.
        }
      })
      .catch(() => {
        if (active) {
          setContract(null)
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </main>
    )
  }

  if (!contract) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <p className="text-sm text-muted-foreground">This link is no longer available.</p>
      </main>
    )
  }

  const companyName = organization?.name || contract.client
  const coverProject: Project = {
    id: contract.clientId,
    clientId: contract.clientId,
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
          <DocumentActions url={contract.url} title={`${companyName} Contract`} />
        </div>
        <div className="mb-6 print:hidden">
          <CompanyBanner name={companyName} categoryLabel={organization?.industry ?? ""} coverProject={coverProject} />
        </div>
        <ContractDocument contract={contract} />
        <p className="mt-6 text-center text-xs text-muted-foreground print:hidden">Shared by VisualHQ</p>
      </div>
    </main>
  )
}
