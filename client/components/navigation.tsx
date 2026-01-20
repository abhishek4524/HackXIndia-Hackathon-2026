"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X, Globe, ChevronDown, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  // Use auth context for auth state and user info
  const { logout, isAuthenticated, user } = useAuth()
  const router = useRouter()

  const languageOptions = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  ]

  const currentLanguage = languageOptions.find((lang) => lang.code === language)

  const closeMobileMenu = () => setIsMenuOpen(false)

  const handleLanguageChange = (code: string) => {
    setLanguage(code as any)
    // Next.js App Router: refresh the page to update all components
    router.refresh()
  }

  const handleLogout = () => {
    // AuthProvider.logout() clears token and user from storage and updates context
    logout()
    closeMobileMenu()
  }

  // No localStorage polling here — rely on AuthContext which already listens to storage

  return (
    <ClerkProvider>
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Krishi Sakhi 🌾</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <SignedOut>
            <Link href="/" className="text-foreground hover:text-primary font-medium">
              {t("nav.home")}
            </Link>
            </SignedOut>
            <SignedIn>
            <Link href="/dashboard" className="text-foreground hover:text-primary font-medium">
              {t("nav.dashboard")}
            </Link>
            </SignedIn>
            <Link href="/krishi-sakhi-chat" className="text-muted-foreground hover:text-primary">
              {t("nav.chat")}
            </Link>
            <Link href="/crop-health" className="text-muted-foreground hover:text-primary">
              {t("nav.cropHealth")}
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                {t("nav.dashboard")}
              </Link>
            ) : null}
            <Link href="/knowledge" className="text-muted-foreground hover:text-primary">
              {t("nav.knowledge")}
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-primary">
              {t("nav.about")}
            </Link>
                        <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>
                    {currentLanguage?.flag} {currentLanguage?.name}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={language === lang.code ? "bg-accent" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Link href="/profile" className="p-1" onClick={closeMobileMenu}>
                <div className="relative h-8 w-8 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                  <div className="h-6 w-6 bg-amber-500 rounded-full"></div>
                  <div className="absolute -top-1 -left-1 h-3 w-3 bg-green-500 rounded-full"></div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
              </Link>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={language === lang.code ? "bg-accent" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link href="/" onClick={closeMobileMenu} className="text-foreground hover:text-primary font-medium px-2 py-1">
                {t("nav.home")}
              </Link>
              <Link href="/crop-health" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary px-2 py-1">
                {t("nav.cropHealth")}
              </Link>
              <Link href="/krishi-sakhi-chat" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary px-2 py-1">
                {t("nav.chat")}
              </Link>
              <Link href="/dashboard" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary px-2 py-1">
                {t("nav.dashboard")}
              </Link>
              <Link href="/knowledge" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary px-2 py-1">
                {t("nav.knowledge")}
              </Link>
              <Link href="/about" onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary px-2 py-1">
                {t("nav.about")}
              </Link>
                          <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
              
            </div>
          </div>
        )}
      </div>
    </nav>
        </ClerkProvider>
  )
}
// ...existing code...