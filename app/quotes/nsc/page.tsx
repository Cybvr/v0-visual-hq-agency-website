"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// --- DATA STRUCTURES ---
interface Feature {
  text: string
  description: string
  threshold: number
}

interface BreakdownItem {
  item: string
  description: string
  getAmount: (budget: number) => number
}

// --- STATIC DATA ---
const MIN_BUDGET = 2000000
const MAX_BUDGET = 18000000
const DEFAULT_BUDGET = 8000000

const FEATURES: Feature[] = [
  { text: "Basic Website Design", description: "Landing page with PAU branding", threshold: 2000000 },
  { text: "Public Film Catalog", description: "Browse films with basic information", threshold: 3000000 },
  { text: "Mobile Responsive Design", description: "Optimized for all devices", threshold: 3500000 },
  { text: "Basic Admin CMS", description: "Content management system", threshold: 4000000 },
  { text: "Standard Search (MongoDB)", description: "Basic search functionality", threshold: 4500000 },
  { text: "User Portal & Accounts", description: "Student/faculty login system", threshold: 5500000 },
  { text: "News & Events Blog", description: "Updates and announcements", threshold: 6000000 },
  { text: "Digital Archive", description: "Document and media storage", threshold: 6500000 },
  { text: "Screening Room Booking", description: "Facility reservation system", threshold: 7000000 },
  { text: "Advanced ElasticSearch", description: "Full-text search with filters", threshold: 8000000 },
  { text: "Research Document Archive", description: "Academic resources library", threshold: 9000000 },
  { text: "Training Sessions (2x)", description: "Staff onboarding and training", threshold: 10000000 },
  { text: "Advanced Analytics Dashboard", description: "Usage insights and metrics", threshold: 11000000 },
  { text: "Secure Video Streaming", description: "Protected video playback", threshold: 12500000 },
  { text: "Multi-lingual Support", description: "English/Yoruba/Igbo/Hausa", threshold: 14000000 },
  { text: "Public Research API", description: "External data access", threshold: 15000000 },
  { text: "Priority 24/7 Support", description: "Dedicated support channel", threshold: 16000000 },
  { text: "Extended 6-Month Maintenance", description: "Long-term support package", threshold: 17000000 },
  { text: "Dedicated Account Manager", description: "Personal project liaison", threshold: 18000000 },
]

const BREAKDOWN: BreakdownItem[] = [
  {
    item: "Discovery & Design",
    description: "Requirements, wireframes, UI/UX",
    getAmount: (b) => Math.round(b * 0.125),
  },
  {
    item: "Frontend Development",
    description: "React/Next.js, responsive layouts",
    getAmount: (b) => Math.round(b * 0.3),
  },
  { item: "Backend Development", description: "API, database, authentication", getAmount: (b) => Math.round(b * 0.25) },
  { item: "Admin Dashboard", description: "CMS, user administration", getAmount: (b) => Math.round(b * 0.15) },
  { item: "Features Integration", description: "Booking, blog, search", getAmount: (b) => Math.round(b * 0.1) },
  { item: "Testing & QA", description: "Quality assurance, bug fixes", getAmount: (b) => Math.round(b * 0.05) },
  {
    item: "Deployment & Training",
    description: "Setup, training, documentation",
    getAmount: (b) => Math.round(b * 0.025),
  },
]

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString("en-NG")}`
}

const getUnlockedFeatures = (budget: number): Feature[] => {
  return FEATURES.filter((f) => f.threshold <= budget)
}

const getNextFeature = (budget: number): Feature | null => {
  const locked = FEATURES.filter((f) => f.threshold > budget)
  return locked.length > 0 ? locked[0] : null
}

const getBudgetTier = (budget: number): { name: string; color: string } => {
  if (budget < 4000000) return { name: "Foundation", color: "text-gray-700" }
  if (budget < 10000000) return { name: "Growth", color: "text-blue-700" }
  if (budget < 15000000) return { name: "Professional", color: "text-purple-700" }
  return { name: "Premier", color: "text-green-700" }
}

const getProjectDuration = (budget: number): number => {
  if (budget < 4000000) return 6
  if (budget < 10000000) return 4
  if (budget < 15000000) return 5
  return 4
}

// --- REACT COMPONENT ---
export default function App() {
  const [budget, setBudget] = useState(DEFAULT_BUDGET)

  const unlockedFeatures = getUnlockedFeatures(budget)
  const nextFeature = getNextFeature(budget)
  const tier = getBudgetTier(budget)
  const duration = getProjectDuration(budget)
  const totalBreakdown = BREAKDOWN.reduce((sum, item) => sum + item.getAmount(budget), 0)

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen py-4 sm:py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-800 text-white p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-grow">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Nollywood Studies Centre Web Application</h1>
                <p className="text-base sm:text-lg opacity-90">Interactive Project Proposal</p>
              </div>
              <button
                onClick={handlePrint}
                className="bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition text-sm sm:text-base"
              >
                Print PDF
              </button>
            </div>
          </div>

          {/* Interactive Budget Slider */}
          <div className="p-6 sm:p-10 bg-gradient-to-br from-blue-50 to-white border-b-2 border-blue-200">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-6 text-center">
              Choose Your Investment Level
            </h2>

            <div className="max-w-3xl mx-auto">
              {/* Budget Display */}
              <div className="text-center mb-8">
                <div className="text-5xl sm:text-6xl font-extrabold text-blue-800 mb-2">{formatCurrency(budget)}</div>
                <div className={`text-xl sm:text-2xl font-semibold ${tier.color} mb-1`}>{tier.name} Package</div>
                <div className="text-sm text-gray-600">
                  {unlockedFeatures.length} of {FEATURES.length} features unlocked • ~{duration} weeks delivery
                </div>
              </div>

              {/* Slider */}
              <div className="relative mb-8">
                <input
                  type="range"
                  min={MIN_BUDGET}
                  max={MAX_BUDGET}
                  step={100000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #1e40af 0%, #1e40af ${((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100}%, #e5e7eb ${((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>{formatCurrency(MIN_BUDGET)}</span>
                  <span>{formatCurrency(MAX_BUDGET)}</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {[3000000, 5500000, 8000000, 13500000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBudget(amount)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      budget === amount
                        ? "bg-blue-800 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>

              {/* Next Feature Unlock */}
              {nextFeature && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">
                        Add {formatCurrency(nextFeature.threshold - budget)} to unlock:
                      </p>
                      <p className="text-sm text-yellow-700">
                        <strong>{nextFeature.text}</strong> - {nextFeature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-10 bg-gray-50 border-b-2 border-gray-200">
            <div>
              <h3 className="text-xs uppercase text-gray-500 mb-2 tracking-wider font-semibold">Proposal Date</h3>
              <p className="text-gray-700">December 10, 2025</p>
              <h3 className="text-xs uppercase text-gray-500 mt-5 mb-2 tracking-wider font-semibold">
                Project Duration
              </h3>
              <p className="text-gray-700">{duration} Weeks (January 2026)</p>
            </div>
            <div>
              <h3 className="text-xs uppercase text-gray-500 mb-2 tracking-wider font-semibold">Client</h3>
              <p className="text-gray-700 leading-relaxed">
                Nollywood Studies Centre
                <br />
                School of Media and Communication
                <br />
                Pan-Atlantic University
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* Unlocked Features */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">
                Your Features ({unlockedFeatures.length}/{FEATURES.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FEATURES.map((feature, index) => {
                  const isUnlocked = feature.threshold <= budget
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isUnlocked ? "bg-white border-blue-200 shadow-sm" : "bg-gray-50 border-gray-200 opacity-50"
                      }`}
                    >
                      <div className="flex items-start">
                        <span className={`text-2xl mr-3 ${isUnlocked ? "text-blue-600" : "text-gray-400"}`}>
                          {isUnlocked ? "✓" : "🔒"}
                        </span>
                        <div className="flex-grow">
                          <h3
                            className={`font-semibold text-sm sm:text-base mb-1 ${isUnlocked ? "text-gray-900" : "text-gray-500"}`}
                          >
                            {feature.text}
                          </h3>
                          <p className={`text-xs sm:text-sm ${isUnlocked ? "text-gray-600" : "text-gray-400"}`}>
                            {feature.description}
                          </p>
                          {!isUnlocked && (
                            <p className="text-xs text-blue-600 mt-1 font-medium">
                              Unlocks at {formatCurrency(feature.threshold)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">
                Cost Breakdown
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-blue-800">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white">Item</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white hidden md:table-cell">
                        Description
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-white">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {BREAKDOWN.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">{item.item}</td>
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                          {item.description}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-900 font-semibold text-right">
                          {formatCurrency(item.getAmount(budget))}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-blue-800 text-white">
                      <td colSpan={2} className="px-4 sm:px-6 py-3 text-sm sm:text-lg font-bold">
                        TOTAL INVESTMENT
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-sm sm:text-lg font-bold text-right">
                        {formatCurrency(totalBreakdown)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">
                Technology Stack
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[
                  { title: "Frontend", desc: "React.js, Next.js, Tailwind CSS" },
                  { title: "Backend", desc: "Node.js, Express, MongoDB" },
                  { title: "Search", desc: budget >= 8000000 ? "Elasticsearch" : "MongoDB Basic Search" },
                  { title: "Hosting", desc: "Vercel + MongoDB Atlas" },
                  { title: "Authentication", desc: budget >= 5500000 ? "NextAuth.js with OAuth" : "Basic Auth" },
                  { title: "Storage", desc: "Cloudinary for media assets" },
                ].map((tech, index) => (
                  <div key={index} className="bg-gray-50 p-4 border-l-4 border-blue-600 rounded-md">
                    <strong className="block text-blue-800 font-semibold mb-1 text-sm sm:text-base">
                      {tech.title}
                    </strong>
                    <span className="text-gray-600 text-xs sm:text-sm">{tech.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Timeline */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">
                Project Timeline - January 2026 ({duration} Weeks)
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row border-l-4 border-blue-800 bg-gray-50 p-4 rounded-r-lg shadow-sm">
                  <div className="flex-shrink-0 sm:w-24 font-bold text-blue-800 mb-2 sm:mb-0 text-sm sm:text-base">
                    Week 1
                  </div>
                  <div className="text-gray-700 flex-grow text-sm sm:text-base">
                    Requirements gathering, design mockups, database architecture, PAU brand integration
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row border-l-4 border-blue-800 bg-gray-50 p-4 rounded-r-lg shadow-sm">
                  <div className="flex-shrink-0 sm:w-24 font-bold text-blue-800 mb-2 sm:mb-0 text-sm sm:text-base">
                    Week 2
                  </div>
                  <div className="text-gray-700 flex-grow text-sm sm:text-base">
                    Frontend development: UI components, public pages, catalog interface, responsive design
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row border-l-4 border-blue-800 bg-gray-50 p-4 rounded-r-lg shadow-sm">
                  <div className="flex-shrink-0 sm:w-24 font-bold text-blue-800 mb-2 sm:mb-0 text-sm sm:text-base">
                    Week 3
                  </div>
                  <div className="text-gray-700 flex-grow text-sm sm:text-base">
                    Backend development: API, database, authentication, admin dashboard, search integration
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row border-l-4 border-blue-800 bg-gray-50 p-4 rounded-r-lg shadow-sm">
                  <div className="flex-shrink-0 sm:w-24 font-bold text-blue-800 mb-2 sm:mb-0 text-sm sm:text-base">
                    Week 4
                  </div>
                  <div className="text-gray-700 flex-grow text-sm sm:text-base">
                    Testing, content migration, staff training, deployment, final review
                  </div>
                </div>
                {duration > 4 && (
                  <div className="flex flex-col sm:flex-row border-l-4 border-blue-800 bg-gray-50 p-4 rounded-r-lg shadow-sm">
                    <div className="flex-shrink-0 sm:w-24 font-bold text-blue-800 mb-2 sm:mb-0 text-sm sm:text-base">
                      Weeks 5-{duration}
                    </div>
                    <div className="text-gray-700 flex-grow text-sm sm:text-base">
                      Additional features implementation, extended testing, advanced integrations
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Why VisualHQ? */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">
                Why VisualHQ?
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm sm:text-base">
                <li>Specialized experience in educational and cultural institution web platforms</li>
                <li>Proven track record delivering projects on time and within budget</li>
                <li>Local team with understanding of Nigerian academic landscape</li>
                <li>Modern technology stack ensuring scalability and performance</li>
                <li>Comprehensive training and ongoing support included</li>
                <li>Flexible pricing to match your budget constraints</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-blue-800 text-white p-6 sm:p-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">Ready to Get Started?</h3>
            <p className="opacity-90 mb-6 text-sm sm:text-base">Adjust the slider to find your perfect package</p>
            <button
              onClick={handlePrint}
              className="bg-white text-blue-800 font-semibold py-3 px-8 rounded-lg shadow-xl hover:bg-gray-100 transition"
            >
              Download Proposal
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
                input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #1e40af;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    background: #1e3a8a;
                }
                input[type="range"]::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #1e40af;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>
    </>
  )
}
