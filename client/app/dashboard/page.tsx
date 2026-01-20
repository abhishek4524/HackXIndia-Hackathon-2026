"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import React, { useEffect, useState, useMemo } from "react"
import { 
  Mic, 
  Calendar,
  MapPin,
  RefreshCw,
  Thermometer,
  Droplet,
  Wind,
  CloudSun,
  ChevronRight,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Leaf,
  Sprout,
  Shield,
  Sunrise,
  Sunset,
  Cloud,
  CloudRain,
  Sun,
  Eye,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  Droplets,
  ThermometerSun,
  CloudSnow,
  CloudFog,
  Zap
} from "lucide-react"
import MarketPriceWidget from "@/components/ui/MarketPriceWidget"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Weather types
interface WeatherData {
  temperature: number
  feelsLike: number
  condition: string
  humidity: number
  rainfall: number
  windSpeed: number
  windDirection: string
  pressure: number
  visibility: number
  sunrise: string
  sunset: string
  uvIndex: number
  aqi: number
  aqiLevel: string
  icon: string
  location: string
  lastUpdated: Date
}

interface ForecastDay {
  day: string
  date: string
  condition: string
  maxTemp: number
  minTemp: number
  icon: string
  rainChance: number
}

interface FarmingTip {
  id: number
  icon: any
  title: string
  description: string
  urgency: 'high' | 'medium' | 'low'
  color: string
  bgColor: string
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user, isLoaded } = useUser()
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Memoized user name
  const userName = useMemo(() => {
    if (!isLoaded) return "Farmer"
    return user?.fullName || user?.firstName || "Farmer"
  }, [user, isLoaded])

  // Function to get time-based greeting
  const getTimeBasedGreeting = useMemo(() => {
    const hour = currentTime.getHours()
    
    if (hour >= 5 && hour < 12) {
      return t("dashboard.greetingMorning", `Good Morning, ${userName}`)
    } else if (hour >= 12 && hour < 17) {
      return t("dashboard.greetingAfternoon", `Good Afternoon, ${userName}`)
    } else if (hour >= 17 && hour < 21) {
      return t("dashboard.greetingEvening", `Good Evening, ${userName}`)
    } else {
      return t("dashboard.greetingNight", `Good Night, ${userName}`)
    }
  }, [currentTime, userName, t])

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, hour: number = currentTime.getHours()) => {
    const cond = condition.toLowerCase()
    const isDay = hour >= 6 && hour < 18
    
    if (cond.includes("rain") || cond.includes("drizzle")) {
      return cond.includes("heavy") ? "⛈️" : "🌧️"
    }
    if (cond.includes("thunderstorm") || cond.includes("storm")) return "⛈️"
    if (cond.includes("snow")) return "❄️"
    if (cond.includes("cloud")) return isDay ? "🌥️" : "☁️"
    if (cond.includes("mist") || cond.includes("fog")) return "🌫️"
    if (cond.includes("clear")) return isDay ? "☀️" : "🌙"
    return isDay ? "🌤️" : "☁️"
  }

  // Get AQI level and color
  const getAQIInfo = (aqi: number) => {
    if (aqi <= 50) return { 
      level: "Good", 
      color: "text-green-600", 
      bg: "bg-green-100",
      border: "border-green-200"
    }
    if (aqi <= 100) return { 
      level: "Moderate", 
      color: "text-yellow-600", 
      bg: "bg-yellow-100",
      border: "border-yellow-200"
    }
    if (aqi <= 150) return { 
      level: "Unhealthy for Sensitive", 
      color: "text-orange-600", 
      bg: "bg-orange-100",
      border: "border-orange-200"
    }
    if (aqi <= 200) return { 
      level: "Unhealthy", 
      color: "text-red-600", 
      bg: "bg-red-100",
      border: "border-red-200"
    }
    if (aqi <= 300) return { 
      level: "Very Unhealthy", 
      color: "text-purple-600", 
      bg: "bg-purple-100",
      border: "border-purple-200"
    }
    return { 
      level: "Hazardous", 
      color: "text-red-700", 
      bg: "bg-red-200",
      border: "border-red-300"
    }
  }

  // Get weather gradient
  const getWeatherGradient = (condition: string, hour: number = currentTime.getHours()) => {
    const cond = condition.toLowerCase()
    const isDay = hour >= 6 && hour < 18
    
    if (cond.includes("rain") || cond.includes("drizzle")) {
      return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
    if (cond.includes("thunderstorm") || cond.includes("storm")) {
      return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
    if (cond.includes("clear")) {
      return isDay 
        ? "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
    if (cond.includes("cloud")) {
      return isDay
        ? "linear-gradient(135deg, #a8caba 0%, #5d4157 100%)"
        : "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)"
    }
    return "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
  }

  // Farming tips based on weather
  const getFarmingTips = (weather: WeatherData | null): FarmingTip[] => {
    if (!weather) return []
    
    const tips: FarmingTip[] = []
    const hour = currentTime.getHours()
    const isMorning = hour >= 5 && hour < 11
    const isEvening = hour >= 16 && hour < 20
    
    // Tip 1: Irrigation timing
    if (weather.temperature > 30) {
      tips.push({
        id: 1,
        icon: Droplet,
        title: "Optimal Irrigation Time",
        description: "Water your crops early morning or late evening to minimize evaporation",
        urgency: 'medium',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      })
    }
    
    // Tip 2: Rain forecast
    if (weather.rainfall > 0) {
      tips.push({
        id: 2,
        icon: CloudRain,
        title: "Rain Alert",
        description: `Expected ${weather.rainfall}mm rainfall. Adjust irrigation schedule`,
        urgency: 'high',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      })
    }
    
    // Tip 3: Fertilizer application
    if (weather.humidity > 70 && weather.temperature < 35) {
      tips.push({
        id: 3,
        icon: Leaf,
        title: "Fertilizer Application",
        description: "Good conditions for fertilizer application today",
        urgency: 'low',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      })
    }
    
    // Tip 4: UV Protection
    if (weather.uvIndex > 6) {
      tips.push({
        id: 4,
        icon: Sun,
        title: "High UV Index",
        description: "Wear protective clothing and sunscreen during fieldwork",
        urgency: 'medium',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      })
    }
    
    // Tip 5: Wind conditions
    if (weather.windSpeed > 20) {
      tips.push({
        id: 5,
        icon: Wind,
        title: "Windy Conditions",
        description: "Avoid spraying pesticides or fertilizers today",
        urgency: 'high',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      })
    }
    
    return tips.slice(0, 3) // Return top 3 tips
  }

  // Fetch weather data
  const fetchWeatherData = async () => {
    setRefreshing(true)
    try {
      // Using OpenWeatherMap API for Delhi
      const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Delhi,in&appid=${apiKey}&units=metric`
      )
      
      if (!response.ok) throw new Error("Failed to fetch weather")
      
      const data = await response.json()
      
      // Generate realistic AQI for Delhi (usually 100-200 range)
      const aqi = Math.floor(Math.random() * 100) + 100
      const aqiInfo = getAQIInfo(aqi)
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
        humidity: data.main.humidity,
        rainfall: data.rain?.["1h"] || data.rain?.["3h"] || 0,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert to km/h
        windDirection: getWindDirection(data.wind.deg),
        pressure: data.main.pressure,
        visibility: Math.round(data.visibility / 1000),
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        uvIndex: 7, // Mock UV index
        aqi,
        aqiLevel: aqiInfo.level,
        icon: getWeatherIcon(data.weather[0].description),
        location: "Delhi, India",
        lastUpdated: new Date()
      }
      
      setWeather(weatherData)
      
      // Generate forecast
      const forecastData: ForecastDay[] = [
        { day: "Tomorrow", date: getFormattedDate(1), condition: "Partly Cloudy", maxTemp: 32, minTemp: 25, icon: "🌤️", rainChance: 20 },
        { day: "Wed", date: getFormattedDate(2), condition: "Light Rain", maxTemp: 30, minTemp: 24, icon: "🌧️", rainChance: 60 },
        { day: "Thu", date: getFormattedDate(3), condition: "Sunny", maxTemp: 33, minTemp: 26, icon: "☀️", rainChance: 10 },
        { day: "Fri", date: getFormattedDate(4), condition: "Cloudy", maxTemp: 31, minTemp: 25, icon: "☁️", rainChance: 30 },
        { day: "Sat", date: getFormattedDate(5), condition: "Heavy Rain", maxTemp: 28, minTemp: 23, icon: "⛈️", rainChance: 80 },
      ]
      
      setForecast(forecastData)
      
    } catch (error) {
      console.error("Error fetching weather:", error)
      // Fallback to mock data
      const mockWeather: WeatherData = {
        temperature: 28,
        feelsLike: 30,
        condition: "Partly Cloudy",
        humidity: 75,
        rainfall: 0,
        windSpeed: 12,
        windDirection: "NE",
        pressure: 1013,
        visibility: 10,
        sunrise: "06:15 AM",
        sunset: "06:45 PM",
        uvIndex: 7,
        aqi: 145,
        aqiLevel: "Unhealthy for Sensitive",
        icon: getWeatherIcon("Partly Cloudy"),
        location: "Delhi, India",
        lastUpdated: new Date()
      }
      
      setWeather(mockWeather)
      setForecast([
        { day: "Tomorrow", date: getFormattedDate(1), condition: "Partly Cloudy", maxTemp: 32, minTemp: 25, icon: "🌤️", rainChance: 20 },
        { day: "Wed", date: getFormattedDate(2), condition: "Light Rain", maxTemp: 30, minTemp: 24, icon: "🌧️", rainChance: 60 },
      ])
    } finally {
      setWeatherLoading(false)
      setRefreshing(false)
    }
  }

  // Helper functions
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  const getFormattedDate = (daysToAdd: number): string => {
    const date = new Date()
    date.setDate(date.getDate() + daysToAdd)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setGreeting(getTimeBasedGreeting)
  }, [getTimeBasedGreeting])

  useEffect(() => {
    setIsVisible(true)
    fetchWeatherData()
  }, [])

  // Get farming tips
  const farmingTips = getFarmingTips(weather)

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header with Greeting */}
          <div className={`text-center transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex flex-col items-center gap-4">
              {/* Date and Time Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border shadow-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
                <span className="mx-1 text-muted-foreground">•</span>
                <span className="text-sm font-medium">
                  {formatTime(currentTime)}
                </span>
              </div>
              
              {/* Greeting */}
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {greeting}
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {t("dashboard.welcomeMessage", "Your personalized farming dashboard with real-time insights.")}
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 justify-center max-w-md mx-auto">
                <Link href="/krishi-sakhi-chat" className="flex-1 min-w-[200px]">
                  <Button 
                    size="lg" 
                    className="w-full h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/90 group"
                  >
                    <Mic className="mr-2 h-5 w-5 animate-pulse" />
                    Krishi Sakhi AI
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  onClick={fetchWeatherData}
                  disabled={refreshing}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Weather & Insights */}
            <div className="space-y-8">
              {/* Weather Card */}
              <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                  <div 
                    className="text-white p-6 relative overflow-hidden min-h-[400px]"
                    style={{
                      background: weather ? getWeatherGradient(weather.condition) : 
                      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
                    }}
                  >
                    {/* Animated background elements */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                    
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-white/90" />
                            <span className="font-semibold text-white/90">
                              {weather?.location || "Delhi, India"}
                            </span>
                            {weather && (
                              <Badge variant="outline" className="ml-2 bg-white/20 border-white/30 text-xs">
                                LIVE
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-white/80">
                            Updated {weather ? formatTime(weather.lastUpdated) : '--:--'}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white/90 hover:text-white hover:bg-white/20"
                          onClick={fetchWeatherData}
                          disabled={refreshing}
                        >
                          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                      
                      {/* Main Weather Info */}
                      {weatherLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-white mb-4"></div>
                            <div className="text-white/80">Loading weather...</div>
                          </div>
                        </div>
                      ) : weather ? (
                        <>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-8">
                              <div>
                                <div className="text-7xl font-bold mb-2">{weather.temperature}°C</div>
                                <div className="text-lg opacity-90">Feels like {weather.feelsLike}°C</div>
                                <div className="text-xl font-semibold mt-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                                  {weather.condition}
                                </div>
                              </div>
                              <div className="text-8xl transform hover:scale-110 transition-transform duration-500">
                                {weather.icon}
                              </div>
                            </div>
                            
                            {/* Air Quality */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Wind className="h-4 w-4" />
                                  <span className="font-semibold">Air Quality Index</span>
                                </div>
                                <Badge 
                                  className={`${getAQIInfo(weather.aqi).bg} ${getAQIInfo(weather.aqi).color} border-0`}
                                >
                                  {weather.aqiLevel}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-2xl font-bold">{weather.aqi} AQI</span>
                                  <div className="text-sm text-white/80">
                                    {weather.aqi <= 100 ? 'Good for outdoor work' : 'Limit exposure'}
                                  </div>
                                </div>
                                <Progress 
                                  value={Math.min(weather.aqi, 300) / 3} 
                                  className="h-2 bg-white/20"
                                  indicatorClassName="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                                />
                                <div className="flex justify-between text-xs text-white/80">
                                  <span>Good</span>
                                  <span>Moderate</span>
                                  <span>Unhealthy</span>
                                  <span>Hazardous</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Weather Details Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { icon: Droplets, label: "Humidity", value: `${weather.humidity}%`, trend: weather.humidity > 70 ? 'high' : 'normal' },
                                { icon: Wind, label: "Wind", value: `${weather.windSpeed} km/h`, trend: weather.windSpeed > 15 ? 'high' : 'normal' },
                                { icon: Thermometer, label: "Pressure", value: `${weather.pressure} hPa`, trend: 'normal' },
                                { icon: Eye, label: "Visibility", value: `${weather.visibility} km`, trend: weather.visibility > 8 ? 'good' : 'low' },
                                { icon: Sun, label: "UV Index", value: `${weather.uvIndex}/10`, trend: weather.uvIndex > 6 ? 'high' : 'normal' },
                                { icon: CloudRain, label: "Rainfall", value: `${weather.rainfall}mm`, trend: weather.rainfall > 0 ? 'high' : 'normal' },
                              ].map((item, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                                >
                                  <div className="p-2 bg-white/20 rounded-lg">
                                    <item.icon className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs opacity-80">{item.label}</div>
                                    <div className="font-semibold text-sm">{item.value}</div>
                                  </div>
                                  {item.trend === 'high' && <TrendingUpIcon className="h-3 w-3 text-red-300" />}
                                  {item.trend === 'low' && <TrendingDown className="h-3 w-3 text-blue-300" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Farming Tips */}
              <div className={`transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-amber-50/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-sm">
                        <Sprout className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">Smart Farming Tips</div>
                        <div className="text-sm text-muted-foreground">Based on current conditions</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {farmingTips.length > 0 ? (
                      farmingTips.map((tip) => {
                        const Icon = tip.icon
                        return (
                          <div 
                            key={tip.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border ${tip.bgColor} ${tip.color.replace('text', 'border')}/20 hover:scale-[1.02] transition-all duration-300 group cursor-pointer`}
                          >
                            <div className={`p-2 rounded-lg ${tip.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className={`h-4 w-4 ${tip.color}`} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="font-semibold text-foreground">{tip.title}</div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${tip.urgency === 'high' ? 'border-red-200 text-red-600 bg-red-50' : tip.urgency === 'medium' ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-green-200 text-green-600 bg-green-50'}`}
                                >
                                  {tip.urgency === 'high' ? 'Urgent' : tip.urgency === 'medium' ? 'Important' : 'Suggestion'}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">{tip.description}</div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Sprout className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <div>No specific recommendations for current conditions</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Market & Activities */}
            <div className="space-y-8">
              {/* Market Prices */}
              <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <MarketPriceWidget 
                  translations={{
                    marketPrices: t("dashboard.marketPrices", "Market Prices"),
                    loading: t("dashboard.marketPricesLoading", "Loading market prices..."),
                    usingCachedData: t("dashboard.marketPricesCached", "Using cached data"),
                    viewMorePrices: t("dashboard.marketPricesViewMore", "View More Prices"),
                  }}
                />
              </div>
              
              {/* 5-Day Forecast */}
              <div className={`transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground">5-Day Forecast</div>
                          <div className="text-sm text-muted-foreground">Planning ahead</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Delhi
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {forecast.map((day, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-all duration-300 hover:scale-[1.01] group border border-transparent hover:border-border"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                            {day.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-foreground">{day.day}</div>
                            <div className="text-sm text-muted-foreground">{day.date}</div>
                            <div className="text-xs text-muted-foreground mt-1">{day.condition}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${day.rainChance > 50 ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                            🌧️ {day.rainChance}%
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-foreground text-lg">{day.maxTemp}°</div>
                            <div className="text-sm text-muted-foreground">{day.minTemp}°</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Stats */}
              <div className={`grid grid-cols-2 gap-4 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                {/* Soil Health */}
                <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-emerald-200/50 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Leaf className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="font-semibold text-emerald-900">Soil Health</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-emerald-800/80">Moisture Level</div>
                      <Progress value={65} className="h-2 bg-emerald-200/50" indicatorClassName="bg-gradient-to-r from-emerald-500 to-emerald-600" />
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-600">65% Optimal</span>
                        <span className="text-muted-foreground">Last: 2h ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Crop Progress */}
                <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/30 border-amber-200/50 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="font-semibold text-amber-900">Crop Progress</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-amber-800/80">Growth Stage</div>
                      <Progress value={45} className="h-2 bg-amber-200/50" indicatorClassName="bg-gradient-to-r from-amber-500 to-orange-500" />
                      <div className="flex justify-between text-xs">
                        <span className="text-amber-600">45% Vegetative</span>
                        <span className="text-muted-foreground">Next: Flowering</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sunrise & Sunset */}
              {weather && (
                <div className={`transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/50">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-foreground">Daylight Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50/50 rounded-xl border border-amber-200/30">
                          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-sm">
                            <Sunrise className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Sunrise</div>
                            <div className="text-2xl font-bold text-amber-700">{weather.sunrise}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50/50 rounded-xl border border-purple-200/30">
                          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-sm">
                            <Sunset className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Sunset</div>
                            <div className="text-2xl font-bold text-purple-700">{weather.sunset}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}