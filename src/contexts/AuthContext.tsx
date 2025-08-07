
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Critical validation: Ensure React hooks are available
if (!React || !React.useState || !React.useContext || !React.useEffect) {
  console.error('❌ CRITICAL: React hooks not available in AuthContext');
  throw new Error('React hooks not available in AuthContext');
}

console.log('✅ AuthContext: React hooks validation passed');

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: { name?: string; role_id?: number }) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Known admin emails - these will always get Administrator privileges (role_id: 1)
const ADMIN_EMAILS = [
  'gb47@msn.com',
  'admin@example.com'
];

const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

const getRoleIdForEmail = (email: string): number => {
  if (isAdminEmail(email)) {
    return 1; // Administrator
  }
  return 2; // Default to Supervisor for non-admin auth users
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🔧 AuthProvider: Starting initialization...');
  
  // Validate React hooks are working
  try {
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

    const signUp = async (email: string, password: string, userData?: { name?: string; role_id?: number }) => {
      const redirectUrl = `${window.location.origin}/`;
      console.log("Attempting sign up for:", email);
      
      // Determine role_id based on email or provided userData
      const roleId = userData?.role_id || getRoleIdForEmail(email);
      const name = userData?.name || email.split('@')[0];
      
      console.log("Setting up user with role_id:", roleId);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
            role_id: roleId
          }
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
  } catch (error) {
    console.error('❌ CRITICAL: Error in AuthProvider:', error);
    // Return a fallback provider
    return (
      <AuthContext.Provider value={{
        user: null,
        session: null,
        loading: false,
        signIn: async () => ({ error: new Error('Auth not available') }),
        signUp: async () => ({ error: new Error('Auth not available') }),
        signOut: async () => ({ error: new Error('Auth not available') }),
      }}>
        {children}
      </AuthContext.Provider>
    );
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
