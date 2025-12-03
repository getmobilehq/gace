import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const ProfileMissingFix: React.FC = () => {
  const { refreshProfile, signOut } = useAuth();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProfile();
      // Give it a moment to complete
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error refreshing profile:", error);
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass relative w-full max-w-md rounded-2xl border border-amber-500/30 p-8"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
          </div>
        </div>

        <h2 className="mb-3 text-center text-2xl text-white">
          Profile Setup Issue
        </h2>

        <p className="mb-6 text-center text-slate-400">
          Your account was created, but your profile data is missing. This can happen if
          the database wasn't fully set up during signup.
        </p>

        <div className="mb-6 rounded-lg border border-slate-700 bg-slate-900/50 p-4">
          <p className="mb-2 text-sm text-slate-300">
            <strong>What happened?</strong>
          </p>
          <p className="text-sm text-slate-400">
            Your authentication account exists, but the profile record wasn't created in
            the database. We'll try to recreate it automatically.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-cyan-500/50 disabled:opacity-50"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Fixing Profile...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                Fix Profile Automatically
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800/50 py-3 font-semibold text-slate-300 transition-all hover:bg-slate-700/50"
          >
            <LogOut className="h-5 w-5" />
            Log Out & Try Again
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
          <p className="text-xs text-amber-200">
            <strong>Note:</strong> If this keeps happening, make sure you've run the
            database setup script at{" "}
            <code className="rounded bg-slate-800 px-2 py-0.5">/supabase/setup.sql</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
