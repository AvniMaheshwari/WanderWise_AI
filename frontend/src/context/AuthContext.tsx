import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { UserProfile } from '../types/itinerary';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isDemoUser: boolean;
  isSupabaseLive: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'wanderwise_active_demo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);
  const isSupabaseLive = isSupabaseConfigured();

  useEffect(() => {
    // 1. Check if real Supabase session exists
    if (isSupabaseLive && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'traveler@wanderwise.ai',
            fullName: session.user.user_metadata?.full_name || 'Adventurer',
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
          setIsDemoUser(false);
        } else {
          checkSavedDemoUser();
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || 'Adventurer',
          });
          setIsDemoUser(false);
        } else {
          checkSavedDemoUser();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. Demo mode
      checkSavedDemoUser();
      setIsLoading(false);
    }
  }, [isSupabaseLive]);

  const checkSavedDemoUser = () => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
        setIsDemoUser(true);
      } else {
        // Set default demo user for frictionless instant preview experience!
        const defaultDemo: UserProfile = {
          id: 'demo-user-wanderer-42',
          email: 'alex.wanderer@example.com',
          fullName: 'Alex Vance',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          homeCurrency: 'USD',
        };
        setUser(defaultDemo);
        setIsDemoUser(true);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(defaultDemo));
      }
    } catch {
      setUser(null);
    }
  };

  const loginAsDemo = () => {
    const demoUser: UserProfile = {
      id: 'demo-user-wanderer-42',
      email: 'alex.wanderer@example.com',
      fullName: 'Alex Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      homeCurrency: 'USD',
    };
    setUser(demoUser);
    setIsDemoUser(true);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
  };

  const signIn = async (email: string, password?: string): Promise<{ error?: string }> => {
    if (isSupabaseLive && supabase && password) {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        });
        setIsDemoUser(false);
        localStorage.removeItem(DEMO_USER_KEY);
      }
      return {};
    }

    // Demo sign in
    const demoUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    setUser(demoUser);
    setIsDemoUser(true);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    return {};
  };

  const signUp = async (email: string, password?: string, fullName?: string): Promise<{ error?: string }> => {
    if (isSupabaseLive && supabase && password) {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          fullName: fullName || email.split('@')[0],
        });
        setIsDemoUser(false);
      }
      return {};
    }

    // Demo sign up
    const demoUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: fullName || email.split('@')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    setUser(demoUser);
    setIsDemoUser(true);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    return {};
  };

  const signOut = async () => {
    if (isSupabaseLive && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsDemoUser(false);
    localStorage.removeItem(DEMO_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isDemoUser,
        isSupabaseLive,
        signIn,
        signUp,
        signOut,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
