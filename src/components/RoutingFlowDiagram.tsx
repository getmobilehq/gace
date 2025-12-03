import React from "react";
import { ArrowRight, Lock, CheckCircle, Shield } from "lucide-react";

/**
 * Visual diagram showing the authentication and routing flow
 * Useful for understanding the user journey through the application
 */
export const RoutingFlowDiagram: React.FC = () => {
  return (
    <div className="tech-grid min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
            GACE Authentication & Routing Flow
          </h1>
          <p className="text-sm text-slate-400">
            Visual representation of user journey through the application
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="space-y-8">
          {/* Step 1: Entry Point */}
          <div className="text-center">
            <div className="glass glow-cyan inline-block rounded-xl border border-cyan-500/30 px-6 py-4">
              <div className="mb-2 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20">
                  <Lock className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <h3 className="font-semibold text-cyan-300">
                Unauthenticated User
              </h3>
              <p className="mt-1 text-xs text-slate-400">Route: /</p>
            </div>
            <div className="my-4 flex justify-center">
              <ArrowRight className="h-6 w-6 rotate-90 text-slate-600" />
            </div>
          </div>

          {/* Step 2: Login */}
          <div className="text-center">
            <div className="glass glow-blue inline-block rounded-xl border border-indigo-500/30 px-6 py-4">
              <h3 className="font-semibold text-indigo-300">Login Page</h3>
              <p className="mt-1 text-xs text-slate-400">Route: /login</p>
              <div className="mt-3 flex gap-2 justify-center">
                <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] text-cyan-300">
                  End User
                </span>
                <span className="rounded-full bg-purple-500/20 px-2 py-1 text-[10px] text-purple-300">
                  Accountant
                </span>
                <span className="rounded-full bg-amber-500/20 px-2 py-1 text-[10px] text-amber-300">
                  Admin
                </span>
              </div>
            </div>
            <div className="my-4 flex justify-center">
              <ArrowRight className="h-6 w-6 rotate-90 text-slate-600" />
            </div>
          </div>

          {/* Step 3: Branching Paths */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Path A: End User */}
            <div className="glass rounded-xl border border-cyan-500/30 p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-cyan-500/20 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20">
                  <span className="text-xs font-bold text-cyan-300">1</span>
                </div>
                <h4 className="font-semibold text-cyan-300">End User Path</h4>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-cyan-500/10 p-3">
                  <div className="text-xs font-semibold text-cyan-200">
                    Onboarding
                  </div>
                  <code className="mt-1 block text-[10px] text-slate-400">
                    /onboarding/end-user
                  </code>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-4 w-4 rotate-90 text-slate-600" />
                </div>
                <div className="rounded-lg bg-cyan-500/10 p-3">
                  <div className="text-xs font-semibold text-cyan-200">
                    Dashboard Access
                  </div>
                  <code className="mt-1 block text-[10px] text-slate-400">
                    /dashboard/*
                  </code>
                </div>
              </div>
            </div>

            {/* Path B: Accountant */}
            <div className="glass rounded-xl border border-purple-500/30 p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-purple-500/20 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
                  <span className="text-xs font-bold text-purple-300">2</span>
                </div>
                <h4 className="font-semibold text-purple-300">
                  Accountant Path
                </h4>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <div className="text-xs font-semibold text-purple-200">
                    Onboarding
                  </div>
                  <code className="mt-1 block text-[10px] text-slate-400">
                    /onboarding/accountant
                  </code>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-4 w-4 rotate-90 text-slate-600" />
                </div>
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <div className="text-xs font-semibold text-purple-200">
                    Dashboard Access
                  </div>
                  <code className="mt-1 block text-[10px] text-slate-400">
                    /dashboard/*
                  </code>
                </div>
              </div>
            </div>

            {/* Path C: Admin */}
            <div className="glass rounded-xl border border-amber-500/30 p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-amber-500/20 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                  <span className="text-xs font-bold text-amber-300">3</span>
                </div>
                <h4 className="font-semibold text-amber-300">Admin Path</h4>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-amber-500/10 p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-300" />
                    <div className="text-xs font-semibold text-amber-200">
                      No Onboarding
                    </div>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Direct access granted
                  </p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-4 w-4 rotate-90 text-slate-600" />
                </div>
                <div className="rounded-lg bg-amber-500/10 p-3">
                  <div className="text-xs font-semibold text-amber-200">
                    Admin Portal
                  </div>
                  <code className="mt-1 block text-[10px] text-slate-400">
                    /admin
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Routes */}
          <div className="glass glow-blue rounded-xl border border-indigo-500/30 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-cyan-400" />
              <h3 className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-semibold text-transparent">
                Protected Dashboard Routes
              </h3>
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {[
                "/dashboard/overview",
                "/dashboard/documents",
                "/dashboard/scanner",
                "/dashboard/tax-engine",
                "/dashboard/alerts",
                "/dashboard/reports",
                "/dashboard/help",
              ].map((route) => (
                <div
                  key={route}
                  className="rounded-lg border border-indigo-500/20 bg-indigo-950/30 px-3 py-2"
                >
                  <code className="text-xs text-indigo-300">{route}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Protection Legend */}
          <div className="glass rounded-xl border border-indigo-500/30 p-6">
            <h3 className="mb-4 font-semibold text-slate-200">
              🔐 Route Protection Levels
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3">
                <h4 className="mb-2 text-sm font-semibold text-cyan-300">
                  Public Routes
                </h4>
                <p className="text-xs text-slate-400">
                  No authentication required. Anyone can access.
                </p>
                <div className="mt-2">
                  <code className="text-[10px] text-cyan-400">/login</code>
                </div>
              </div>

              <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-3">
                <h4 className="mb-2 text-sm font-semibold text-purple-300">
                  Onboarding Routes
                </h4>
                <p className="text-xs text-slate-400">
                  Requires authentication + matching user role.
                </p>
                <div className="mt-2 space-x-2">
                  <code className="text-[10px] text-purple-400">
                    /onboarding/*
                  </code>
                </div>
              </div>

              <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3">
                <h4 className="mb-2 text-sm font-semibold text-indigo-300">
                  Dashboard Routes
                </h4>
                <p className="text-xs text-slate-400">
                  Requires authentication + completed onboarding.
                </p>
                <div className="mt-2">
                  <code className="text-[10px] text-indigo-400">
                    /dashboard/*
                  </code>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                <h4 className="mb-2 text-sm font-semibold text-amber-300">
                  Admin Routes
                </h4>
                <p className="text-xs text-slate-400">
                  Requires authentication + admin role only.
                </p>
                <div className="mt-2">
                  <code className="text-[10px] text-amber-400">/admin</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
