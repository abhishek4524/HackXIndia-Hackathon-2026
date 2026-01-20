"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { API_BASE_URL } from '@/lib/api'
import { User, Calendar } from "lucide-react"

interface FarmerProfile {
  _id: string
  name: string
  email: string
  phone?: string
  createdAt?: string
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user: authUser, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<FarmerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log('Fetching profile with token:', token)
        
        if (!token) {
          console.log('No token found in localStorage')
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:5000/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        console.log('Profile API response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Profile data received:', data)
          setProfile(data)
        } else {
          const errorData = await response.json()
          console.log('Profile fetch error:', errorData)
          alert('Failed to fetch profile: ' + (errorData.error || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        alert('Network error: Could not fetch profile')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && authUser) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, authUser])

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="ml-4">Loading profile...</p>
        </div>
      </LayoutWrapper>
    )
  }

  if (!isAuthenticated) {
    return (
      <LayoutWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t("profile.title") || "Farmer Profile"}
          </h1>
          <p className="text-muted-foreground">
            {t("profile.subtitle") || "Your personal information"}
          </p>
        </div>

        <Card className="max-w-3xl mx-auto shadow-lg border border-border">
          <CardHeader className="text-center">
            <User className="h-10 w-10 mx-auto text-primary mb-2" />
            <CardTitle className="text-2xl">{profile?.name || 'Not set'}</CardTitle>
            <CardDescription>{profile?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Full Name</h3>
                <p className="text-lg">{profile?.name || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Phone</h3>
                <p className="text-lg">{profile?.phone || 'Not set'}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-semibold flex items-center justify-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Member Since
              </h3>
              <p className="text-lg mt-1">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  )
}
