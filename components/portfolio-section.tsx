"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { getPortfolioProjects, type PortfolioProject } from "@/lib/portfolio"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PortfolioGrid } from "@/components/portfolio-grid"

const triggerClass =
  "w-fit gap-1 border-0 bg-transparent p-0 h-auto shadow-none focus-visible:ring-0 text-foreground [&>svg]:size-5 [&>svg]:opacity-100"
const contentClass =
  "border-0 shadow-lg [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden [&_[data-radix-select-viewport]]:[scrollbar-width:none] [&_[data-radix-select-viewport]]:[&::-webkit-scrollbar]:hidden"
const itemClass = "text-lg"

interface PortfolioSectionProps {
  showHero?: boolean
  /** Render without the page container's max-width and gutters, for use inside an already-constrained parent. */
  inset?: boolean
  /** Cap the number of tiles and offer a link through to the full index. Omit to show everything. */
  limit?: number
}

export function PortfolioSection({ showHero = true, inset = false, limit }: PortfolioSectionProps) {
  const containerClass = inset ? "" : "mx-auto max-w-7xl px-4 sm:px-8 md:px-20"
  const [activeFilter, setActiveFilter] = useState("All")
  const [industryFilter, setIndustryFilter] = useState("All")
  const [locationFilter, setLocationFilter] = useState("All")
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
  const locations = Array.from(new Set(projects.map((p) => p.location).filter(Boolean))).sort()

  const filteredProjects = projects
    .filter((p) => activeFilter === "All" || p.category?.includes(activeFilter))
    .filter((p) => industryFilter === "All" || p.industry === industryFilter)
    .filter((p) => locationFilter === "All" || p.location === locationFilter)

  const visibleProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects
  const hasMore = Boolean(limit) && filteredProjects.length > visibleProjects.length

  return (
    <>
      {showHero && (
        <section className="pt-30 pb-12">
          <div className={containerClass}>
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
        <div className={`flex flex-wrap items-center gap-6 ${containerClass}`}>
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

          {locations.length > 0 && (
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className={triggerClass}>
                <h2 className="text-2xl md:text-3xl">
                  <SelectValue />
                </h2>
              </SelectTrigger>
              <SelectContent className={contentClass}>
                <SelectItem value="All" className={itemClass}>
                  <h3 className="text-lg">All Locations</h3>
                </SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location as string} className={itemClass}>
                    <h3 className="text-lg">{location}</h3>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </section>

      {/* Projects */}
      <section className={inset ? "pb-4" : "pb-24 md:pb-32"}>
        <div className={containerClass}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              No projects match these filters yet. Try widening one of them.
            </p>
          ) : (
            <>
              {/* The hero heading carries the count on /portfolio; inset has no heading, so it carries its own. */}
              {limit && (
                <p className="mb-8 font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-muted-foreground">
                  Showing {visibleProjects.length} of {filteredProjects.length} projects
                </p>
              )}

              <PortfolioGrid projects={visibleProjects} compact={inset} showNumbers={!inset} />

              {hasMore && (
                <div className="mt-12 border-t border-border pt-6">
                  <Link
                    href="/portfolio"
                    className="group inline-flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-accent"
                  >
                    View all {filteredProjects.length} projects
                    <ArrowRight className="size-3.5 transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:transition-none" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
