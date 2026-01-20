"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { User, MapPin, Ruler, Sprout, Mountain, Droplets, Save, Calendar, Phone, Mail, Edit } from "lucide-react"

// Define the user profile interface
interface FarmerProfile {
  _id: string
  name: string
  email: string
  phone?: string
  location?: string
  crop?: string
  soilType?: string
  irrigation?: string
  landSize?: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { user: authUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [profile, setProfile] = useState<FarmerProfile | null>(null)
  
  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [landSize, setLandSize] = useState("")
  const [crop, setCrop] = useState("")
  const [soilType, setSoilType] = useState("")
  const [irrigation, setIrrigation] = useState("")

  // Fetch farmer profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) return
      
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          
          // Populate form fields
          setName(data.name || "")
          setEmail(data.email || "")
          setPhone(data.phone || "")
          setLocation(data.location || "")
          setLandSize(data.landSize || "")
          setCrop(data.crop || "")
          setSoilType(data.soilType || "")
          setIrrigation(data.irrigation || "")
        } else {
          console.error('Failed to fetch profile')
          // If no profile exists, use auth user data
          setName(authUser.name || "")
          setEmail(authUser.email || "")
          setPhone(authUser.phone || "")
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast({
          title: t("profile.fetchError"),
          description: "Could not load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [authUser, t, toast])

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Supported",
        description: "Your browser doesn't support GPS location.",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        setLocation(locationString)
        setIsGettingLocation(false)
        toast({
          title: t("profile.gpsSuccess"),
          description: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
        })
      },
      (error) => {
        console.error("GPS Error:", error)
        setIsGettingLocation(false)
        toast({
          title: t("profile.gpsError"),
          description: "Please check your location permissions.",
          variant: "destructive",
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          phone,
          location,
          landSize,
          crop,
          soilType,
          irrigation
        })
      })
      
      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsEditing(false)
        toast({
          title: t("profile.saveSuccess"),
          description: "Your profile has been updated successfully",
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: t("profile.saveError"),
        description: "Could not update profile",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("profile.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("profile.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary Card */}
            <Card className="lg:col-span-1 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 to-green-300 flex items-center justify-center mx-auto">
                    <User className="h-12 w-12 text-amber-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">{profile?.name || authUser?.name}</CardTitle>
                <p className="text-muted-foreground">Krishi Sakhi Farmer</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">{profile?.email || authUser?.email}</span>
                </div>
                
                {profile?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
                
                {profile?.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                
                {profile?.createdAt && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">Member since {formatDate(profile.createdAt)}</span>
                  </div>
                )}
                
                <Button 
                  variant={isEditing ? "outline" : "default"} 
                  className="w-full"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </CardContent>
            </Card>

            {/* Profile Details Card */}
            <Card className="lg:col-span-2 p-6 shadow-lg">
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span>{t("profile.nameLabel")}</span>
                    </Label>
                    <Input 
                      id="name" 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="h-12 text-base" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landSize" className="text-base font-medium flex items-center space-x-2">
                      <Ruler className="h-4 w-4 text-primary" />
                      <span>{t("profile.landSizeLabel")}</span>
                    </Label>
                    <Input 
                      id="landSize" 
                      type="number" 
                      value={landSize} 
                      onChange={(e) => setLandSize(e.target.value)}
                      disabled={!isEditing}
                      placeholder="0.5" 
                      className="h-12 text-base" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-base font-medium flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{t("profile.locationLabel")}</span>
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={!isEditing}
                      placeholder={t("profile.locationLabel")}
                      className="h-12 text-base flex-1"
                    />
                    <Button
                      variant="outline"
                      className="h-12 px-6 bg-transparent shadow-md hover:shadow-lg transition-all"
                      onClick={handleGPSLocation}
                      disabled={!isEditing || isGettingLocation}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {isGettingLocation ? "..." : t("profile.gpsButton")}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="crop" className="text-base font-medium flex items-center space-x-2">
                      <Sprout className="h-4 w-4 text-primary" />
                      <span>{t("profile.cropLabel")}</span>
                    </Label>
                    <Select value={crop} onValueChange={setCrop} disabled={!isEditing}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder={t("profile.cropLabel")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice / നെല്ല് / चावल</SelectItem>
                        <SelectItem value="coconut">Coconut / തെങ്ങ് / नारियल</SelectItem>
                        <SelectItem value="rubber">Rubber / റബ്ബർ / रबड़</SelectItem>
                        <SelectItem value="spices">Spices / സുഗന്ധവ്യഞ്ജനങ്ങൾ / मसाले</SelectItem>
                        <SelectItem value="vegetables">Vegetables / പച്ചക്കറികൾ / सब्जियां</SelectItem>
                        <SelectItem value="fruits">Fruits / പഴങ്ങൾ / फल</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soilType" className="text-base font-medium flex items-center space-x-2">
                      <Mountain className="h-4 w-4 text-primary" />
                      <span>{t("profile.soilTypeLabel")}</span>
                    </Label>
                    <Select value={soilType} onValueChange={setSoilType} disabled={!isEditing}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder={t("profile.soilTypeLabel")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laterite">Laterite / ലാറ്ററൈറ്റ് / लेटराइट</SelectItem>
                        <SelectItem value="alluvial">Alluvial / എക്കൽ / जलोढ़</SelectItem>
                        <SelectItem value="red">Red Soil / ചുവന്ന മണ്ണ് / लाल मिट्टी</SelectItem>
                        <SelectItem value="black">Black Soil / കറുത്ത മണ്ണ് / काली मिट्टी</SelectItem>
                        <SelectItem value="sandy">Sandy / മണൽ / रेतीली</SelectItem>
                        <SelectItem value="clay">Clay / കളിമണ്ണ് / चिकनी मिट्टी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="irrigation" className="text-base font-medium flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-primary" />
                    <span>{t("profile.irrigationLabel")}</span>
                  </Label>
                  <Select value={irrigation} onValueChange={setIrrigation} disabled={!isEditing}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder={t("profile.irrigationLabel")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rainfed">Rain-fed / മഴയെ ആശ്രയിച്ച് / वर्षा आधारित</SelectItem>
                      <SelectItem value="drip">Drip Irrigation / ഡ്രിപ്പ് ജലസേചനം / ड्रिप सिंचाई</SelectItem>
                      <SelectItem value="sprinkler">Sprinkler / സ്പ്രിങ്ക്ലർ / स्प्रिंकलर</SelectItem>
                      <SelectItem value="flood">Flood Irrigation / വെള്ളപ്പൊക്ക ജലസേചനം / बाढ़ सिंचाई</SelectItem>
                      <SelectItem value="well">Well Water / കിണർ വെള്ളം / कुआं पानी</SelectItem>
                      <SelectItem value="canal">Canal Water / കനാൽ വെള്ളം / नहर का पानी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isEditing && (
                  <Button 
                    className="w-full h-14 text-lg font-medium mt-8 shadow-lg hover:shadow-xl transition-all"
                    onClick={handleSaveProfile}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {t("profile.saveButton")}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}