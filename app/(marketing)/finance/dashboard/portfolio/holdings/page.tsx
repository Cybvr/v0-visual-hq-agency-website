import {
  holdingCompanies,
  holdingsTotal,
  type HoldingAvatarTone,
} from "@/lib/finance/portfolio"
import { HoldingsTable } from "@/components/finance/holdings-table"
import { PageHeader } from "@/components/finance/page-header"
import { PortfolioSubnav } from "@/components/finance/portfolio-subnav"
import { Card } from "@/components/ui/card"

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
        <HoldingsTable
          holdings={holdingCompanies}
          showSector
          avatarClasses={holdingAvatarClasses}
          rowPaddingY="md"
        />
      </Card>
    </>
  )
}
