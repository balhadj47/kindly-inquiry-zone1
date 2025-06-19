
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Ensure React hooks are available
if (!useState || !useContext || !useEffect) {
  console.error('❌ CRITICAL: React hooks not available in AuthContext');
  throw new Error('React hooks not available');
}

console.log('🔧 AuthContext: React hooks validation passed');

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🔧 AuthProvider: Starting initialization...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    // Prevent re-initialization on tab focus
    if (initialized.current) {
      console.log("Auth already initialized, skipping...");
      return;
    }

    console.log("Initializing auth state...");
    initialized.current = true;

    // Check for existing session first
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
      }
      console.log("Initial session check:", session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []); // Empty dependency array to run only once

  const signIn = async (email: string, password: string) => {
    console.log("Attempting sign in for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Sign in result:", { data, error });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    console.log("Attempting sign up for:", email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    console.log("Sign up result:", { data, error });
    return { error };
  };

  const signOut = async () => {
    console.log("Attempting sign out");
    try {
      const { error } = await supabase.auth.signOut();
      console.log("Sign out result:", { error });
      
      // Force clear local state regardless of error
      setSession(null);
      setUser(null);
      
      return { error };
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      // Force clear local state even on unexpected errors
      setSession(null);
      setUser(null);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
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
