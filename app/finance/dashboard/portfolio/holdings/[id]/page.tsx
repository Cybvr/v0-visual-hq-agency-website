import { notFound } from "next/navigation"
import { ArrowRight, Download, Plus } from "lucide-react"
import { PageHeader } from "@/components/finance/page-header"
import { PortfolioSubnav } from "@/components/finance/portfolio-subnav"
import { AddInitiativeDialog } from "@/components/finance/add-initiative-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getCompany } from "@/lib/finance/companies"
import {
  getHoldingCompany,
  holdingCompanies,
  initiatives,
  type HoldingAvatarTone,
  type InitiativeStatusTone,
} from "@/lib/finance/portfolio"

interface HoldingDetailPageProps {
  params: Promise<{ id: string }>
}

const holdingAvatarClasses: Record<HoldingAvatarTone, string> = {
  "primary-container": "bg-primary/90 text-primary-foreground",
  secondary: "bg-primary text-primary-foreground",
  tertiary: "bg-foreground text-background",
  outline: "bg-muted-foreground text-background",
}

const initiativeStatusVariant: Record<
  InitiativeStatusTone,
  "default" | "destructive" | "secondary"
> = {
  "on-track": "default",
  delayed: "destructive",
  completed: "secondary",
}

export function generateStaticParams() {
  return holdingCompanies.map((holding) => ({ id: holding.id }))
}

export default async function HoldingDetailPage({ params }: HoldingDetailPageProps) {
  const { id } = await params
  const holding = getHoldingCompany(id)
  if (!holding) notFound()

  const company = getCompany(holding.id)
  const companyInitiatives = initiatives.filter((initiative) => initiative.companyId === holding.id)
  const activeInitiatives = companyInitiatives.filter(
    (initiative) => initiative.statusTone !== "completed",
  ).length

  const metrics = [
    { label: "Revenue (LTM)", value: holding.revenue },
    { label: "EBITDA Margin", value: holding.ebitdaMargin },
    { label: "Net Debt", value: holding.netDebt },
    { label: "Active Initiatives", value: activeInitiatives.toString() },
  ]

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Portfolio", href: "/finance/dashboard/portfolio" },
          { label: "Holdings", href: "/finance/dashboard/portfolio/holdings" },
          { label: holding.name },
        ]}
        eyebrow="Holding"
        title={holding.name}
        subtitle={`${company.sector} • ${company.stage}`}
        meta={
          <>
            <Badge variant="outline">{company.sector}</Badge>
            <Badge variant="secondary">{company.stage}</Badge>
          </>
        }
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" />
              Export brief
            </Button>
            <AddInitiativeDialog
              defaultCompanyId={holding.id}
              trigger={
                <Button>
                  <Plus className="size-4" />
                  Log Initiative
                </Button>
              }
            />
          </>
        }
      />

      <PortfolioSubnav />

      <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="shadow-none">
            <CardContent className="px-5 pb-5 pt-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {metric.label}
              </p>
              <h3 className="mt-2 text-3xl text-primary tabular-nums">{metric.value}</h3>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="shadow-none lg:col-span-8">
          <CardHeader className="border-b">
            <CardTitle>Trend</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pt-6">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-sm text-sm font-bold",
                  holdingAvatarClasses[holding.avatarTone],
                )}
              >
                {holding.initials}
              </div>
              <div>
                <p className="text-sm font-semibold">{holding.name}</p>
                <p className="text-xs text-muted-foreground">Trailing performance (indexed)</p>
              </div>
            </div>
            <div className="mt-6 rounded-md border bg-muted/30 p-6">
              <svg className="h-48 w-full text-primary" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d={holding.sparklinePath}
                  fill="none"
                  stroke={holding.sparklineStroke ?? "currentColor"}
                  strokeWidth={0.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="mt-4 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <span>Q4 &lsquo;22</span>
                <span>Q2 &lsquo;23</span>
                <span>Q4 &lsquo;23</span>
                <span>Q2 &lsquo;24</span>
                <span>Q4 &lsquo;24</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none lg:col-span-4">
          <CardHeader className="border-b">
            <CardTitle>Company Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pt-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Sector
              </p>
              <p className="mt-1 text-sm">{company.sector}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Lifecycle stage
              </p>
              <p className="mt-1 text-sm">{company.stage}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Company ID
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{company.id}</p>
            </div>
            <div className="border-t pt-4">
              <Button variant="ghost" size="sm" asChild className="w-full justify-between">
                <a href={`/finance/dashboard/analysis?deal=${company.id}`}>
                  Open in analysis
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl text-primary">Value Creation Initiatives</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Operating workstreams scoped to {holding.name}.
            </p>
          </div>
          <AddInitiativeDialog
            defaultCompanyId={holding.id}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="size-4" />
                Log initiative
              </Button>
            }
          />
        </div>

        {companyInitiatives.length === 0 ? (
          <Card className="shadow-none">
            <CardContent className="px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No initiatives logged for {holding.name} yet.
              </p>
              <div className="mt-4">
                <AddInitiativeDialog
                  defaultCompanyId={holding.id}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Plus className="size-4" />
                      Log the first one
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {companyInitiatives.map((initiative) => (
              <Card key={initiative.name} className="shadow-none">
                <CardContent className="px-6 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-primary">{initiative.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{initiative.context}</p>
                    </div>
                    <Badge variant={initiativeStatusVariant[initiative.statusTone]}>
                      {initiative.status}
                    </Badge>
                  </div>
                  <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-primary tabular-nums">
                        {initiative.progress}%
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          initiative.statusTone === "delayed" ? "bg-destructive" : "bg-primary",
                        )}
                        style={{ width: `${initiative.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
