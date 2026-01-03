"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { showLoading, dismissToast, showError } from '@/utils/toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setLoading(false);

        if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (currentSession && location.pathname === '/login') {
            navigate('/home'); // Redirect to home if already logged in and on login page
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
      // If no session and not on login or landing page, redirect to login
      if (!session && location.pathname !== '/login' && location.pathname !== '/') {
        navigate('/login');
      } else if (session && location.pathname === '/login') {
        navigate('/home'); // If session exists and on login page, redirect to home
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]); // Add location.pathname to dependencies

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    if (!loading && !user) {
      // If not loading and no user, redirect to login, preserving the attempted path
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
};