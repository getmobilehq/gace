import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Shield,
  ArrowRight,
} from "lucide-react";

/**
 * Development guide showing the complete routing structure
 * Useful for understanding navigation flow and testing routes
 */
export const RoutingGuide: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = {
    public: [
      {
        path: "/login",
        label: "Login Page",
        icon: LogIn,
        description: "Authentication for all user types",
      },
    ],
    onboarding: [
      {
        path: "/onboarding/end-user",
        label: "End User Onboarding",
        icon: UserPlus,
        description: "Investor/individual asset holder setup",
      },
      {
        path: "/onboarding/accountant",
        label: "Accountant Onboarding",
        icon: UserPlus,
        description: "Professional accountant setup",
      },
    ],
    dashboard: [
      {
        path: "/dashboard/overview",
        label: "Compliance Overview",
        icon: LayoutDashboard,
      },
      { path: "/dashboard/documents", label: "Document Ingestion" },
      { path: "/dashboard/scanner", label: "Global Asset Scanner" },
      { path: "/dashboard/tax-engine", label: "ML Tax Engine" },
      { path: "/dashboard/alerts", label: "Compliance Alerts" },
      { path: "/dashboard/reports", label: "HMRC Reports" },
      { path: "/dashboard/help", label: "Help & Documentation" },
    ],
    admin: [
      {
        path: "/admin",
        label: "Admin Dashboard",
        icon: Shield,
        description: "Role-based admin portal",
      },
    ],
  };

  const RouteSection = ({
    title,
    routes,
    color,
  }: {
    title: string;
    routes: any[];
    color: string;
  }) => (
    <div className="mb-6">
      <h3 className={`mb-3 text-sm font-semibold text-${color}-400`}>
        {title}
      </h3>
      <div className="space-y-2">
        {routes.map((route) => {
          const Icon = route.icon || Home;
          const isActive = location.pathname === route.path;
          return (
            <button
              key={route.path}
              onClick={() => navigate(route.path)}
              className={`group w-full rounded-lg border p-3 text-left transition-all ${
                isActive
                  ? `border-${color}-500/50 bg-${color}-500/10`
                  : "border-indigo-500/20 bg-slate-900/50 hover:border-indigo-500/40 hover:bg-indigo-950/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`mt-0.5 h-4 w-4 ${isActive ? `text-${color}-400` : "text-slate-400"}`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${isActive ? `text-${color}-300` : "text-slate-200"}`}
                    >
                      {route.label}
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <code className="mt-1 block text-xs text-slate-400">
                    {route.path}
                  </code>
                  {route.description && (
                    <p className="mt-1 text-xs text-slate-500">
                      {route.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="tech-grid min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
            GACE Routing Guide
          </h1>
          <p className="text-sm text-slate-400">
            Complete navigation structure with protected routes and role-based
            access
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-xl border border-indigo-500/20 p-6">
            <RouteSection
              title="🔓 Public Routes"
              routes={routes.public}
              color="cyan"
            />
            <RouteSection
              title="📋 Onboarding Routes"
              routes={routes.onboarding}
              color="purple"
            />
          </div>

          <div className="glass rounded-xl border border-indigo-500/20 p-6">
            <RouteSection
              title="📊 Dashboard Routes"
              routes={routes.dashboard}
              color="cyan"
            />
            <RouteSection
              title="🛡️ Admin Routes"
              routes={routes.admin}
              color="amber"
            />
          </div>
        </div>

        <div className="glass glow-blue mt-6 rounded-xl border border-indigo-500/30 p-6">
          <h3 className="mb-3 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-semibold text-transparent">
            🔐 Route Protection
          </h3>
          <div className="space-y-2 text-sm text-slate-400">
            <p>
              <strong className="text-cyan-400">Public Routes:</strong> Accessible without authentication
            </p>
            <p>
              <strong className="text-purple-400">Onboarding Routes:</strong>{" "}
              Require authentication + matching user role
            </p>
            <p>
              <strong className="text-cyan-400">Dashboard Routes:</strong>{" "}
              Require authentication + completed onboarding
            </p>
            <p>
              <strong className="text-amber-400">Admin Routes:</strong> Require
              authentication + admin role
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Current Route:{" "}
            <code className="text-purple-400">{location.pathname}</code>
          </p>
        </div>
      </div>
    </div>
  );
};
