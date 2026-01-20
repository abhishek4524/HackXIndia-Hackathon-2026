"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mic,
  UserPlus,
  Users,
  FileText,
  Cloud,
  Bell,
  ChevronDown,
  Calendar,
  Shield,
  TrendingUp,
  Sprout,
} from "lucide-react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { useLanguage } from "@/contexts/language-context";
import Products from "@/components/ui/products";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <section className="bgImage relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center overflow-hidden">
        <div className="max-w-4xl mx-auto text-center z-10 ">
          <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-6">
            <Sprout className="mr-2 h-4 w-4" />
            {t("home.hero.subtitle")}
          </div>

          <h1
            className="border p-4 md:p-6 text-4xl md:text-6xl font-bold text-white mb-6 
             bg-black/10 backdrop-blur-md rounded-2xl shadow-lg text-shadow-lg"
          >
            {t("home.hero.title")}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI-powered agricultural assistance in different languages for India's farmers
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/krishi-sakhi-chat">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all w-full bg-green-600 hover:bg-green-700"
              >
                <Mic className="mr-3 h-6 w-6" />
                {t("dashboard.voiceButton")}
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-xl border-green-600 text-green-600 hover:bg-green-50 hover:text-green-800"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                {t("home.hero.registerButton")}
              </Button>
            </Link>
          </div>

          <div className="animate-bounce flex justify-center">
            <ChevronDown className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("home.features.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive digital tools designed specifically for India's
              agricultural needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/profile">
              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-0 shadow-md">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl text-green-800">
                    {t("home.features.profiling.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t("home.features.profiling.description")}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/activity">
              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-0 shadow-md">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-blue-800">
                    {t("home.features.tracking.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t("home.features.tracking.description")}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/advisory">
              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-0 shadow-md">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-amber-100 rounded-full w-fit">
                    <Cloud className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl text-amber-800">
                    {t("home.features.advisory.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t("home.features.advisory.description")}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/advisory">
              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-0 shadow-md">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-red-100 rounded-full w-fit">
                    <Bell className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-xl text-red-800">
                    {t("home.features.alerts.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t("home.features.alerts.description")}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>


      {/* Impact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t("home.impact.title")}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("home.impact.description")}
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Increased Yield</h3>
              <p className="text-sm text-muted-foreground">
                Up to 30% improvement with timely advice
              </p>
            </div>

            <div className="p-4">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Reduced Losses</h3>
              <p className="text-sm text-muted-foreground">
                Early pest and disease detection
              </p>
            </div>

            <div className="p-4">
              <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Better Planning</h3>
              <p className="text-sm text-muted-foreground">
                Seasonal guidance and reminders
              </p>
            </div>

            <div className="p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold mb-2">Higher Income</h3>
              <p className="text-sm text-muted-foreground">
                Market insights and better pricing
              </p>
            </div>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
