"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ExternalLink, Loader2 } from "lucide-react"
import { getPortfolioProjects, type PortfolioProject } from "@/lib/portfolio"
import Link from "next/link"

const categories = ["All", "Branding", "Web Development", "Presentation Design"]

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getPortfolioProjects()
        // Only show published projects
        setProjects(data.filter((p) => p.status === "Published"))
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

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-muted-foreground mb-4">Portfolio</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">Our Work</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A selection of projects where we've helped brands establish their identity and build their digital
              presence.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No projects found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  href={project.projectUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={project.id}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[7/5] bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={project.imageUrl || "/placeholder.svg?height=500&width=700&query=project"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{project.category?.join(", ")}</p>
                      <h3 className="font-semibold text-xl group-hover:underline">{project.title}</h3>
                      <p className="text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies?.slice(0, 4).map((tech) => (
                          <span key={tech} className="text-xs bg-secondary px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-foreground text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Have a project in mind?</h2>
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
