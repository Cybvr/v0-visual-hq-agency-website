import Link from "next/link"
import { ArrowLeft, Download, FileSpreadsheet, FileText } from "lucide-react"
import { PageHeader } from "@/components/finance/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { lpReportDocuments } from "@/lib/finance/lp-portal"

export default function ReportArchivePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/finance/dashboard" },
          { label: "Reports", href: "/finance/dashboard/reports" },
          { label: "Report Archive" },
        ]}
        eyebrow="Reporting"
        title="Report Archive"
        subtitle="Browse previously prepared investor materials, download package files, and review reporting history."
      />

      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/finance/dashboard/reports">
            <ArrowLeft className="size-4" />
            Back to reports
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
                      <Icon className={doc.format === "XLSX" ? "size-5 text-primary" : "size-5 text-muted-foreground"} />
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
    </>
  )
}

