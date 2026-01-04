"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { showLoading, dismissToast, showError } from '@/utils/toast';

interface UserProfile {
  id: string;
  role: 'patient' | 'rider' | 'admin' | 'pharmacy' | 'doctor' | 'caregiver';
  is_blocked: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, is_blocked')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as UserProfile;
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        if (currentSession) {
          setUser(currentSession.user);
          const userProfile = await fetchProfile(currentSession.user.id);
          setProfile(userProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);

        if (event === 'SIGNED_OUT') {
          router.push('/login');
        } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (currentSession && pathname === '/login') {
            // Redirect based on user role
            const userProfile = await fetchProfile(currentSession.user.id);
            if (userProfile) {
              switch (userProfile.role) {
                case 'admin':
                  router.push('/admin-dashboard');
                  break;
                case 'pharmacy':
                  router.push('/pharmacy');
                  break;
                case 'rider':
                  router.push('/rider-dashboard');
                  break;
                default:
                  router.push('/home');
              }
            } else {
              router.push('/home');
            }
          }
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);

      if (!session && pathname !== '/login' && pathname !== '/') {
        router.push('/login');
      } else if (session && pathname === '/login') {
        // Redirect based on user role
        const userProfile = await fetchProfile(session.user.id);
        if (userProfile) {
          switch (userProfile.role) {
            case 'admin':
              router.push('/admin-dashboard');
              break;
            case 'pharmacy':
              router.push('/pharmacy');
              break;
            case 'rider':
              router.push('/rider-dashboard');
              break;
            default:
              router.push('/home');
          }
        } else {
          router.push('/home');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ session, user, profile, loading }}>
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

export const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: UserProfile['role'][] }) => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // For simple migration, we just redirect to login without complex state
      router.push('/login');
    } else if (!loading && user && profile && allowedRoles && !allowedRoles.includes(profile.role)) {
      showError("You don't have permission to access this page.");
      router.push('/home'); // Redirect to home if not authorized
    }
  }, [user, profile, loading, router, pathname, allowedRoles]);

  if (loading || !user || !profile || (allowedRoles && !allowedRoles.includes(profile.role))) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
};