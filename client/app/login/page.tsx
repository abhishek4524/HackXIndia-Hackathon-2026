"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import { Mail, Lock, Eye, EyeOff, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { LoginData } from "@/lib/api"
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: ""
  })

  // Use authentication context
  const { login } = useAuth()
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

  // Validation
  if (loginMethod === "email" && !formData.email) {
    setError(t("auth.login.emailRequired") || "Email is required")
    return
  }

  if (loginMethod === "phone" && !formData.phone) {
    setError(t("auth.login.phoneRequired") || "Phone number is required")
    return
  }

  if (!formData.password) {
    setError(t("auth.login.passwordRequired") || "Password is required")
    return
  }

  setIsLoading(true)

  try {
    // Prepare login data based on selected method
    const loginData: LoginData = {
      password: formData.password,
    }

    if (loginMethod === "email") {
      loginData.email = formData.email
    } else {
      loginData.phone = formData.phone
    }

    // Try API login
    await login(loginData)

    // Redirect to dashboard
    router.push("/dashboard")
  } catch (err) {
    console.error("Login failed, checking fallback...")

    // ✅ Fallback credentials (for demo or offline mode)
    const fallbackEmail = "abhishek21@gmail.com"
    const fallbackPassword = "12345678"

    if (
      formData.email === fallbackEmail &&
      formData.password === fallbackPassword
    ) {
      // Simulate a successful login
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Demo User", email: fallbackEmail })
      )
      localStorage.setItem("token", "demo-token-123")
      router.push("/dashboard")
      return
    }

    setError(
      err instanceof Error
        ? err.message
        : "An error occurred. Please try again."
    )
  } finally {
    setIsLoading(false)
  }
}


  return (
    <LayoutWrapper showFooter={false}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("auth.login.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("auth.login.subtitle")}</p>
          </div>

          <Card className="p-8">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={loginMethod === "email" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setLoginMethod("email")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {t("auth.login.emailTab")}
                </Button>
                <Button
                  variant={loginMethod === "phone" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setLoginMethod("phone")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t("auth.login.phoneTab")}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={loginMethod} className="text-base font-medium">
                    {loginMethod === "email" ? t("auth.login.emailLabel") : t("auth.login.phoneLabel")}
                  </Label>
                  <div className="relative">
                    <Input
                      id={loginMethod}
                      type={loginMethod === "email" ? "email" : "tel"}
                      placeholder={
                        loginMethod === "email" 
                          ? t("auth.login.emailPlaceholder") 
                          : t("auth.login.phonePlaceholder")
                      }
                      className="h-12 text-base pl-12"
                      value={loginMethod === "email" ? formData.email : formData.phone}
                      onChange={handleChange}
                      required
                    />
                    {loginMethod === "email" ? (
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium">
                    {t("auth.login.passwordLabel")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.login.passwordPlaceholder")}
                      className="h-12 text-base pl-12 pr-12"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
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

                <div className="flex items-center justify-between">
                  <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80">
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.login.signingIn") || "Signing in..."}
                    </>
                  ) : (
                    t("auth.login.signInButton")
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-muted-foreground">
                  {t("auth.login.noAccount")}{" "}
                  <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                    {t("auth.login.signUpLink")}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}