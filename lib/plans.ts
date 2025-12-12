export interface Plan {
  id: string
  name: string
  price: number
  period: string
  mostPicked?: boolean
  description: string
  features: string[]
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter Plan",
    price: 9999,
    period: "year",
    mostPicked: false,
    description: "Perfect for early-stage businesses that need a solid foundation.",
    features: [
      "1 Mobile App MVP - basic iOS/Android build",
      "1 Web App MVP - essential frontend/backend",
      "Basic Marketing Setup - landing page & email capture",
      "1 Managed Ad Campaign/mo - Google or Facebook",
      "1-Hour Consulting/mo - strategy kick-off",
      "Standard Support - email response within 48h",
    ],
  },
  {
    id: "growth",
    name: "Growth Plan",
    price: 29999,
    period: "year",
    mostPicked: true,
    description: "Scale your business with advanced tools and dedicated support.",
    features: [
      "2 Mobile Apps - tailored user flows",
      "2 Web Apps - advanced modules & database",
      "Advanced Marketing - A/B testing & funnel setup",
      "Up to 5 Managed Ad Campaigns/mo - multi-channel",
      "3-Hour Consulting/mo - growth & tech strategy",
      "Priority Support - 24h response time",
      "Analytics Dashboard - detailed usage stats",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 69999,
    period: "year",
    mostPicked: false,
    description: "Full-service enterprise solution for aggressive scaling.",
    features: [
      "Up to 5 Custom Apps - mobile & web suite",
      "Enterprise Marketing - AI automations & workflows",
      "Up to 15 Managed Ad Campaigns/mo - cross-platform scaling",
      "Weekly Strategy Calls - roadmap & conversion optimization",
      "Dedicated Account Manager - direct Slack access",
      "Custom API Integrations - Salesforce, HubSpot, Stripe",
      "Priority Development Queue - fast-track requests",
      "White-label Options - fully branded deployment",
    ],
  },
]
