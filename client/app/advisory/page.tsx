"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { AlertTriangle, CheckCircle, Clock, CloudRain, Bug, Leaf, Calendar, Bell } from "lucide-react"

export default function AdvisoryPage() {
  const [language, setLanguage] = useState("en")

  const content = {
    en: {
      title: "Advisory & Alerts",
      subtitle: "AI-powered recommendations tailored for your farm",
      todaysAdvisory: "Today's Advisory",
      urgentAlerts: "Urgent Alerts",
      upcomingTasks: "Upcoming Tasks",
      weatherAlerts: "Weather Alerts",
      advisories: [
        {
          id: 1,
          type: "weather",
          priority: "high",
          title: "Rain Expected Tomorrow",
          description:
            "Heavy rainfall predicted for tomorrow. Avoid spraying pesticides and ensure proper drainage in your fields.",
          time: "2 hours ago",
          action: "Postpone pesticide application",
        },
        {
          id: 2,
          type: "pest",
          priority: "medium",
          title: "Pest Alert: Brown Plant Hopper",
          description:
            "Brown plant hopper activity detected in nearby rice fields. Monitor your crops closely and consider preventive measures.",
          time: "4 hours ago",
          action: "Inspect rice fields",
        },
        {
          id: 3,
          type: "fertilizer",
          priority: "low",
          title: "Fertilizer Application Due",
          description:
            "Based on your crop calendar, it's time for the second round of fertilizer application for your coconut trees.",
          time: "1 day ago",
          action: "Apply organic fertilizer",
        },
      ],
      alerts: [
        {
          id: 1,
          type: "scheme",
          title: "PM-KISAN Scheme Deadline",
          description:
            "Last date to apply for PM-KISAN scheme benefits is approaching. Submit your application by March 31st.",
          deadline: "5 days left",
        },
        {
          id: 2,
          type: "weather",
          title: "Cyclone Warning",
          description: "Cyclonic storm expected in coastal areas. Secure your crops and livestock.",
          deadline: "2 days",
        },
      ],
      tasks: [
        {
          id: 1,
          title: "Harvest Rice - Field A",
          description: "Rice in Field A is ready for harvest based on growth monitoring",
          dueDate: "Tomorrow",
          priority: "high",
        },
        {
          id: 2,
          title: "Prune Coconut Trees",
          description: "Regular pruning scheduled for coconut grove maintenance",
          dueDate: "In 3 days",
          priority: "medium",
        },
        {
          id: 3,
          title: "Soil Testing",
          description: "Annual soil testing due for nutrient analysis",
          dueDate: "Next week",
          priority: "low",
        },
      ],
      priorities: {
        high: "High",
        medium: "Medium",
        low: "Low",
      },
      types: {
        weather: "Weather",
        pest: "Pest Alert",
        fertilizer: "Fertilizer",
        scheme: "Government Scheme",
      },
    },
    ml: {
      title: "ഉപദേശവും അലേർട്ടുകളും",
      subtitle: "നിങ്ങളുടെ കൃഷിയിടത്തിനായി AI-പവർഡ് ശുപാർശകൾ",
      todaysAdvisory: "ഇന്നത്തെ ഉപദേശം",
      urgentAlerts: "അടിയന്തിര അലേർട്ടുകൾ",
      upcomingTasks: "വരാനിരിക്കുന്ന ജോലികൾ",
      weatherAlerts: "കാലാവസ്ഥാ അലേർട്ടുകൾ",
      advisories: [
        {
          id: 1,
          type: "weather",
          priority: "high",
          title: "നാളെ മഴ പ്രതീക്ഷിക്കുന്നു",
          description: "നാളെ കനത്ത മഴ പ്രതീക്ഷിക്കുന്നു. കീടനാശിനി തളിക്കുന്നത് ഒഴിവാക്കുകയും വയലുകളിൽ ശരിയായ ഡ്രെയിനേജ് ഉറപ്പാക്കുകയും ചെയ്യുക.",
          time: "2 മണിക്കൂർ മുമ്പ്",
          action: "കീടനാശിനി പ്രയോഗം മാറ്റിവയ്ക്കുക",
        },
        {
          id: 2,
          type: "pest",
          priority: "medium",
          title: "കീട അലേർട്ട്: ബ്രൗൺ പ്ലാന്റ് ഹോപ്പർ",
          description:
            "അടുത്തുള്ള നെൽവയലുകളിൽ ബ്രൗൺ പ്ലാന്റ് ഹോപ്പർ പ്രവർത്തനം കണ്ടെത്തി. നിങ്ങളുടെ വിളകൾ സൂക്ഷ്മമായി നിരീക്ഷിക്കുകയും പ്രതിരോധ നടപടികൾ പരിഗണിക്കുകയും ചെയ്യുക.",
          time: "4 മണിക്കൂർ മുമ്പ്",
          action: "നെൽവയലുകൾ പരിശോധിക്കുക",
        },
        {
          id: 3,
          type: "fertilizer",
          priority: "low",
          title: "വള പ്രയോഗം അവശേഷിക്കുന്നു",
          description: "നിങ്ങളുടെ വിള കലണ്ടർ അനുസരിച്ച്, നിങ്ങളുടെ തെങ്ങുകൾക്ക് രണ്ടാം റൗണ്ട് വള പ്രയോഗത്തിന്റെ സമയമായി.",
          time: "1 ദിവസം മുമ്പ്",
          action: "ജൈവവളം പ്രയോഗിക്കുക",
        },
      ],
      alerts: [
        {
          id: 1,
          type: "scheme",
          title: "PM-KISAN പദ്ധതി സമയപരിധി",
          description:
            "PM-KISAN പദ്ധതി ആനുകൂല്യങ്ങൾക്ക് അപേക്ഷിക്കാനുള്ള അവസാന തീയതി അടുത്തുവരുന്നു. മാർച്ച് 31-നകം നിങ്ങളുടെ അപേക്ഷ സമർപ്പിക്കുക.",
          deadline: "5 ദിവസം ബാക്കി",
        },
        {
          id: 2,
          type: "weather",
          title: "ചുഴലിക്കാറ്റ് മുന്നറിയിപ്പ്",
          description: "തീരപ്രദേശങ്ങളിൽ ചുഴലിക്കാറ്റ് പ്രതീക്ഷിക്കുന്നു. നിങ്ങളുടെ വിളകളും കന്നുകാലികളും സുരക്ഷിതമാക്കുക.",
          deadline: "2 ദിവസം",
        },
      ],
      tasks: [
        {
          id: 1,
          title: "നെല്ല് വിളവെടുപ്പ് - വയൽ A",
          description: "വളർച്ച നിരീക്ഷണത്തിന്റെ അടിസ്ഥാനത്തിൽ വയൽ A-യിലെ നെല്ല് വിളവെടുപ്പിന് തയ്യാറാണ്",
          dueDate: "നാളെ",
          priority: "high",
        },
        {
          id: 2,
          title: "തെങ്ങ് വെട്ടിമാറ്റൽ",
          description: "തെങ്ങിൻ തോപ്പിന്റെ പരിപാലനത്തിനായി പതിവ് വെട്ടിമാറ്റൽ ഷെഡ്യൂൾ ചെയ്തു",
          dueDate: "3 ദിവസത്തിനുള്ളിൽ",
          priority: "medium",
        },
        {
          id: 3,
          title: "മണ്ണ് പരിശോധന",
          description: "പോഷക വിശകലനത്തിനായി വാർഷിക മണ്ണ് പരിശോധന അവശേഷിക്കുന്നു",
          dueDate: "അടുത്ത ആഴ്ച",
          priority: "low",
        },
      ],
      priorities: {
        high: "ഉയർന്നത്",
        medium: "ഇടത്തരം",
        low: "കുറഞ്ഞത്",
      },
      types: {
        weather: "കാലാവസ്ഥ",
        pest: "കീട അലേർട്ട്",
        fertilizer: "വളം",
        scheme: "സർക്കാർ പദ്ധതി",
      },
    },
  }

  const t = content[language]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weather":
        return <CloudRain className="h-5 w-5" />
      case "pest":
        return <Bug className="h-5 w-5" />
      case "fertilizer":
        return <Leaf className="h-5 w-5" />
      case "scheme":
        return <Calendar className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-lg text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Advisory */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6">{t.todaysAdvisory}</h2>
              <div className="space-y-4">
                {t.advisories.map((advisory) => (
                  <Card key={advisory.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">{getTypeIcon(advisory.type)}</div>
                          <div>
                            <CardTitle className="text-lg">{advisory.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={getPriorityColor(advisory.priority)}>
                                {t.priorities[advisory.priority]}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{advisory.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">{advisory.description}</CardDescription>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {advisory.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Urgent Alerts */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">{t.urgentAlerts}</h3>
                <div className="space-y-3">
                  {t.alerts.map((alert) => (
                    <Card key={alert.id} className="border-destructive/20">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{alert.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                            <Badge variant="destructive" className="mt-2 text-xs">
                              {alert.deadline}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">{t.upcomingTasks}</h3>
                <div className="space-y-3">
                  {t.tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-medium">{task.dueDate}</span>
                              <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                {t.priorities[task.priority]}
                              </Badge>
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
        </div>
      </div>
    </LayoutWrapper>
  )
}
