import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="relative inline-block h-10 w-32">
              <Image
                src="/images/design-mode/visualhqlog.png"
                alt="VisualHQ"
                fill
                className="object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-primary-foreground/70 max-w-md text-sm">
              Transforming brands through exceptional design and cutting-edge web development. Based in Lagos,
              delivering globally.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 font-serif">Navigation</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                Home
              </Link>
              <Link
                href="/about"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
              >
                About
              </Link>
              <Link
                href="/portfolio"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
              >
                Portfolio
              </Link>
              <Link
                href="/contact"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4 font-serif">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:jide.pinheiro@gmail.com"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                jide.pinheiro@gmail.com
              </a>
              <div className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Polystar 2nd Roundabout, Lekki Phase 1, Lagos 105102, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-xs">
            © {new Date().getFullYear()} VisualHQ. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 text-xs">Crafted with precision in Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  )
}
