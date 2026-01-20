"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ml" | "hi"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, any> = {
  en: {},
  ml: {},
  hi: {},
}

// Load translations dynamically
const loadTranslations = async () => {
  try {
    const [enTranslations, mlTranslations, hiTranslations] = await Promise.all([
      import("../locales/en/common.json"),
      import("../locales/ml/common.json"),
      import("../locales/hi/common.json"),
    ])

    translations.en = enTranslations.default
    translations.ml = mlTranslations.default
    translations.hi = hiTranslations.default
  } catch (error) {
    console.error("Failed to load translations:", error)
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en") // Default to English
  const [translationsLoaded, setTranslationsLoaded] = useState(false)

  useEffect(() => {
    // Load translations on mount
    loadTranslations().then(() => {
      setTranslationsLoaded(true)
    })

    // Load saved language preference
    const savedLanguage = localStorage.getItem("krishi-sakhi-language") as Language
    if (savedLanguage && ["en", "ml", "hi"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("krishi-sakhi-language", lang)
  }

  const t = (key: string): string => {
    if (!translationsLoaded) return key

    const keys = key.split(".")
    let value = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found in current language
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if not found in any language
          }
        }
        break
      }
    }

    return typeof value === "string" ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
