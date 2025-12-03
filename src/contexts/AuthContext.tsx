import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../utils/supabase/auth.ts";
import type { UserProfile } from "../utils/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData: {
      fullName: string;
      userType: "end-user" | "accountant" | "admin";
      companyName?: string;
    }
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session and user profile on mount
  useEffect(() => {
    loadSession();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (newSession) => {
      console.log("Auth state changed:", newSession ? "logged in" : "logged out");
      setSession(newSession);

      if (newSession?.user) {
        await loadUserProfile(newSession.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadSession = async () => {
    try {
      setLoading(true);
      const { session: currentSession } = await authService.getSession();
      setSession(currentSession);

      if (currentSession?.user) {
        await loadUserProfile(currentSession.user.id);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("Loading user profile for ID:", userId);
      const profile = await authService.getUserProfile(userId);
      
      // If profile doesn't exist, something went wrong during signup
      if (!profile) {
        console.warn("Profile not found for user:", userId);
        console.warn("This usually means the profile wasn't created during signup.");
        console.warn("User should sign up again or contact support.");
        setUser(null);
        return;
      }
      
      console.log("✅ Profile loaded successfully:", profile);
      setUser(profile);
    } catch (error: any) {
      console.error("Error loading user profile:", error);
      setUser(null);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: {
      fullName: string;
      userType: "end-user" | "accountant" | "admin";
      companyName?: string;
    }
  ) => {
    try {
      console.log("[AuthContext] Signup started for:", email);
      const { data, error } = await authService.signUp(email, password, userData);

      if (error) {
        console.error("[AuthContext] Signup error:", error);
        
        // Enhance specific error messages
        if (error.message?.includes("already registered")) {
          return { 
            error: { 
              ...error, 
              message: "This email is already registered. Please sign in instead or use a different email." 
            } 
          };
        }
        
        if (error.message?.includes("you can only request this after") || 
            error.message?.includes("rate limit")) {
          return { 
            error: { 
              ...error, 
              message: "Too many signup attempts. Please wait a few seconds and try again." 
            } 
          };
        }
        
        if (error.message?.includes("auto sign-in failed")) {
          return { 
            error: { 
              ...error, 
              message: "Account created successfully! Please sign in manually to continue." 
            } 
          };
        }
        
        return { error };
      }

      console.log("[AuthContext] Signup successful");
      // Profile will be loaded via onAuthStateChange
      return { error: null };
    } catch (error) {
      console.error("[AuthContext] Unexpected signup error:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[AuthContext] Sign in started for:", email);
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        console.error("[AuthContext] Sign in error:", error);
        return { error };
      }

      console.log("[AuthContext] Sign in successful");
      // Session and profile will be loaded via onAuthStateChange
      return { error: null };
    } catch (error) {
      console.error("[AuthContext] Unexpected sign in error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      await loadUserProfile(session.user.id);
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};