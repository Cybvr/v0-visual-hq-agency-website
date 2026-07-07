import type { LucideIcon } from "lucide-react"
import {
  Activity,
  ClipboardList,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Calculator,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Users,
} from "lucide-react"

export interface FinanceAppNavItem {
  label: string
  href: string
  icon: LucideIcon
  activeMatchers?: string[]
}

export const financeAppNav: FinanceAppNavItem[] = [
  { label: "Overview", href: "/finance/app", icon: LayoutDashboard },
  { label: "Deal Pipeline", href: "/finance/app/pipeline", icon: BriefcaseBusiness },
  {
    label: "Analysis",
    href: "/finance/app/analysis",
    icon: ClipboardList,
    activeMatchers: ["/finance/app/analysis", "/finance/app/benchmarking", "/finance/app/modeling"],
  },
  { label: "Portfolio", href: "/finance/app/portfolio", icon: Activity },
  { label: "Reports", href: "/finance/app/reports", icon: Users },
]

export const analysisNav: FinanceAppNavItem[] = [
  { label: "Overview", href: "/finance/app/analysis", icon: ClipboardList },
  { label: "Business Info", href: "/finance/app/analysis/business-info", icon: Building2 },
  { label: "Document Intake", href: "/finance/app/analysis/documents", icon: FolderOpen },
  { label: "QofE Report", href: "/finance/app/analysis/report", icon: FileText },
  { label: "Benchmarking", href: "/finance/app/benchmarking", icon: BarChart3 },
  { label: "Financial Modeling", href: "/finance/app/modeling", icon: Calculator },
]
