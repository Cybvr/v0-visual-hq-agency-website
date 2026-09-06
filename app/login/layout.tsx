"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/components/auth-provider"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
