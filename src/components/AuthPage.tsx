import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Globe, Shield, Users } from "lucide-react";

interface AuthPageProps {
  onLogin: (userType: "end-user" | "accountant" | "admin") => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"end-user" | "accountant">("end-user");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would authenticate with backend
    onLogin(accountType);
  };

  const handleSSOLogin = (provider: string) => {
    // Mock SSO login
    console.log(`Logging in with ${provider}`);
    onLogin(accountType);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-12 lg:flex">
        <div>
          <div className="text-3xl font-bold text-white">GACE</div>
          <div className="mt-1 text-sm text-indigo-100">Global Asset Compliance Engine</div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Simplify Your Cross-Border Tax Compliance
            </h1>
            <p className="mt-4 text-lg text-indigo-100">
              AI-powered platform for UK residents to manage overseas assets and
              meet HMRC obligations with confidence.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">
                  Multi-Jurisdiction Support
                </div>
                <div className="text-sm text-indigo-100">
                  Track assets across Nigeria, UAE, India, Kenya, and more
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">
                  ML Tax Engine
                </div>
                <div className="text-sm text-indigo-100">
                  AI interprets DTAs and calculates optimal tax strategies
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">
                  HMRC-Ready Reports
                </div>
                <div className="text-sm text-indigo-100">
                  Generate compliant Self Assessment and CGT returns
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-indigo-100">
          © 2025 GACE Platform • Built for Innovator Founder Endorsement
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="text-2xl font-bold text-slate-100">GACE</div>
            <div className="text-sm text-slate-400">Global Asset Compliance Engine</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-100">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {isLogin
                  ? "Sign in to access your compliance dashboard"
                  : "Start managing your global tax compliance"}
              </p>
            </div>

            {/* Account Type Selector (only for signup) */}
            {!isLogin && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType("end-user")}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      accountType === "end-user"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="font-medium text-slate-100">Individual</div>
                    <div className="text-xs text-slate-400">
                      Personal tax compliance
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("accountant")}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      accountType === "accountant"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="font-medium text-slate-100">Accountant</div>
                    <div className="text-xs text-slate-400">
                      Manage multiple clients
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* SSO Options */}
            <div className="mb-6 space-y-3">
              <button
                type="button"
                onClick={() => handleSSOLogin("Google")}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 font-medium text-slate-100 transition-all hover:border-slate-600 hover:bg-slate-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleSSOLogin("Microsoft")}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 font-medium text-slate-100 transition-all hover:border-slate-600 hover:bg-slate-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                </svg>
                Continue with Microsoft
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-900 px-2 text-slate-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-10 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center text-sm">
              <span className="text-slate-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>

            {/* Admin Login Link */}
            {isLogin && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => onLogin("admin")}
                  className="text-xs text-slate-500 hover:text-slate-400"
                >
                  Admin Access
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-slate-500">
            By continuing, you agree to GACE's Terms of Service and Privacy Policy.
            <br />
            Not meant for collecting PII or securing sensitive data.
          </div>
        </div>
      </div>
    </div>
  );
};