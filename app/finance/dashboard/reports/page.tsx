import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  Download,
  FileSpreadsheet,
  FileText,
  Headset,
  Landmark,
  Send,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"
import { PageHeader } from "@/components/finance/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  lpCapitalCall,
  lpDpiMetric,
  lpHero,
  lpIrMessage,
  lpNetIrrMetric,
  lpPortfolioAssets,
  lpReportDocuments,
  lpTvpiMetric,
} from "@/lib/finance/lp-portal"

export const metadata: Metadata = {
  title: "Visualcns Finance | Reports",
}

const sparklineBars = [
  "h-1/4 bg-primary/20",
  "h-2/5 bg-primary/30",
  "h-3/5 bg-primary/40",
  "h-1/2 bg-primary/50",
  "h-4/5 bg-primary/60",
  "h-full bg-primary/80",
]

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Reports" },
        ]}
        eyebrow="Reporting"
        title="Reports"
        subtitle="Fund performance, reporting packages, capital activity, and investor communications in one workspace."
      />

      <div className="space-y-8">
        <section className="overflow-hidden rounded-xl border bg-primary px-6 py-10 text-primary-foreground md:px-10 md:py-12">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl leading-tight md:text-5xl">
              {lpHero.titleLines[0]}
              <br />
              {lpHero.titleLines[1]}
            </h2>
            <p className="max-w-xl text-sm leading-6 text-primary-foreground/80 md:text-base">
              {lpHero.body}
            </p>
            <div className="pt-2">
              <Button variant="secondary" size="lg">
                <Download className="size-4" />
                {lpHero.cta}
              </Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="shadow-none md:col-span-1">
            <CardContent className="flex h-full flex-col justify-between px-6 pb-6 pt-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {lpTvpiMetric.label}
                </p>
                <h3 className="mt-2 text-4xl text-primary">{lpTvpiMetric.value}</h3>
              </div>
              <div className="mt-4 flex items-center gap-2 text-primary">
                <TrendingUp className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {lpTvpiMetric.trend}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none md:col-span-1">
            <CardContent className="flex h-full flex-col justify-between px-6 pb-6 pt-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {lpDpiMetric.label}
                </p>
                <h3 className="mt-2 text-4xl text-primary">{lpDpiMetric.value}</h3>
              </div>
              <div className="mt-4">
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${lpDpiMetric.progressPct}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {lpDpiMetric.target}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none md:col-span-2">
            <CardContent className="px-6 pb-6 pt-0">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {lpNetIrrMetric.label}
                  </p>
                  <h3 className="mt-2 text-4xl text-primary">{lpNetIrrMetric.value}</h3>
                </div>
                <Badge className="bg-accent/15 text-primary hover:bg-accent/15">{lpNetIrrMetric.badge}</Badge>
              </div>
              <div className="flex h-16 w-full items-end gap-1">
                {sparklineBars.map((bar) => (
                  <div key={bar} className={`w-full rounded-sm ${bar}`} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl">Quarterly Performance Reports</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/finance/dashboard/reports/archive">
                  View All Archives
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <Card className="shadow-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">Report Name</TableHead>
                    <TableHead className="px-6">Period</TableHead>
                    <TableHead className="px-6">Format</TableHead>
                    <TableHead className="px-6 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lpReportDocuments.map((doc) => {
                    const Icon = doc.format === "XLSX" ? FileSpreadsheet : FileText

                    return (
                      <TableRow key={doc.name}>
                        <TableCell className="px-6">
                          <div className="flex items-center gap-3">
                            <Icon
                              className={doc.format === "XLSX" ? "size-5 text-primary" : "size-5 text-muted-foreground"}
                            />
                            <span className="font-semibold">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 text-muted-foreground">{doc.period}</TableCell>
                        <TableCell className="px-6">
                          <Badge variant="secondary">{doc.format}</Badge>
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <Button variant="ghost" size="icon-sm" aria-label={`Download ${doc.name}`}>
                            <Download className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <h2 className="text-2xl">Capital Management</h2>
            <Card className="shadow-none">
              <CardContent className="space-y-6 px-6 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-destructive/15 text-destructive">
                    <Landmark className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold">{lpCapitalCall.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{lpCapitalCall.dueDate}</p>
                    <h3 className="mt-3 text-2xl text-primary tabular-nums">{lpCapitalCall.amount}</h3>
                    <Button className="mt-4 w-full">{lpCapitalCall.cta}</Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <p className="mb-4 text-base font-semibold">Internal Communication</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <ShieldCheck className="size-4" />
                      </div>
                      <div className="rounded-md border bg-muted p-3">
                        <p className="text-sm leading-relaxed">{lpIrMessage.body}</p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {lpIrMessage.meta}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <Textarea
                        className="min-h-24 resize-none bg-background pr-12"
                        placeholder="Message the IR Team..."
                        rows={3}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute bottom-3 right-3"
                        aria-label="Send message"
                      >
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl">Key Asset Progression</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/finance/dashboard/portfolio/holdings">
                View all holdings
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lpPortfolioAssets.map((asset) => (
              <Link
                key={asset.id}
                href={`/finance/dashboard/portfolio/holdings/${asset.id}`}
                className="group relative block h-64 overflow-hidden rounded-xl border transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={asset.image}
                  alt={asset.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
                <div className="absolute bottom-0 p-6 text-background">
                  <Badge className="mb-2 bg-accent/15 text-background hover:bg-accent/15">{asset.tag}</Badge>
                  <p className="text-lg font-semibold">{asset.name}</p>
                  <p className="mt-1 text-sm text-background/80">{asset.detail}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Button
        size="icon-lg"
        className="fixed bottom-6 right-6 z-50 rounded-full"
        aria-label="Open support"
      >
        <Headset className="size-5" />
      </Button>
    </>
  )
}

