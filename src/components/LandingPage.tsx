import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, user, loading } = useAuth();

  useEffect(() => {
    // Auto-redirect based on auth status
    if (!loading) {
      if (session && user) {
        if (user.has_completed_onboarding) {
          navigate("/dashboard/overview", { replace: true });
        } else {
          navigate(`/onboarding/${user.user_type}`, { replace: true });
        }
      }
    }
  }, [session, user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto" />
          <p className="text-slate-400">Loading GACE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass relative z-10 w-full max-w-4xl rounded-3xl border border-indigo-500/30 p-12 text-center shadow-2xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 p-4 shadow-lg shadow-cyan-500/50"
        >
          <Shield className="h-12 w-12 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
        >
          Welcome to GACE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-slate-300"
        >
          Global Asset Compliance Engine
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12 text-slate-400"
        >
          AI-powered RegTech platform for UK residents with overseas assets.
          <br />
          Simplify your tax compliance with HMRC using intelligent automation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <button
            onClick={() => navigate("/login")}
            className="glow-cyan group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-cyan-500/50"
          >
            Sign In
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="group flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-slate-900/50 px-8 py-4 font-semibold text-slate-300 transition-all hover:border-cyan-500/50 hover:bg-indigo-950/30"
          >
            Create Account
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <div className="rounded-xl border border-indigo-500/20 bg-slate-900/30 p-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <Shield className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="mb-2 text-cyan-400">AI-Powered Analysis</h3>
            <p className="text-sm text-slate-400">
              Intelligent interpretation of multiple tax regimes and Double Taxation Agreements
            </p>
          </div>

          <div className="rounded-xl border border-indigo-500/20 bg-slate-900/30 p-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="mb-2 text-purple-400">Compliance Automation</h3>
            <p className="text-sm text-slate-400">
              Automated HMRC reporting and compliance monitoring for global assets
            </p>
          </div>

          <div className="rounded-xl border border-indigo-500/20 bg-slate-900/30 p-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30">
              <Shield className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="mb-2 text-indigo-400">Document Processing</h3>
            <p className="text-sm text-slate-400">
              OCR and AI-powered document ingestion for seamless data extraction
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-xs text-slate-500"
        >
          MVP Demo for Innovator Founder Endorsement Presentation
        </motion.p>
      </motion.div>
    </div>
  );
};
