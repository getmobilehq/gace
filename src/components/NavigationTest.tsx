import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Development component to test routing functionality
 * Shows current route and provides quick navigation links
 */
export const NavigationTest: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const testRoutes = [
    { path: "/", label: "Root" },
    { path: "/login", label: "Login" },
    { path: "/onboarding/end-user", label: "End User Onboarding" },
    { path: "/onboarding/accountant", label: "Accountant Onboarding" },
    { path: "/dashboard/overview", label: "Dashboard - Overview" },
    { path: "/dashboard/documents", label: "Dashboard - Documents" },
    { path: "/dashboard/scanner", label: "Dashboard - Scanner" },
    { path: "/dashboard/alerts", label: "Dashboard - Alerts" },
    { path: "/admin", label: "Admin Dashboard" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-xl border border-indigo-500/30 bg-slate-900/95 p-4 shadow-2xl backdrop-blur">
      <div className="mb-2 border-b border-indigo-500/20 pb-2">
        <h3 className="text-xs font-semibold text-cyan-400">
          🧪 Route Testing (Dev Only)
        </h3>
        <p className="mt-1 text-[10px] text-slate-400">
          Current: <code className="text-purple-300">{location.pathname}</code>
        </p>
      </div>
      <div className="space-y-1">
        {testRoutes.map((route) => (
          <button
            key={route.path}
            onClick={() => navigate(route.path)}
            className={`w-full rounded px-2 py-1 text-left text-[10px] transition-colors ${
              location.pathname === route.path
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-slate-400 hover:bg-indigo-500/10 hover:text-slate-200"
            }`}
          >
            {route.label}
          </button>
        ))}
      </div>
    </div>
  );
};
