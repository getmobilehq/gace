import { getSupabaseClient } from "./client";
import type { UserProfile } from "./client";
import { projectId, publicAnonKey } from "./info";

// Auth service for sign up, sign in, and user management
export const authService = {
  /**
   * Sign up a new user using server-side endpoint
   * This auto-confirms emails and creates both auth user and profile atomically
   */
  async signUp(
    email: string,
    password: string,
    userData: {
      fullName: string;
      userType: "end-user" | "accountant" | "admin";
      companyName?: string;
    }
  ) {
    const supabase = getSupabaseClient();

    try {
      console.log("[Auth] Starting signup via server API for:", email);
      
      // Use server-side signup endpoint which creates both auth user and profile
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8/auth/signup`;
      
      const signupResponse = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: email,
          password: password,
          fullName: userData.fullName,
          userType: userData.userType,
          companyName: userData.companyName || null,
        }),
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json().catch(() => ({ error: 'Unknown error' }));
        console.error("[Auth] Signup error from server:", errorData);
        
        // Handle 404 - Edge Function not deployed
        if (signupResponse.status === 404) {
          const deployError = new Error(
            "SERVER_NOT_DEPLOYED: The backend server hasn't been deployed yet. " +
            "Please deploy the Edge Function to Supabase. " +
            "Visit: https://supabase.com/dashboard/project/" + projectId + "/functions " +
            "and deploy the 'server' function. " +
            "Or run: supabase functions deploy server"
          );
          (deployError as any).code = "SERVER_NOT_DEPLOYED";
          return { data: null, error: deployError };
        }
        
        // Handle specific errors
        if (signupResponse.status === 409 || errorData.error?.includes("already registered")) {
          return { 
            data: null, 
            error: new Error("This email is already registered. Please sign in instead or use a different email.") 
          };
        }
        
        if (errorData.error?.includes("table") || errorData.error?.includes("relation")) {
          const setupError = new Error(
            "DATABASE_NOT_SETUP: The database tables haven't been created yet. " +
            "Please run the SQL setup script at /supabase/setup.sql in your Supabase SQL Editor. " +
            `Visit: https://supabase.com/dashboard/project/${projectId}/sql`
          );
          (setupError as any).code = "DATABASE_NOT_SETUP";
          return { data: null, error: setupError };
        }
        
        return { 
          data: null, 
          error: new Error(errorData.error || `Server error (${signupResponse.status}): ${signupResponse.statusText}`) 
        };
      }

      const responseData = await signupResponse.json();
      console.log("[Auth] Signup successful, now signing in user...");

      // Now sign in the user to get a session
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("[Auth] Auto sign-in after signup failed:", signInError);
        // Signup was successful but auto sign-in failed
        // User can still manually sign in
        return { 
          data: responseData, 
          error: new Error("Account created successfully, but auto sign-in failed. Please sign in manually.") 
        };
      }

      console.log("✅ Signup and sign-in completed successfully");
      return { data: authData, error: null };

    } catch (error: any) {
      console.error("[Auth] Unexpected signup error:", error);
      return { data: null, error };
    }
  },

  /**
   * Sign in existing user
   */
  async signIn(email: string, password: string) {
    const supabase = getSupabaseClient();

    try {
      console.log("[Auth] Signing in user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("[Auth] Sign in error:", error);
        
        // Provide helpful error messages
        if (error.message?.includes("Invalid login credentials")) {
          return { 
            data: null, 
            error: new Error("Invalid email or password. Please check your credentials and try again.") 
          };
        }
        
        if (error.message?.includes("Email not confirmed")) {
          return { 
            data: null, 
            error: new Error("Please confirm your email address before signing in.") 
          };
        }
        
        return { data: null, error };
      }

      console.log("✅ Sign in successful");
      return { data, error: null };
    } catch (error: any) {
      console.error("[Auth] Unexpected sign in error:", error);
      return { data: null, error };
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Unexpected sign out error:", error);
      throw error;
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Get session error:", error);
        return { session: null, error };
      }

      return { session: data.session, error: null };
    } catch (error: any) {
      console.error("Unexpected get session error:", error);
      return { session: null, error };
    }
  },

  /**
   * Get user profile from database
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

      if (error) {
        console.error("Error fetching user profile:", error);
        
        // Check if it's a "table not found" error
        if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
          const setupError = new Error("DATABASE_NOT_SETUP");
          (setupError as any).code = "DATABASE_NOT_SETUP";
          throw setupError;
        }
        
        throw error;
      }

      // If no profile exists, return null instead of throwing
      if (!data) {
        console.warn("User profile not found for userId:", userId);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Create or update user profile (upsert)
   * Useful for fixing missing profiles
   */
  async upsertUserProfile(
    userId: string,
    profileData: {
      email: string;
      userType: "end-user" | "accountant" | "admin";
      fullName: string;
      companyName?: string;
    }
  ) {
    try {
      // Use server API to bypass RLS
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8/auth/create-profile`;
      
      const profileResponse = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          userId: userId,
          email: profileData.email,
          fullName: profileData.fullName,
          userType: profileData.userType,
          companyName: profileData.companyName || null,
        }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        console.error("Error upserting user profile via API:", errorData);
        
        // If profile already exists (409), that's actually OK for upsert
        if (profileResponse.status === 409) {
          console.log("Profile already exists, fetching it...");
          // Fetch the existing profile
          const existingProfile = await this.getUserProfile(userId);
          if (existingProfile) {
            return { data: existingProfile, error: null };
          }
        }
        
        throw new Error(errorData.error || "Failed to upsert profile");
      }

      const { profile } = await profileResponse.json();
      return { data: profile as UserProfile, error: null };
    } catch (error: any) {
      console.error("Unexpected error upserting profile:", error);
      return { data: null, error };
    }
  },

  /**
   * Mark user onboarding as complete
   */
  async completeOnboarding(userId: string) {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ has_completed_onboarding: true })
        .eq("id", userId);

      if (error) {
        console.error("Error completing onboarding:", error);
        throw error;
      }
    } catch (error) {
      console.error("Unexpected error completing onboarding:", error);
      throw error;
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (session: any) => void) {
    const supabase = getSupabaseClient();

    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },
};