import { useState } from "react";
import { Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

/**
 * Cleanup Tool - Delete test users
 * TEMPORARY COMPONENT FOR TESTING ONLY!
 */
export function CleanupTool() {
  const [email, setEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleDelete = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter an email address" });
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8/admin/delete-user`;

      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `✅ Successfully deleted: ${email}. You can now sign up with this email again!`,
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error || data.message || "Failed to delete user",
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to connect to server",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-900 border border-red-500/30 rounded-lg shadow-xl p-4 max-w-sm z-50">
      <div className="flex items-center gap-2 mb-3">
        <Trash2 className="size-5 text-red-400" />
        <h3 className="font-semibold text-white">Delete Test User</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Email to delete:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="bidemigraceo@yahoo.com"
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
            disabled={isDeleting}
          />
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting || !email}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
        >
          {isDeleting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="size-4" />
              Delete User
            </>
          )}
        </button>

        {message && (
          <div
            className={`flex items-start gap-2 p-3 rounded text-sm ${
              message.type === "success"
                ? "bg-green-950/50 text-green-300 border border-green-500/30"
                : "bg-red-950/50 text-red-300 border border-red-500/30"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="size-4 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="size-4 mt-0.5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
          ⚠️ This deletes the user from both Auth and Database.
          <br />
          Only use for testing!
        </div>
      </div>
    </div>
  );
}