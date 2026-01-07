"use client"

import { useState, useEffect } from "react"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, Code, Sparkles, Loader2, Megaphone } from "lucide-react"
import { getPortfolioProjects, type PortfolioProject } from "@/lib/portfolio"

const services = [
  {
    icon: Palette,
    title: "Brand Development",
    description: "Strategic brand identity, visual systems, and guidelines that make your business memorable.",
  },
  {
    icon: Code,
    title: "Web Development",
    description: "High-performance websites and web applications built with modern technologies.",
  },
  {
    icon: Sparkles,
    title: "Digital Strategy",
    description: "Comprehensive digital solutions that align your brand with your business goals.",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    description: "Effective marketing strategies to promote your brand and reach your target audience.",
  },
]

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getPortfolioProjects()
        const featured = data.filter((p) => p.status === "Published" && p.featured).slice(0, 3)
        setFeaturedProjects(featured)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-balance">
              We craft brands and build digital experiences
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              VisualHQ is a creative agency in Lagos, Nigeria specializing in brand development and web development. We
              help businesses stand out through strategic design and technology.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="font-serif" asChild>
                <Link href="/portfolio">
                  View Our Work
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="font-serif bg-transparent" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Canva Embed Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="w-full max-w-[350px] aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <iframe
                loading="lazy"
                className="w-full h-full"
                src="https://www.canva.com/design/DAG7SJwEiW0/T1aH6eU39bKp_nVlrFe2Cw/view?embed"
                allowFullScreen
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-medium text-muted-foreground mb-2">What We Do</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Our Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-card p-8 rounded-lg border-border px-4 py-4 pb-24 border-0">
                <service.icon className="w-10 h-10 mb-4" />
                <h3 className="text-xl mb-2 font-serif font-light">{service.title}</h3>
                <p className="text-muted-foreground leading-4 text-xs">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Featured Work</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light">Selected Projects</h2>
            </div>
            <Button variant="outline" className="font-serif bg-transparent" asChild>
              <Link href="/portfolio">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.slug}`} className="group block">
                  <div className="aspect-[3/2] bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105 h-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{project.category?.join(" & ") || "Project"}</p>
                  <h3 className="font-serif group-hover:underline text-2xl font-medium italic">{project.title}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No featured projects yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-foreground text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl mb-6 text-balance font-medium">
            Ready to transform your brand?
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Let's discuss your project and explore how VisualHQ can help bring your vision to life.
          </p>
          <Button size="lg" variant="secondary" className="font-serif" asChild>
            <Link href="/contact">
              Start a Conversation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
