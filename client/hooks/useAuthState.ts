// hooks/useAuthState.ts
"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

export function useAuthState() {
  const { isAuthenticated, user, loading } = useAuth();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null as any,
    loading: true
  });

  useEffect(() => {
    setAuthState({
      isAuthenticated,
      user,
      loading
    });
  }, [isAuthenticated, user, loading]);

  return authState;
}