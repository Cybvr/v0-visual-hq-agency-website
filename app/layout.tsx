import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Inter, Geist_Mono, Fraunces, Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" })

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
    <html lang="en" className={`${inter.variable} ${geistMono.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
