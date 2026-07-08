import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  Download,
  Filter,
  Landmark,
  Plus,
  Search,
  Search as SearchInsights,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  aiInsight,
  heatmapCells,
  holdingCompanies,
  holdingsTotal,
  initiatives,
  pendingDeliverables,
  portfolioKpis,
  portfolioLastUpdated,
  type HeatmapTone,
  type HoldingAvatarTone,
  type InitiativeStatusTone,
  type KpiDeltaTone,
} from "@/lib/finance/portfolio"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/finance/page-header"
import { PortfolioSubnav } from "@/components/finance/portfolio-subnav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const kpiDeltaClasses: Record<KpiDeltaTone, string> = {
  positive: "bg-accent/15 text-primary",
  negative: "bg-destructive/15 text-destructive",
  neutral: "bg-muted text-muted-foreground",
}

const holdingAvatarClasses: Record<HoldingAvatarTone, string> = {
  "primary-container": "bg-primary/90 text-primary-foreground",
  secondary: "bg-primary text-primary-foreground",
  tertiary: "bg-foreground text-background",
  outline: "bg-muted-foreground text-background",
}

const heatmapToneClasses: Record<HeatmapTone, string> = {
  primary: "bg-primary text-primary-foreground",
  "primary-90": "bg-primary/90 text-primary-foreground",
  "primary-80": "bg-primary/80 text-primary-foreground",
  "primary-60": "bg-primary/60 text-primary-foreground",
  "primary-40": "bg-primary/40 text-primary",
  error: "bg-destructive text-primary-foreground",
  "error-60": "bg-destructive/60 text-primary-foreground",
  neutral: "bg-muted text-foreground",
}

const initiativeStatusBadgeVariant: Record<
  InitiativeStatusTone,
  "default" | "secondary" | "outline" | "destructive"
> = {
  "on-track": "default",
  delayed: "destructive",
  completed: "secondary",
}

const deliverableIconMap: Record<string, LucideIcon> = {
  verified_user: ShieldCheck,
  account_balance: Landmark,
  search_insights: SearchInsights,
}

const kpiLinks = [
  "/finance/dashboard/portfolio/holdings",
  "/finance/dashboard/portfolio/holdings",
  "/finance/dashboard/portfolio/holdings",
  "/finance/dashboard/portfolio/initiatives",
] as const

export default function PortfolioMonitoringPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Portfolio" },
        ]}
        title="Portfolio"
        subtitle="Post-acquisition company health, value creation progress, and reporting across active holdings."
        actions={
          <>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Last Updated
              </span>
              <span className="text-sm font-semibold text-foreground">{portfolioLastUpdated}</span>
            </div>
            <Button variant="outline">
              <Download className="size-4" />
              Export Board Pack
            </Button>
          </>
        }
      />

      <PortfolioSubnav />

      {/* KPI Summary Ribbon */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {portfolioKpis.map((kpi, index) => (
          <Link key={kpi.label} href={kpiLinks[index]} className="group block">
            <Card className="shadow-none transition-colors hover:border-primary">
              <CardContent className="px-5 pb-5 pt-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {kpi.label}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <h3 className="text-2xl tabular-nums text-primary">{kpi.value}</h3>
                  <span
                    className={cn(
                      "rounded-sm px-1.5 text-xs font-bold",
                      kpiDeltaClasses[kpi.deltaTone],
                    )}
                  >
                    {kpi.delta}
                  </span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  View details
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Portfolio Companies Table + Heatmap */}
        <section className="col-span-12 space-y-6 lg:col-span-8">
          <Card className="shadow-none">
            <CardHeader className="border-b">
              <CardTitle>Holding Companies</CardTitle>
              <CardAction>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" aria-label="Filter">
                    <Filter className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label="Search">
                    <Search className="size-4" />
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <Table className="tabular-nums">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Company</TableHead>
                  <TableHead className="px-6">Revenue (LTM)</TableHead>
                  <TableHead className="px-6">EBITDA %</TableHead>
                  <TableHead className="px-6">Net Debt</TableHead>
                  <TableHead className="px-6">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingCompanies.map((company) => (
                  <TableRow key={company.name} className={cn(company.highlighted && "bg-muted/40")}>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-8 items-center justify-center rounded-sm text-xs font-bold",
                            holdingAvatarClasses[company.avatarTone],
                          )}
                        >
                          {company.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{company.name}</p>
                          <p className="text-[10px] text-muted-foreground">{company.sector}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-sm">{company.revenue}</TableCell>
                    <TableCell className="px-6 text-sm">{company.ebitdaMargin}</TableCell>
                    <TableCell className="px-6 text-sm">{company.netDebt}</TableCell>
                    <TableCell className="px-6 text-primary">
                      <svg className="h-8 w-24" viewBox="0 0 100 30">
                        <path
                          d={company.sparklinePath}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <CardFooter className="border-t justify-center py-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/finance/dashboard/portfolio/holdings">View all {holdingsTotal} holdings</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Performance Heat Map Section */}
          <Card className="shadow-none">
            <CardHeader className="border-b">
              <CardTitle>Sector Performance Heatmap</CardTitle>
              <CardAction>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-primary" />
                    <span className="text-[10px] text-muted-foreground">Overperforming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-destructive" />
                    <span className="text-[10px] text-muted-foreground">Underperforming</span>
                  </div>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <div className="grid h-64 min-w-[480px] grid-cols-4 grid-rows-3 gap-2">
                  {heatmapCells.map((cell) => (
                    <div
                      key={cell.label}
                      className={cn(
                        "flex items-end rounded-md p-3 transition-transform duration-200 ease-out hover:z-10 hover:scale-105",
                        heatmapToneClasses[cell.tone],
                        cell.colSpan === 2 && "col-span-2",
                        cell.rowSpan === 2 && "row-span-2",
                      )}
                    >
                      <span className="text-xs font-semibold">{cell.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sidebar: Value Creation & Alerts */}
        <aside className="col-span-12 space-y-4 lg:col-span-4">
          {/* Value Creation Status */}
          <Card className="shadow-none">
            <CardHeader className="border-b">
              <CardTitle>Value Creation Initiatives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 py-5">
              {initiatives.map((initiative) => (
                <Link
                  key={initiative.name}
                  href="/finance/dashboard/portfolio/initiatives"
                  className="block rounded-md transition-colors hover:bg-muted/50"
                >
                <div className="space-y-2 rounded-md p-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{initiative.name}</p>
                      <p className="text-[11px] text-muted-foreground">{initiative.context}</p>
                    </div>
                    <Badge variant={initiativeStatusBadgeVariant[initiative.statusTone]}>
                      {initiative.status}
                    </Badge>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        initiative.statusTone === "delayed" ? "bg-destructive" : "bg-primary",
                      )}
                      style={{ width: `${initiative.progress}%` }}
                    />
                  </div>
                </div>
                </Link>
              ))}
            </CardContent>
            <CardFooter className="border-t justify-center py-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/finance/dashboard/portfolio/initiatives">
                  <Plus className="size-4" />
                  Log New Initiative
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* AI Insight Card */}
          <Link href="/finance/dashboard/modeling" className="group block">
          <Card className="relative overflow-hidden border-transparent bg-primary text-primary-foreground shadow-none">
            <CardContent className="relative z-10 px-6 py-6">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="size-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {aiInsight.label}
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed">{aiInsight.quote}</p>
              <div className="inline-flex items-center gap-2 rounded-sm bg-background px-3 py-2 text-sm font-medium text-primary">
                {aiInsight.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </CardContent>
            <Target
              className="pointer-events-none absolute -bottom-6 -right-6 size-32 opacity-20"
              strokeWidth={1.5}
              aria-hidden
            />
          </Card>
          </Link>

          {/* Compliance & Reports */}
          <Card className="shadow-none">
            <CardHeader className="border-b">
              <CardTitle>Pending Deliverables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6 py-5">
              {pendingDeliverables.map((deliverable) => {
                const Icon = deliverableIconMap[deliverable.icon] ?? ShieldCheck
                return (
                  <Link
                    key={deliverable.title}
                    href="/finance/dashboard/reports"
                    className="flex items-center gap-3 rounded-md bg-muted p-3 transition-colors hover:bg-muted/70"
                  >
                    <Icon className="size-5 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{deliverable.title}</p>
                      <p className="text-[10px] text-muted-foreground">{deliverable.subtitle}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  )
}

