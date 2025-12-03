// Signup Page - GACE RegTech Platform
// Last updated: 2024-12-01
import * as React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "motion/react";
import { Lock, Mail, AlertCircle, Loader2, UserPlus, Building2, Users, Shield, User, CheckCircle, ArrowRight, Trash2 } from "lucide-react";
import { TestHelper } from "../components/TestHelper";
import { DatabaseSetupGuide } from "../components/DatabaseSetupGuide";
import { CleanupTool } from "../components/CleanupTool";
import { ServerDeploymentGuide } from "../components/ServerDeploymentGuide";
import { projectId, publicAnonKey } from "../utils/supabase/info";

type UserType = "end-user" | "accountant" | "admin";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<UserType>("end-user");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false);
  const [showServerDeployment, setShowServerDeployment] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showQuickDelete, setShowQuickDelete] = useState(true);
  const [quickDeleteEmail, setQuickDeleteEmail] = useState("");

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleQuickDelete = async () => {
    if (!quickDeleteEmail || !quickDeleteEmail.includes('@')) {
      alert("Please enter a valid email address");
      return;
    }

    if (!confirm(`Delete account: ${quickDeleteEmail}?\n\nThis will permanently delete the account.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/server/make-server-b5fd51b8/admin/delete-user`;
      
      console.log("[QUICK DELETE] URL:", serverUrl);
      console.log("[QUICK DELETE] Email:", quickDeleteEmail);

      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email: quickDeleteEmail }),
      });

      console.log("[QUICK DELETE] Status:", response.status);
      
      const data = await response.json();
      console.log("[QUICK DELETE] Response:", data);

      if (response.ok) {
        alert(`✅ SUCCESS!\n\nAccount deleted: ${quickDeleteEmail}\n\nYou can now sign up with this email.`);
        setQuickDeleteEmail("");
        setShowQuickDelete(false);
      } else {
        alert(`❌ ERROR (${response.status})\n\n${data.error || data.message || "Failed to delete account"}\n\nCheck the browser console for details.`);
      }
    } catch (err: any) {
      console.error("[QUICK DELETE] Error:", err);
      alert(`❌ ERROR\n\n${err.message}\n\nCheck the browser console for details.`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteExistingAccount = async () => {
    if (!email) return;

    setIsDeleting(true);
    setError("");

    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/server/make-server-b5fd51b8/admin/delete-user`;
      
      console.log("[DELETE] Calling server URL:", serverUrl);
      console.log("[DELETE] Email:", email);
      console.log("[DELETE] projectId:", projectId);

      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email }),
      });

      console.log("[DELETE] Response status:", response.status);
      console.log("[DELETE] Response ok:", response.ok);
      
      const data = await response.json();
      console.log("[DELETE] Response data:", data);

      if (response.ok) {
        setError("");
        setIsDuplicateEmail(false);
        alert(`✅ Account deleted successfully!\n\nYou can now sign up with ${email}`);
      } else {
        const errorMsg = `Failed to delete account (${response.status}): ${data.error || data.message || "Unknown error"}`;
        console.error("[DELETE] Error:", errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error("[DELETE] Caught error:", err);
      setError(`Failed to delete account: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSignupSuccess(false);

    // Rate limiting - prevent submission within 5 seconds of last attempt
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    const RATE_LIMIT_MS = 5000; // 5 seconds

    if (timeSinceLastSubmit < RATE_LIMIT_MS && lastSubmitTime > 0) {
      const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastSubmit) / 1000);
      setError(
        `Please wait ${waitTime} second${waitTime > 1 ? "s" : ""} before trying again. This is a security measure.`
      );
      return;
    }

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (userType === "accountant" && !companyName.trim()) {
      setError("Company name is required for accountants");
      return;
    }

    setIsLoading(true);
    setLastSubmitTime(now);
    setIsDuplicateEmail(false);

    try {
      console.log("=== SIGNUP STARTED ===");
      console.log("Email:", email);
      console.log("User Type:", userType);
      console.log("Full Name:", fullName);
      console.log("Company Name:", companyName || "N/A");

      const { error: signUpError } = await signUp(
        email,
        password,
        {
          fullName: fullName,
          userType: userType,
          companyName: companyName || undefined,
        }
      );

      if (signUpError) {
        console.error("=== SIGNUP FAILED ===");
        console.error("Error:", signUpError);
        
        // Check for successful account creation but failed auto sign-in
        if (signUpError.message?.includes("Account created successfully")) {
          setSignupSuccess(true);
          setError("");
          setIsLoading(false);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }
        
        // Check for duplicate email error
        if (
          signUpError.message?.includes("already registered") ||
          signUpError.message?.includes("Email already") ||
          signUpError.message?.includes("User already registered")
        ) {
          setError(
            `This email (${email}) is already registered. Please sign in instead or use a different email.`
          );
          setIsLoading(false);
          setIsDuplicateEmail(true);
          
          // Automatically prompt to delete the account
          setTimeout(() => {
            if (confirm(`⚠️ DUPLICATE EMAIL DETECTED\n\nThe email "${email}" is already registered.\n\n🗑️ Do you want to DELETE this account and retry signup?\n\nClick OK to delete, or Cancel to try a different email.`)) {
              handleDeleteExistingAccount();
            }
          }, 500);
          
          return;
        }
        
        // Check for rate limiting error
        if (
          signUpError.message?.includes("you can only request this after") ||
          signUpError.message?.includes("rate limit")
        ) {
          setError(
            "Too many signup attempts. Please wait a few seconds and try again."
          );
          setIsLoading(false);
          return;
        }

        // Check if it's a database setup error
        if (
          (signUpError as any).code === "DATABASE_NOT_SETUP" ||
          signUpError.message?.includes("DATABASE_NOT_SETUP") ||
          signUpError.message?.includes("Could not find the table")
        ) {
          setShowDatabaseSetup(true);
          setError(
            "Database setup required! Please follow the instructions shown below to create the database tables."
          );
        } else {
          setError(
            signUpError.message || "Failed to create account. Please try again."
          );
        }
        setIsLoading(false);
        return;
      }

      console.log("=== SIGNUP SUCCESSFUL ===");
      // Success! Navigation will happen automatically via AuthContext
      // User will be redirected to onboarding based on their user_type
      // No manual navigation needed - AuthRoute will handle this
    } catch (err: any) {
      console.error("=== SIGNUP ERROR (CAUGHT) ===");
      console.error("Error:", err);

      // Check for rate limiting error
      if (
        err.message?.includes("you can only request this after") ||
        err.message?.includes("rate limit")
      ) {
        setError(
          "Too many signup attempts. Please wait a few seconds and try again."
        );
        setIsLoading(false);
        return;
      }

      // Check if server is not deployed (404)
      if (
        err.code === "SERVER_NOT_DEPLOYED" ||
        err.message?.includes("SERVER_NOT_DEPLOYED")
      ) {
        setShowServerDeployment(true);
        setError(
          "Backend server not deployed! Please follow the instructions shown below to deploy the Edge Function."
        );
        setIsLoading(false);
        return;
      }

      // Check if it's a database setup error
      if (
        err.code === "DATABASE_NOT_SETUP" ||
        err.message?.includes("DATABASE_NOT_SETUP") ||
        err.message?.includes("Could not find the table")
      ) {
        setShowDatabaseSetup(true);
        setError(
          "Database setup required! Please follow the instructions shown below."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "fullName":
        setFullName(value);
        break;
      case "userType":
        setUserType(value as UserType);
        break;
      case "companyName":
        setCompanyName(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* QUICK DELETE PANEL - Floating at top */}
      {showQuickDelete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className="glass rounded-xl border-2 border-yellow-500/50 bg-yellow-950/40 p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-yellow-300 mb-2">🗑️ Quick Delete Account</div>
                <p className="text-xs text-yellow-200/80 mb-3">
                  If you're getting "email already registered" error, delete the account here first:
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={quickDeleteEmail}
                    onChange={(e) => setQuickDeleteEmail(e.target.value)}
                    placeholder="email@example.com"
                    disabled={isDeleting}
                    className="flex-1 rounded-lg border border-yellow-500/30 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 disabled:opacity-50"
                  />
                  <button
                    onClick={handleQuickDelete}
                    disabled={isDeleting || !quickDeleteEmail}
                    className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Delete</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setShowQuickDelete(false)}
                  className="mt-2 text-xs text-yellow-300/60 hover:text-yellow-300 transition-colors"
                >
                  Hide this panel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 p-3 shadow-lg shadow-purple-500/50"
          >
            <UserPlus className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Start managing your global tax compliance today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6"
          >
            {/* Main Error Box */}
            <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-950/30 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
              <div className="flex-1">
                <div className="text-sm text-red-300">{error}</div>
              </div>
            </div>
            
            {/* PROMINENT Delete Button for Duplicate Email */}
            {isDuplicateEmail && (
              <div className="mt-4 space-y-3">
                {/* Big Delete Button */}
                <button
                  onClick={handleDeleteExistingAccount}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-red-500/50 bg-red-950/40 px-6 py-4 font-semibold text-red-300 hover:bg-red-950/60 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Deleting account...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5" />
                      <span>🗑️ DELETE THIS ACCOUNT & RETRY SIGNUP</span>
                    </>
                  )}
                </button>
                
                {/* Secondary Options */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-4 py-3 text-sm font-semibold text-cyan-400 hover:bg-cyan-950/40 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Go to Login
                  </Link>
                  <button
                    onClick={() => {
                      setIsDuplicateEmail(false);
                      setError("");
                      setEmail("");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500/30 bg-purple-950/20 px-4 py-3 text-sm font-semibold text-purple-400 hover:bg-purple-950/40 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Different Email
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Success Message */}
        {signupSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-950/30 p-4"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-400" />
            <div className="flex-1">
              <div className="font-semibold text-green-300">Account created successfully!</div>
              <div className="mt-1 text-sm text-green-300/80">
                Redirecting you to the login page...
              </div>
            </div>
          </motion.div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-indigo-500/30 bg-slate-900/50 py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-indigo-500/30 bg-slate-900/50 py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          {/* User Type */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              I am a...
            </label>
            <select
              name="userType"
              value={userType}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-lg border border-indigo-500/30 bg-slate-900/50 py-3 px-4 text-slate-100 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
            >
              <option value="end-user">Individual / End User</option>
              <option value="accountant">Accountant / Tax Professional</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Company Name (for accountants) */}
          {userType === "accountant" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <label className="mb-2 block text-sm text-slate-300">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="companyName"
                  value={companyName}
                  onChange={handleChange}
                  placeholder="Acme Accounting Ltd"
                  required={userType === "accountant"}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-indigo-500/30 bg-slate-900/50 py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                />
              </div>
            </motion.div>
          )}

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={6}
                className="w-full rounded-lg border border-indigo-500/30 bg-slate-900/50 py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              At least 6 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-indigo-500/30 bg-slate-900/50 py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="glow-purple flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Create Account
              </>
            )}
          </motion.button>

          {/* Sign In Instead Button (shown when email already exists) */}
          {isDuplicateEmail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/20 py-3 font-semibold text-cyan-300 shadow-lg transition-all hover:bg-cyan-950/40 hover:border-cyan-500/50"
              >
                <ArrowRight className="h-5 w-5" />
                Sign In Instead
              </Link>
            </motion.div>
          )}
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Database Setup Guide */}
      {showDatabaseSetup && (
        <DatabaseSetupGuide onClose={() => setShowDatabaseSetup(false)} />
      )}

      {/* Server Deployment Guide */}
      {showServerDeployment && (
        <ServerDeploymentGuide onClose={() => setShowServerDeployment(false)} />
      )}

      {/* Test Helper - Shows backend status for debugging */}
      <TestHelper />

      {/* Cleanup Tool - Delete test users (temporary for testing) */}
      <CleanupTool />
    </div>
  );
}