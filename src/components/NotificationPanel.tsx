import React, { useEffect, useRef } from "react";
import { AlertTriangle, FileCheck, TrendingUp, X, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: "alert" | "report" | "update";
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onViewAll: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onViewAll,
  onMarkAsRead,
  onClearAll,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case "report":
        return <FileCheck className="h-4 w-4 text-cyan-400" />;
      case "update":
        return <TrendingUp className="h-4 w-4 text-purple-400" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return "from-rose-500/20 to-pink-500/20 border-rose-500/30";
      case "report":
        return "from-cyan-500/20 to-blue-500/20 border-cyan-500/30";
      case "update":
        return "from-purple-500/20 to-indigo-500/20 border-purple-500/30";
    }
  };

  return (
    <div
      ref={panelRef}
      className="glass glow-blue absolute right-0 top-14 z-50 w-96 rounded-2xl border border-indigo-500/30 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-500/20 p-4">
        <div>
          <h3 className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-semibold text-transparent">
            Notifications
          </h3>
          <p className="text-xs text-slate-400">
            {notifications.filter((n) => n.unread).length} unread
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 transition-colors hover:bg-indigo-500/20"
          aria-label="Close notifications"
        >
          <X className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
              <FileCheck className="h-6 w-6 text-cyan-400" />
            </div>
            <p className="text-sm text-slate-400">No notifications</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative rounded-xl border bg-gradient-to-r p-3 transition-all hover:glow-blue ${getTypeColor(notification.type)} ${
                  notification.unread ? "border-opacity-50" : "border-opacity-20 opacity-60"
                }`}
              >
                {notification.unread && (
                  <span className="glow-cyan absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />
                )}

                <div className="flex gap-3">
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-100">
                      {notification.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-300">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      {notification.time}
                    </div>
                  </div>
                </div>

                {notification.unread && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="absolute bottom-2 right-2 rounded-full bg-indigo-900/50 px-2 py-1 text-[9px] font-semibold text-cyan-400 opacity-0 transition-opacity hover:bg-indigo-800/50 group-hover:opacity-100"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="flex gap-2 border-t border-indigo-500/20 p-3">
          <button
            onClick={onViewAll}
            className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-indigo-500/30 py-2 text-xs font-semibold text-cyan-300 transition-all hover:border-cyan-500/50 hover:glow-blue"
          >
            View All Alerts
          </button>
          <button
            onClick={onClearAll}
            className="rounded-xl border border-indigo-500/30 bg-slate-900/50 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-rose-500/50 hover:text-rose-300"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
