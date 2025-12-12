import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { plans } from "@/lib/plans"

export function PricingSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <div key={plan.id} className="relative bg-card border border-border rounded-lg p-8 flex flex-col">
          {plan.mostPicked && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              MOST PICKED
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-4xl font-bold">${plan.price.toLocaleString()}</span>
              <span className="text-muted-foreground">/{plan.period}</span>
            </div>
            <p className="text-muted-foreground">{plan.description}</p>
          </div>
          <Button className="w-full mb-6" asChild>
            <Link href="/contact">Subscribe Now</Link>
          </Button>
          <div className="flex-1">
            <p className="font-semibold mb-4">What's included</p>
            <ul className="space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex gap-3">
                  <Check className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
