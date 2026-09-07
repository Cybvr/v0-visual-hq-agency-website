"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { CompanyPage } from "@/components/company/company-page"
import {
  getContractsByClientId,
  getInvoicesByClientId,
  getSharedEstimatesByClientId,
  type Contract,
  type Estimate,
  type Invoice,
} from "@/lib/billing"
import { getCaseStudyProjectsByClientId, type CaseStudyProject } from "@/lib/case-studies"
import { getOrganizationByRef, type Organization } from "@/lib/organizations"

/**
 * A company's public page - visualcns.com/{organization.slug}. Data loading is
 * public-safe; the rendered profile is the same component used by the admin.
 */
export default function PublicCompanyPage() {
  const params = useParams<{ clientSlug: string }>()
  const ref = params?.clientSlug ?? ""

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [projects, setProjects] = useState<CaseStudyProject[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const org = await getOrganizationByRef(ref)
        if (!active) return
        if (!org) {
          setMissing(true)
          return
        }
        setOrganization(org)
        const [projectResult, invoiceResult, contractResult, estimateResult] = await Promise.allSettled([
          getCaseStudyProjectsByClientId(org.id),
          getInvoicesByClientId(org.id),
          getContractsByClientId(org.id),
          getSharedEstimatesByClientId(org.id),
        ])
        if (!active) return
        setProjects(projectResult.status === "fulfilled" ? projectResult.value : [])
        setInvoices(invoiceResult.status === "fulfilled" ? invoiceResult.value : [])
        setContracts(contractResult.status === "fulfilled" ? contractResult.value : [])
        setEstimates(estimateResult.status === "fulfilled" ? estimateResult.value : [])
      } catch {
        if (active) setMissing(true)
      } finally {
        if (active) setLoading(false)
      }
    }
    if (ref) void load()
    return () => {
      active = false
    }
  }, [ref])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (missing || !organization) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-40 text-center sm:px-6">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">There&apos;s no company at this address.</p>
      </div>
    )
  }

  const team = organization.publicTeam ?? []
  const categoryLabel = [
    organization.industry,
    projects.length ? `${projects.length} case ${projects.length === 1 ? "study" : "studies"}` : "",
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <CompanyPage
      company={{
        id: organization.id,
        name: organization.name,
        logoUrl: organization.logoUrl,
        categoryLabel,
        industry: organization.industry,
        location: organization.location,
        website: organization.website,
      }}
      people={team.map((person) => ({
        id: person.uid,
        name: person.name,
        role: person.role,
        photoUrl: person.photoUrl,
      }))}
      projects={projects}
      invoices={invoices}
      contracts={contracts}
      estimates={estimates}
      emptyProjectsLabel="No published projects yet."
    />
  )
}
