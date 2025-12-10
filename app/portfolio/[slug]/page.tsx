"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react"
import { getPortfolioProjectBySlug, type PortfolioProject } from "@/lib/portfolio"

export default function SingleProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<PortfolioProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getPortfolioProjectBySlug(slug)
        setProject(data)
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 px-6 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/portfolio">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Back Button */}
      <section className="pt-28 px-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/portfolio">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Image */}
      <section className="pt-6 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden">
            <img
              src={project.imageUrl || "/placeholder.svg?height=900&width=1600&query=project"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {project.category?.join(" & ") || "Project"}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6">{project.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>

              {project.projectUrl && (
                <Button className="mt-8" asChild>
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                    Visit Live Site
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {project.client && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm text-muted-foreground mb-1">Client</p>
                  <p className="font-medium">{project.client}</p>
                </div>
              )}
              {project.industry && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm text-muted-foreground mb-1">Industry</p>
                  <p className="font-medium">{project.industry}</p>
                </div>
              )}
              {project.founders && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm text-muted-foreground mb-1">Founders</p>
                  <p className="font-medium">{project.founders}</p>
                </div>
              )}
              {project.clientValuation && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm text-muted-foreground mb-1">Valuation</p>
                  <p className="font-medium">{project.clientValuation}</p>
                </div>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-sm bg-secondary px-3 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-8">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((image, index) => (
                <div key={index} className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${project.title} gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6 bg-foreground text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Like what you see?</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Let's discuss how we can create something amazing for your brand.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Start a Project</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
