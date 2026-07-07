import Link from "next/link"
import { PageHeader } from "@/components/finance/page-header"
import { pendingDeliverables } from "@/lib/finance/portfolio"
import { recentActivity } from "@/lib/finance/pipeline"

const iconToneClass = {
  history_edu: "bg-(--fin-secondary-container) text-(--fin-on-secondary-container)",
  check_circle: "bg-(--fin-on-tertiary-fixed-variant) text-white",
  mail: "bg-(--fin-secondary-fixed) text-(--fin-on-secondary-fixed)",
  person_add: "bg-(--fin-surface-container-high) text-(--fin-outline)",
} as const

export default function ActivityPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/app" },
          { label: "Activity" },
        ]}
        eyebrow="Workspace"
        title="Activity"
        subtitle="A fuller view of recent updates, alerts, and follow-ups across the finance workspace."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 lg:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold leading-7 text-(--fin-primary)">Recent Updates</h2>
            <Link
              href="/finance/app/pipeline"
              className="text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) hover:underline"
            >
              Back to pipeline
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-[6px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-4"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconToneClass[item.icon as keyof typeof iconToneClass]}`}>
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-semibold text-(--fin-primary)">{item.title}</p>
                    <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-(--fin-outline)">
                      {item.time}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-(--fin-on-surface-variant)">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6 lg:col-span-4">
          <h2 className="mb-6 text-xl font-semibold leading-7 text-(--fin-primary)">Open Follow-Ups</h2>
          <div className="space-y-3">
            {pendingDeliverables.map((deliverable) => (
              <div
                key={deliverable.title}
                className="rounded-[6px] border border-(--fin-outline-variant) bg-(--fin-surface-container-lowest) p-4"
              >
                <p className="text-sm font-semibold text-(--fin-primary)">{deliverable.title}</p>
                <p className="mt-1 text-xs text-(--fin-on-surface-variant)">{deliverable.subtitle}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}
