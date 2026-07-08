import type { Metadata } from "next"
import { Download, Filter, Info, MoreVertical, Share2, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"
import { getQofeReport, qofeReportMeta, type QofeBridgeTone, type QofeRowVariant } from "@/lib/finance/report"
import { resolveDeal } from "@/lib/finance/pipeline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Visualcns Finance - QofE Report",
}

const bridgeBarClasses: Record<QofeBridgeTone, string> = {
  start: "rounded-t-sm bg-primary/90",
  gain: "rounded-sm bg-accent/25",
  loss: "rounded-sm border border-destructive bg-destructive/20",
  end: "rounded-t-sm bg-primary",
}

const bridgeValueClasses: Record<QofeBridgeTone, string> = {
  start: "text-primary",
  gain: "text-primary",
  loss: "text-destructive",
  end: "text-primary",
}

const insightIconMap: Record<string, LucideIcon> = {
  auto_awesome: Sparkles,
  insights: Sparkles,
}

interface RowStyle {
  row: string
  cell: string
  description: string
  reported: string
  adjustments: string
  proForma: string
}

const rowStyles: Record<QofeRowVariant, RowStyle> = {
  revenue: {
    row: "hover:bg-muted/50",
    cell: "px-6 py-4",
    description: "font-semibold text-primary",
    reported: "",
    adjustments: "text-muted-foreground",
    proForma: "font-semibold",
  },
  detail: {
    row: "hover:bg-muted/50",
    cell: "px-6 py-4",
    description: "pl-10 italic text-muted-foreground",
    reported: "",
    adjustments: "text-muted-foreground",
    proForma: "",
  },
  subtotal: {
    row: "border-t-2 bg-card font-bold hover:bg-muted/50",
    cell: "px-6 py-4",
    description: "text-primary",
    reported: "",
    adjustments: "text-primary",
    proForma: "",
  },
  line: {
    row: "hover:bg-muted/50",
    cell: "px-6 py-4",
    description: "text-foreground",
    reported: "",
    adjustments: "text-muted-foreground",
    proForma: "",
  },
  adjustment: {
    row: "border-l-4 border-primary bg-accent/10 hover:bg-accent/15",
    cell: "px-6 py-4",
    description: "font-medium text-foreground",
    reported: "text-muted-foreground",
    adjustments: "font-bold text-primary",
    proForma: "",
  },
  total: {
    row: "bg-primary font-bold text-primary-foreground",
    cell: "px-6 py-6",
    description: "text-xl leading-7",
    reported: "text-xl leading-7",
    adjustments: "text-xl leading-7 text-primary-foreground/80",
    proForma: "text-xl leading-7",
  },
  margin: {
    row: "border-t bg-primary/90 font-medium text-primary-foreground",
    cell: "px-6 py-4",
    description: "",
    reported: "",
    adjustments: "text-primary-foreground/80",
    proForma: "",
  },
}

interface QofeReportPageProps {
  searchParams: Promise<{ deal?: string }>
}

export default async function QofeReportPage({ searchParams }: QofeReportPageProps) {
  const { deal: dealId } = await searchParams
  const deal = resolveDeal(dealId)
  const report = getQofeReport(deal)
  const reportSubtitle = `Reporting period: ${report.periodLabel}`
  const InsightIcon = insightIconMap[report.insight.icon] ?? Sparkles

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Analysis", href: "/finance/dashboard/analysis" },
          { label: deal.name, href: `/finance/dashboard/analysis?deal=${deal.id}` },
          { label: "QofE Report" },
        ]}
        eyebrow={deal.name}
        title="QofE Report"
        subtitle={reportSubtitle}
      />

      <AnalysisSubnav dealId={deal.id} />

      <section className="mb-8 flex items-center gap-3">
        <Button variant="outline">
          <Download className="size-4" />
          Export PDF
        </Button>
        <Button>
          <Share2 className="size-4" />
          Share Link
        </Button>
      </section>

      <div className="space-y-8">
        {/* Summary visualization */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Bridge chart card */}
          <Card className="shadow-none lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle>EBITDA Bridge Analysis</CardTitle>
              <CardAction>
                <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                  {qofeReportMeta.currencyNote}
                </span>
              </CardAction>
            </CardHeader>
            <CardContent className="px-6 py-6">
              <div className="flex h-64 items-end justify-between gap-4 px-4">
                {report.bridgeBars.map((bar) => (
                  <div key={bar.label} className="flex w-full max-w-[60px] flex-col items-center">
                    <div
                      className={cn("relative w-full", bridgeBarClasses[bar.tone])}
                      style={{ height: bar.height, marginBottom: bar.offset || undefined }}
                    >
                      <div
                        className={cn(
                          "absolute -top-8 left-1/2 -translate-x-1/2 font-bold",
                          bridgeValueClasses[bar.tone],
                        )}
                      >
                        {bar.value}
                      </div>
                      {bar.dashed && (
                        <div className="absolute inset-0 -left-2 border-l border-dashed" />
                      )}
                    </div>
                    <span className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI insight box */}
          <Card className="shadow-none bg-primary text-primary-foreground border-primary">
            <CardContent className="flex h-full flex-col px-6 py-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-primary-foreground/15">
                  <InsightIcon className="size-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl leading-7 text-primary-foreground">{report.insight.title}</h3>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-primary-foreground/90">{report.insight.body}</p>
              <div className="mt-auto">
                <div className="flex items-center justify-between border-t border-primary-foreground/30 py-3">
                  <span className="text-xs font-semibold tracking-wide text-primary-foreground/70">
                    {report.insight.confidenceLabel}
                  </span>
                  <span className="font-bold text-primary-foreground">{report.insight.confidence}</span>
                </div>
                <Button variant="secondary" className="mt-4 w-full">
                  {report.insight.ctaLabel}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Adjusted EBITDA table */}
        <Card className="shadow-none overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Adjusted EBITDA Calculation</CardTitle>
            <CardAction>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm" aria-label="Filter line items">
                  <Filter className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label="More options">
                  <MoreVertical className="size-4" />
                </Button>
              </div>
            </CardAction>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table className="tabular-nums">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Line Item Description</TableHead>
                  <TableHead className="px-6 text-right">Reported (Audited)</TableHead>
                  <TableHead className="px-6 text-right">Adjustments</TableHead>
                  <TableHead className="px-6 text-right">Pro Forma</TableHead>
                  <TableHead className="px-6 text-center">Ref</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.tableRows.map((row) => {
                  const styles = rowStyles[row.variant]
                  return (
                    <TableRow key={row.description} className={styles.row}>
                      <TableCell className={cn(styles.cell, styles.description)}>{row.description}</TableCell>
                      <TableCell className={cn(styles.cell, "text-right", styles.reported)}>{row.reported}</TableCell>
                      <TableCell className={cn(styles.cell, "text-right", styles.adjustments)}>{row.adjustments}</TableCell>
                      <TableCell className={cn(styles.cell, "text-right", styles.proForma)}>{row.proForma}</TableCell>
                      <TableCell className={cn(styles.cell, "text-center")}>
                        {row.refInfoIcon ? (
                          <Info className="mx-auto size-4 cursor-help text-primary" />
                        ) : row.ref ? (
                          <Badge variant="secondary" className="text-[10px]">
                            {row.ref}
                          </Badge>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Bottom note */}
        <Card className="shadow-none bg-muted">
          <CardContent className="flex flex-col items-start gap-8 px-6 py-6 md:flex-row">
            <div className="flex-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {qofeReportMeta.methodologyTitle}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">{qofeReportMeta.methodologyNote}</p>
            </div>
            <div className="w-full space-y-4 md:w-64">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Report ID:</span>
                <span className="font-mono font-bold">{report.reportId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Analyst:</span>
                <span className="font-bold">{qofeReportMeta.analyst}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Review Status:</span>
                <Badge variant="outline" className="text-[10px]">
                  {report.reviewStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

