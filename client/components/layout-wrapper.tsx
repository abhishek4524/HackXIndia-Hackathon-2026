"use client"

import type React from "react"
import { Navigation } from "./navigation"
import { Footer } from "./footer"
import { useLanguage } from "@/contexts/language-context"

interface LayoutWrapperProps {
  children: React.ReactNode
  showFooter?: boolean
}

export function LayoutWrapper({ children, showFooter = true }: LayoutWrapperProps) {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />
      <main>{children}</main>
      {showFooter && <Footer language={language} />}
    </div>
  )
}
