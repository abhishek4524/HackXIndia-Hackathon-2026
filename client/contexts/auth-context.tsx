"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LoginData, LoginResponse, registerUser, loginUser, UserData as ApiUserData, API_BASE_URL } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  phone?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (credentials: LoginData) => Promise<void>
  register: (userData: UserData) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface UserData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check authentication on mount and add storage event listener
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        console.log('Auth check - Token:', token, 'User data:', userData);

        // If token exists, try to refresh user from backend to ensure fresh username
        if (token) {
          // Attempt to fetch profile from backend
          (async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/profile`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              })

              if (res.ok) {
                const data = await res.json()
                const freshUser: User = {
                  id: data._id || data.id,
                  name: data.name,
                  email: data.email
                }
                localStorage.setItem('user', JSON.stringify(freshUser))
                setIsAuthenticated(true)
                setUser(freshUser)
                console.log('Auth check - refreshed user from backend:', freshUser)
                return
              }
            } catch (err) {
              console.error('Auth check - failed to refresh profile:', err)
            }

            // If backend refresh failed, fallback to localStorage user parsing
            if (userData) {
              try {
                const parsedUser = JSON.parse(userData) as User;
                if (parsedUser.id && parsedUser.name && parsedUser.email) {
                  setIsAuthenticated(true)
                  setUser(parsedUser)
                  console.log('Auth check - using cached user:', parsedUser);
                  return
                }
              } catch (error) {
                console.error('Error parsing user data:', error);
              }
            }

            // No valid user -> clear auth
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          })()
        } else {
          console.log('No auth tokens found');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false)
    }

    checkAuth();

    // Add event listener for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [])

  const login = async (credentials: LoginData) => {
    try {
      setLoading(true);
      const response: LoginResponse = await loginUser(credentials)
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        setIsAuthenticated(true)
        setUser(response.user)
        console.log('Login successful:', response.user);
      }
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const register = async (userData: UserData) => {
    try {
      setLoading(true);
      const response = await registerUser(userData as ApiUserData);
      
      if (response.user) {
        const loginCredentials: LoginData = {
          email: userData.email,
          password: userData.password
        };
        
        await login(loginCredentials);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    
    // Force a hard refresh to ensure all components reset
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}