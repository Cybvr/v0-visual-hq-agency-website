import type { Metadata } from "next"
import { ArrowDown, ArrowUp, Download, ExternalLink, Info, MoreVertical, Share2, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  benchmarkAiConfidence,
  benchmarkFilters,
  benchmarkMatrixFootnote,
  getBenchmarkData,
} from "@/lib/finance/benchmarking"
import { resolveDeal } from "@/lib/finance/pipeline"

export const metadata: Metadata = {
  title: "Benchmarking | Visualcns Finance",
}

const growthToneClasses: Record<string, string> = {
  upper: "bg-accent/25",
  current: "bg-primary",
  median: "bg-muted-foreground/40",
}

interface BenchmarkingPageProps {
  searchParams: Promise<{ deal?: string }>
}

export default async function BenchmarkingPage({ searchParams }: BenchmarkingPageProps) {
  const { deal: dealId } = await searchParams
  const deal = resolveDeal(dealId)
  const { ebitdaMultiples, revenueGrowthBenchmarks, revenueGrowthSummary, benchmarkMatrix, qofeCards, aiLensCard } =
    getBenchmarkData(deal)

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Analysis", href: "/finance/dashboard/analysis" },
          { label: deal.name, href: `/finance/dashboard/analysis?deal=${deal.id}` },
          { label: "Benchmarking" },
        ]}
        eyebrow={deal.name}
        title="Benchmarking"
        subtitle="Compare against verified peers, market quartiles, and QofE-derived operating signals."
      />

      <AnalysisSubnav dealId={deal.id} />

      <section className="mb-8 flex flex-wrap items-end gap-3">
        {benchmarkFilters.map((filter) => (
          <div key={filter.label} className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">{filter.label}</Label>
            <Select defaultValue={filter.options[0]}>
              <SelectTrigger className={cn("h-9 text-sm", filter.minWidthClass)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="size-4" />
          More Filters
        </Button>
      </section>

      <section className="flex w-full flex-col gap-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* EBITDA multiples (large) */}
          <Card className="shadow-none lg:col-span-8">
            <CardHeader className="border-b">
              <div>
                <CardTitle>EBITDA Multiples by Industry</CardTitle>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Median EV/EBITDA (LTM)
                </p>
              </div>
              <CardAction>
                <Button variant="ghost" size="icon-sm" aria-label="More">
                  <MoreVertical className="size-4" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <div className="flex h-64 items-end justify-between gap-4 border-b pt-4">
                {ebitdaMultiples.map((bar) => (
                  <div key={bar.label} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                    {bar.isCurrentDeal ? (
                      <div className="absolute -top-10 z-20 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
                        {deal.name}: {bar.tooltip}
                      </div>
                    ) : (
                      <div className="invisible absolute -top-8 z-20 rounded-sm bg-primary/90 px-2 py-1 text-[10px] font-bold text-primary-foreground opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                        {bar.tooltip}
                      </div>
                    )}
                    <div
                      className={cn(
                        "w-full max-w-[48px] rounded-t-sm transition-all",
                        bar.isCurrentDeal
                          ? "bg-primary group-hover:bg-primary/80"
                          : "bg-muted group-hover:bg-accent/25",
                      )}
                      style={{ height: `${bar.heightPct}%` }}
                    />
                    <span
                      className={cn(
                        "mt-2 w-full truncate text-center text-[10px] font-semibold",
                        bar.isCurrentDeal ? "font-bold text-primary" : "text-muted-foreground",
                      )}
                    >
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue growth (small) */}
          <Card className="shadow-none lg:col-span-4">
            <CardHeader className="border-b">
              <div>
                <CardTitle>Revenue Growth</CardTitle>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  LTM Growth Rate
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col px-6 pb-6 pt-4">
              <div className="space-y-5">
                {revenueGrowthBenchmarks.map((row) => (
                  <div key={row.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{row.tone === "current" ? deal.name : row.label}</span>
                      <span className="font-bold text-primary tabular-nums">{row.value}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full", growthToneClasses[row.tone])} style={{ width: `${row.widthPct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-4 border-t pt-5">
                <div className="flex-1">
                  <div className="text-xl font-bold text-primary tabular-nums">{revenueGrowthSummary.value}</div>
                  <div className="text-xs font-semibold text-muted-foreground">
                    {revenueGrowthSummary.label}
                  </div>
                </div>
                <TrendingUp className="size-8 text-muted-foreground" strokeWidth={1.5} />
              </div>
            </CardContent>
          </Card>

          {/* Benchmark matrix */}
          <Card className="shadow-none lg:col-span-12">
            <CardHeader className="border-b">
              <CardTitle>Benchmark Analysis Matrix</CardTitle>
              <CardAction>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="size-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="size-4" />
                    Share Access
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table className="tabular-nums">
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">Key Performance Indicator</TableHead>
                    <TableHead className="px-6">{deal.name}</TableHead>
                    <TableHead className="px-6">Median Peer</TableHead>
                    <TableHead className="px-6">Top Quartile</TableHead>
                    <TableHead className="px-6">Variance (vs Med)</TableHead>
                    <TableHead className="px-6 text-center">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benchmarkMatrix.map((row) => (
                    <TableRow key={row.kpi}>
                      <TableCell className="px-6 font-semibold text-primary">{row.kpi}</TableCell>
                      <TableCell className="bg-accent/10 px-6 font-bold">{row.currentDeal}</TableCell>
                      <TableCell className="px-6">{row.medianPeer}</TableCell>
                      <TableCell className="px-6">{row.topQuartile}</TableCell>
                      <TableCell className={cn("px-6 font-medium", row.variancePositive ? "text-primary" : "text-destructive")}>
                        <span className="inline-flex items-center gap-0.5">
                          {row.variancePositive ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
                          {row.variance}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <Badge
                          variant={row.confidence === "VERIFIED" ? "default" : "secondary"}
                          className={row.confidence === "VERIFIED" ? "bg-accent/15 text-primary border-transparent hover:bg-accent/15" : ""}
                        >
                          {row.confidence}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t bg-muted/40 p-4 text-xs font-semibold italic text-muted-foreground">
              <span>{benchmarkMatrixFootnote}</span>
              <div className="flex items-center gap-1">
                <Sparkles className="size-4" />
                <span>{benchmarkAiConfidence}</span>
              </div>
            </div>
          </Card>

          {/* QofE cards */}
          {qofeCards.map((card) => (
            <Card key={card.title} className="shadow-none lg:col-span-4">
              <CardContent className="flex flex-col gap-4 px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {card.title}
                  </span>
                  <Info className="size-4 text-primary" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-primary tabular-nums">{card.value}</span>
                  <span
                    className={cn(
                      "mb-1.5 flex items-center text-sm font-bold",
                      card.deltaDirection === "up" ? "text-primary" : "text-destructive",
                    )}
                  >
                    {card.deltaDirection === "up" ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                    {card.delta}
                  </span>
                </div>
                <div className="h-12 w-full overflow-hidden opacity-50">
                  <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d={card.sparklinePath} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
                  </svg>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Net Confidence Score</span>
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${card.confidencePct}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* AI Lens */}
          <Card className="group relative shadow-none lg:col-span-4">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
              <Sparkles className="size-24" strokeWidth={1} />
            </div>
            <CardContent className="relative z-10 flex flex-col gap-4 px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {aiLensCard.title}
                </span>
                <Badge>{aiLensCard.badge}</Badge>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium italic text-primary">{aiLensCard.quote}</p>
                <Button variant="link" size="sm" className="h-auto justify-start p-0 text-xs">
                  {aiLensCard.linkLabel}
                  <ExternalLink className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}

