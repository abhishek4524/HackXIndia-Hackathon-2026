"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Calendar, 
  Lightbulb, 
  Shield, 
  BookOpen, 
  Bug, 
  ChevronRight,
  Star,
  TrendingUp,
  Droplets,
  CloudRain,
  Thermometer
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CropCalendar {
  crop: string;
  season: string;
  sowing: string;
  harvest: string;
  description: string;
  category: string;
  difficulty: string;
  waterRequirement: string;
  temperature: string;
  popularity: number;
  icon: string;
}

interface BestPractice {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeRequired: string;
  benefits: string[];
  rating: number;
}

interface Pest {
  pest: string;
  crops: string;
  symptoms: string;
  treatment: string;
  severity: string;
  season: string;
  organicSolutions: string[];
  urgency: string;
}

interface WeatherTip {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function KnowledgePage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredData, setFilteredData] = useState({
    calendars: [] as CropCalendar[],
    practices: [] as BestPractice[],
    pests: [] as Pest[]
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  // Crop calendars data
  const cropCalendars: CropCalendar[] = [
    {
      crop: t("knowledge.cropCalendars.rice.crop"),
      season: t("knowledge.cropCalendars.rice.season"),
      sowing: t("knowledge.cropCalendars.rice.sowing"),
      harvest: t("knowledge.cropCalendars.rice.harvest"),
      description: t("knowledge.cropCalendars.rice.description"),
      category: "grains",
      difficulty: "Medium",
      waterRequirement: "High",
      temperature: "24-30°C",
      popularity: 95,
      icon: "🌾"
    },
    {
      crop: t("knowledge.cropCalendars.coconut.crop"),
      season: t("knowledge.cropCalendars.coconut.season"),
      sowing: t("knowledge.cropCalendars.coconut.sowing"),
      harvest: t("knowledge.cropCalendars.coconut.harvest"),
      description: t("knowledge.cropCalendars.coconut.description"),
      category: "trees",
      difficulty: "Easy",
      waterRequirement: "Medium",
      temperature: "27-32°C",
      popularity: 88,
      icon: "🥥"
    },
    {
      crop: t("knowledge.cropCalendars.rubber.crop"),
      season: t("knowledge.cropCalendars.rubber.season"),
      sowing: t("knowledge.cropCalendars.rubber.sowing"),
      harvest: t("knowledge.cropCalendars.rubber.harvest"),
      description: t("knowledge.cropCalendars.rubber.description"),
      category: "trees",
      difficulty: "Medium",
      waterRequirement: "Medium",
      temperature: "24-28°C",
      popularity: 76,
      icon: "🌳"
    },
  ]

  // Best practices data
  const bestPractices: BestPractice[] = [
    {
      title: t("knowledge.bestPractices.organicFarming.title"),
      description: t("knowledge.bestPractices.organicFarming.description"),
      category: t("knowledge.bestPractices.organicFarming.category"),
      difficulty: "Beginner",
      timeRequired: "3-6 months",
      benefits: ["Soil Health", "Cost Saving", "Sustainability"],
      rating: 4.8
    },
    {
      title: t("knowledge.bestPractices.waterConservation.title"),
      description: t("knowledge.bestPractices.waterConservation.description"),
      category: t("knowledge.bestPractices.waterConservation.category"),
      difficulty: "Intermediate",
      timeRequired: "1-2 months",
      benefits: ["Water Saving", "Increased Yield", "Eco-friendly"],
      rating: 4.5
    },
    {
      title: t("knowledge.bestPractices.soilHealth.title"),
      description: t("knowledge.bestPractices.soilHealth.description"),
      category: t("knowledge.bestPractices.soilHealth.category"),
      difficulty: "Beginner",
      timeRequired: "2-4 months",
      benefits: ["Better Growth", "Disease Prevention", "Long-term"],
      rating: 4.7
    },
  ]

  // Pest management data
  const pestManagement: Pest[] = [
    {
      pest: t("knowledge.pestManagement.brownPlantHopper.pest"),
      crops: t("knowledge.pestManagement.brownPlantHopper.crops"),
      symptoms: t("knowledge.pestManagement.brownPlantHopper.symptoms"),
      treatment: t("knowledge.pestManagement.brownPlantHopper.treatment"),
      severity: "High",
      season: "Rainy",
      organicSolutions: ["Neem oil", "Garlic spray", "Beneficial insects"],
      urgency: "immediate"
    },
    {
      pest: t("knowledge.pestManagement.coconutMite.pest"),
      crops: t("knowledge.pestManagement.coconutMite.crops"),
      symptoms: t("knowledge.pestManagement.coconutMite.symptoms"),
      treatment: t("knowledge.pestManagement.coconutMite.treatment"),
      severity: "Medium",
      season: "Summer",
      organicSolutions: ["Sulfur spray", "Pruning", "Proper drainage"],
      urgency: "moderate"
    },
    {
      pest: t("knowledge.pestManagement.leafBlight.pest"),
      crops: t("knowledge.pestManagement.leafBlight.crops"),
      symptoms: t("knowledge.pestManagement.leafBlight.symptoms"),
      treatment: t("knowledge.pestManagement.leafBlight.treatment"),
      severity: "Low",
      season: "Winter",
      organicSolutions: ["Copper fungicide", "Crop rotation", "Resistant varieties"],
      urgency: "low"
    },
  ]

  // Weather tips data
  const weatherTips: WeatherTip[] = [
    {
      title: "Rainy Season Tips",
      description: "Manage drainage and prevent waterlogging in fields",
      icon: CloudRain,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Temperature Control",
      description: "Use shade nets during extreme heat periods",
      icon: Thermometer,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Water Management",
      description: "Implement drip irrigation for optimal water use",
      icon: Droplets,
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      title: "Seasonal Planning",
      description: "Plan crop cycles based on weather patterns",
      icon: TrendingUp,
      color: "bg-green-100 text-green-600"
    },
  ]

  // Search and filter function
  useEffect(() => {
    const filtered = {
      calendars: cropCalendars.filter(item =>
        item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      practices: bestPractices.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      pests: pestManagement.filter(item =>
        item.pest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.crops.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredData(filtered)
  }, [searchQuery, cropCalendars, bestPractices, pestManagement])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-700 border-red-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header with search */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                {t("knowledge.title")}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t("knowledge.subtitle")}
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <motion.div 
              variants={itemVariants}
              className="max-w-3xl mx-auto"
            >
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder={t("knowledge.searchPlaceholder")} 
                  className="h-14 text-base pl-14 pr-32 rounded-2xl border-2 transition-all duration-300 focus:border-primary shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Button className="h-10 px-6 rounded-xl gap-2">
                    <Search className="h-4 w-4" />
                    {t("knowledge.searchButton")}
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setSearchQuery("rice")}
                >
                  Rice Farming
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setSearchQuery("organic")}
                >
                  Organic Tips
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setSearchQuery("pest")}
                >
                  Pest Control
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setSearchQuery("water")}
                >
                  Water Management
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Weather Tips */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-primary" />
              Weather Smart Tips
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {weatherTips.map((tip, index) => {
                const Icon = tip.icon
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2">
                      <CardContent className="p-5 flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${tip.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Tabs for different sections */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex rounded-2xl p-1 bg-muted/50">
                <TabsTrigger 
                  value="all" 
                  className="rounded-xl data-[state=active]:shadow-sm"
                  onClick={() => setActiveTab("all")}
                >
                  All Resources
                </TabsTrigger>
                <TabsTrigger 
                  value="calendars" 
                  className="rounded-xl data-[state=active]:shadow-sm"
                  onClick={() => setActiveTab("calendars")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendars
                </TabsTrigger>
                <TabsTrigger 
                  value="practices" 
                  className="rounded-xl data-[state=active]:shadow-sm"
                  onClick={() => setActiveTab("practices")}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Practices
                </TabsTrigger>
                <TabsTrigger 
                  value="pests" 
                  className="rounded-xl data-[state=active]:shadow-sm"
                  onClick={() => setActiveTab("pests")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Pest Control
                </TabsTrigger>
              </TabsList>

              {/* All Content */}
              <TabsContent value="all" className="space-y-8">
                {/* Crop Calendars */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-primary" />
                    Crop Calendars
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {filteredData.calendars.map((calendar, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 overflow-hidden group">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                                  <span className="text-2xl">{calendar.icon}</span>
                                </div>
                                <div>
                                  <CardTitle className="text-xl">{calendar.crop}</CardTitle>
                                  <CardDescription>{calendar.season}</CardDescription>
                                </div>
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                {calendar.popularity}% Popular
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="font-medium">Sowing:</span>
                                    <span className="font-semibold text-primary">{calendar.sowing}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">Harvest:</span>
                                    <span className="font-semibold text-primary">{calendar.harvest}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="font-medium">Water:</span>
                                    <span>{calendar.waterRequirement}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">Temp:</span>
                                    <span>{calendar.temperature}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{calendar.description}</p>
                              <div className="pt-3 border-t">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="rounded-full">
                                    Difficulty: {calendar.difficulty}
                                  </Badge>
                                  <Button variant="ghost" size="sm" className="gap-1">
                                    Learn More
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Best Practices */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                    <Lightbulb className="h-6 w-6 mr-2 text-primary" />
                    Best Practices
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {filteredData.practices.map((practice, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 overflow-hidden group">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                                  <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl">{practice.title}</CardTitle>
                                  <CardDescription>{practice.category}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg">
                                <Star className="h-3 w-3 fill-current mr-1" />
                                <span className="text-sm font-semibold">{practice.rating}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">{practice.description}</p>
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  {practice.benefits.map((benefit, idx) => (
                                    <Badge key={idx} variant="secondary" className="rounded-full">
                                      {benefit}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t">
                                  <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Time Required</div>
                                    <div className="font-semibold">{practice.timeRequired}</div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Difficulty</div>
                                    <Badge variant="outline" className={cn(
                                      "rounded-full",
                                      practice.difficulty === "Beginner" && "bg-green-50 text-green-700",
                                      practice.difficulty === "Intermediate" && "bg-yellow-50 text-yellow-700"
                                    )}>
                                      {practice.difficulty}
                                    </Badge>
                                  </div>
                                  <Button variant="ghost" size="sm" className="gap-1">
                                    View Guide
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Pest Management */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                    <Shield className="h-6 w-6 mr-2 text-primary" />
                    Pest Control
                  </h2>
                  <div className="space-y-6">
                    {filteredData.pests.map((pest, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="hover:shadow-xl transition-all duration-300 border-2 overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="p-3 bg-primary/10 rounded-xl">
                                <Bug className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                  <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-xl">{pest.pest}</h3>
                                    <Badge className={cn("rounded-full", getUrgencyColor(pest.urgency))}>
                                      {pest.severity} Priority
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="rounded-full">
                                      {pest.season}
                                    </Badge>
                                    <Badge variant="secondary" className="rounded-full">
                                      {pest.crops}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center">
                                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                      Symptoms
                                    </h4>
                                    <p className="text-sm text-muted-foreground bg-red-50 p-3 rounded-lg">
                                      {pest.symptoms}
                                    </p>
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center">
                                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                      Treatment
                                    </h4>
                                    <p className="text-sm text-muted-foreground bg-green-50 p-3 rounded-lg">
                                      {pest.treatment}
                                    </p>
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center">
                                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                      Organic Solutions
                                    </h4>
                                    <div className="space-y-2">
                                      {pest.organicSolutions.map((solution, idx) => (
                                        <div key={idx} className="text-sm text-muted-foreground bg-blue-50 p-2 rounded-lg">
                                          • {solution}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Individual Tab Contents */}
              <TabsContent value="calendars">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {filteredData.calendars.map((calendar, index) => (
                    <Card key={index} className="h-full">
                      <CardHeader>
                        <CardTitle>{calendar.crop}</CardTitle>
                        <CardDescription>{calendar.season}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{calendar.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="practices">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {filteredData.practices.map((practice, index) => (
                    <Card key={index} className="h-full">
                      <CardHeader>
                        <CardTitle>{practice.title}</CardTitle>
                        <CardDescription>{practice.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{practice.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pests">
                <div className="space-y-6">
                  {filteredData.pests.map((pest, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{pest.pest}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p><strong>Crops:</strong> {pest.crops}</p>
                        <p><strong>Symptoms:</strong> {pest.symptoms}</p>
                        <p><strong>Treatment:</strong> {pest.treatment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-primary/5 to-green-500/5 rounded-2xl p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{cropCalendars.length}+</div>
                <div className="text-sm text-muted-foreground">Crop Guides</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{bestPractices.length}+</div>
                <div className="text-sm text-muted-foreground">Best Practices</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{pestManagement.length}+</div>
                <div className="text-sm text-muted-foreground">Pest Solutions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Accessible</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </LayoutWrapper>
  )
}