import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Database,
  CheckCircle,
  Copy,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
  X,
} from "lucide-react";

interface DatabaseSetupGuideProps {
  onClose?: () => void;
}

export const DatabaseSetupGuide: React.FC<DatabaseSetupGuideProps> = ({ onClose }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const projectId = "faczbtutzsrcnlrahifb";
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectId}/sql/new`;
  const tableEditorUrl = `https://supabase.com/dashboard/project/${projectId}/editor`;

  const sqlScript = `-- GACE Database Setup
-- Copy this entire script and run it in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('end-user', 'accountant', 'admin')),
  full_name TEXT NOT NULL,
  company_name TEXT,
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  admin_role TEXT CHECK (admin_role IN ('support', 'compliance', 'super')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Continue with the rest of the setup...
-- OR better yet, copy the FULL script from /supabase/setup.sql file`;

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 p-4 shadow-lg shadow-red-500/50">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            Database Setup Required
          </h1>
          <p className="text-lg text-slate-300">
            The database tables haven't been created yet. Follow these steps to
            set up your database:
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl border border-indigo-500/30 p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-2xl text-cyan-400">
                  1
                </div>
                <div>
                  <h2 className="text-xl text-white">Open Supabase SQL Editor</h2>
                  <p className="text-sm text-slate-400">
                    Click the button below to open the SQL editor
                  </p>
                </div>
              </div>
            </div>
            <a
              href={sqlEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-cyan-500/30 bg-cyan-950/30 p-4 transition-all hover:border-cyan-500/50 hover:bg-cyan-950/50"
            >
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-cyan-400" />
                <span className="text-cyan-300">Open SQL Editor</span>
              </div>
              <ExternalLink className="h-5 w-5 text-cyan-400" />
            </a>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl border border-indigo-500/30 p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-2xl text-cyan-400">
                  2
                </div>
                <div>
                  <h2 className="text-xl text-white">Copy the SQL Script</h2>
                  <p className="text-sm text-slate-400">
                    Open <code className="rounded bg-slate-800 px-2 py-1">/supabase/setup.sql</code> in
                    your code editor and copy ALL the content
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <code className="text-xs text-slate-400">File: /supabase/setup.sql</code>
                <button
                  onClick={() => copyToClipboard("See /supabase/setup.sql", 2)}
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                >
                  {copiedStep === 2 ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Path
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto text-xs text-slate-300">
                {`-- Open this file in your code editor
-- Select ALL (Ctrl+A / Cmd+A)
-- Copy ALL (Ctrl+C / Cmd+C)
-- Then paste in Supabase SQL Editor`}
              </pre>
            </div>
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
                <div className="text-sm text-amber-200">
                  <p className="mb-1 font-semibold">Important:</p>
                  <p>
                    Make sure you copy the ENTIRE file (~260 lines). This creates all 5
                    database tables plus security policies.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl border border-indigo-500/30 p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-2xl text-cyan-400">
                  3
                </div>
                <div>
                  <h2 className="text-xl text-white">Paste & Run</h2>
                  <p className="text-sm text-slate-400">
                    Paste the SQL script in Supabase and click "Run"
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-slate-900/50 p-4">
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                <div className="text-sm text-slate-300">
                  In Supabase SQL Editor, click "New query"
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-slate-900/50 p-4">
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                <div className="text-sm text-slate-300">
                  Paste the entire SQL script (Ctrl+V / Cmd+V)
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-slate-900/50 p-4">
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                <div className="text-sm text-slate-300">
                  Click the "Run" button (or press Ctrl+Enter / Cmd+Enter)
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-slate-900/50 p-4">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-400" />
                <div className="text-sm text-slate-300">
                  Wait for "Success. No rows returned" message
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl border border-indigo-500/30 p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-2xl text-cyan-400">
                  4
                </div>
                <div>
                  <h2 className="text-xl text-white">Verify Tables Created</h2>
                  <p className="text-sm text-slate-400">
                    Confirm that all 5 tables were created successfully
                  </p>
                </div>
              </div>
            </div>
            <a
              href={tableEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 flex w-full items-center justify-between gap-3 rounded-lg border border-cyan-500/30 bg-cyan-950/30 p-4 transition-all hover:border-cyan-500/50 hover:bg-cyan-950/50"
            >
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-cyan-400" />
                <span className="text-cyan-300">Open Table Editor</span>
              </div>
              <ExternalLink className="h-5 w-5 text-cyan-400" />
            </a>
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="mb-3 text-sm text-slate-400">You should see these 5 tables:</p>
              <div className="space-y-2">
                {[
                  "user_profiles",
                  "assets",
                  "documents",
                  "tax_calculations",
                  "compliance_alerts",
                ].map((table) => (
                  <div
                    key={table}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <code className="rounded bg-slate-800 px-2 py-1">{table}</code>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Step 5 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl border border-green-500/30 bg-green-950/20 p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-2xl text-green-400">
                  5
                </div>
                <div>
                  <h2 className="text-xl text-white">Refresh & Sign Up</h2>
                  <p className="text-sm text-slate-400">
                    Once tables are created, refresh this page and try again
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="glow-green flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-green-500/50"
            >
              <CheckCircle className="h-5 w-5" />
              Refresh Page & Try Again
            </button>
          </motion.div>
        </div>

        {/* Help Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-6"
        >
          <h3 className="mb-3 text-lg text-white">Need More Help?</h3>
          <div className="space-y-2 text-sm text-slate-400">
            <p>
              • Read the detailed guide:{" "}
              <code className="rounded bg-slate-800 px-2 py-1">/START_HERE.md</code>
            </p>
            <p>
              • Step-by-step walkthrough:{" "}
              <code className="rounded bg-slate-800 px-2 py-1">/RUN_THIS_FIRST.md</code>
            </p>
            <p>
              • Troubleshooting:{" "}
              <code className="rounded bg-slate-800 px-2 py-1">/AUTH_FIX_GUIDE.md</code>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};