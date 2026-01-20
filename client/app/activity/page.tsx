"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Sprout, Droplets, Beaker, Bug, Plus, Calendar, Save } from "lucide-react"

export default function ActivityPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [language, setLanguage] = useState<keyof typeof content>("en")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    location: "",
    description: "",
    quantity: "",
    notes: ""
  })

  const content = {
    en: {
      title: "Activity Logging",
      subtitle: "Track your farming activities for better insights",
      addActivity: "Add New Activity",
      activityTypes: "Activity Types",
      recentActivities: "Recent Activities",
      types: {
        sowing: {
          title: "Sowing",
          description: "Record seed planting activities",
        },
        irrigation: {
          title: "Irrigation",
          description: "Log watering and irrigation",
        },
        fertilizer: {
          title: "Fertilizer",
          description: "Track fertilizer applications",
        },
        pest: {
          title: "Pest Management",
          description: "Record pest control measures",
        },
      },
      modal: {
        title: "Add New Activity",
        activityType: "Activity Type",
        date: "Date",
        location: "Field/Location",
        description: "Description",
        quantity: "Quantity/Amount",
        notes: "Additional Notes",
        save: "Save Activity",
        cancel: "Cancel",
        placeholders: {
          location: "e.g., Field A, North section",
          description: "Describe what you did",
          quantity: "e.g., 2 kg, 100 liters",
          notes: "Any additional information",
        },
      },
      activities: [
        {
          type: "Irrigation",
          date: "Today, 10:30 AM",
          location: "Rice Field - Section A",
          description: "Watered the rice field using drip irrigation system",
          quantity: "500 liters",
        },
        {
          type: "Fertilizer",
          date: "Yesterday, 6:00 AM",
          location: "Coconut Grove",
          description: "Applied organic compost around coconut trees",
          quantity: "50 kg",
        },
        {
          type: "Pest Check",
          date: "2 days ago",
          location: "Vegetable Garden",
          description: "Inspected tomato plants for pest damage and applied neem oil",
          quantity: "2 liters neem oil",
        },
      ],
    },
    ml: {
      title: "പ്രവർത്തന രേഖപ്പെടുത്തൽ",
      subtitle: "മികച്ച ഉൾക്കാഴ്ചകൾക്കായി നിങ്ങളുടെ കൃഷി പ്രവർത്തനങ്ങൾ ട്രാക്ക് ചെയ്യുക",
      addActivity: "പുതിയ പ്രവർത്തനം ചേർക്കുക",
      activityTypes: "പ്രവർത്തന തരങ്ങൾ",
      recentActivities: "സമീപകാല പ്രവർത്തനങ്ങൾ",
      types: {
        sowing: {
          title: "വിതയൽ",
          description: "വിത്ത് നടൽ പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തുക",
        },
        irrigation: {
          title: "ജലസേചനം",
          description: "വെള്ളം നൽകലും ജലസേചനവും ലോഗ് ചെയ്യുക",
        },
        fertilizer: {
          title: "വളം",
          description: "വള പ്രയോഗങ്ങൾ ട്രാക്ക് ചെയ്യുക",
        },
        pest: {
          title: "കീട നിയന്ത്രണം",
          description: "കീട നിയന്ത്രണ നടപടികൾ രേഖപ്പെടുത്തുക",
        },
      },
      modal: {
        title: "പുതിയ പ്രവർത്തനം ചേർക്കുക",
        activityType: "പ്രവർത്തന തരം",
        date: "തീയതി",
        location: "വയൽ/സ്ഥാനം",
        description: "വിവരണം",
        quantity: "അളവ്/തുക",
        notes: "അധിക കുറിപ്പുകൾ",
        save: "പ്രവർത്തനം സേവ് ചെയ്യുക",
        cancel: "റദ്ദാക്കുക",
        placeholders: {
          location: "ഉദാ., വയൽ A, വടക്കൻ ഭാഗം",
          description: "നിങ്ങൾ എന്താണ് ചെയ്തതെന്ന് വിവരിക്കുക",
          quantity: "ഉദാ., 2 കിലോ, 100 ലിറ്റർ",
          notes: "എന്തെങ്കിലും അധിക വിവരങ്ങൾ",
        },
      },
      activities: [
        {
          type: "ജലസേചനം",
          date: "ഇന്ന്, 10:30 AM",
          location: "നെൽവയൽ - വിഭാഗം A",
          description: "ഡ്രിപ്പ് ജലസേചന സംവിധാനം ഉപയോഗിച്ച് നെൽവയലിൽ വെള്ളം നൽകി",
          quantity: "500 ലിറ്റർ",
        },
        {
          type: "വളം",
          date: "ഇന്നലെ, 6:00 AM",
          location: "തെങ്ങിൻ തോപ്പ്",
          description: "തെങ്ങിന് ചുറ്റും ജൈവ കമ്പോസ്റ്റ് പ്രയോഗിച്ചു",
          quantity: "50 കിലോ",
        },
        {
          type: "കീട പരിശോധന",
          date: "2 ദിവസം മുമ്പ്",
          location: "പച്ചക്കറി തോട്ടം",
          description: "തക്കാളി ചെടികളിൽ കീടനാശം പരിശോധിച്ച് വേപ്പെണ്ണ പ്രയോഗിച്ചു",
          quantity: "2 ലിറ്റർ വേപ്പെണ്ണ",
        },
      ],
    },
  }

  const t = content[language]

  const fetchActivities = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/activities`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch activities");
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error("Failed to create activity");
      
      const newActivity = await response.json();
      setActivities([newActivity, ...activities]);
      setIsModalOpen(false);
      setFormData({
        type: "",
        date: "",
        location: "",
        description: "",
        quantity: "",
        notes: ""
      });
      toast({
        title: "Success",
        description: "Activity added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create activity",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{t.subtitle}</p>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
                  <Plus className="mr-2 h-5 w-5" />
                  {t.addActivity}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t.modal.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t.modal.activityType}</Label>
                    <Select onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sowing">{t.types.sowing.title}</SelectItem>
                        <SelectItem value="irrigation">{t.types.irrigation.title}</SelectItem>
                        <SelectItem value="fertilizer">{t.types.fertilizer.title}</SelectItem>
                        <SelectItem value="pest">{t.types.pest.title}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.modal.date}</Label>
                    <Input 
                      type="datetime-local" 
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.modal.location}</Label>
                    <Input 
                      placeholder={t.modal.placeholders.location} 
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.modal.description}</Label>
                    <Textarea 
                      placeholder={t.modal.placeholders.description} 
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.modal.quantity}</Label>
                    <Input 
                      placeholder={t.modal.placeholders.quantity} 
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.modal.notes}</Label>
                    <Textarea 
                      placeholder={t.modal.placeholders.notes} 
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button className="flex-1 cursor-pointer" onClick={handleSubmit}>
                      <Save className="mr-2 h-4 w-4" />
                      {t.modal.save}
                    </Button>
                    <Button variant="outline" className="cursor-pointer" onClick={() => setIsModalOpen(false)}>
                      {t.modal.cancel}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Activity Types */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">{t.activityTypes}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="text-center p-0">
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                    <Sprout className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">{t.types.sowing.title}</CardTitle>
                  <CardDescription className="text-sm">{t.types.sowing.description}</CardDescription>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="text-center p-0">
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                    <Droplets className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">{t.types.irrigation.title}</CardTitle>
                  <CardDescription className="text-sm">{t.types.irrigation.description}</CardDescription>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="text-center p-0">
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                    <Beaker className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">{t.types.fertilizer.title}</CardTitle>
                  <CardDescription className="text-sm">{t.types.fertilizer.description}</CardDescription>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="text-center p-0">
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                    <Bug className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">{t.types.pest.title}</CardTitle>
                  <CardDescription className="text-sm">{t.types.pest.description}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">{t.recentActivities}</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading activities...</div>
              ) : activities.length === 0 ? (
                <div className="text-center py-4">No activities found. Start by adding one!</div>
              ) : (
                activities.map((activity: any) => (
                  <Card key={activity._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(activity.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-2">{activity.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="font-medium">Location: {activity.location}</span>
                            <span className="font-medium">Quantity: {activity.quantity}</span>
                          </div>
                          {activity.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{activity.notes}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
