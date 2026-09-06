"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, CheckCircle2, Lock, X } from "lucide-react"
import {
  businessInfoDefaults,
  industrySectorOptions,
  reportingCurrencyOptions,
} from "@/lib/finance/analysis"
import { resolveDeal } from "@/lib/finance/pipeline"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-2 text-xl text-primary">
      <span className="h-6 w-1.5 rounded-full bg-primary" />
      {children}
    </h2>
  )
}

export default function BusinessInfoPage() {
  const [saved, setSaved] = useState(false)
  const dealId = useSearchParams().get("deal") ?? undefined
  const deal = resolveDeal(dealId)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Analysis", href: "/finance/dashboard/analysis" },
          { label: deal.name, href: `/finance/dashboard/analysis?deal=${deal.id}` },
          { label: "Business Info" },
        ]}
        eyebrow={deal.name}
        title="Business Info"
        subtitle="Capture the baseline company profile, reporting context, and scale assumptions that drive downstream QofE analysis."
      />

      <AnalysisSubnav dealId={deal.id} />

      <div className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
        <span>Step 1 of 4</span>
        <span className="h-px w-12 bg-border" />
        <span className="text-muted-foreground">Initial Parameters</span>
      </div>

      <div className="mx-auto max-w-4xl">
        <Card className="shadow-none">
          <CardContent className="p-10">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Section: Identity */}
              <div>
                <SectionTitle>Core Identity</SectionTitle>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="company-name"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Target Company Name
                    </Label>
                    <Input
                      id="company-name"
                      type="text"
                      defaultValue={deal.name}
                      placeholder={businessInfoDefaults.companyNamePlaceholder}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="industry-sector"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Industry Sector
                    </Label>
                    <Select>
                      <SelectTrigger id="industry-sector" className="w-full">
                        <SelectValue placeholder={businessInfoDefaults.sectorPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {industrySectorOptions.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-border" />

              {/* Section: Financial parameters */}
              <div>
                <SectionTitle>Reporting Framework</SectionTitle>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="fiscal-year-end"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Fiscal Year End
                    </Label>
                    <Input id="fiscal-year-end" type="month" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="reporting-currency"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Reporting Currency
                    </Label>
                    <Select defaultValue={reportingCurrencyOptions[0]}>
                      <SelectTrigger id="reporting-currency" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {reportingCurrencyOptions.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section: Estimated scale */}
              <div className="rounded-md border bg-muted/40 p-6">
                <SectionTitle>Market Scale (Estimated TTM)</SectionTitle>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {(["TTM Revenue", "TTM EBITDA"] as const).map((field) => {
                    const id = field.toLowerCase().replace(" ", "-")
                    return (
                      <div key={field} className="flex flex-col gap-2">
                        <Label
                          htmlFor={id}
                          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          {field}
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            $
                          </span>
                          <Input
                            id={id}
                            type="number"
                            placeholder={businessInfoDefaults.amountPlaceholder}
                            className="pl-7 pr-12 tabular-nums"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            MM
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t pt-6">
                <Button variant="ghost" asChild className="text-destructive hover:text-destructive">
                  <Link href={`/finance/dashboard/analysis?deal=${deal.id}`}>
                    <X className="size-4" />
                    Discard Draft
                  </Link>
                </Button>
                <Button type="submit">
                  Save and Continue to Uploads
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer help */}
        <footer className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="size-4" />
            <p className="text-[11px] font-semibold uppercase tracking-widest">
              Societe Gen Et. 256-Bit Encryption Active
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/finance"
              className="text-xs font-semibold uppercase tracking-wide text-primary underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/finance"
              className="text-xs font-semibold uppercase tracking-wide text-primary underline-offset-4 hover:underline"
            >
              Security Protocol
            </Link>
          </div>
        </footer>
      </div>

      {/* Success dialog */}
      <AlertDialog open={saved} onOpenChange={setSaved}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-6" />
            </div>
            <AlertDialogTitle>Entity Profile Saved</AlertDialogTitle>
            <AlertDialogDescription>
              Business information for {deal.name} has been successfully
              initialized. Ready to proceed to document ingestion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSaved(false)}>
              Review Entry
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`/finance/dashboard/analysis/documents?deal=${deal.id}`}>
                Continue to Data Room
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

