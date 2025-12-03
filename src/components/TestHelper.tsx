import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

/**
 * Test Helper Component
 * Shows the status of backend services for debugging
 */
export function TestHelper() {
  const [healthStatus, setHealthStatus] = useState<"loading" | "ok" | "error">("loading");
  const [healthMessage, setHealthMessage] = useState("");
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8/health`;
      
      const response = await fetch(serverUrl, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHealthStatus("ok");
        setHealthMessage(`Server healthy - ${data.timestamp}`);
      } else {
        setHealthStatus("error");
        setHealthMessage(`Server returned ${response.status}`);
      }
    } catch (error: any) {
      setHealthStatus("error");
      setHealthMessage(error.message || "Failed to connect to server");
    }
  };

  if (!showHelper) {
    return (
      <button
        onClick={() => setShowHelper(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors text-sm"
      >
        🔧 Test Helper
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-xl p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          🔧 Backend Status
        </h3>
        <button
          onClick={() => setShowHelper(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Project ID */}
        <div className="flex items-start gap-2">
          <AlertCircle className="size-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-400">Project ID:</div>
            <div className="text-white font-mono text-xs break-all">
              {projectId || "❌ Not set"}
            </div>
          </div>
        </div>

        {/* Health Check */}
        <div className="flex items-start gap-2">
          {healthStatus === "loading" && (
            <Loader2 className="size-4 text-cyan-400 animate-spin mt-0.5 flex-shrink-0" />
          )}
          {healthStatus === "ok" && (
            <CheckCircle2 className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
          )}
          {healthStatus === "error" && (
            <XCircle className="size-4 text-red-400 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <div className="text-gray-400">Server Health:</div>
            <div className={`text-xs ${
              healthStatus === "ok" ? "text-green-400" : 
              healthStatus === "error" ? "text-red-400" : 
              "text-gray-400"
            }`}>
              {healthMessage || "Checking..."}
            </div>
          </div>
        </div>

        {/* Server URL */}
        <div className="flex items-start gap-2">
          <AlertCircle className="size-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-gray-400">Server URL:</div>
            <div className="text-white font-mono text-xs break-all">
              {`https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8`}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={checkHealth}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded text-xs transition-colors"
        >
          🔄 Refresh Health Check
        </button>

        {/* Quick Links */}
        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="text-gray-400 text-xs mb-2">Quick Links:</div>
          <div className="flex flex-col gap-1">
            <a
              href={`https://supabase.com/dashboard/project/${projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-xs"
            >
              → Supabase Dashboard
            </a>
            <a
              href={`https://supabase.com/dashboard/project/${projectId}/auth/users`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-xs"
            >
              → Auth Users
            </a>
            <a
              href={`https://supabase.com/dashboard/project/${projectId}/editor`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-xs"
            >
              → Database Tables
            </a>
            <a
              href={`https://supabase.com/dashboard/project/${projectId}/functions/server/details`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-xs"
            >
              → Edge Function Logs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
