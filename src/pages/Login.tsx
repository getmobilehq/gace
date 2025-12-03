import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "motion/react";
import { Lock, Mail, AlertCircle, Loader2, LogIn, Trash2, RefreshCw } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInvalidCredsHelp, setShowInvalidCredsHelp] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAndReset = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    if (!confirm(`Delete account for ${email} and start fresh?\n\nThis will permanently delete the account and all associated data.`)) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/server/make-server-b5fd51b8/admin/delete-user`;

      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Account deleted successfully!\n\nClick OK to go to signup and create a new account.`);
        navigate("/signup");
      } else {
        setError(`Failed to delete account: ${data.error || data.message || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(`Failed to delete account: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("[Login] Attempting to sign in:", email);
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.error("[Login] Sign in failed:", signInError);
        
        // Provide helpful error messages
        let errorMessage = "Failed to sign in. Please try again.";
        
        if (signInError.message?.includes("Invalid login credentials") || 
            signInError.message?.includes("Invalid email or password")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
          setShowInvalidCredsHelp(true);
        } else if (signInError.message?.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email address before signing in.";
        } else if (signInError.message?.includes("User not found")) {
          errorMessage = "No account found with this email. Please sign up first.";
        } else if (signInError.message) {
          errorMessage = signInError.message;
        }
        
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      console.log("[Login] Sign in successful, redirecting...");
      // Navigation will happen automatically via AuthContext + App.tsx routing
    } catch (err: any) {
      console.error("[Login] Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass relative w-full max-w-md rounded-2xl border border-indigo-500/30 p-8 shadow-2xl"
      >
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 p-3 shadow-lg shadow-cyan-500/50"
          >
            <Lock className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to GACE
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your global tax compliance
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-950/30 p-4"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <div className="text-sm text-red-300">{error}</div>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-indigo-500/30 bg-slate-900/50 py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-indigo-500/30 bg-slate-900/50 py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setError("Password reset functionality coming soon. Please contact support.")}
              className="text-sm text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="glow-cyan flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Credentials (Remove in production) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-lg border border-slate-700 bg-slate-900/50 p-4"
        >
          <p className="mb-2 text-xs text-slate-400">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-slate-300">
            <p>Email: demo@gace.app</p>
            <p>Password: demo123456</p>
          </div>
        </motion.div>

        {/* Delete Account Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleDeleteAndReset}
            disabled={isDeleting || !email}
            className="inline-flex items-center gap-2 text-sm text-red-400 transition-colors hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting account...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete this account & start fresh
              </>
            )}
          </button>
        </div>

        {/* Invalid Credentials Help */}
        {showInvalidCredsHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-950/20 p-4"
          >
            <p className="mb-3 text-sm font-semibold text-yellow-300">Can't sign in?</p>
            <div className="space-y-2 text-xs text-yellow-200/80">
              <p>• Double-check your email and password for typos</p>
              <p>• Try the demo account (shown above)</p>
              <p>• Delete this account and create a new one (button below)</p>
              <p>• Or create a new account with a different email</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleDeleteAndReset}
                disabled={isDeleting || !email}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-950/50 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete & Reset
                  </>
                )}
              </button>
              <Link
                to="/signup"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500/30 bg-purple-950/30 px-4 py-2 text-sm font-semibold text-purple-300 hover:bg-purple-950/50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                New Signup
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};