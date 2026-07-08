import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Filter,
  Mail,
  MoreVertical,
  Plus,
  Search,
  Target,
  UserPlus,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  ddConfidence,
  deals,
  pipelineStages,
  recentActivity,
  type ActivityIconTone,
  type DealStageTone,
  type PartnerAvatarTone,
  type PipelineStageTone,
} from "@/lib/finance/pipeline"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/finance/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const stageBarClasses: Record<PipelineStageTone, string> = {
  primary: "bg-primary",
  secondary: "bg-primary/70",
  highlight: "bg-accent",
  closed: "bg-muted-foreground/40",
}

const dealStageBadgeVariant: Record<DealStageTone, "default" | "secondary" | "outline" | "destructive"> = {
  "due-diligence": "default",
  loi: "secondary",
  neutral: "outline",
  stalled: "destructive",
}

const partnerAvatarClasses: Record<PartnerAvatarTone, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-primary/20 text-primary",
  tertiary: "bg-muted text-muted-foreground",
}

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

export default function PipelinePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Pipeline" },
        ]}
        title="Deal Pipeline"
        subtitle="Q4 acquisition targets, sourcing coverage, and diligence momentum across the active pipeline."
        actions={
          <Button>
            <Plus className="size-4" />
            Add Target
          </Button>
        }
      />

      {/* Funnel stage summary */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {pipelineStages.map((stage) => (
          <Card key={stage.label} className="shadow-none">
            <CardContent className="px-5 pb-5 pt-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {stage.label}
              </p>
              <h3 className="mt-1 text-4xl text-primary">{stage.count}</h3>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", stageBarClasses[stage.tone])}
                  style={{ width: `${stage.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* Deals table */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="shadow-none">
            <CardHeader className="gap-3 border-b !grid-cols-1 has-data-[slot=card-action]:!grid-cols-1 sm:has-data-[slot=card-action]:!grid-cols-[1fr_auto]">
              <CardTitle>Active Opportunities</CardTitle>
              <CardAction className="col-start-1 row-start-2 row-span-1 justify-self-stretch sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:justify-self-end">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input className="h-8 w-full pl-8 text-xs sm:w-40" placeholder="Search targets…" />
                  </div>
                  <Button variant="ghost" size="icon-sm" aria-label="Filter">
                    <Filter className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label="More">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Target</TableHead>
                  <TableHead className="px-6">Size ($M)</TableHead>
                  <TableHead className="px-6">Sector</TableHead>
                  <TableHead className="px-6">Stage</TableHead>
                  <TableHead className="px-6">Lead Partner</TableHead>
                  <TableHead className="px-6" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id} className={cn(deal.highlighted && "bg-muted/40")}>
                    <TableCell className="px-6 font-semibold text-primary">{deal.name}</TableCell>
                    <TableCell className="px-6">{deal.size}</TableCell>
                    <TableCell className="px-6 text-muted-foreground">{deal.sector}</TableCell>
                    <TableCell className="px-6">
                      <Badge variant={dealStageBadgeVariant[deal.stageTone]}>{deal.stage}</Badge>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
                            partnerAvatarClasses[deal.partnerAvatarTone],
                          )}
                        >
                          {deal.partnerInitials}
                        </span>
                        <span className="text-sm">{deal.partner}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/finance/dashboard/analysis?deal=${deal.id}`}>
                          Open <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 space-y-4 lg:col-span-4">
          {/* Recent Activity */}
          <Link href="/finance/dashboard/activity" className="group block">
          <Card className="shadow-none transition-colors hover:border-primary">
            <CardHeader className="border-b">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 px-6 py-5">
              {recentActivity.map((item) => {
                const Icon = activityIconMap[item.icon] ?? FileText
                return (
                  <div key={item.title} className="flex gap-3">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full",
                        activityChipClasses[item.iconTone],
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
            <CardFooter className="border-t justify-center py-3">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                View all activity
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </CardFooter>
          </Card>
          </Link>

          {/* DD Confidence */}
          <Link href="/finance/dashboard/analysis" className="group block">
          <Card className="shadow-none transition-colors hover:border-primary">
            <CardContent className="px-6 py-6">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {ddConfidence.label}
                  </p>
                  <h3 className="mt-1 text-4xl text-primary">{ddConfidence.score}</h3>
                </div>
                <Target className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {ddConfidence.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{metric.label}</span>
                      <span className="text-xs font-semibold">{metric.value}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          metric.tone === "primary" ? "bg-primary" : "bg-primary/60",
                        )}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t pt-4 text-xs italic leading-relaxed text-muted-foreground">
                {ddConfidence.note}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Open analysis
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </CardContent>
          </Card>
          </Link>
        </div>
      </div>
    </>
  )
}

