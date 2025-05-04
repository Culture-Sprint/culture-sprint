
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

// Function to identify user to Gist
const identifyToGist = (user: User | null) => {
  if (!user) return;

  try {
    // Access the global gist object with proper type checking
    if (typeof window.gist !== 'undefined' && window.gist.identify) {
      window.gist.identify(user.id, {
        "email": user.email,
        "name": user.user_metadata?.full_name || user.email?.split('@')[0] || "",
        "tags": "culturesprintapp",
        "overwrite_tags": false
      });
      console.log("User identified to Gist:", user.id);
    } else {
      console.log("Gist not available for identification");
    }
  } catch (error) {
    console.error("Error identifying user to Gist:", error);
  }
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string, userData?: object) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isPublicRoute: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true);
      
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      
      // Identify user to Gist if they're logged in
      if (data.session?.user) {
        identifyToGist(data.session.user);
      }
      
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Identify user to Gist when auth state changes
        identifyToGist(newSession?.user || null);
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isPublicRoute = () => {
    const path = window.location.pathname;
    return path.includes("submit-story") || 
           path.includes("public-dashboard") || 
           path === "/auth" || 
           path === "/" || 
           path === "/about";
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data.session) {
      // Identify user to Gist after successful sign in
      identifyToGist(data.session.user);
      navigate("/");
    }
    
    return { data: data.session, error };
  };

  const signUp = async (email: string, password: string, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (!error && data.session) {
      // Identify user to Gist after successful sign up
      identifyToGist(data.session.user);
      navigate("/");
    }
    
    return { data: data.session, error };
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
      throw error;
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error signing in with LinkedIn:", error.message);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithLinkedIn,
    signOut,
    isPublicRoute
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
