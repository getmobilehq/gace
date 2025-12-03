import { getSupabaseClient } from "./client";
import type { UserProfile } from "./client";
import { projectId, publicAnonKey } from "./info";

export class AuthService {
  private supabase = getSupabaseClient();
  private signUpInProgress = false;

  /**
   * Sign up a new user
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
    // Prevent concurrent signup requests
    if (this.signUpInProgress) {
      return {
        data: null,
        error: {
          message: "A signup is already in progress. Please wait.",
        },
      };
    }

    try {
      this.signUpInProgress = true;

      console.log("Starting signup for:", email, "as", userData.userType);

      // Use server endpoint to create user with admin API (auto-confirms email)
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8/auth/signup`;
      
      console.log("Creating user via server endpoint...");
      
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
        // Check if it's a 404 error (server not deployed)
        if (signupResponse.status === 404) {
          console.error("Server not deployed - got 404");
          const error: any = new Error("SERVER_NOT_DEPLOYED: The backend server is not deployed. Please deploy the Supabase Edge Function.");
          error.code = "SERVER_NOT_DEPLOYED";
          throw error;
        }
        
        const errorData = await signupResponse.json();
        console.error("Signup failed:", errorData);
        throw new Error(errorData.error || "Failed to create user account");
      }

      const { user, profile } = await signupResponse.json();
      console.log("User created successfully:", user.id);
      console.log("Profile created successfully:", profile);
      
      // Now sign in the user to establish a session
      const { data: sessionData, error: signInError } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error("Auto sign-in after signup failed:", signInError);
        // User was created but auto-login failed - they can still log in manually
        throw new Error("Account created successfully, but auto-login failed. Please sign in manually.");
      }

      console.log("User signed in successfully after signup");

      return { data: sessionData, error: null };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { data: null, error };
    } finally {
      // Reset the flag after a delay to allow the request to fully complete
      setTimeout(() => {
        this.signUpInProgress = false;
      }, 2000);
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  }

  /**
   * Get current user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Use server endpoint to fetch profile (bypasses RLS)
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8/auth/get-profile`;
      
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Profile doesn't exist yet
          return null;
        }
        const errorData = await response.json();
        console.error("Error fetching user profile:", errorData);
        return null;
      }

      const { profile } = await response.json();
      return profile as UserProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Upsert user profile (insert or update)
   */
  async upsertUserProfile(
    userId: string,
    profileData: {
      email: string;
      userType: string;
      fullName: string;
      companyName?: string;
    }
  ) {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .upsert({
          id: userId,
          email: profileData.email,
          full_name: profileData.fullName,
          user_type: profileData.userType,
          company_name: profileData.companyName,
          has_completed_onboarding: profileData.userType === "admin",
          admin_role: profileData.userType === "admin" ? "support" : null,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as UserProfile, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Complete onboarding
   */
  async completeOnboarding(userId: string) {
    return this.updateUserProfile(userId, { has_completed_onboarding: true });
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (session: any) => void) {
    return this.supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }
}

// Singleton instance
export const authService = new AuthService();