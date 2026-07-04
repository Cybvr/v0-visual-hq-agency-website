"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { getPortfolioProjects, type PortfolioProject } from "@/lib/portfolio"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const triggerClass =
  "w-fit gap-1 border-0 bg-transparent p-0 h-auto shadow-none focus-visible:ring-0 text-foreground [&>svg]:size-5 [&>svg]:opacity-100"
const contentClass =
  "border-0 shadow-lg [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden [&_[data-radix-select-viewport]]:[scrollbar-width:none] [&_[data-radix-select-viewport]]:[&::-webkit-scrollbar]:hidden"
const itemClass = "text-lg"

interface PortfolioSectionProps {
  showHero?: boolean
}

export function PortfolioSection({ showHero = true }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [industryFilter, setIndustryFilter] = useState("All")
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getPortfolioProjects()
        setProjects(data.filter((p) => p.status?.toLowerCase() === "published"))
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const categories = ["All", ...Array.from(new Set(projects.flatMap((p) => p.category || []))).sort()]
  const industries = Array.from(new Set(projects.map((p) => p.industry).filter(Boolean))).sort()

  const filteredProjects = projects
    .filter((p) => activeFilter === "All" || p.category?.includes(activeFilter))
    .filter((p) => industryFilter === "All" || p.industry === industryFilter)

  return (
    <>
      {showHero && (
        <section className="pt-30 pb-12">
          <div className="mx-auto max-w-7xl px-12 md:px-20">
            <div className="max-w-3xl">
              <h1 className="text-sm uppercase tracking-[0.24em] text-foreground">
                Portfolio {!loading && `(${filteredProjects.length})`}
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="pb-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-12 md:px-20">
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className={triggerClass}>
              <h2 className="text-2xl md:text-3xl">
                <SelectValue />
              </h2>
            </SelectTrigger>
            <SelectContent className={contentClass}>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className={itemClass}>
                  <h3 className="text-lg">{category === "All" ? "All Categories" : category}</h3>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {industries.length > 0 && (
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className={triggerClass}>
                <h2 className="text-2xl md:text-3xl">
                  <SelectValue />
                </h2>
              </SelectTrigger>
              <SelectContent className={contentClass}>
                <SelectItem value="All" className={itemClass}>
                  <h3 className="text-lg">All Industries</h3>
                </SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry as string} className={itemClass}>
                    <h3 className="text-lg">{industry}</h3>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-12 md:px-20">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No projects found.</div>
          ) : (
            <ul className="grid grid-cols-1 gap-y-8">
              {filteredProjects.map((project) => (
                <li key={project.id} className="border-b border-border pb-4">
                  <Link href={`/portfolio/${project.slug}`} className="block group">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="w-24 h-16 bg-muted overflow-hidden shrink-0">
                        <img
                          src={project.imageUrl || "/placeholder.svg?height=300&width=480&query=project"}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl text-foreground group-hover:text-accent transition-colors md:text-3xl line-clamp-1">
                          {project.excerpt || project.description}
                        </h2>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
