import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * RouteDebugger - Shows current route information
 * This component helps debug routing issues
 */
export const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const { session, user, loading } = useAuth();

  useEffect(() => {
    console.log("=== ROUTE DEBUG ===");
    console.log("Current Path:", location.pathname);
    console.log("Search Params:", location.search);
    console.log("Hash:", location.hash);
    console.log("Loading:", loading);
    console.log("Session:", session ? "Yes" : "No");
    console.log("User:", user ? user.email : "No user");
    console.log("Has Onboarded:", user?.has_completed_onboarding);
    console.log("User Type:", user?.user_type);
    console.log("==================");
  }, [location, session, user, loading]);

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border border-yellow-500/30 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-sm">
      <div className="mb-2 font-semibold text-yellow-400">Route Debugger</div>
      <div className="space-y-1 text-slate-300">
        <div>
          <span className="text-slate-500">Path:</span>{" "}
          <span className="font-mono text-cyan-400">{location.pathname}</span>
        </div>
        <div>
          <span className="text-slate-500">Auth:</span>{" "}
          <span className={session ? "text-green-400" : "text-red-400"}>
            {session ? "✓ Logged In" : "✗ Not Logged In"}
          </span>
        </div>
        {user && (
          <>
            <div>
              <span className="text-slate-500">User:</span>{" "}
              <span className="text-purple-400">{user.email}</span>
            </div>
            <div>
              <span className="text-slate-500">Type:</span>{" "}
              <span className="text-indigo-400">{user.user_type}</span>
            </div>
            <div>
              <span className="text-slate-500">Onboarded:</span>{" "}
              <span
                className={
                  user.has_completed_onboarding
                    ? "text-green-400"
                    : "text-yellow-400"
                }
              >
                {user.has_completed_onboarding ? "Yes" : "No"}
              </span>
            </div>
          </>
        )}
        <div>
          <span className="text-slate-500">Loading:</span>{" "}
          <span className={loading ? "text-yellow-400" : "text-green-400"}>
            {loading ? "Yes..." : "No"}
          </span>
        </div>
      </div>
    </div>
  );
};
