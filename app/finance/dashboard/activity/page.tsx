import Link from "next/link"
import { ArrowLeft, CheckCircle2, FileText, Mail, UserPlus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { PageHeader } from "@/components/finance/page-header"
import { pendingDeliverables } from "@/lib/finance/portfolio"
import { recentActivity } from "@/lib/finance/pipeline"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"

const activityChipClasses: Record<string, string> = {
  history_edu: "bg-accent/15 text-primary",
  check_circle: "bg-foreground text-background",
  mail: "bg-primary/10 text-primary",
  person_add: "bg-muted text-muted-foreground",
}

const activityIconMap: Record<string, LucideIcon> = {
  history_edu: FileText,
  check_circle: CheckCircle2,
  mail: Mail,
  person_add: UserPlus,
}

export default function ActivityPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Activity" },
        ]}
        eyebrow="Workspace"
        title="Activity"
        subtitle="A fuller view of recent updates, alerts, and follow-ups across the finance workspace."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <Card className="shadow-none">
            <CardHeader className="border-b">
              <CardTitle>Recent Updates</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/finance/dashboard/pipeline">
                    <ArrowLeft className="size-3.5" />
                    Back to pipeline
                  </Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4 px-6 py-5">
              {recentActivity.map((item) => {
                const Icon = activityIconMap[item.icon] ?? FileText
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-md border bg-card p-4"
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full",
                        activityChipClasses[item.icon] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {item.time}
                        </p>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        <aside className="lg:col-span-4">
          <Card className="shadow-none">
            <CardHeader className="border-b">
              <CardTitle>Open Follow-Ups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6 py-5">
              {pendingDeliverables.map((deliverable) => (
                <div
                  key={deliverable.title}
                  className="rounded-md border bg-card p-4"
                >
                  <p className="text-sm font-semibold">{deliverable.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{deliverable.subtitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  )
}

