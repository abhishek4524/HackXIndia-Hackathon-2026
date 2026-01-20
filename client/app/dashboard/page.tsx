"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import React, { useEffect, useState } from "react"
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
  MapPin
} from "lucide-react"
import MarketPriceWidget from "@/components/ui/MarketPriceWidget"
import Link from "next/link"

// Mock user data - replace with actual database fetch
const mockUserData = {
  name: "Rajesh Kumar",
  location: "Kerala"
}

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
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userName, setUserName] = useState("")
  const [greeting, setGreeting] = useState("")

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
      const data = await response.json()
      return data.city || data.locality || data.principalSubdivision || "Your Location"
    } catch (error) {
      console.error("Error getting location name:", error)
      return "Your Location"
    }
  }

  // Get user's current location
  const getUserLocation = () => {
    return new Promise<LocationData>((resolve, reject) => {
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
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out."
              break
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

  // Mock forecast data - in real app, this would come from API
  const getMockForecast = (): ForecastDay[] => [
    { day: "Tomorrow", condition: "Partly Cloudy", maxTemp: "32°C", minTemp: "25°C", icon: "🌤️", rainChance: "20%" },
    { day: "Wed", condition: "Light Rain", maxTemp: "30°C", minTemp: "24°C", icon: "🌧️", rainChance: "60%" },
    { day: "Thu", condition: "Sunny", maxTemp: "33°C", minTemp: "26°C", icon: "☀️", rainChance: "10%" },
    { day: "Fri", condition: "Cloudy", maxTemp: "31°C", minTemp: "25°C", icon: "☁️", rainChance: "30%" },
    { day: "Sat", condition: "Heavy Rain", maxTemp: "28°C", minTemp: "23°C", icon: "⛈️", rainChance: "80%" },
  ]

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with actual API call to get user data
        const response = await fetch('http://localhost:5000/api/auth/')
        const userData = await response.json()
        setUserName(userData.name)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    }
    
    fetchUserData()
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setGreeting(getTimeBasedGreeting())
    }, 60000)
    
    setGreeting(getTimeBasedGreeting())
    
    return () => clearInterval(timer)
  }, [t])

  // Fetch user location and weather
  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      setLocationLoading(true)
      setWeatherLoading(true)
      setLocationError(null)
      setWeatherError(null)

      try {
        // Get user's current location
        const userLocation = await getUserLocation()
        setLocation(userLocation)

        // Fetch weather data using coordinates
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY}`
        
        const weatherResponse = await fetch(weatherUrl)
        if (!weatherResponse.ok) throw new Error(`Weather API error: ${weatherResponse.status}`)
        
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
          location: userLocation.city
        })

        // Set mock forecast
        setForecast(getMockForecast())
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        
        if (errorMessage.includes("Location access denied")) {
          setLocationError("Location access denied")
          // Fallback to IP-based location or default location
          try {
            const fallbackResponse = await fetch("https://ipapi.co/json/")
            const fallbackData = await fallbackResponse.json()
            setLocation({
              latitude: fallbackData.latitude,
              longitude: fallbackData.longitude,
              city: fallbackData.city,
              state: fallbackData.region,
              country: fallbackData.country_name
            })
            setLocationError(null)
          } catch (fallbackError) {
            setLocationError("Using default location (Kerala)")
            setLocation({
              latitude: 10.8505,
              longitude: 76.2711,
              city: "Kerala",
              state: "Kerala",
              country: "India"
            })
          }
        } else {
          setLocationError(errorMessage)
        }
        
        setWeatherError("Weather data unavailable")
        setForecast(getMockForecast())
      } finally {
        setLocationLoading(false)
        setWeatherLoading(false)
      }
    }

    fetchLocationAndWeather()
  }, [])

  // Function to retry location access
  const retryLocationAccess = () => {
    setLocationError(null)
    setWeatherError(null)
    setLocationLoading(true)
    setWeatherLoading(true)
    
    // Re-fetch location and weather
    const fetchLocationAndWeather = async () => {
      try {
        const userLocation = await getUserLocation()
        setLocation(userLocation)
        setLocationError(null)
        
        // You can add weather fetch logic here again if needed
        setWeather(prev => prev ? { ...prev, location: userLocation.city } : null)
      } catch (err) {
        setLocationError(err instanceof Error ? err.message : "Failed to get location")
      } finally {
        setLocationLoading(false)
        setWeatherLoading(false)
      }
    }
    
    fetchLocationAndWeather()
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Greeting Section */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {greeting}, {userName || "Farmer"}!
            </h1>
            <p className="text-muted-foreground mb-4">
              {``}
            </p>
            <div className="flex justify-center max-w-md mx-auto">
            <Link href="/krishi-sakhi-chat" className="w-full cursor-pointer">
              <Button size="lg" className=" text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all w-full">
                <Mic className="mr-3 h-8 w-8" />
                {t("dashboard.voiceButton")}
              </Button>
            </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">{t("dashboard.quickActions")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/activity">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                  <CardContent className="text-center p-0">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t("dashboard.actions.logActivity")}</CardTitle>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/advisory">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                  <CardContent className="text-center p-0">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                      <Cloud className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t("dashboard.actions.checkWeather")}</CardTitle>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/advisory">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                  <CardContent className="text-center p-0">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t("dashboard.actions.advisory")}</CardTitle>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/knowledge">
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                  <CardContent className="text-center p-0">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t("dashboard.actions.schemes")}</CardTitle>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Weather Widget */}
            <div className="flex flex-col gap-8">
              <Card className="shadow-xl overflow-hidden transition-all duration-500 border-0">
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
                        <Cloud className="h-5 w-5 text-white" />
                        <span className="text-white font-semibold">
                          {t("dashboard.todaysWeather")}
                        </span>
                      </div>
                      <div className="text-sm font-normal bg-white/20 px-2 py-1 rounded-full">
                        {currentTime.toLocaleDateString('en-IN', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
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
                          className="text-xs bg-white/20 border-white/30 text-white hover:bg-white/30"
                          onClick={retryLocationAccess}
                          disabled={locationLoading}
                        >
                          {locationLoading ? "Retrying..." : "Retry"}
                        </Button>
                      )}
                    </div>

                    {weatherLoading ? (
                      <div className="text-center py-8 text-white/80 animate-pulse">
                        <div className="text-2xl mb-2">Loading weather data...</div>
                        <div className="text-sm">Getting latest conditions for your location</div>
                      </div>
                    ) : weatherError ? (
                      <div className="text-center py-8 text-white/90 bg-black/20 rounded-lg">
                        <div className="text-red-200 mb-2">⚠️ Weather data unavailable</div>
                        <div className="text-sm text-white/70">Using demo data for {location?.city || "your area"}</div>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-white/30">
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg">
                            <Droplets className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-sm opacity-80">Humidity</div>
                              <div className="font-semibold">{weather.humidity}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg">
                            <CloudRain className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-sm opacity-80">Rainfall</div>
                              <div className="font-semibold">{weather.rainfall}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg">
                            <Wind className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-sm opacity-80">Wind</div>
                              <div className="font-semibold">{weather.windSpeed}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg">
                            <Compass className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-sm opacity-80">Pressure</div>
                              <div className="font-semibold">{weather.pressure}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg">
                            <Eye className="h-4 w-4 text-blue-200" />
                            <div>
                              <div className="text-sm opacity-80">Visibility</div>
                              <div className="font-semibold">{weather.visibility}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg">
                            <Sun className="h-4 w-4 text-yellow-200" />
                            <div>
                              <div className="text-sm opacity-80">UV Index</div>
                              <div className="font-semibold">{weather.uvIndex}</div>
                            </div>
                          </div>
                        </div>

                        {/* Sunrise & Sunset */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/30">
                          <div className="flex items-center space-x-2">
                            <Sunrise className="h-5 w-5 text-yellow-300" />
                            <div>
                              <div className="text-sm opacity-80">Sunrise</div>
                              <div className="font-semibold">{weather.sunrise}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Sunset className="h-5 w-5 text-orange-300" />
                            <div>
                              <div className="text-sm opacity-80">Sunset</div>
                              <div className="font-semibold">{weather.sunset}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </CardContent>
                </div>
              </Card>

              {/* 5-Day Forecast */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>5-Day Forecast - {location?.city || "Your Area"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{day.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{day.day}</div>
                          <div className="text-sm text-muted-foreground">{day.condition}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-right">
                        <div className="text-sm text-muted-foreground">🌧️ {day.rainChance}</div>
                        <div>
                          <div className="font-semibold">{day.maxTemp}</div>
                          <div className="text-sm text-muted-foreground">{day.minTemp}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weather Advisory */}
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-amber-800">
                    <Sparkles className="h-5 w-5" />
                    <span>Farming Advisory for {location?.city || "Your Area"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-amber-800">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">Good day for irrigation and fertilizer application</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">Monitor soil moisture levels regularly</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">Expected rainfall in 2 days - plan accordingly</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Price Widget and Recent Activity */}
            <div className="flex flex-col gap-8">
            
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{t("dashboard.recentActivity")}</span>
                    <Link href="/activity">
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.type}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                          <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
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