import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"
import {
  createModelPlaceholder,
  featuredDeal,
  modelCards,
  modelingHubMeta,
  modelingTabs,
  portfolioSummary,
  syncRows,
  syncSection,
  type ModelBadgeTone,
  type ModelIconStyle,
  type SyncStatusTone,
} from "@/lib/finance/modeling"
import { deriveFinancials, formatEvShort, getFinancials } from "@/lib/finance/deal-financials"
import { resolveDeal } from "@/lib/finance/pipeline"

export const metadata: Metadata = {
  title: "Financial Modeling & Valuation Hub | Visualcns Finance",
}

const labelMd = "text-xs font-semibold tracking-[0.02em]"

const cardDepth =
  "shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.02)]"

const modelIconStyles: Record<ModelIconStyle, string> = {
  "tertiary-fixed": "bg-(--fin-tertiary-fixed) text-(--fin-primary)",
  "surface-highest": "bg-(--fin-surface-container-highest) text-(--fin-primary)",
  "primary-container": "bg-(--fin-primary-container) text-(--fin-on-primary-container)",
}

const badgeToneStyles: Record<ModelBadgeTone, string> = {
  green: "border-(--fin-secondary-container) bg-(--fin-secondary-container) text-(--fin-on-secondary-container)",
  amber: "border-(--fin-outline-variant) bg-(--fin-surface-container-high) text-(--fin-on-surface-variant)",
  blue: "border-(--fin-primary-container) bg-(--fin-primary-container) text-(--fin-on-primary-container)",
}

const statusToneStyles: Record<SyncStatusTone, string> = {
  green: "bg-(--fin-secondary-container) text-(--fin-on-secondary-container)",
  amber: "bg-(--fin-surface-container-high) text-(--fin-on-surface-variant)",
  blue: "bg-(--fin-primary-container) text-(--fin-on-primary-container)",
}

const integrityToneStyles: Record<"green" | "amber", string> = {
  green: "text-(--fin-secondary)",
  amber: "text-(--fin-on-surface-variant)",
}

const avatarStyles: Record<"primary" | "secondary" | "tertiary", string> = {
  primary: "bg-(--fin-primary)",
  secondary: "bg-(--fin-secondary)",
  tertiary: "bg-(--fin-tertiary)",
}

interface ModelingHubPageProps {
  searchParams: Promise<{ deal?: string }>
}

export default async function ModelingHubPage({ searchParams }: ModelingHubPageProps) {
  const { deal: dealId } = await searchParams
  const deal = resolveDeal(dealId)
  // The featured "active model" is scoped to the selected deal; the rest of the
  // library (other models/sync rows) stays as-is.
  const activeModel = {
    ...featuredDeal,
    name: `${deal.name} — Platform LBO`,
    sector: `Sector: ${deal.sector}`,
    ev: formatEvShort(deriveFinancials(getFinancials(deal.id)).enterpriseValueM),
  }

  return (
    <>
      {/* Page header */}
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/app" },
          { label: "Analysis", href: "/finance/app/analysis" },
          { label: deal.name, href: `/finance/app/analysis?deal=${deal.id}` },
          { label: "Financial Modeling" },
        ]}
        eyebrow={deal.name}
        title="Financial Modeling"
        subtitle="Valuation workbooks and synchronization status for this deal."
      />

      <AnalysisSubnav dealId={deal.id} />

      <section className="mb-8 flex items-center gap-4">
        <div className="relative">
          <input
            className="h-10 w-80 rounded-full border border-(--fin-outline-variant) bg-(--fin-surface-container-low) pl-10 pr-4 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-(--fin-primary)"
            placeholder={modelingHubMeta.searchPlaceholder}
            type="text"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-(--fin-on-surface-variant)">
            search
          </span>
        </div>
        <div className="ml-2 flex items-center gap-2 border-l border-(--fin-outline-variant) pl-4">
          <button aria-label="Filter models" className="rounded-full p-2 text-(--fin-on-surface-variant) transition-colors hover:bg-(--fin-surface-container)">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button aria-label="Toggle view layout" className="rounded-full p-2 text-(--fin-on-surface-variant) transition-colors hover:bg-(--fin-surface-container)">
            <span className="material-symbols-outlined">view_module</span>
          </button>
        </div>
      </section>

      <div className="space-y-12">
        {/* Priority assets */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <p className="flex items-center gap-2 text-xl font-semibold leading-7 text-(--fin-primary)">
              <span className="material-symbols-outlined text-(--fin-secondary)">stars</span>
              Priority Assets
            </p>
            <button className={cn(labelMd, "text-(--fin-secondary) hover:underline")}>View Active Bids</button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Featured deal card */}
            <div
              className={cn(
                cardDepth,
                "flex flex-col overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white md:flex-row lg:col-span-2",
              )}
            >
              <div className="relative h-48 md:h-auto md:w-2/5">
                <img alt={activeModel.imageAlt} className="h-full w-full object-cover" src={activeModel.image} />
                <div className="absolute inset-0 bg-(--fin-primary)/10" />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-(--fin-primary) px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-(--fin-on-primary)">
                    {activeModel.badge}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xl font-bold text-(--fin-primary)">{activeModel.name}</p>
                    <p className={cn(labelMd, "text-(--fin-on-surface-variant)")}>{activeModel.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold leading-7 text-(--fin-primary)">{activeModel.ev}</p>
                    <p className="text-[10px] font-bold uppercase text-(--fin-on-surface-variant)">
                      {activeModel.evLabel}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid flex-1 grid-cols-2 gap-4">
                  {activeModel.meta.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[4px] border border-(--fin-outline-variant)/30 bg-(--fin-surface-container-low) p-3"
                    >
                      <p className="text-[10px] font-bold uppercase text-(--fin-on-surface-variant)">{item.label}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={cn(
                            "material-symbols-outlined text-[18px]",
                            item.iconFilled
                              ? "fin-icon-fill text-(--fin-secondary)"
                              : "text-(--fin-on-surface-variant)",
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className={cn(labelMd, "text-(--fin-primary)")}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    className={cn(
                      labelMd,
                      "flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-(--fin-primary) py-2.5 text-(--fin-on-primary) transition-colors hover:bg-(--fin-primary-container)",
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_document</span>
                    {activeModel.primaryAction}
                  </button>
                  <button
                    className={cn(
                      labelMd,
                      "flex flex-1 items-center justify-center gap-2 rounded-[4px] border border-(--fin-outline) py-2.5 text-(--fin-primary) transition-colors hover:bg-(--fin-surface-container)",
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">table_chart</span>
                    {activeModel.secondaryAction}
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio summary card */}
            <div
              className={cn(
                cardDepth,
                "relative flex flex-col justify-between overflow-hidden rounded-[8px] bg-(--fin-primary) p-6 text-(--fin-on-primary)",
              )}
            >
              <div className="relative z-10">
                <p className={cn(labelMd, "mb-1 uppercase tracking-widest text-(--fin-on-primary-container)")}>
                  {portfolioSummary.eyebrow}
                </p>
                <p className="fin-headline-md text-2xl">{portfolioSummary.title}</p>
                <div className="mt-8 space-y-4">
                  {portfolioSummary.stats.map((stat) => (
                    <div key={stat.label} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-80">{stat.label}</span>
                        <span className="text-xl font-semibold leading-7">{stat.value}</span>
                      </div>
                      {stat.pct !== undefined && (
                        <div className="h-1 w-full overflow-hidden rounded-full bg-(--fin-on-primary)/10">
                          <div
                            className="h-full bg-(--fin-secondary-container)"
                            style={{ width: `${stat.pct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-8">
                <button
                  className={cn(
                    labelMd,
                    "w-full rounded-[4px] bg-white py-2 font-bold text-(--fin-primary) transition-colors hover:bg-(--fin-secondary-fixed)",
                  )}
                >
                  {portfolioSummary.ctaLabel}
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <span className="material-symbols-outlined text-[180px]">monitoring</span>
              </div>
            </div>
          </div>
        </section>

        {/* Library categorization */}
        <section>
          <div className="fin-scrollbar mb-8 flex items-center gap-8 overflow-x-auto whitespace-nowrap border-b border-(--fin-outline-variant)">
            {modelingTabs.map((tab, index) => (
              <button
                key={tab.label}
                className={cn(
                  labelMd,
                  "flex items-center gap-2 px-1 pb-4",
                  index === 0
                    ? "border-b-2 border-(--fin-primary) font-bold text-(--fin-primary)"
                    : "text-(--fin-on-surface-variant) transition-colors hover:text-(--fin-primary)",
                )}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modelCards.map((model) => (
              <div
                key={model.name}
                className={cn(
                  cardDepth,
                  "group flex flex-col rounded-[8px] border border-(--fin-outline-variant) bg-white p-5",
                )}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-[2px]",
                      modelIconStyles[model.iconStyle],
                    )}
                  >
                    <span className="material-symbols-outlined">{model.icon}</span>
                  </div>
                  {model.badge && (
                    <div className="flex gap-1">
                      <span
                        className={cn(
                          "rounded-[2px] border px-2 py-0.5 text-[10px] font-bold",
                          badgeToneStyles[model.badge.tone],
                        )}
                      >
                        {model.badge.label}
                      </span>
                      <button aria-label="More options" className="text-(--fin-on-surface-variant) hover:text-(--fin-primary)">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xl font-semibold leading-7 text-(--fin-primary) transition-colors group-hover:text-(--fin-secondary)">
                  {model.name}
                </p>
                <p className={cn(labelMd, "mt-1 text-(--fin-on-surface-variant)")}>{model.type}</p>
                <div className="mt-6 flex items-center gap-4 text-(--fin-on-surface-variant)">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span className="text-[11px] font-bold">{model.updated}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">{model.linkIcon}</span>
                    <span className="text-[11px] font-bold">{model.linkLabel}</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-2 border-t border-(--fin-outline-variant) pt-4">
                  <button
                    className={cn(
                      labelMd,
                      "flex-1 rounded-[2px] bg-(--fin-surface-container-high) py-1.5 font-bold text-(--fin-primary) transition-colors hover:bg-(--fin-surface-container-highest)",
                    )}
                  >
                    EDIT
                  </button>
                  <button
                    className={cn(
                      labelMd,
                      "flex-1 rounded-[2px] border border-(--fin-outline-variant) py-1.5 text-(--fin-on-surface-variant) transition-colors hover:bg-(--fin-surface-container-low)",
                    )}
                  >
                    EXCEL
                  </button>
                </div>
              </div>
            ))}

            {/* Create new model placeholder */}
            <div className="group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-(--fin-outline-variant) p-5 transition-colors hover:bg-(--fin-surface-container-low)">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-(--fin-outline-variant) text-(--fin-outline-variant) transition-all group-hover:border-(--fin-primary) group-hover:text-(--fin-primary)">
                <span className="material-symbols-outlined text-[32px]">add</span>
              </div>
              <p className="mt-4 font-bold text-(--fin-on-surface-variant) transition-colors group-hover:text-(--fin-primary)">
                {createModelPlaceholder.title}
              </p>
              <p className="mt-1 px-4 text-center text-[11px] text-(--fin-on-surface-variant)/60">
                {createModelPlaceholder.description}
              </p>
            </div>
          </div>
        </section>

        {/* Model sync status */}
        <section className="overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white">
          <div className="flex items-center justify-between border-b border-(--fin-outline-variant) p-6">
            <div>
              <p className="text-xl font-semibold leading-7 text-(--fin-primary)">{syncSection.title}</p>
              <p className={cn(labelMd, "text-(--fin-on-surface-variant)")}>{syncSection.subtitle}</p>
            </div>
            <button className={cn(labelMd, "flex items-center gap-2 font-bold text-(--fin-secondary) hover:underline")}>
              <span className="material-symbols-outlined text-[18px]">sync</span> {syncSection.refreshLabel}
            </button>
          </div>
          <div className="fin-scrollbar overflow-x-auto">
            <table className="fin-tabular w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-(--fin-outline-variant) bg-(--fin-surface-container-low)">
                  {syncSection.columns.map((column) => (
                    <th
                      key={column}
                      className={cn(labelMd, "px-6 py-4 font-bold uppercase tracking-wider text-(--fin-primary)")}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-(--fin-outline-variant)/30">
                {syncRows.map((row) => (
                  <tr
                    key={row.model}
                    className={cn(
                      "transition-colors hover:bg-(--fin-surface-container-low)",
                      row.highlighted && "bg-(--fin-secondary-fixed)/10",
                    )}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-(--fin-primary)">{row.model}</td>
                    <td className="px-6 py-4">
                      <div className={cn("flex items-center gap-2", integrityToneStyles[row.integrity.tone])}>
                        <span
                          className={cn(
                            "material-symbols-outlined text-[18px]",
                            row.integrity.iconFilled && "fin-icon-fill",
                          )}
                        >
                          {row.integrity.icon}
                        </span>
                        <span className={labelMd}>{row.integrity.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {row.link ? (
                        <span className="rounded-[2px] bg-(--fin-surface-container) px-2 py-1 text-[11px] font-bold text-(--fin-primary)">
                          {row.link}
                        </span>
                      ) : (
                        <span className="text-[11px] italic text-(--fin-on-surface-variant)">No active link</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusToneStyles[row.status.tone],
                        )}
                      >
                        {row.status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white",
                            avatarStyles[row.user.avatar],
                          )}
                        >
                          {row.user.initials}
                        </div>
                        <span className={cn(labelMd, "text-(--fin-on-surface-variant)")}>{row.user.name}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Floating quick access action */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-(--fin-secondary-container) text-(--fin-on-secondary-container) shadow-lg transition-transform hover:scale-105">
          <span className="material-symbols-outlined fin-icon-fill text-[28px]">bolt</span>
        </button>
      </div>
    </>
  )
}
