import { InfoCard } from "@/components/company/info-card"

/**
 * The Industry/Location/Team/Website row shown on the Overview section.
 * Identical on the admin company dashboard and the public company page -
 * this was previously written out twice, once per page.
 */
export function CompanyOverviewGrid({
  industry,
  location,
  website,
  teamCount,
}: {
  industry?: string
  location?: string
  website?: string
  teamCount: number
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <InfoCard label="Industry" value={industry ?? ""} />
      <InfoCard label="Location" value={location ?? ""} />
      <InfoCard label="Team" value={`${teamCount} ${teamCount === 1 ? "person" : "people"}`} />
      <InfoCard label="Website" value={website ?? ""} />
    </div>
  )
}
