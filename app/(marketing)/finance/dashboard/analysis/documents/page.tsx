import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Info,
  Rocket,
} from "lucide-react"
import { AnalysisSubnav } from "@/components/finance/analysis-subnav"
import { PageHeader } from "@/components/finance/page-header"
import {
  documentLensHighlight,
  intakeQueue,
  intakeQueueActiveLabel,
  intakeRequirements,
  type IntakeFileStatus,
} from "@/lib/finance/analysis"
import { resolveDeal } from "@/lib/finance/pipeline"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const statusBadgeVariant: Record<IntakeFileStatus, "default" | "secondary" | "outline"> = {
  analyzing: "default",
  completed: "secondary",
  pending: "outline",
}

const statusLabel: Record<IntakeFileStatus, string> = {
  analyzing: "Analyzing",
  completed: "Completed",
  pending: "Pending",
}

const iconToneClass = {
  secondary: "text-primary",
  error: "text-destructive",
} as const

interface DocumentIntakePageProps {
  searchParams: Promise<{ deal?: string }>
}

export default async function DocumentIntakePage({ searchParams }: DocumentIntakePageProps) {
  const { deal: dealId } = await searchParams
  const deal = resolveDeal(dealId)

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Analysis", href: "/finance/dashboard/analysis" },
          { label: deal.name, href: `/finance/dashboard/analysis?deal=${deal.id}` },
          { label: "Document Intake" },
        ]}
        eyebrow={deal.name}
        title="Document Intake"
        subtitle="Upload source files, track processing, and prepare the working set for structured QofE analysis."
      />

      <AnalysisSubnav dealId={deal.id} />

      <Button variant="link" size="sm" asChild className="mb-8 px-0">
        <Link href={`/finance/dashboard/analysis/business-info?deal=${deal.id}`}>
          <ArrowLeft className="size-4" />
          Back to Business Info
        </Link>
      </Button>

      <section>
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Left column: upload zone */}
          <div className="flex flex-col gap-6 xl:col-span-7">
            <Card className="shadow-none border-dashed border-2 cursor-pointer transition-colors hover:border-primary hover:bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-6 flex gap-4">
                  <div className="flex size-16 items-center justify-center rounded-md bg-muted text-primary">
                    <FileSpreadsheet className="size-8" />
                  </div>
                  <div className="flex size-16 items-center justify-center rounded-md bg-muted text-destructive">
                    <FileText className="size-8" />
                  </div>
                </div>
                <p className="mb-2 text-xl font-semibold text-primary">
                  Drop your Excel or PDF files here
                </p>
                <p className="mb-8 text-sm text-muted-foreground">
                  Supported: .xlsx, .csv, .pdf, .zip up to 256MB
                </p>
                <Button>Select Files from Local Machine</Button>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <Info className="size-5 text-primary" />
                <CardTitle>Intake Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {intakeRequirements.map((requirement) => (
                    <li key={requirement} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right column: upload queue */}
          <div className="xl:col-span-5">
            <Card className="shadow-none flex h-full flex-col">
              <CardHeader className="border-b flex-row items-center justify-between space-y-0">
                <CardTitle>Processing Queue</CardTitle>
                <span className="text-xs font-semibold text-muted-foreground">
                  {intakeQueueActiveLabel}
                </span>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                {intakeQueue.map((file) => (
                  <div
                    key={file.name}
                    className={cn(
                      "flex items-center gap-4 border-b p-4 transition-colors hover:bg-muted/50",
                      file.status === "pending" && "opacity-70",
                    )}
                  >
                    <div className="flex size-10 items-center justify-center rounded-sm bg-muted">
                      <FileText className={cn("size-5", iconToneClass[file.iconTone])} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-primary">
                        {file.name}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {file.meta}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={statusBadgeVariant[file.status]}>
                        {statusLabel[file.status]}
                      </Badge>
                      {file.status === "analyzing" && (
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${file.progress ?? 0}%` }}
                          />
                        </div>
                      )}
                      {file.actionLabel && (
                        <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
                          {file.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {intakeQueue.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-sm text-muted-foreground">Ready for next batch</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t bg-muted/40 flex items-center justify-between p-6">
                <Button variant="ghost" size="sm">
                  Clear Finished
                </Button>
                <Button asChild>
                  <Link href={`/finance/dashboard/analysis/report?deal=${deal.id}`}>
                    <Rocket className="size-4" />
                    Start All Analysis
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Document Lens highlight */}
      <Card className="shadow-none mt-12 bg-primary text-primary-foreground">
        <CardContent className="flex flex-col items-center gap-8 p-8 md:flex-row">
          <div className="flex-1">
            <h2 className="mb-4 text-3xl">{documentLensHighlight.title}</h2>
            <p className="max-w-xl text-base opacity-90">{documentLensHighlight.body}</p>
          </div>
          <div className="shrink-0">
            <img
              src={documentLensHighlight.imageSrc}
              alt={documentLensHighlight.imageAlt}
              className="h-40 w-64 rounded-lg border border-primary-foreground/20 object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

