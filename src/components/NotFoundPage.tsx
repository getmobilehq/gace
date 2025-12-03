import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, user } = useAuth();

  const handleGoHome = () => {
    // Navigate to appropriate home page based on auth status
    if (session && user) {
      if (user.has_completed_onboarding) {
        navigate("/dashboard/overview");
      } else {
        navigate(`/onboarding/${user.user_type}`);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="tech-grid">
        <div className="glass glow-blue rounded-2xl border border-indigo-500/30 p-8 text-center max-w-md">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30">
              <AlertTriangle className="h-10 w-10 text-rose-400" />
            </div>
          </div>

          <h1 className="mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            404 - Page Not Found
          </h1>
          
          <p className="mb-6 text-slate-400">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-slate-900/50 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-indigo-950/30"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
            
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-indigo-500/30 px-6 py-2.5 text-sm font-semibold text-cyan-300 transition-all hover:border-cyan-500/50 hover:glow-blue"
            >
              <Home className="h-4 w-4" />
              {session ? "Go to Dashboard" : "Go to Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};