import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  TrendingUp,
  Users,
} from "lucide-react"
import { PageHeader } from "@/components/finance/page-header"
import { pipelineStages, recentActivity } from "@/lib/finance/pipeline"
import { portfolioKpis } from "@/lib/finance/portfolio"
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

const secondaryCards = [
  {
    eyebrow: "Analysis",
    title: "Run diligence from intake to output",
    description:
      "Move from company setup through document review, QofE findings, benchmarking, and valuation work in one connected flow.",
    href: "/finance/dashboard/analysis",
    cta: "Open analysis",
  },
  {
    eyebrow: "Pipeline",
    title: "Track sourcing and active opportunities",
    description:
      "Review the live funnel, search targets, and monitor diligence-stage movement across current deals.",
    href: "/finance/dashboard/pipeline",
    cta: "Open pipeline",
  },
  {
    eyebrow: "Reporting",
    title: "Prepare investor-facing updates",
    description:
      "Access fund performance materials, capital call activity, and investor communication workflows.",
    href: "/finance/dashboard/reports",
    cta: "Open reports",
  },
]

const attentionLinks = [
  "/finance/dashboard/pipeline",
  "/finance/dashboard/pipeline",
  "/finance/dashboard/portfolio",
  "/finance/dashboard/portfolio",
] as const

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

      <section className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-4">
        {workspaceCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.title} href={card.href} className="group block">
              <Card className="shadow-none min-h-[220px] transition-colors hover:border-primary">
                <CardContent className="flex min-h-[220px] flex-col justify-between px-6 pb-6 pt-0">
                  <div>
                    <div className="mb-6 flex size-11 items-center justify-center rounded-md bg-muted text-primary">
                      <Icon className="size-5" strokeWidth={2} />
                    </div>
                    <h2 className="text-xl">{card.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.description}</p>
                  </div>
                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    {card.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="shadow-none lg:col-span-7">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="size-5 text-primary" strokeWidth={2} />
              What Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
          <CardContent className="space-y-4 px-6 py-6">
            {recentActivity.slice(0, 4).map((item) => (
              <Link
                key={item.title}
                href="/finance/dashboard/activity"
                className="block rounded-md border p-4 transition-colors hover:border-primary"
              >
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {item.time}
                </p>
              </Link>
            ))}
          </CardContent>
          <CardFooter className="justify-center border-t py-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/finance/dashboard/activity">View all activity</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {secondaryCards.map((card) => (
          <Link key={card.title} href={card.href} className="group block">
            <Card className="shadow-none h-full transition-colors hover:border-primary">
              <CardContent className="px-6 py-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {card.eyebrow}
                </p>
                <h2 className="mt-3 text-xl">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  {card.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </>
  )
}

