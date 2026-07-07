import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  initiatives,
  type InitiativeStatusTone,
} from "@/lib/finance/portfolio"
import { PageHeader } from "@/components/finance/page-header"

const initiativeStatusClasses: Record<InitiativeStatusTone, string> = {
  "on-track": "bg-(--fin-primary)/10 text-(--fin-primary)",
  delayed: "bg-(--fin-error-container) text-(--fin-error)",
  completed: "bg-(--fin-secondary-fixed) text-(--fin-primary)",
}

export default function InitiativesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Value Creation Initiatives"
        subtitle="Track operating improvement workstreams, current status, and execution progress across the portfolio."
      />

      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/finance/app/portfolio"
          className="text-xs font-semibold tracking-[0.02em] text-(--fin-secondary) hover:underline"
        >
          Back to portfolio
        </Link>
        <button className="rounded-[4px] bg-(--fin-primary) px-4 py-2 text-xs font-semibold tracking-[0.02em] text-(--fin-on-primary)">
          Log New Initiative
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {initiatives.map((initiative) => (
          <div
            key={initiative.name}
            className="rounded-[8px] border border-(--fin-outline-variant) bg-white p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-(--fin-primary)">{initiative.name}</h2>
                <p className="mt-1 text-sm text-(--fin-on-surface-variant)">{initiative.context}</p>
              </div>
              <span
                className={cn(
                  "rounded-[4px] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
                  initiativeStatusClasses[initiative.statusTone],
                )}
              >
                {initiative.status}
              </span>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-(--fin-on-surface-variant)">Progress</span>
                <span className="font-bold text-(--fin-primary)">{initiative.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-(--fin-surface-container)">
                <div
                  className={cn(
                    "h-full",
                    initiative.statusTone === "delayed" ? "bg-(--fin-error)" : "bg-(--fin-primary)",
                  )}
                  style={{ width: `${initiative.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
