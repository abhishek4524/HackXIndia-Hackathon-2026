"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Search, Calendar, Lightbulb, Shield, BookOpen, Sprout, Bug } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function KnowledgePage() {
  const { t } = useLanguage()

  // Crop calendars data
  const cropCalendars = [
    {
      crop: t("knowledge.cropCalendars.rice.crop"),
      season: t("knowledge.cropCalendars.rice.season"),
      sowing: t("knowledge.cropCalendars.rice.sowing"),
      harvest: t("knowledge.cropCalendars.rice.harvest"),
      description: t("knowledge.cropCalendars.rice.description"),
    },
    {
      crop: t("knowledge.cropCalendars.coconut.crop"),
      season: t("knowledge.cropCalendars.coconut.season"),
      sowing: t("knowledge.cropCalendars.coconut.sowing"),
      harvest: t("knowledge.cropCalendars.coconut.harvest"),
      description: t("knowledge.cropCalendars.coconut.description"),
    },
    {
      crop: t("knowledge.cropCalendars.rubber.crop"),
      season: t("knowledge.cropCalendars.rubber.season"),
      sowing: t("knowledge.cropCalendars.rubber.sowing"),
      harvest: t("knowledge.cropCalendars.rubber.harvest"),
      description: t("knowledge.cropCalendars.rubber.description"),
    },
  ]

  // Best practices data
  const bestPractices = [
    {
      title: t("knowledge.bestPractices.organicFarming.title"),
      description: t("knowledge.bestPractices.organicFarming.description"),
      category: t("knowledge.bestPractices.organicFarming.category"),
    },
    {
      title: t("knowledge.bestPractices.waterConservation.title"),
      description: t("knowledge.bestPractices.waterConservation.description"),
      category: t("knowledge.bestPractices.waterConservation.category"),
    },
    {
      title: t("knowledge.bestPractices.soilHealth.title"),
      description: t("knowledge.bestPractices.soilHealth.description"),
      category: t("knowledge.bestPractices.soilHealth.category"),
    },
  ]

  // Pest management data
  const pestManagement = [
    {
      pest: t("knowledge.pestManagement.brownPlantHopper.pest"),
      crops: t("knowledge.pestManagement.brownPlantHopper.crops"),
      symptoms: t("knowledge.pestManagement.brownPlantHopper.symptoms"),
      treatment: t("knowledge.pestManagement.brownPlantHopper.treatment"),
    },
    {
      pest: t("knowledge.pestManagement.coconutMite.pest"),
      crops: t("knowledge.pestManagement.coconutMite.crops"),
      symptoms: t("knowledge.pestManagement.coconutMite.symptoms"),
      treatment: t("knowledge.pestManagement.coconutMite.treatment"),
    },
    {
      pest: t("knowledge.pestManagement.leafBlight.pest"),
      crops: t("knowledge.pestManagement.leafBlight.crops"),
      symptoms: t("knowledge.pestManagement.leafBlight.symptoms"),
      treatment: t("knowledge.pestManagement.leafBlight.treatment"),
    },
  ]

  return (
    <LayoutWrapper>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("knowledge.title")}</h1>
            <p className="text-lg text-muted-foreground mb-8">{t("knowledge.subtitle")}</p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input type="text" placeholder={t("knowledge.searchPlaceholder")} className="h-12 text-base pl-12 pr-4" />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Button className="h-12 px-6">
                  <Search className="h-4 w-4 mr-2" />
                  {t("knowledge.searchButton")}
                </Button>
              </div>
            </div>
          </div>

          {/* Crop Calendars */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-primary" />
              {t("knowledge.sections.calendars")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cropCalendars.map((calendar, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Sprout className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{calendar.crop}</CardTitle>
                        <CardDescription>{calendar.season}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{t("knowledge.sowing")}:</span>
                        <span>{calendar.sowing}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{t("knowledge.harvest")}:</span>
                        <span>{calendar.harvest}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">{calendar.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-primary" />
              {t("knowledge.sections.practices")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bestPractices.map((practice, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{practice.title}</CardTitle>
                        <CardDescription>{practice.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{practice.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pest Management */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              {t("knowledge.sections.pest")}
            </h2>
            <div className="space-y-4">
              {pestManagement.map((pest, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Bug className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{pest.pest}</h3>
                          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{pest.crops}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-1">{t("knowledge.symptoms")}:</h4>
                            <p className="text-sm text-muted-foreground">{pest.symptoms}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">{t("knowledge.treatment")}:</h4>
                            <p className="text-sm text-muted-foreground">{pest.treatment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}