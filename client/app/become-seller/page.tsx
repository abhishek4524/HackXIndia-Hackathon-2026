"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import React, { useState, ChangeEvent, FormEvent } from "react"
import { ArrowLeft, CheckCircle, Store, UserCheck, Shield, CreditCard, FileText, Phone, Mail, Sparkles } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  fullName: string
  phone: string
  email: string
  farmLocation: string
  farmSize: string
  mainProducts: string[]
  experience: string
  description: string
  certification: string
  bankAccount: string
  ifscCode: string
}

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
}

interface Step {
  number: number
  title: string
}

export default function BecomeSellerPage() {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    farmLocation: "",
    farmSize: "",
    mainProducts: [],
    experience: "",
    description: "",
    certification: "none",
    bankAccount: "",
    ifscCode: "",
  })

  const benefits: Benefit[] = [
    {
      icon: <Store className="h-6 w-6" />,
      title: t("becomeSeller.benefits.directMarket.title"),
      description: t("becomeSeller.benefits.directMarket.description")
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: t("becomeSeller.benefits.betterPrices.title"),
      description: t("becomeSeller.benefits.betterPrices.description")
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t("becomeSeller.benefits.securePayments.title"),
      description: t("becomeSeller.benefits.securePayments.description")
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: t("becomeSeller.benefits.financialServices.title"),
      description: t("becomeSeller.benefits.financialServices.description")
    },
  ]

  const steps: Step[] = [
    { number: 1, title: t("becomeSeller.steps.personalInfo.title") },
    { number: 2, title: t("becomeSeller.steps.farmDetails.title") },
    { number: 3, title: t("becomeSeller.steps.bankInfo.title") },
    { number: 4, title: t("becomeSeller.steps.verification.title") },
  ]

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit the form (would connect to your backend in a real application)
      console.log("Form submitted:", formData)
      alert("Application submitted successfully!")
    }
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.backToDashboard")}
              </Button>
            </Link>
          </div>

          {/* Page title and description */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Sparkles className="h-8 w-8 mr-3 text-primary" />
              {t("becomeSeller.title")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("becomeSeller.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits sidebar - hidden on small screens */}
            <div className="lg:col-span-1 hidden lg:block">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t("becomeSeller.whyJoin")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full mt-1">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main form content */}
            <div className="lg:col-span-2">
              {/* Progress steps */}
              <div className="mb-8">
                <div className="flex justify-between relative mb-4">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0"></div>
                  {steps.map((step, index) => (
                    <div key={index} className={`relative z-10 flex flex-col items-center ${index < steps.length - 1 ? 'w-1/4' : ''}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {currentStep > step.number ? <CheckCircle className="h-5 w-5" /> : step.number}
                      </div>
                      <p className={`text-xs mt-2 text-center ${currentStep >= step.number ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form content */}
              <Card>
                <CardHeader>
                  <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                  <CardDescription>
                    {t(`becomeSeller.steps.step${currentStep}.description` as any)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">{t("becomeSeller.form.fullName.label")}</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder={t("becomeSeller.form.fullName.placeholder")}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">{t("becomeSeller.form.phone.label")}</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder={t("becomeSeller.form.phone.placeholder")}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("becomeSeller.form.email.label")}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t("becomeSeller.form.email.placeholder")}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Farm Details */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="farmLocation">{t("becomeSeller.form.farmLocation.label")}</Label>
                            <Input
                              id="farmLocation"
                              name="farmLocation"
                              value={formData.farmLocation}
                              onChange={handleInputChange}
                              placeholder={t("becomeSeller.form.farmLocation.placeholder")}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="farmSize">{t("becomeSeller.form.farmSize.label")}</Label>
                            <Input
                              id="farmSize"
                              name="farmSize"
                              value={formData.farmSize}
                              onChange={handleInputChange}
                              placeholder={t("becomeSeller.form.farmSize.placeholder")}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mainProducts">{t("becomeSeller.form.mainProducts.label")}</Label>
                          <Select
                            value={formData.mainProducts[0] || ""}
                            onValueChange={(value) => handleSelectChange("mainProducts", [value])}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("becomeSeller.form.mainProducts.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vegetables">{t("common.products.vegetables")}</SelectItem>
                              <SelectItem value="fruits">{t("common.products.fruits")}</SelectItem>
                              <SelectItem value="grains">{t("common.products.grains")}</SelectItem>
                              <SelectItem value="spices">{t("common.products.spices")}</SelectItem>
                              <SelectItem value="dairy">{t("common.products.dairy")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">{t("becomeSeller.form.experience.label")}</Label>
                          <Select
                            value={formData.experience}
                            onValueChange={(value) => handleSelectChange("experience", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("becomeSeller.form.experience.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-2">{t("becomeSeller.form.experience.options.0-2")}</SelectItem>
                              <SelectItem value="3-5">{t("becomeSeller.form.experience.options.3-5")}</SelectItem>
                              <SelectItem value="5-10">{t("becomeSeller.form.experience.options.5-10")}</SelectItem>
                              <SelectItem value="10+">{t("becomeSeller.form.experience.options.10+")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">{t("becomeSeller.form.description.label")}</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder={t("becomeSeller.form.description.placeholder")}
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Bank Information */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankAccount">{t("becomeSeller.form.bankAccount.label")}</Label>
                          <Input
                            id="bankAccount"
                            name="bankAccount"
                            value={formData.bankAccount}
                            onChange={handleInputChange}
                            placeholder={t("becomeSeller.form.bankAccount.placeholder")}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ifscCode">{t("becomeSeller.form.ifscCode.label")}</Label>
                          <Input
                            id="ifscCode"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleInputChange}
                            placeholder={t("becomeSeller.form.ifscCode.placeholder")}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="certification">{t("becomeSeller.form.certification.label")}</Label>
                          <Select
                            value={formData.certification}
                            onValueChange={(value) => handleSelectChange("certification", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("becomeSeller.form.certification.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">{t("becomeSeller.form.certification.options.none")}</SelectItem>
                              <SelectItem value="organic">{t("becomeSeller.form.certification.options.organic")}</SelectItem>
                              <SelectItem value="goodAgricultural">{t("becomeSeller.form.certification.options.goodAgricultural")}</SelectItem>
                              <SelectItem value="other">{t("becomeSeller.form.certification.options.other")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Verification */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="bg-muted/30 p-6 rounded-lg">
                          <h3 className="font-semibold mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            {t("becomeSeller.verification.termsTitle")}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {t("becomeSeller.verification.termsDescription")}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                              <span>{t("becomeSeller.verification.term1")}</span>
                            </div>
                            <div className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                              <span>{t("becomeSeller.verification.term2")}</span>
                            </div>
                            <div className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                              <span>{t("becomeSeller.verification.term3")}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-primary/5 p-6 rounded-lg">
                          <h3 className="font-semibold mb-4 flex items-center">
                            <Phone className="h-5 w-5 mr-2" />
                            {t("becomeSeller.verification.contactTitle")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("becomeSeller.verification.contactDescription")}
                          </p>
                          <div className="mt-4 flex items-center space-x-4">
                            <Button variant="outline" className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {t("common.callUs")}
                            </Button>
                            <Button variant="outline" className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {t("common.emailUs")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Form navigation buttons */}
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        disabled={currentStep === 1}
                      >
                        {t("common.previous")}
                      </Button>
                      
                      <Button type="submit">
                        {currentStep === 4 ? t("becomeSeller.form.submit") : t("common.next")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Mobile benefits - shown only on small screens */}
              <Card className="mt-8 lg:hidden">
                <CardHeader>
                  <CardTitle>{t("becomeSeller.whyJoin")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full mt-1">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}