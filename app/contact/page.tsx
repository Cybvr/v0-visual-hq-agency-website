"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-muted-foreground mb-4">Contact</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Let's start a project
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have a project in mind? We'd love to hear from you. Book a call below or reach out directly via email.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <div 
                id="my-cal-inline-30min" 
                className="w-full min-h-[600px] rounded-lg overflow-scroll"
                dangerouslySetInnerHTML={{
                  __html: `
                    <script type="text/javascript">
                      (function (C, A, L) { 
                        let p = function (a, ar) { a.q.push(ar); }; 
                        let d = C.document; 
                        C.Cal = C.Cal || function () { 
                          let cal = C.Cal; 
                          let ar = arguments; 
                          if (!cal.loaded) { 
                            cal.ns = {}; 
                            cal.q = cal.q || []; 
                            d.head.appendChild(d.createElement("script")).src = A; 
                            cal.loaded = true; 
                          } 
                          if (ar[0] === L) { 
                            const api = function () { p(api, arguments); }; 
                            const namespace = ar[1]; 
                            api.q = api.q || []; 
                            if(typeof namespace === "string"){
                              cal.ns[namespace] = cal.ns[namespace] || api;
                              p(cal.ns[namespace], ar);
                              p(cal, ["initNamespace", namespace]);
                            } else p(cal, ar); 
                            return;
                          } 
                          p(cal, ar); 
                        }; 
                      })(window, "https://app.cal.com/embed/embed.js", "init");
                      Cal("init", "30min", {origin:"https://app.cal.com"});
                      Cal.ns["30min"]("inline", {
                        elementOrSelector:"#my-cal-inline-30min",
                        config: {"layout":"month_view"},
                        calLink: "pinheirojide/30min",
                      });
                      Cal.ns["30min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
                    </script>
                  `
                }}
              />
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-secondary p-8 rounded-lg mb-8">
                <h3 className="font-semibold text-lg mb-4">Prefer email?</h3>
                <a
                  href="mailto:jide.pinheiro@gmail.com"
                  className="flex items-center gap-3 text-foreground hover:underline"
                >
                  <Mail className="w-5 h-5" />
                  jide.pinheiro@gmail.com
                </a>
              </div>

              <div className="bg-secondary p-8 rounded-lg mb-8">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Polystar 2nd Roundabout, Lekki Phase 1, Lagos 105102, Nigeria</span>
                </div>
              </div>

              <div className="p-8 border border-border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">What happens next?</h3>
                <ol className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">1.</span>
                    Book a convenient time slot
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">2.</span>
                    We'll discuss your project goals
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">3.</span>
                    Receive a tailored proposal within 48 hours
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
