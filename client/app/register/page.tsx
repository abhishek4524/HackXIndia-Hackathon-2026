"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import { User, Mail, Lock, Eye, EyeOff, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { UserData } from "@/lib/api"
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from "next/navigation"

interface FormData extends UserData {
  confirmPassword: string;
}

export default function RegisterPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  // Use Auth context to register (auto-login)
  const { register } = useAuth()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.register.passwordMismatch") || "Passwords do not match")
      return
    }
    
    if (formData.password.length < 6) {
      setError(t("auth.register.passwordLength") || "Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    
    try {
  // Prepare data for API (exclude confirmPassword)
  const { confirmPassword, ...userData } = formData
  // Use Auth context register to auto-login after successful registration
  await register(userData)

  // Redirect to dashboard after auto-login
  router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LayoutWrapper showFooter={false}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("auth.register.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("auth.register.subtitle")}</p>
          </div>

          <Card className="p-8">
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">
                    {t("auth.register.nameLabel")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("auth.register.namePlaceholder")}
                      className="h-12 text-base pl-12"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    {t("auth.register.emailLabel")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("auth.register.emailPlaceholder")}
                      className="h-12 text-base pl-12"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium">
                    {t("auth.register.phoneLabel")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t("auth.register.phonePlaceholder")}
                      className="h-12 text-base pl-12"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium">
                    {t("auth.register.passwordLabel")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.register.passwordPlaceholder")}
                      className="h-12 text-base pl-12 pr-12"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-base font-medium">
                    {t("auth.register.confirmPasswordLabel")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("auth.register.confirmPasswordPlaceholder")}
                      className="h-12 text-base pl-12 pr-12"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="cursor-pointer w-full h-12 text-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.register.processing") || "Processing..."}
                    </>
                  ) : (
                    t("auth.register.signUpButton")
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-muted-foreground">
                  {t("auth.register.haveAccount")}{" "}
                  <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                    {t("auth.register.signInLink")}
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">{t("auth.register.terms")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}