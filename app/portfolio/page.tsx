"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { getPortfolioProjects, type PortfolioProject } from "@/lib/portfolio"
import Link from "next/link"

const categories = ["All", "Branding", "Web Development", "Presentation Design"]

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getPortfolioProjects()
        // Only show published projects
        setProjects(data.filter((p) => p.status?.toLowerCase() === "published"))
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const filteredProjects =
    activeFilter === "All" ? projects : projects.filter((p) => p.category?.includes(activeFilter))

  const ITEMS_PER_PAGE = 8
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-12 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Portfolio {!loading && `(${filteredProjects.length})`}
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="px-12 pb-12 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`text-2xl font-bold md:text-3xl [font-family:var(--font-outfit)] transition-colors ${
                  activeFilter === category ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-12 pb-20 md:px-20">
        <div className="max-w-7xl mx-auto">
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
                        <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors md:text-3xl line-clamp-1 [font-family:var(--font-outfit)]">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-12 bg-foreground text-primary-foreground md:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Have a project in mind?</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            We'd love to hear about it. Let's discuss how we can help bring your vision to life.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/contact">Start a Project</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
