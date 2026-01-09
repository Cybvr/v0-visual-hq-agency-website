import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Target, Users, Lightbulb, Globe } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    description: "Every design decision is guided by clear objectives and measurable outcomes.",
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "We work closely with our clients, treating each project as a true partnership.",
  },
  {
    icon: Lightbulb,
    title: "Innovative",
    description: "We stay ahead of trends while focusing on timeless design principles.",
  },
  {
    icon: Globe,
    title: "Global Standards",
    description: "Local expertise meets international quality and best practices.",
  },
]

const team = [
  {
    name: "Jide Pinheiro",
    role: "Founder & Creative Director",
    image: "/professional-african-man-portrait.png",
  },
  {
    name: "Adaeze Okonkwo",
    role: "Lead Designer",
    image: "/professional-african-woman.png",
  },
  {
    name: "Tunde Bakare",
    role: "Senior Developer",
    image: "/professional-african-man-developer-portrait.jpg",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-muted-foreground mb-4">About Us</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-balance">
              Building brands that matter
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              VisualHQ was founded with a simple mission: to help businesses in Africa and beyond establish powerful
              digital presences through exceptional brand and web development.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in Lagos, Nigeria, VisualHQ emerged from a passion for design excellence and technical
                  innovation. We recognized that businesses in our region deserved world-class creative services without
                  compromising on quality or understanding.
                </p>
                <p>
                  Today, we've grown into a team of dedicated designers and developers who combine local market
                  knowledge with global standards. We've helped startups launch, established businesses rebrand, and
                  enterprises scale their digital presence.
                </p>
                <p>
                  Our location in Lagos gives us unique insight into the African market while our commitment to
                  excellence ensures we deliver work that stands up anywhere in the world.
                </p>
              </div>
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-eniforo-kelvin-2147697922-29715199-xWkruvbP3vXKzdsjBdSomWtqM5Y8r7.jpg" alt="VisualHQ Office" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-medium text-muted-foreground mb-2">Our Approach</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title}>
                <value.icon className="w-10 h-10 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Let's work together</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            We're always excited to collaborate with ambitious brands and businesses.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">
              Get in Touch
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
