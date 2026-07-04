import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { EB_Garamond, Geist_Mono, Inter, Outfit } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-eb-garamond" })

const FIREBASE_FAVICON_URL =
  "https://firebasestorage.googleapis.com/v0/b/jujuagi-new.firebasestorage.app/o/favicon.ico?alt=media&token=e0666b35-06cb-41a4-8d0d-9b37740baa7a"

export const metadata: Metadata = {
  title: "VisualCoreNine - Software Systems for Modern Businesses",
  description:
    "VisualCoreNine builds software systems, product businesses, and AI-enabled tools from Lagos for modern teams.",
  keywords: ["software development", "AI", "VisualHQ", "VisualCoreNine", "Lagos", "Nigeria", "product company"],
  generator: "v0.app",
  // --- FAVICON USING EXTERNAL URL ---
  icons: {
    icon: FIREBASE_FAVICON_URL,
  },
  // ----------------------------------
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${outfit.variable} ${ebGaramond.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
