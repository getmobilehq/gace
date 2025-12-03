import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Route labels mapping
  const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    overview: "Compliance Overview",
    documents: "Document Ingestion",
    scanner: "Global Asset Scanner",
    "tax-engine": "ML Tax Engine",
    alerts: "Compliance Alerts",
    reports: "HMRC Reports",
    help: "Help & Documentation",
    onboarding: "Onboarding",
    "end-user": "End User",
    accountant: "Accountant",
    admin: "Admin Portal",
  };

  // Don't show breadcrumbs on login page
  if (location.pathname === "/login" || location.pathname === "/") {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-xs" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center gap-1 text-slate-400 transition-colors hover:text-cyan-400"
      >
        <Home className="h-3 w-3" />
        <span className="hidden md:inline">Home</span>
      </Link>

      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label = routeLabels[pathname] || pathname;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            {isLast ? (
              <span className="font-semibold text-cyan-400">{label}</span>
            ) : (
              <Link
                to={routeTo}
                className="text-slate-400 transition-colors hover:text-cyan-400"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
