"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import React, { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Mic, 
  FileText, 
  Cloud, 
  Award, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Plus, 
  Sparkles,
  Wind,
  Eye,
  Sunrise,
  Sunset,
  Compass,
  Calendar,
  MapPin,
  RefreshCw
} from "lucide-react"
import MarketPriceWidget from "@/components/ui/MarketPriceWidget"
import Link from "next/link"


// Weather types
interface WeatherData {
  temperature: string
  feelsLike: string
  condition: string
  humidity: string
  rainfall: string
  windSpeed: string
  windDirection: string
  pressure: string
  visibility: string
  sunrise: string
  sunset: string
  uvIndex: string
  icon: string
  location: string
  aqi?: {
    index: number
    label: string
    pm2_5?: number
  }
}

interface ForecastDay {
  day: string
  condition: string
  maxTemp: string
  minTemp: string
  icon: string
  rainChance: string
}

interface LocationData {
  latitude: number
  longitude: number
  city: string
  state: string
  country: string
}

export default function DashboardPage() {
  const { t, language } = useLanguage()
  const { user, isLoaded } = useUser()

  const displayName = isLoaded && user ? user.fullName : "Farmer"

  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Location and weather states
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationLoading, setLocationLoading] = useState<boolean>(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  // Provide translations for MarketPriceWidget
  const marketTranslations = {
    marketPrices: t("dashboard.marketPrices"),
    loading: t("dashboard.marketPricesLoading"),
    usingCachedData: t("dashboard.marketPricesCached"),
    viewMorePrices: t("dashboard.marketPricesViewMore"),
  }

  const activities = [
    {
      type: t("activity.types.irrigation.title"),
      time: "2 hours ago",
      description: "Watered rice field - Section A",
      quantity: "500 liters",
    },
    {
      type: t("activity.types.fertilizer.title"),
      time: "Yesterday",
      description: "Applied organic fertilizer to coconut trees",
      quantity: "50 kg",
    },
    {
      type: "Pest Check",
      time: "2 days ago",
      description: "Inspected crops for pest damage",
      quantity: "2 liters neem oil",
    },
  ]

  // Function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours()

    if (hour >= 5 && hour < 12) {
      return t("dashboard.greetingMorning")
    } else if (hour >= 12 && hour < 17) {
      return t("dashboard.greetingAfternoon")
    } else if (hour >= 17 && hour < 21) {
      return t("dashboard.greetingEvening")
    } else {
      return t("dashboard.greetingNight")
    }
  }

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase()
    if (cond.includes("rain") || cond.includes("drizzle")) return "🌧️"
    if (cond.includes("thunderstorm") || cond.includes("storm")) return "⛈️"
    if (cond.includes("snow")) return "❄️"
    if (cond.includes("cloud")) return "☁️"
    if (cond.includes("mist") || cond.includes("fog")) return "🌫️"
    if (cond.includes("clear")) return "☀️"
    return "🌤️"
  }

  // Get background based on weather condition
  const getWeatherBackground = (condition: string) => {
    const cond = condition.toLowerCase()
    if (cond.includes("rain") || cond.includes("drizzle")) 
      return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    if (cond.includes("thunderstorm") || cond.includes("storm")) 
      return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    if (cond.includes("clear")) 
      return "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    if (cond.includes("cloud")) 
      return "linear-gradient(135deg, #a8caba 0%, #5d4157 100%)"
    return "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
  }

  // Get location name from coordinates (reverse geocoding)
  const getLocationName = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      )
      if (!response.ok) throw new Error("Failed to fetch location name")
      const data = await response.json()
      return data.city || data.locality || data.principalSubdivision || "Your Location"
    } catch (error) {
      console.error("Error getting location name:", error)
      return "Your Location"
    }
  }

  // Get user's current location
  const getUserLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const locationName = await getLocationName(latitude, longitude)
            
            resolve({
              latitude,
              longitude,
              city: locationName,
              state: "",
              country: "India"
            })
          } catch (error) {
            reject(error)
          }
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location"
          switch (error.code) {
            case 1:
              errorMessage = "Location access denied. Please enable location permissions."
              break
            case 2:
              errorMessage = "Location information unavailable."
              break
            case 3:
              errorMessage = "Location request timed out."
              break
            default:
              errorMessage = "Unknown location error."
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  // Mock forecast data
  const getMockForecast = (): ForecastDay[] => [
    { day: "Tomorrow", condition: "Partly Cloudy", maxTemp: "32°C", minTemp: "25°C", icon: "🌤️", rainChance: "20%" },
    { day: "Wed", condition: "Light Rain", maxTemp: "30°C", minTemp: "24°C", icon: "🌧️", rainChance: "60%" },
    { day: "Thu", condition: "Sunny", maxTemp: "33°C", minTemp: "26°C", icon: "☀️", rainChance: "10%" },
    { day: "Fri", condition: "Cloudy", maxTemp: "31°C", minTemp: "25°C", icon: "☁️", rainChance: "30%" },
    { day: "Sat", condition: "Heavy Rain", maxTemp: "28°C", minTemp: "23°C", icon: "⛈️", rainChance: "80%" },
  ]

  // Mock weather data for fallback
  const getMockWeather = (locationName: string): WeatherData => ({
    temperature: "28°C",
    feelsLike: "30°C",
    condition: "Partly Cloudy",
    humidity: "75%",
    rainfall: "0 mm",
    windSpeed: "12 km/h",
    windDirection: "NE",
    pressure: "1013 hPa",
    visibility: "10 km",
    sunrise: "06:15 AM",
    sunset: "06:45 PM",
    uvIndex: "7 (High)",
    icon: "🌤️",
    location: locationName
  })

  // Fetch user data from database
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  // Fetch user location and weather
  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      setLocationLoading(true)
      setWeatherLoading(true)
      setLocationError(null)
      setWeatherError(null)
      try {
        // Use Delhi coordinates for consistent current weather + AQI
        const userLocation: LocationData = {
          latitude: 28.7041,
          longitude: 77.1025,
          city: "Delhi",
          state: "Delhi",
          country: "India",
        }
        setLocation(userLocation)

        const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY
        if (!apiKey) {
          console.warn("OpenWeatherMap API key not found, using mock data")
          throw new Error("API key not configured")
        }

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${apiKey}&units=metric`
        const weatherResponse = await fetch(weatherUrl)
        if (!weatherResponse.ok) {
          throw new Error(`Weather API error: ${weatherResponse.status}`)
        }

        const weatherData = await weatherResponse.json()

        const temp = typeof weatherData.main?.temp === "number" ? `${weatherData.main.temp.toFixed(1)}°C` : "N/A"
        const feelsLike = typeof weatherData.main?.feels_like === "number" ? `${weatherData.main.feels_like.toFixed(1)}°C` : "N/A"
        const conditionRaw = weatherData.weather?.[0]?.description || "N/A"
        const condition = conditionRaw.charAt(0).toUpperCase() + conditionRaw.slice(1)
        const humidity = typeof weatherData.main?.humidity === "number" ? `${weatherData.main.humidity}%` : "N/A"
        const rainfall = typeof weatherData.rain?.["1h"] === "number" ? `${weatherData.rain["1h"]} mm` : "0 mm"
        const windSpeed = typeof weatherData.wind?.speed === "number" ? `${weatherData.wind.speed} m/s` : "N/A"
        const windDirection = typeof weatherData.wind?.deg === "number" ? `${weatherData.wind.deg}°` : "N/A"
        const pressure = typeof weatherData.main?.pressure === "number" ? `${weatherData.main.pressure} hPa` : "N/A"
        const visibility = typeof weatherData.visibility === "number" ? `${(weatherData.visibility / 1000).toFixed(1)} km` : "N/A"

        // Mock sunrise/sunset and UV index for demo
        const sunrise = "06:15 AM"
        const sunset = "06:45 PM"
        const uvIndex = "7 (High)"

        setWeather({
          temperature: temp,
          feelsLike,
          condition,
          humidity,
          rainfall,
          windSpeed,
          windDirection,
          pressure,
          visibility,
          sunrise,
          sunset,
          uvIndex,
          icon: getWeatherIcon(condition),
          location: userLocation.city,
        })

        // Fetch Air Quality Index (AQI)
        try {
          const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${apiKey}`
          const aqiResp = await fetch(aqiUrl)
          if (aqiResp.ok) {
            const aqiJson = await aqiResp.json()
            const index = aqiJson.list?.[0]?.main?.aqi
            const components = aqiJson.list?.[0]?.components || {}
            let label = "Unknown"
            switch (index) {
              case 1:
                label = "Good"
                break
              case 2:
                label = "Fair"
                break
              case 3:
                label = "Moderate"
                break
              case 4:
                label = "Poor"
                break
              case 5:
                label = "Very Poor"
                break
            }
            setWeather(prev => prev ? { ...prev, aqi: { index, label, pm2_5: components.pm2_5 } } : null)
          }
        } catch (aqiErr) {
          console.warn("AQI fetch failed", aqiErr)
        }

        // Set mock forecast
        setForecast(getMockForecast())

      } catch (err) {
        console.error("Error fetching weather:", err)
        const errorMessage = err instanceof Error ? err.message : "Unknown error"

        // Fallback to default Kerala demo data
        const defaultLocation: LocationData = {
          latitude: 10.8505,
          longitude: 76.2711,
          city: "Kerala",
          state: "Kerala",
          country: "India",
        }
        setLocation(defaultLocation)
        setWeather(getMockWeather("Kerala"))
        setWeatherError("Weather data unavailable - showing demo data")
        setForecast(getMockForecast())
      } finally {
        setLocationLoading(false)
        setWeatherLoading(false)
      }
    }

    fetchLocationAndWeather()
  }, [])

  // Function to retry location access
  const retryLocationAccess = async () => {
    setLocationError(null)
    setWeatherError(null)
    setLocationLoading(true)
    setWeatherLoading(true)
    
    try {
      const userLocation = await getUserLocation()
      setLocation(userLocation)
      setLocationError(null)
      
      // Update weather location
      if (weather) {
        setWeather({
          ...weather,
          location: userLocation.city
        })
      }
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : "Failed to get location")
    } finally {
      setLocationLoading(false)
      setWeatherLoading(false)
    }
  }

  const greeting = getTimeBasedGreeting()

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-linear-to-b from-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Greeting Section */}
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
              <span className="text-sm font-medium text-primary">
                {currentTime.toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              {greeting}, {displayName}! 👋
            </h1>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              {t("dashboard.welcomeMessage")}
            </p>
                <div className="flex justify-center max-w-md mx-auto">
              <Link href="/krishi-sakhi-chat" className="w-full">
                <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                  <Mic className="mr-3 h-6 w-6" />
                  {t("dashboard.voiceButton")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <span className="bg-primary/10 p-2 rounded-lg mr-3">
                <Sparkles className="h-5 w-5 text-primary" />
              </span>
              {t("dashboard.quickActions")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/activity">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border hover:border-primary/20 group">
                  <CardContent className="text-center p-0">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{t("dashboard.actions.logActivity")}</CardTitle>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/advisory">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border hover:border-primary/20 group">
                  <CardContent className="text-center p-0">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <Cloud className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{t("dashboard.actions.checkWeather")}</CardTitle>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/advisory">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border hover:border-primary/20 group">
                  <CardContent className="text-center p-0">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{t("dashboard.actions.advisory")}</CardTitle>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/knowledge">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border hover:border-primary/20 group">
                  <CardContent className="text-center p-0">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{t("dashboard.actions.schemes")}</CardTitle>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Weather Section */}
            <div className="flex flex-col gap-8">
              {/* Enhanced Weather Widget */}
              <Card className="shadow-xl overflow-hidden transition-all duration-500 border-0 hover:shadow-2xl">
                <div 
                  className="text-white p-6"
                  style={{
                    background: weather ? getWeatherBackground(weather.condition) : 
                    "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
                  }}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2">
                        <Cloud className="h-5 w-5 text-white/90" />
                        <span className="text-white font-bold">
                          {t("dashboard.todaysWeather")}
                        </span>
                      </div>
                             <div className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                              {locationLoading ? "Locating..." : 
                               weatherError ? "Demo Mode" : 
                               "Live"}
                             </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 p-0">
                    {/* Location Display */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-white/80" />
                        <span className="text-white/90 font-medium">
                          {locationLoading ? "Detecting location..." : 
                           locationError ? locationError : 
                           weather?.location || location?.city || "Your Location"}
                        </span>
                      </div>
                      {locationError && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white backdrop-blur-sm"
                          onClick={retryLocationAccess}
                          disabled={locationLoading}
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${locationLoading ? 'animate-spin' : ''}`} />
                          {locationLoading ? "Retrying..." : "Retry"}
                        </Button>
                      )}
                    </div>

                    {weatherLoading ? (
                      <div className="text-center py-8 text-white/80">
                        <div className="text-2xl mb-2 animate-pulse">Loading weather data...</div>
                        <div className="text-sm">Getting latest conditions for your location</div>
                      </div>
                    ) : weatherError ? (
                      <div className="text-center py-8 text-white/90 bg-black/20 rounded-lg backdrop-blur-sm">
                        <div className="text-yellow-200 mb-2 flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Showing Demo Data
                        </div>
                        <div className="text-sm text-white/70">Weather data unavailable for {location?.city || "your area"}</div>
                      </div>
                    ) : weather ? (
                      <>
                        {/* Main Weather Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-6xl">{weather.icon}</div>
                            <div>
                              <div className="text-5xl font-bold">{weather.temperature}</div>
                              <div className="text-lg opacity-90">Feels like {weather.feelsLike}</div>
                              <div className="text-xl font-semibold capitalize mt-1">{weather.condition}</div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Weather Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-6 border-t border-white/30">
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <Droplets className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-xs opacity-80">Humidity</div>
                              <div className="font-semibold text-sm">{weather.humidity}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <CloudRain className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-xs opacity-80">Rainfall</div>
                              <div className="font-semibold text-sm">{weather.rainfall}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <Wind className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-xs opacity-80">Wind</div>
                              <div className="font-semibold text-sm">{weather.windSpeed}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <Compass className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-xs opacity-80">Pressure</div>
                              <div className="font-semibold text-sm">{weather.pressure}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <Eye className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-xs opacity-80">Visibility</div>
                              <div className="font-semibold text-sm">{weather.visibility}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <Sun className="h-4 w-4 text-yellow-200" />
                            <div>
                              <div className="text-xs opacity-80">UV Index</div>
                              <div className="font-semibold text-sm">{weather.uvIndex}</div>
                            </div>
                          </div>
                        </div>

                        {/* Sunrise & Sunset */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/30">
                          <div className="flex items-center space-x-2">
                            <Sunrise className="h-5 w-5 text-yellow-300" />
                            <div>
                              <div className="text-xs opacity-80">Sunrise</div>
                              <div className="font-semibold text-sm">{weather.sunrise}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Sunset className="h-5 w-5 text-orange-300" />
                            <div>
                              <div className="text-xs opacity-80">Sunset</div>
                              <div className="font-semibold text-sm">{weather.sunset}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </CardContent>
                </div>
              </Card>

              {/* 5-Day Forecast */}
              <Card className="shadow-lg border hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-bold">5-Day Forecast - {location?.city || "Your Area"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors duration-200 group">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{day.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{day.day}</div>
                          <div className="text-sm text-muted-foreground">{day.condition}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-right">
                        <div className="text-sm text-muted-foreground">🌧️ {day.rainChance}</div>
                        <div>
                          <div className="font-bold text-foreground">{day.maxTemp}</div>
                          <div className="text-sm text-muted-foreground">{day.minTemp}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weather Advisory */}
              <Card className="bg-linear-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-amber-800">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <span className="font-bold">Farming Advisory for {location?.city || "Your Area"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-amber-800">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
                      <div className="text-sm font-medium">Good day for irrigation and fertilizer application</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
                      <div className="text-sm font-medium">Monitor soil moisture levels regularly</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
                      <div className="text-sm font-medium">Expected rainfall in 2 days - plan accordingly</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Market Prices and Activities */}
            <div className="flex flex-col gap-8">
              {/* Market Price Widget */}
              <MarketPriceWidget translations={marketTranslations} language={language} />
            
              {/* Recent Activity */}
              <Card className="shadow-lg border hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="font-bold">{t("dashboard.recentActivity")}</span>
                    <Link href="/activity">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors duration-200 group">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">{activity.type}</div>
                        <div className="text-sm text-muted-foreground truncate">{activity.description}</div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                          <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                            {activity.quantity}
                          </div>
                        </div>
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