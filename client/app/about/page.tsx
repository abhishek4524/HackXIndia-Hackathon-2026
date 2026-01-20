"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Users, Target, Award, Heart, Leaf, Shield, Zap, Globe, TrendingUp, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  const { t } = useLanguage()

  // Enhanced animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  return (
    <LayoutWrapper>
      {/* Hero Section with gradient background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <motion.div
          className="relative py-24 px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6"
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
            >
              <Leaf className="h-6 w-6 text-primary" />
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
              variants={fadeUp}
            >
              {t("about.title")}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeUp}
              custom={1}
            >
              {t("about.subtitle")}
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-10"
              variants={fadeUp}
              custom={2}
            >
              {[
                { icon: <Shield className="h-4 w-4" />, text: t("about.trusted") },
                { icon: <Zap className="h-4 w-4" />, text: t("about.realtime") },
                { icon: <Globe className="h-4 w-4" />, text: t("about.accessibility") },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--primary)/0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {badge.icon}
                  <span className="text-sm font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Vision & Mission - Enhanced */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.ourCore")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("about.coreDescription")}
            </p>
          </motion.div>

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
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -8 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-50`} />
                  <div className="relative p-8">
                    <CardHeader className="p-0 mb-6">
                      <motion.div
                        className="flex items-center space-x-4 mb-6"
                        animate="animate"
                        variants={floatAnimation}
                      >
                        <div className="p-4 bg-primary/10 rounded-2xl backdrop-blur-sm">
                          {item.icon}
                        </div>
                        <CardTitle className="text-2xl md:text-3xl">{item.title}</CardTitle>
                      </motion.div>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with enhanced visual hierarchy */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card to-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeUp}>
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.features.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("about.features.subtitle")}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
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
              <motion.div
                key={i}
                variants={fadeUp}
                custom={feature.delay}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card className="h-full border hover:border-primary/20 transition-all duration-300 group hover:shadow-xl">
                  <CardHeader>
                    <motion.div
                      className="flex items-center space-x-3 mb-4"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Stats with animated counters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.impact.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("about.impact.subtitle")}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
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
              <motion.div
                key={i}
                className="text-center"
                variants={scaleIn}
                custom={i * 0.1}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`${stat.color} mb-4 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <motion.div
                    className="text-4xl md:text-5xl font-bold mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    {stat.number}
                    <span className="text-primary">{stat.suffix}</span>
                  </motion.div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </LayoutWrapper>
  )
}