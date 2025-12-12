import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, Code, Sparkles, Megaphone } from "lucide-react"
import { getPortfolioProjects } from "@/lib/portfolio"
import { StoriesViewer } from "@/components/StoriesViewer"

const services = [
  {
    icon: Palette,
    title: "Brand Development",
    description:
      "We design brands people actually remember. Logos, colors, typography—the whole identity that makes you stand out in Lagos and beyond.",
  },
  {
    icon: Code,
    title: "Web Development",
    description:
      "Fast, beautiful websites that work. We build with React, Next.js, and whatever tech gets your business online properly.",
  },
  {
    icon: Sparkles,
    title: "Digital Strategy",
    description: "The plan behind the pretty stuff. We figure out what your business needs online and make it happen.",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    description:
      "Getting people to notice you. Social media, content, ads—whatever it takes to put your brand in front of the right audience.",
  },
]

export default async function HomePage() {
  const featuredProjects = await getPortfolioProjects()

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-balance">
                We make brands people remember
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                Based in Lagos, we design brands and build websites for businesses that want to look good and work
                better. No fluff, just good design and solid code.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/portfolio">
                    See What We've Built
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Let's Talk</Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <StoriesViewer />
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-card p-8 rounded-lg border border-border">
                <service.icon className="w-10 h-10 mb-4" />
                <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
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
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Selected Projects</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/portfolio">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.slug}`} className="group block">
                  <div className="aspect-[3/2] bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{project.category?.join(" & ") || "Project"}</p>
                  <h3 className="font-semibold text-lg group-hover:underline">{project.title}</h3>
                  <p className="text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
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
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-balance">Got a project in mind?</h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Whether you need a new brand or a website that actually converts, let's talk about what you're building.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
