"use client"

import Link from "next/link"
import { ArrowUpRight, FolderKanban, Megaphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

const SECTIONS = [
  {
    title: "Portfolio",
    description: "Add, edit, and remove portfolio projects shown on the site.",
    href: "/admin/portfolio",
    icon: FolderKanban,
  },
  {
    title: "Marketing",
    description: "Preview the Instagram presence and campaign content.",
    href: "/admin/marketing",
    icon: Megaphone,
  },
]

export default function AdminHomePage() {
  const { user } = useAuth()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-xl font-semibold">
        Welcome{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage the VisualHQ site from here.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="group">
            <Card className="h-full transition-colors group-hover:border-foreground/30">
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div>
                  <div className="font-medium">{section.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
