import { cn } from "@/lib/utils"
import {
  initiatives,
  type InitiativeStatusTone,
} from "@/lib/finance/portfolio"
import { PageHeader } from "@/components/finance/page-header"
import { PortfolioSubnav } from "@/components/finance/portfolio-subnav"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const initiativeStatusVariant: Record<
  InitiativeStatusTone,
  "default" | "destructive" | "secondary"
> = {
  "on-track": "default",
  delayed: "destructive",
  completed: "secondary",
}

export default function InitiativesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Portfolio", href: "/finance/dashboard/portfolio" },
          { label: "Value Creation Initiatives" },
        ]}
        eyebrow="Portfolio"
        title="Value Creation Initiatives"
        subtitle="Track operating improvement workstreams, current status, and execution progress across the portfolio."
      />

      <PortfolioSubnav />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {initiatives.map((initiative) => (
          <Card key={initiative.name} className="shadow-none">
            <CardContent className="px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-primary">
                    {initiative.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {initiative.context}
                  </p>
                </div>
                <Badge variant={initiativeStatusVariant[initiative.statusTone]}>
                  {initiative.status}
                </Badge>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-primary tabular-nums">
                    {initiative.progress}%
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      initiative.statusTone === "delayed"
                        ? "bg-destructive"
                        : "bg-primary",
                    )}
                    style={{ width: `${initiative.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  )
}

