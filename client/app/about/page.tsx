"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Users, Target, Award, Heart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
    }),
  }

  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            variants={fadeUp}
          >
            {t("about.title")}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
            variants={fadeUp}
            custom={1}
          >
            {t("about.subtitle")}
          </motion.p>
        </div>
      </motion.section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {[ 
            { icon: <Target className="h-6 w-6 text-primary" />, title: t("about.vision.title"), desc: t("about.vision.description") },
            { icon: <Heart className="h-6 w-6 text-primary" />, title: t("about.mission.title"), desc: t("about.mission.description") },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Card className="p-8 hover:shadow-xl hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {item.icon}
                    </div>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {item.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="max-w-6xl mx-auto text-center mb-16" variants={fadeUp}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("about.features.title")}
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { icon: <Users className="h-5 w-5 text-primary" />, title: t("about.features.voice.title"), desc: t("about.features.voice.description") },
            { icon: <Target className="h-5 w-5 text-primary" />, title: t("about.features.personalized.title"), desc: t("about.features.personalized.description") },
            { icon: <Award className="h-5 w-5 text-primary" />, title: t("about.features.realtime.title"), desc: t("about.features.realtime.description") },
            { icon: <Heart className="h-5 w-5 text-primary" />, title: t("about.features.local.title"), desc: t("about.features.local.description") },
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeUp} custom={i * 0.2}>
              <Card className="p-6 hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">{feature.icon}</div>
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Impact Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-12" variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.impact.title")}
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={fadeUp}
            custom={1}
          >
            {[
              { number: "10,000+", label: t("about.impact.farmers") },
              { number: "24/7", label: t("about.impact.advisory") },
              { number: "2", label: t("about.impact.languages") },
              { number: "14", label: t("about.impact.coverage") },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                variants={fadeUp}
                custom={i * 0.2}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </LayoutWrapper>
  )
}
