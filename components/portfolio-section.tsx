"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { getPortfolioProjects, type PortfolioProject } from "@/lib/portfolio"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import "./portfolio.css"

const triggerClass =
  "w-fit gap-1 border-0 bg-transparent p-0 h-auto shadow-none focus-visible:ring-0 text-foreground [&>svg]:size-5 [&>svg]:opacity-100"
const contentClass =
  "border-0 shadow-lg [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden [&_[data-radix-select-viewport]]:[scrollbar-width:none] [&_[data-radix-select-viewport]]:[&::-webkit-scrollbar]:hidden"
const itemClass = "text-lg"

const PLACEHOLDER = "/placeholder.svg?height=900&width=1200&query=project"

/**
 * The mosaic repeats every four tiles. Spans are chosen so each pair tiles a
 * 12-column row: 7+4 on the first row, 5+6 indented on the second. The offsets
 * are positive only, so a short tile never overlaps the row above it.
 *
 * `insetLift` is the same rhythm at reduced amplitude, for the narrower column
 * inside the home accordion where the full offsets read as dead space.
 */
const TILE_PATTERN = [
  { span: "md:col-span-7 md:col-start-1", ratio: "md:aspect-[4/3]", lift: "", insetLift: "" },
  { span: "md:col-span-4 md:col-start-9", ratio: "md:aspect-[3/4]", lift: "md:mt-28", insetLift: "md:mt-16" },
  { span: "md:col-span-5 md:col-start-2", ratio: "md:aspect-[1/1]", lift: "md:mt-16", insetLift: "md:mt-10" },
  { span: "md:col-span-6 md:col-start-7", ratio: "md:aspect-[16/11]", lift: "", insetLift: "" },
]

interface PortfolioSectionProps {
  showHero?: boolean
  /** Render without the page container's max-width and gutters, for use inside an already-constrained parent. */
  inset?: boolean
}

function metaLine(project: PortfolioProject) {
  return [project.category?.join(" & "), project.location].filter(Boolean).join(" · ")
}

/** The gallery wall. The work leads on /portfolio and in the home accordion alike. */
function ProjectMosaic({ projects, compact = false }: { projects: PortfolioProject[]; compact?: boolean }) {
  return (
    <ul
      className={`grid grid-cols-1 md:grid-cols-12 ${
        compact ? "gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-8" : "gap-x-8 gap-y-16 md:gap-x-10 md:gap-y-10"
      }`}
    >
      {projects.map((project, index) => {
        const tile = TILE_PATTERN[index % TILE_PATTERN.length]
        const meta = metaLine(project)

        return (
          <li key={project.id} className={`pf-tile ${tile.span} ${compact ? tile.insetLift : tile.lift}`}>
            <Link href={`/portfolio/${project.slug}`} className="group block outline-none">
              <figure>
                <div className={`pf-shot aspect-[4/3] overflow-hidden bg-muted ${tile.ratio}`}>
                  <img src={project.imageUrl || PLACEHOLDER} alt="" loading="lazy" />
                </div>

                <figcaption className="pf-rule mt-5 border-t border-border pt-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground transition-colors group-hover:text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-balance text-2xl tracking-[-0.01em] text-foreground transition-colors group-hover:text-accent md:text-3xl">
                      {project.title}
                    </h2>
                  </div>

                  {project.excerpt && (
                    <p className="mt-2 max-w-[48ch] pl-8 text-sm leading-6 text-muted-foreground">{project.excerpt}</p>
                  )}

                  {meta && (
                    <p className="mt-3 pl-8 font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-muted-foreground">
                      {meta}
                    </p>
                  )}
                </figcaption>
              </figure>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function PortfolioSection({ showHero = true, inset = false }: PortfolioSectionProps) {
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
            <ProjectMosaic projects={filteredProjects} compact={inset} />
          )}
        </div>
      </section>
    </>
  )
}
