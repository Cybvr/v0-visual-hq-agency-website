"use client"

import { useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useAgent } from "@/components/agent/agent-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

export function SidebarSearch() {
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { isAdmin, isImpersonating, stopViewingAs } = useAuth()
  const { setOpen: setAgentOpen } = useAgent()
  const { setOpen, isMobile, setOpenMobile } = useSidebar()

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim().toLowerCase()
    if (!query) return
    const destinations = isAdmin
      ? [
          { terms: ["agent", "chat", "assistant"], href: "/dashboard/agent" },
          { terms: ["project"], href: "/dashboard/projects" },
          { terms: ["task"], href: "/dashboard/tasks" },
          { terms: ["drive", "file", "upload"], href: "/dashboard/drive" },
          { terms: ["document", "proposal", "sow", "brief"], href: "/dashboard/documents" },
          { terms: ["email", "mail", "message", "template", "sender"], href: "/dashboard/email" },
          { terms: ["seo", "ranking", "keyword"], href: "/dashboard/seo" },
          { terms: ["invoice", "billing", "payment", "finance"], href: "/dashboard/invoices" },
          { terms: ["contract", "agreement", "signature"], href: "/dashboard/contracts" },
          { terms: ["estimate", "quote", "proposal"], href: "/dashboard/estimates" },
          { terms: ["client", "company", "workspace"], href: "/dashboard/companies" },
          { terms: ["contact", "user", "account", "settings"], href: "/dashboard/users" },
        ]
      : [
          { terms: ["agent", "chat", "assistant"], href: "/dashboard/agent" },
          { terms: ["project"], href: "/dashboard/projects" },
          { terms: ["task"], href: "/dashboard/tasks" },
          { terms: ["drive", "file", "upload"], href: "/dashboard/drive" },
          { terms: ["document", "proposal", "sow", "brief"], href: "/dashboard/documents" },
          { terms: ["email", "mail", "message", "template", "sender"], href: "/dashboard/email" },
          { terms: ["seo", "ranking", "keyword"], href: "/dashboard/seo" },
          { terms: ["invoice", "billing", "payment", "finance"], href: "/dashboard/invoices" },
          { terms: ["contract", "agreement", "signature"], href: "/dashboard/contracts" },
          { terms: ["estimate", "quote", "proposal"], href: "/dashboard/estimates" },
        ]
    const match = destinations.find(({ terms }) => terms.some((term) => term.includes(query) || query.includes(term)))
    if (isImpersonating && (match?.href === "/dashboard/companies" || match?.href === "/dashboard/users")) {
      stopViewingAs()
    }
    if (match?.href === "/dashboard/agent") setAgentOpen(true)
    else router.push(match?.href ?? "/dashboard")
    if (isMobile) setOpenMobile(false)
  }


  return (
    <>
      <form role="search" onSubmit={handleSearch} className="relative group-data-[collapsible=icon]:hidden">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input ref={inputRef} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search dashboard" aria-label="Search dashboard" className="pl-9 pr-10 text-sm font-medium text-muted-foreground placeholder:text-muted-foreground md:text-[13px] [&::-webkit-search-cancel-button]:hidden" />
        <Button type="submit" variant="ghost" size="icon-sm" className="absolute right-0.5 top-1/2 -translate-y-1/2" aria-label="Go to page">
          <Search className="size-4" aria-hidden="true" />
        </Button>
      </form>
      <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Search dashboard" aria-label="Search dashboard" onClick={() => {
            setOpen(true)
            requestAnimationFrame(() => inputRef.current?.focus())
          }}>
            <Search className="size-4" aria-hidden="true" />
            <span>Search dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
