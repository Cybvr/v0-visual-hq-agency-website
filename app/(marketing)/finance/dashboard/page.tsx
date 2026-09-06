import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  Mail,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { PageHeader } from "@/components/finance/page-header"
import { pipelineStages, recentActivity, type ActivityIconTone } from "@/lib/finance/pipeline"
import { portfolioKpis } from "@/lib/finance/portfolio"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const workspaceCards = [
  {
    title: "Deal Pipeline",
    description: "Source targets, review active opportunities, and manage the current funnel.",
    href: "/finance/dashboard/pipeline",
    icon: BriefcaseBusiness,
    cta: "Open pipeline",
  },
  {
    title: "Analysis",
    description: "Run the diligence workflow from intake through QofE, benchmarking, and modeling.",
    href: "/finance/dashboard/analysis",
    icon: ClipboardList,
    cta: "Open analysis",
  },
  {
    title: "Portfolio",
    description: "Track post-close performance, value creation, and operational signals across holdings.",
    href: "/finance/dashboard/portfolio",
    icon: TrendingUp,
    cta: "Open portfolio",
  },
  {
    title: "Reports",
    description: "Review investor-facing reports, capital activity, and communication workflows.",
    href: "/finance/dashboard/reports",
    icon: Users,
    cta: "Open reports",
  },
]

const attentionLinks = [
  "/finance/dashboard/pipeline",
  "/finance/dashboard/pipeline",
  "/finance/dashboard/portfolio",
  "/finance/dashboard/portfolio",
] as const

const activityChipClasses: Record<ActivityIconTone, string> = {
  "secondary-container": "bg-accent/15 text-primary",
  "tertiary-dark": "bg-foreground text-background",
  "secondary-fixed": "bg-primary/10 text-primary",
  muted: "bg-muted text-muted-foreground",
}

const activityIconMap: Record<string, LucideIcon> = {
  history_edu: FileText,
  check_circle: CheckCircle2,
  mail: Mail,
  person_add: UserPlus,
}

export default function FinanceDashboardPage() {
  const attentionItems = [
    {
      label: "Pipeline",
      value: pipelineStages[3]?.count ?? 0,
      description: "Deals in due diligence",
    },
    {
      label: "Sourcing",
      value: pipelineStages[0]?.count ?? 0,
      description: "Active sourced targets",
    },
    ...portfolioKpis.slice(0, 2).map((kpi) => ({
      label: kpi.label,
      value: kpi.value,
      description: "Current portfolio signal",
    })),
  ]

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home" }]}
        eyebrow="Finance Workspace"
        title="Overview"
        subtitle="A single home for pipeline priorities, analysis progress, portfolio signals, and investor reporting."
      />

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {workspaceCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.title} href={card.href} className="group block">
              <Card className="h-full shadow-none transition-colors hover:border-primary">
                <CardContent className="flex h-full flex-col justify-between gap-6 px-6">
                  <div>
                    <div className="mb-6 flex size-11 items-center justify-center rounded-md bg-muted text-primary">
                      <Icon className="size-5" strokeWidth={2} />
                    </div>
                    <h2 className="text-xl">{card.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.description}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    {card.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="shadow-none lg:col-span-7">
          <CardHeader className="border-b">
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {attentionItems.map((item, index) => (
                <Link
                  key={item.label}
                  href={attentionLinks[index]}
                  className="group rounded-md border p-4 transition-colors hover:border-primary"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </p>
                  <h3 className="mt-2 text-2xl text-primary tabular-nums">{item.value}</h3>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none lg:col-span-5">
          <CardHeader className="border-b">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6">
            {recentActivity.slice(0, 4).map((item) => {
              const Icon = activityIconMap[item.icon] ?? FileText
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex gap-3 rounded-md border p-4 transition-colors hover:border-primary"
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      activityChipClasses[item.iconTone],
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {item.time}
                    </p>
                  </div>
                </Link>
              )
            })}
          </CardContent>
          <CardFooter className="justify-center border-t py-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/finance/dashboard/activity">View all activity</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}
