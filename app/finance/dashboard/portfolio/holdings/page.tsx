import { cn } from "@/lib/utils"
import {
  holdingCompanies,
  holdingsTotal,
  type HoldingAvatarTone,
} from "@/lib/finance/portfolio"
import { PageHeader } from "@/components/finance/page-header"
import { PortfolioSubnav } from "@/components/finance/portfolio-subnav"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const holdingAvatarClasses: Record<HoldingAvatarTone, string> = {
  "primary-container": "bg-primary/15 text-primary",
  secondary: "bg-primary text-primary-foreground",
  tertiary: "bg-foreground text-background",
  outline: "bg-muted-foreground text-background",
}

export default function HoldingsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Portfolio", href: "/finance/dashboard/portfolio" },
          { label: "Holdings" },
        ]}
        eyebrow="Portfolio"
        title="Holdings"
        subtitle={`Review the current portfolio roster, operating profile, and trend direction across ${holdingsTotal} holdings.`}
      />

      <PortfolioSubnav />

      <Card className="shadow-none overflow-hidden text-primary">
        <Table className="tabular-nums">
          <TableHeader>
            <TableRow>
              <TableHead className="px-6">Company</TableHead>
              <TableHead className="px-6">Sector</TableHead>
              <TableHead className="px-6">Revenue (LTM)</TableHead>
              <TableHead className="px-6">EBITDA %</TableHead>
              <TableHead className="px-6">Net Debt</TableHead>
              <TableHead className="px-6">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdingCompanies.map((company) => (
              <TableRow
                key={company.name}
                className={cn(company.highlighted && "bg-muted/40")}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-sm text-xs font-bold",
                        holdingAvatarClasses[company.avatarTone],
                      )}
                    >
                      {company.initials}
                    </div>
                    <span className="text-sm font-semibold text-primary">{company.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">{company.sector}</TableCell>
                <TableCell className="px-6 py-4 text-sm">{company.revenue}</TableCell>
                <TableCell className="px-6 py-4 text-sm">{company.ebitdaMargin}</TableCell>
                <TableCell className="px-6 py-4 text-sm">{company.netDebt}</TableCell>
                <TableCell className="px-6 py-4">
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
      </Card>
    </>
  )
}

