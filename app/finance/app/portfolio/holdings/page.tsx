import { cn } from "@/lib/utils"
import {
  holdingCompanies,
  holdingsTotal,
  type HoldingAvatarTone,
} from "@/lib/finance/portfolio"
import { PageHeader } from "@/components/finance/page-header"
import { PortfolioSubnav } from "@/components/finance/portfolio-subnav"

const holdingAvatarClasses: Record<HoldingAvatarTone, string> = {
  "primary-container": "bg-(--fin-primary-container) text-(--fin-on-primary-container)",
  secondary: "bg-(--fin-secondary) text-(--fin-on-secondary)",
  tertiary: "bg-(--fin-tertiary) text-(--fin-on-tertiary)",
  outline: "bg-(--fin-outline) text-white",
}

export default function HoldingsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/app" },
          { label: "Portfolio", href: "/finance/app/portfolio" },
          { label: "Holdings" },
        ]}
        eyebrow="Portfolio"
        title="Holdings"
        subtitle={`Review the current portfolio roster, operating profile, and trend direction across ${holdingsTotal} holdings.`}
      />

      <PortfolioSubnav />

      <section className="overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white">
        <table className="fin-tabular w-full border-collapse text-left">
          <thead>
            <tr className="bg-(--fin-surface-container-low)">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">Company</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">Sector</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">Revenue (LTM)</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">EBITDA %</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">Net Debt</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-(--fin-on-surface-variant)">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--fin-outline-variant)/30">
            {holdingCompanies.map((company) => (
              <tr
                key={company.name}
                className={cn(
                  "transition-colors hover:bg-(--fin-surface-container-lowest)",
                  company.highlighted && "bg-(--fin-secondary-fixed)/10",
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-[2px] text-xs font-bold",
                        holdingAvatarClasses[company.avatarTone],
                      )}
                    >
                      {company.initials}
                    </div>
                    <span className="text-sm font-semibold text-(--fin-primary)">{company.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-(--fin-on-surface-variant)">{company.sector}</td>
                <td className="px-6 py-4 text-sm">{company.revenue}</td>
                <td className="px-6 py-4 text-sm">{company.ebitdaMargin}</td>
                <td className="px-6 py-4 text-sm">{company.netDebt}</td>
                <td className="px-6 py-4">
                  <svg className="h-8 w-24" viewBox="0 0 100 30">
                    <path
                      d={company.sparklinePath}
                      fill="none"
                      stroke={company.sparklineStroke ?? "#1a365d"}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
