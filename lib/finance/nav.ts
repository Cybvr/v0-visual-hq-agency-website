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
  { label: "Overview", href: "/finance/dashboard", icon: LayoutDashboard },
  { label: "Pipeline", href: "/finance/dashboard/pipeline", icon: BriefcaseBusiness },
  {
    label: "Analysis",
    href: "/finance/dashboard/analysis",
    icon: ClipboardList,
    activeMatchers: ["/finance/dashboard/analysis", "/finance/dashboard/benchmarking", "/finance/dashboard/modeling"],
  },
  { label: "Portfolio", href: "/finance/dashboard/portfolio", icon: Activity },
  { label: "Reports", href: "/finance/dashboard/reports", icon: Users },
]

export const portfolioNav: FinanceAppNavItem[] = [
  { label: "Overview", href: "/finance/dashboard/portfolio", icon: LayoutDashboard },
  { label: "Holdings", href: "/finance/dashboard/portfolio/holdings", icon: Building2 },
  { label: "Value Creation", href: "/finance/dashboard/portfolio/initiatives", icon: BarChart3 },
]

export const analysisNav: FinanceAppNavItem[] = [
  { label: "Overview", href: "/finance/dashboard/analysis", icon: ClipboardList },
  { label: "Business Info", href: "/finance/dashboard/analysis/business-info", icon: Building2 },
  { label: "Document Intake", href: "/finance/dashboard/analysis/documents", icon: FolderOpen },
  { label: "QofE Report", href: "/finance/dashboard/analysis/report", icon: FileText },
  { label: "Benchmarking", href: "/finance/dashboard/benchmarking", icon: BarChart3 },
  { label: "Financial Modeling", href: "/finance/dashboard/modeling", icon: Calculator },
]

