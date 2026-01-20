"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Users, Target, Award, Heart, Leaf, Shield, Zap, Globe, TrendingUp, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t } = useLanguage()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewJSON, setPreviewJSON] = useState<any>(null)

  const togglePreview = async () => {
    if (!previewOpen && !previewJSON) {
      try {
        const mod = await import("@/locales/en/common.json")
        setPreviewJSON(mod.default || mod)
      } catch (e) {
        console.error("Failed to load preview JSON", e)
      }
    }
    setPreviewOpen((s) => !s)
  }

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]')) as HTMLElement[]
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = Number(el.dataset.delay || 0) * 100
            setTimeout(() => {
              el.classList.remove('opacity-0', 'translate-y-6')
              el.classList.add('opacity-100', 'translate-y-0')
            }, delay)
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.08, rootMargin: '-100px' },
    )

    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <LayoutWrapper>
      {/* Hero Section with gradient background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div
          className="relative py-24 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-6 transition-all duration-700 ease-out"
          data-reveal
        >
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 hover:scale-105 transition-transform"
              data-reveal
              data-delay="0"
            >
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 opacity-0 translate-y-6 transition-all duration-700 ease-out"
              data-reveal
              data-delay="1"
            >
              {t('about.title')}
            </h1>
            <p
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed opacity-0 translate-y-6 transition-all duration-700 ease-out"
              data-reveal
              data-delay="2"
            >
              {t('about.subtitle')}
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={togglePreview}
                className="px-4 py-2 rounded-md bg-primary text-white text-sm hover:brightness-90"
              >
                {previewOpen ? 'Hide text preview' : 'Show text preview'}
              </button>
            </div>
            {previewOpen && previewJSON && (
              <div className="mt-6 max-w-3xl mx-auto text-left bg-muted p-4 rounded-md overflow-auto">
                <pre className="whitespace-pre-wrap text-sm">
{JSON.stringify(previewJSON.about, null, 2)}
                </pre>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-4 mt-10" data-reveal data-delay="3">
              {[
                { icon: <Shield className="h-4 w-4" />, text: t("about.trusted") },
                { icon: <Zap className="h-4 w-4" />, text: t("about.realtime") },
                { icon: <Globe className="h-4 w-4" />, text: t("about.accessibility") },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border hover:scale-105 transition-transform"
                >
                  {badge.icon}
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Enhanced */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 opacity-0 translate-y-6 transition-all duration-700 ease-out" data-reveal data-delay="0">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.ourCore")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("about.coreDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                icon: <Target className="h-8 w-8 text-primary" />,
                title: t("about.vision.title"),
                desc: t("about.vision.description"),
                color: "from-blue-500/10 to-primary/10",
                highlight: t("about.vision.highlight"),
              },
              {
                icon: <Heart className="h-8 w-8 text-primary" />,
                title: t("about.mission.title"),
                desc: t("about.mission.description"),
                color: "from-red-500/10 to-primary/10",
                highlight: t("about.mission.highlight"),
              },
            ].map((item, i) => (
              <div key={i} className="opacity-0 translate-y-6 transition-all duration-700 ease-out" data-reveal data-delay={`${i}`}>
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-50`} />
                  <div className="relative p-8">
                    <CardHeader className="p-0 mb-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-4 bg-primary/10 rounded-2xl backdrop-blur-sm">
                          {item.icon}
                        </div>
                        <CardTitle className="text-2xl md:text-3xl">{item.title}</CardTitle>
                      </div>
                      <div className="text-primary font-semibold mb-4 text-lg">
                        {item.highlight}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CardDescription className="text-base leading-relaxed text-muted-foreground">
                        {item.desc}
                      </CardDescription>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with enhanced visual hierarchy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card to-background" data-reveal>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 opacity-0 translate-y-6 transition-all duration-700 ease-out" data-reveal data-delay="0">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.features.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("about.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="h-6 w-6 text-primary" />,
                title: t("about.features.voice.title"),
                desc: t("about.features.voice.description"),
                delay: 0,
              },
              {
                icon: <Target className="h-6 w-6 text-primary" />,
                title: t("about.features.personalized.title"),
                desc: t("about.features.personalized.description"),
                delay: 0.1,
              },
              {
                icon: <Clock className="h-6 w-6 text-primary" />,
                title: t("about.features.realtime.title"),
                desc: t("about.features.realtime.description"),
                delay: 0.2,
              },
              {
                icon: <Globe className="h-6 w-6 text-primary" />,
                title: t("about.features.local.title"),
                desc: t("about.features.local.description"),
                delay: 0.3,
              },
              {
                icon: <Shield className="h-6 w-6 text-primary" />,
                title: t("about.features.secure.title"),
                desc: t("about.features.secure.description"),
                delay: 0.4,
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-primary" />,
                title: t("about.features.analytics.title"),
                desc: t("about.features.analytics.description"),
                delay: 0.5,
              },
            ].map((feature, i) => (
              <div key={i} className="opacity-0 translate-y-6 transition-all duration-700 ease-out" data-reveal data-delay={`${feature.delay}`}>
                <Card className="h-full border hover:border-primary/20 transition-all duration-300 group hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats with simple reveal */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 opacity-0 translate-y-6 transition-all duration-700 ease-out" data-reveal data-delay="0">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.impact.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("about.impact.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "10,000+",
                label: t("about.impact.farmers"),
                icon: <Users className="h-8 w-8" />,
                suffix: "+",
                color: "text-blue-500",
              },
              {
                number: "24/7",
                label: t("about.impact.advisory"),
                icon: <Clock className="h-8 w-8" />,
                suffix: "",
                color: "text-green-500",
              },
              {
                number: "2",
                label: t("about.impact.languages"),
                icon: <Globe className="h-8 w-8" />,
                suffix: "+",
                color: "text-purple-500",
              },
              {
                number: "14",
                label: t("about.impact.coverage"),
                icon: <Target className="h-8 w-8" />,
                suffix: " districts",
                color: "text-orange-500",
              },
            ].map((stat, i) => (
              <div key={i} className="text-center opacity-0 translate-y-6 transition-all duration-700 ease-out" data-reveal data-delay={`${i}`}>
                <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`${stat.color} mb-4 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                    <span className="text-primary">{stat.suffix}</span>
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LayoutWrapper>
  )
}