import React from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle, Link2, Shield, Zap } from "lucide-react";

/**
 * Status indicator showing the routing system is active
 * Can be used for debugging or showing system status
 */
export const RoutingStatus: React.FC = () => {
  const location = useLocation();

  const features = [
    { icon: Link2, label: "URL Navigation", status: "Active" },
    { icon: Shield, label: "Route Protection", status: "Active" },
    { icon: Zap, label: "Deep Linking", status: "Active" },
    { icon: CheckCircle, label: "Browser History", status: "Active" },
  ];

  return (
    <div className="glass fixed bottom-4 left-4 z-50 w-80 rounded-xl border border-indigo-500/30 p-4 shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-center justify-between border-b border-indigo-500/20 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-cyan-400">
            Routing System Status
          </h3>
          <p className="text-[10px] text-slate-400">React Router v6</p>
        </div>
        <div className="glow-cyan flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
          <CheckCircle className="h-5 w-5 text-cyan-400" />
        </div>
      </div>

      <div className="mb-3 space-y-2">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-indigo-950/30 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3 w-3 text-cyan-400" />
                <span className="text-xs text-slate-300">{feature.label}</span>
              </div>
              <span className="glow-cyan rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                {feature.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-purple-500/20 bg-purple-950/30 p-3">
        <div className="mb-1 text-[10px] font-semibold text-purple-300">
          Current Route
        </div>
        <code className="block break-all text-xs text-purple-400">
          {location.pathname}
        </code>
        {location.search && (
          <code className="mt-1 block break-all text-[10px] text-slate-400">
            {location.search}
          </code>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <a
          href="/ROUTING.md"
          target="_blank"
          className="flex-1 rounded-lg border border-indigo-500/30 bg-slate-900/50 px-3 py-1.5 text-center text-[10px] font-semibold text-cyan-300 transition-all hover:border-cyan-500/50 hover:bg-indigo-950/30"
        >
          📖 Docs
        </a>
        <a
          href="/ROUTING_QUICK_REFERENCE.md"
          target="_blank"
          className="flex-1 rounded-lg border border-indigo-500/30 bg-slate-900/50 px-3 py-1.5 text-center text-[10px] font-semibold text-purple-300 transition-all hover:border-purple-500/50 hover:bg-purple-950/30"
        >
          ⚡ Quick Ref
        </a>
      </div>
    </div>
  );
};
