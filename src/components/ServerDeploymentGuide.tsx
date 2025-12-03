import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle, ExternalLink, Terminal, Copy, CheckCircle } from "lucide-react";

interface ServerDeploymentGuideProps {
  onClose: () => void;
}

export const ServerDeploymentGuide: React.FC<ServerDeploymentGuideProps> = ({ onClose }) => {
  const [copiedStep, setCopiedStep] = React.useState<number | null>(null);

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const projectId = "faczbtutzsrcnlrahifb";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass relative w-full max-w-3xl rounded-2xl border border-red-500/30 bg-slate-900/95 p-8 shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/20">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-2xl text-transparent">
                Backend Server Not Deployed
              </h2>
              <p className="mt-2 text-slate-400">
                The Edge Function needs to be deployed to Supabase before you can create accounts.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            {/* Option 1: CLI Deployment */}
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg text-cyan-400">
                <Terminal className="h-5 w-5" />
                Option 1: Deploy via CLI (Recommended)
              </h3>

              <div className="space-y-4">
                {/* Step 1 */}
                <div>
                  <p className="mb-2 text-sm text-slate-300">
                    <span className="font-semibold text-cyan-400">Step 1:</span> Install Supabase CLI
                  </p>
                  <div className="group relative">
                    <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                      npm install -g supabase
                    </pre>
                    <button
                      onClick={() => copyToClipboard("npm install -g supabase", 1)}
                      className="absolute right-2 top-2 rounded-md bg-slate-800 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:text-cyan-400"
                    >
                      {copiedStep === 1 ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <p className="mb-2 text-sm text-slate-300">
                    <span className="font-semibold text-cyan-400">Step 2:</span> Login to Supabase
                  </p>
                  <div className="group relative">
                    <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                      supabase login
                    </pre>
                    <button
                      onClick={() => copyToClipboard("supabase login", 2)}
                      className="absolute right-2 top-2 rounded-md bg-slate-800 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:text-cyan-400"
                    >
                      {copiedStep === 2 ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 3 */}
                <div>
                  <p className="mb-2 text-sm text-slate-300">
                    <span className="font-semibold text-cyan-400">Step 3:</span> Link your project
                  </p>
                  <div className="group relative">
                    <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                      supabase link --project-ref {projectId}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(`supabase link --project-ref ${projectId}`, 3)}
                      className="absolute right-2 top-2 rounded-md bg-slate-800 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:text-cyan-400"
                    >
                      {copiedStep === 3 ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 4 */}
                <div>
                  <p className="mb-2 text-sm text-slate-300">
                    <span className="font-semibold text-cyan-400">Step 4:</span> Deploy the function
                  </p>
                  <div className="group relative">
                    <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                      supabase functions deploy server
                    </pre>
                    <button
                      onClick={() => copyToClipboard("supabase functions deploy server", 4)}
                      className="absolute right-2 top-2 rounded-md bg-slate-800 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:text-cyan-400"
                    >
                      {copiedStep === 4 ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Dashboard Deployment */}
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg text-purple-400">
                <ExternalLink className="h-5 w-5" />
                Option 2: Deploy via Dashboard
              </h3>

              <ol className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    1
                  </span>
                  <span>
                    Visit{" "}
                    <a
                      href={`https://supabase.com/dashboard/project/${projectId}/functions`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Supabase Functions Dashboard
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    2
                  </span>
                  <span>Click "Deploy new function"</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    3
                  </span>
                  <span>Name it "server" and upload the files from /supabase/functions/server/</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    4
                  </span>
                  <span>Click "Deploy" and wait for deployment to complete</span>
                </li>
              </ol>
            </div>

            {/* Verification */}
            <div className="rounded-xl border border-green-500/30 bg-green-950/20 p-6">
              <h3 className="mb-3 text-lg text-green-400">Verify Deployment</h3>
              <p className="mb-3 text-sm text-slate-300">
                After deployment, test the health endpoint:
              </p>
              <div className="group relative">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
{`curl https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8/health`}
                </pre>
                <button
                  onClick={() => copyToClipboard(`curl https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8/health`, 5)}
                  className="absolute right-2 top-2 rounded-md bg-slate-800 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:text-cyan-400"
                >
                  {copiedStep === 5 ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Expected response: {`{"status":"ok","timestamp":"..."}`}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/30 p-4">
            <p className="text-sm text-slate-400">
              Need help? Check the{" "}
              <a
                href="https://supabase.com/docs/guides/functions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Supabase Functions documentation
              </a>
            </p>
            <button
              onClick={onClose}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
