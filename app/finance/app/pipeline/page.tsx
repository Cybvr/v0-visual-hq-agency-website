import Link from "next/link"
import {
  ddConfidence,
  deals,
  marketSentiment,
  pipelineStages,
  recentActivity,
  type ActivityIconTone,
  type DealStageTone,
  type PartnerAvatarTone,
  type PipelineStageTone,
} from "@/lib/finance/pipeline"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/finance/page-header"

const stageLabelClasses: Record<PipelineStageTone, string> = {
  primary: "text-(--fin-outline)",
  secondary: "text-(--fin-outline)",
  highlight: "text-(--fin-secondary-container)",
  closed: "text-(--fin-outline)",
}

const stageBarClasses: Record<PipelineStageTone, string> = {
  primary: "bg-(--fin-primary)",
  secondary: "bg-(--fin-secondary)",
  highlight: "bg-(--fin-secondary-container)",
  closed: "bg-(--fin-on-tertiary-fixed-variant)",
}

const dealStageBadgeClasses: Record<DealStageTone, string> = {
  "due-diligence": "bg-(--fin-secondary-container) text-(--fin-on-secondary-container)",
  loi: "bg-[#d8e3fa] text-[#111c2c]",
  neutral: "bg-(--fin-surface-variant) text-(--fin-outline)",
  stalled: "bg-(--fin-error-container) text-(--fin-on-error-container)",
}

const partnerAvatarClasses: Record<PartnerAvatarTone, string> = {
  primary: "bg-(--fin-primary-fixed)",
  secondary: "bg-(--fin-secondary-fixed-dim)",
  tertiary: "bg-(--fin-tertiary-fixed)",
}

const activityChipClasses: Record<ActivityIconTone, string> = {
  "secondary-container": "bg-(--fin-secondary-container)",
  "tertiary-dark": "bg-(--fin-on-tertiary-fixed-variant)",
  "secondary-fixed": "bg-(--fin-secondary-fixed)",
  muted: "bg-(--fin-surface-container-high)",
}

const activityIconClasses: Record<ActivityIconTone, string> = {
  "secondary-container": "text-(--fin-on-secondary-container)",
  "tertiary-dark": "text-white",
  "secondary-fixed": "text-(--fin-on-secondary-fixed)",
  muted: "text-(--fin-outline)",
}

export default function DealPipelinePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/app" },
          { label: "Deal Pipeline" },
        ]}
        eyebrow="Pipeline"
        title="Deal Pipeline"
        subtitle="Q4 acquisition targets, sourcing coverage, and diligence momentum across the active pipeline."
      />

      <section className="mb-8 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-[4px] border border-(--fin-outline-variant) bg-(--fin-surface-container-low) px-4 py-2">
          <span className="material-symbols-outlined text-(--fin-outline)">search</span>
          <input
            className="w-48 border-none bg-transparent text-sm focus:outline-none"
            placeholder="Search targets..."
            type="text"
          />
        </div>
        <button className="flex items-center gap-2 rounded-[4px] bg-(--fin-primary) px-6 py-2.5 text-sm font-semibold text-(--fin-on-primary) transition-all duration-100 hover:bg-(--fin-primary-container) active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Add New Target
        </button>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {pipelineStages.map((stage) => (
          <div
            key={stage.label}
            className={cn(
              "flex flex-col items-center justify-center rounded-[8px] border border-(--fin-outline-variant) bg-white p-4 text-center",
              stage.tone === "highlight" && "border-l-4 border-l-(--fin-secondary-container)",
            )}
          >
            <span className={cn("mb-1 text-xs font-semibold tracking-[0.02em]", stageLabelClasses[stage.tone])}>
              {stage.label}
            </span>
            <div className="fin-headline-md text-[32px] leading-10 text-(--fin-primary)">{stage.count}</div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-(--fin-surface-container)">
              <div className={cn("h-full", stageBarClasses[stage.tone])} style={{ width: `${stage.progress}%` }} />
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div className="overflow-hidden rounded-[8px] border border-(--fin-outline-variant) bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) px-6 py-4">
              <p className="text-xl font-semibold leading-7 text-(--fin-primary)">Active Opportunities</p>
              <div className="flex gap-2">
                <button aria-label="Filter opportunities" className="rounded-[4px] p-2 transition-colors hover:bg-(--fin-surface-container-low)">
                  <span className="material-symbols-outlined text-(--fin-outline)">filter_list</span>
                </button>
                <button aria-label="More options" className="rounded-[4px] p-2 transition-colors hover:bg-(--fin-surface-container-low)">
                  <span className="material-symbols-outlined text-(--fin-outline)">more_vert</span>
                </button>
              </div>
            </div>
            <div className="fin-scrollbar overflow-x-auto">
              <table className="fin-tabular w-full border-collapse text-left">
                <thead className="bg-(--fin-surface-container-low) uppercase tracking-wider text-(--fin-outline)">
                  <tr>
                    <th className="px-6 py-3 text-[11px] font-semibold">Target Name</th>
                    <th className="px-6 py-3 text-[11px] font-semibold">Size ($M)</th>
                    <th className="px-6 py-3 text-[11px] font-semibold">Sector</th>
                    <th className="px-6 py-3 text-[11px] font-semibold">Stage</th>
                    <th className="px-6 py-3 text-[11px] font-semibold">Lead Partner</th>
                    <th className="px-6 py-3 text-[11px] font-semibold" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--fin-outline-variant) text-sm text-(--fin-on-surface)">
                  {deals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-(--fin-on-surface-variant)">
                        No active opportunities in the pipeline.
                      </td>
                    </tr>
                  )}
                  {deals.map((deal) => (
                    <tr
                      key={deal.id}
                      className={cn(
                        "transition-colors hover:bg-(--fin-surface-container-low)",
                        deal.highlighted && "bg-(--fin-secondary-fixed)/10",
                      )}
                    >
                      <td className="px-6 py-4 font-semibold text-(--fin-primary)">{deal.name}</td>
                      <td className="px-6 py-4">{deal.size}</td>
                      <td className="px-6 py-4">{deal.sector}</td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            dealStageBadgeClasses[deal.stageTone],
                          )}
                        >
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                              partnerAvatarClasses[deal.partnerAvatarTone],
                            )}
                          >
                            {deal.partnerInitials}
                          </div>
                          {deal.partner}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/finance/app/analysis?deal=${deal.id}`}
                          className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) hover:underline"
                        >
                          Open Analysis
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative flex items-center justify-between overflow-hidden rounded-[8px] bg-(--fin-primary) p-8 text-(--fin-on-primary)">
            <div className="relative z-10 max-w-md">
              <h2 className="fin-headline-md mb-2 text-2xl">{marketSentiment.title}</h2>
              <p className="mb-6 text-sm opacity-80">{marketSentiment.body}</p>
              <button className="rounded-[4px] bg-(--fin-on-primary) px-5 py-2 text-sm font-semibold text-(--fin-primary) transition-colors hover:bg-(--fin-primary-fixed)">
                {marketSentiment.cta}
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4">
          <div className="rounded-[8px] border border-(--fin-outline-variant) bg-white shadow-sm">
            <div className="border-b border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) px-6 py-4">
              <p className="text-xl font-semibold leading-7 text-(--fin-primary)">Recent Activity</p>
            </div>
            <div className="space-y-6 p-6">
              {recentActivity.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                      activityChipClasses[item.iconTone],
                    )}
                  >
                    <span className={cn("material-symbols-outlined text-sm", activityIconClasses[item.iconTone])}>
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-(--fin-on-surface-variant)">{item.description}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-(--fin-outline)">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-(--fin-outline-variant) bg-(--fin-surface-container-low) px-6 py-4 text-center">
              <Link
                href="/finance/app/activity"
                className="text-xs font-semibold tracking-[0.02em] text-(--fin-primary) hover:underline"
              >
                View All Notifications
              </Link>
            </div>
          </div>

          <div className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.02em] text-(--fin-outline)">
                  {ddConfidence.label}
                </p>
                <p className="text-2xl font-bold text-(--fin-primary)">{ddConfidence.score}</p>
              </div>
              <span className="material-symbols-outlined text-3xl text-(--fin-primary)">{ddConfidence.icon}</span>
            </div>
            <div className="space-y-3">
              {ddConfidence.metrics.map((metric, index) => (
                <div key={metric.label}>
                  <div className={cn("flex items-center justify-between text-xs", index > 0 && "pt-2")}>
                    <span className="text-(--fin-on-surface-variant)">{metric.label}</span>
                    <span className="font-bold">{metric.value}%</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-(--fin-surface-container)">
                    <div
                      className={cn("h-full", metric.tone === "primary" ? "bg-(--fin-primary)" : "bg-(--fin-secondary)")}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-(--fin-outline-variant) pt-4 text-xs italic leading-relaxed text-(--fin-on-surface-variant)">
              {ddConfidence.note}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
