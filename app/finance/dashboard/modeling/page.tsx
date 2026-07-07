import type { Metadata } from "next"
import {
  Activity,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  FileText,
  Filter,
  LayoutGrid,
  Link2,
  MoreVertical,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Table as TableIcon,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

const modelIconStyles: Record<ModelIconStyle, string> = {
  "tertiary-fixed": "bg-muted text-primary",
  "surface-highest": "bg-muted text-primary",
  "primary-container": "bg-primary/15 text-primary",
}

const badgeVariantByTone: Record<ModelBadgeTone, "default" | "secondary" | "outline"> = {
  green: "default",
  amber: "secondary",
  blue: "outline",
}

const statusBadgeVariantByTone: Record<SyncStatusTone, "default" | "secondary" | "outline"> = {
  green: "default",
  amber: "secondary",
  blue: "outline",
}

const integrityToneStyles: Record<"green" | "amber", string> = {
  green: "text-primary",
  amber: "text-muted-foreground",
}

const avatarStyles: Record<"primary" | "secondary" | "tertiary", string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-primary/70 text-primary-foreground",
  tertiary: "bg-foreground text-background",
}

const metaIconMap: Record<string, LucideIcon> = {
  monitoring: Activity,
  percent: Percent,
  business: Building2,
  event: CalendarDays,
  trending_up: TrendingUp,
  people: Users,
}

const modelCardIconMap: Record<string, LucideIcon> = {
  table_chart: TableIcon,
  monitoring: Activity,
  trending_up: TrendingUp,
  insert_chart: BarChart3,
  bar_chart: BarChart3,
  description: FileText,
  calculate: FileSpreadsheet,
}

const linkIconMap: Record<string, LucideIcon> = {
  link: Link2,
  attachment: Link2,
  description: FileText,
  table_chart: TableIcon,
}

const tabIconMap: Record<string, LucideIcon> = {
  all_inclusive: LayoutGrid,
  trending_up: TrendingUp,
  monitoring: Activity,
  business: Building2,
  insert_chart: BarChart3,
  table_chart: TableIcon,
  description: FileText,
  calculate: FileSpreadsheet,
}

const integrityIconMap: Record<string, LucideIcon> = {
  check_circle: CheckCircle2,
  schedule: Clock,
  warning: Clock,
}

interface ModelingHubPageProps {
  searchParams: Promise<{ deal?: string }>
}

export default async function ModelingHubPage({ searchParams }: ModelingHubPageProps) {
  const { deal: dealId } = await searchParams
  const deal = resolveDeal(dealId)
  const activeModel = {
    ...featuredDeal,
    name: `${deal.name} — Platform LBO`,
    sector: `Sector: ${deal.sector}`,
    ev: formatEvShort(deriveFinancials(getFinancials(deal.id)).enterpriseValueM),
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Analysis", href: "/finance/dashboard/analysis" },
          { label: deal.name, href: `/finance/dashboard/analysis?deal=${deal.id}` },
          { label: "Financial Modeling" },
        ]}
        eyebrow={deal.name}
        title="Financial Modeling"
        subtitle="Valuation workbooks and synchronization status for this deal."
      />

      <AnalysisSubnav dealId={deal.id} />

      <section className="mb-8 flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-10 w-80 rounded-full pl-10" placeholder={modelingHubMeta.searchPlaceholder} />
        </div>
        <div className="ml-2 flex items-center gap-2 border-l pl-4">
          <Button variant="ghost" size="icon-sm" aria-label="Filter models">
            <Filter className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle view layout">
            <LayoutGrid className="size-4" />
          </Button>
        </div>
      </section>

      <div className="space-y-12">
        {/* Priority assets */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
              <Sparkles className="size-5 text-primary" />
              Priority Assets
            </h2>
            <Button variant="link" size="sm" className="text-primary">
              View Active Bids
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Featured deal card */}
            <Card className="shadow-none flex flex-col overflow-hidden md:flex-row lg:col-span-2 gap-0 py-0">
              <div className="relative h-48 md:h-auto md:w-2/5">
                <img alt={activeModel.imageAlt} className="h-full w-full object-cover" src={activeModel.image} />
                <div className="absolute inset-0 bg-primary/10" />
                <div className="absolute left-4 top-4">
                  <Badge className="uppercase tracking-widest">
                    {activeModel.badge}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{activeModel.name}</h3>
                    <p className="text-xs font-semibold text-muted-foreground">{activeModel.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-primary tabular-nums">{activeModel.ev}</p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      {activeModel.evLabel}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid flex-1 grid-cols-2 gap-4">
                  {activeModel.meta.map((item) => {
                    const MetaIcon = metaIconMap[item.icon] ?? Activity
                    return (
                      <div
                        key={item.label}
                        className="rounded-md border bg-muted/30 p-3"
                      >
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">{item.label}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <MetaIcon
                            className={cn(
                              "size-4",
                              item.iconFilled ? "text-primary" : "text-muted-foreground",
                            )}
                          />
                          <span className="text-xs font-semibold text-primary tabular-nums">{item.value}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button className="flex-1">
                    <FileText className="size-4" />
                    {activeModel.primaryAction}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <TableIcon className="size-4" />
                    {activeModel.secondaryAction}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Portfolio summary card */}
            <Card className="shadow-none relative flex flex-col justify-between overflow-hidden bg-primary text-primary-foreground border-transparent">
              <CardContent className="relative z-10 flex-1 px-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest opacity-80">
                  {portfolioSummary.eyebrow}
                </p>
                <h3 className="text-2xl">{portfolioSummary.title}</h3>
                <div className="mt-8 space-y-4">
                  {portfolioSummary.stats.map((stat) => (
                    <div key={stat.label} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-80">{stat.label}</span>
                        <span className="text-xl font-semibold tabular-nums">{stat.value}</span>
                      </div>
                      {stat.pct !== undefined && (
                        <div className="h-1 w-full overflow-hidden rounded-full bg-primary-foreground/10">
                          <div
                            className="h-full bg-primary-foreground/80"
                            style={{ width: `${stat.pct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="relative z-10 px-6 pb-6">
                <Button variant="secondary" className="w-full bg-background text-primary hover:bg-background/90">
                  {portfolioSummary.ctaLabel}
                </Button>
              </div>
              <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-10">
                <Activity className="size-44" strokeWidth={1} />
              </div>
            </Card>
          </div>
        </section>

        {/* Library categorization */}
        <section>
          <div className="mb-8 flex items-center gap-8 overflow-x-auto whitespace-nowrap border-b">
            {modelingTabs.map((tab, index) => {
              const TabIcon = tabIconMap[tab.icon] ?? LayoutGrid
              return (
                <Button
                  key={tab.label}
                  className={cn(
                    "flex items-center gap-2 px-1 pb-4 text-xs font-semibold",
                    index === 0
                      ? "border-b-2 border-primary font-bold text-primary"
                      : "text-muted-foreground transition-colors hover:text-primary",
                  )}
                  variant="ghost"
                  size="sm"
                >
                  <TabIcon className="size-4" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modelCards.map((model) => {
              const ModelIcon = modelCardIconMap[model.icon] ?? TableIcon
              const LinkIcon = linkIconMap[model.linkIcon] ?? Link2
              return (
                <Card key={model.name} className="shadow-none group flex flex-col">
                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-sm",
                          modelIconStyles[model.iconStyle],
                        )}
                      >
                        <ModelIcon className="size-5" />
                      </div>
                      {model.badge && (
                        <div className="flex items-center gap-1">
                          <Badge variant={badgeVariantByTone[model.badge.tone]} className="rounded-sm">
                            {model.badge.label}
                          </Badge>
                          <Button variant="ghost" size="icon-sm" aria-label="More options">
                            <MoreVertical className="size-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-primary transition-colors group-hover:text-primary/80">
                      {model.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{model.type}</p>
                    <div className="mt-6 flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span className="text-[11px] font-bold">{model.updated}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LinkIcon className="size-4" />
                        <span className="text-[11px] font-bold">{model.linkLabel}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2 border-t pt-4">
                      <Button variant="secondary" size="sm" className="flex-1 rounded-sm">
                        EDIT
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-sm">
                        EXCEL
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Create new model placeholder */}
            <Button
              variant="ghost"
              className="group flex min-h-[220px] h-auto w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-5 hover:bg-muted/40"
            >
              <div className="flex size-12 items-center justify-center rounded-full border-2 border-dashed text-muted-foreground transition-all group-hover:border-primary group-hover:text-primary">
                <Plus className="size-6" />
              </div>
              <p className="mt-4 font-bold text-muted-foreground transition-colors group-hover:text-primary">
                {createModelPlaceholder.title}
              </p>
              <p className="mt-1 px-4 text-center text-[11px] text-muted-foreground/60">
                {createModelPlaceholder.description}
              </p>
            </Button>
          </div>
        </section>

        {/* Model sync status */}
        <Card className="shadow-none">
          <CardHeader className="border-b flex items-start justify-between gap-4">
            <div>
              <CardTitle>{syncSection.title}</CardTitle>
              <p className="text-xs font-semibold text-muted-foreground">{syncSection.subtitle}</p>
            </div>
            <Button variant="link" size="sm" className="text-primary">
              <RefreshCw className="size-4" />
              {syncSection.refreshLabel}
            </Button>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                {syncSection.columns.map((column) => (
                  <TableHead key={column} className="px-6 uppercase tracking-wider text-primary">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncRows.map((row) => {
                const IntegrityIcon = integrityIconMap[row.integrity.icon] ?? CheckCircle2
                return (
                  <TableRow key={row.model} className={cn(row.highlighted && "bg-muted/40")}>
                    <TableCell className="px-6 font-semibold text-primary">{row.model}</TableCell>
                    <TableCell className="px-6">
                      <div className={cn("flex items-center gap-2", integrityToneStyles[row.integrity.tone])}>
                        <IntegrityIcon className="size-4" />
                        <span className="text-xs font-semibold">{row.integrity.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      {row.link ? (
                        <Badge variant="secondary" className="rounded-sm">
                          {row.link}
                        </Badge>
                      ) : (
                        <span className="text-[11px] italic text-muted-foreground">No active link</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge variant={statusBadgeVariantByTone[row.status.tone]}>
                        {row.status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
                            avatarStyles[row.user.avatar],
                          )}
                        >
                          {row.user.initials}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">{row.user.name}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Floating quick access action */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <Button size="icon" className="size-14 rounded-full bg-accent/15 text-primary hover:bg-accent/25">
          <Zap className="size-6" />
        </Button>
      </div>
    </>
  )
}

