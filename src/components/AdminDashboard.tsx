import React, { useState } from "react";
import {
  Shield,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  FileText,
  Key,
} from "lucide-react";

type AdminRole = "support" | "compliance" | "super";

interface AdminDashboardProps {
  adminRole: AdminRole;
  onRoleChange: (role: AdminRole) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  adminRole,
  onRoleChange,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const getRoleConfig = () => {
    switch (adminRole) {
      case "support":
        return {
          title: "Support Admin",
          description: "Assist with user onboarding and account issues",
          color: "sky",
          tabs: [
            { id: "overview", label: "Overview", icon: Shield },
            { id: "tickets", label: "Support Tickets", icon: AlertTriangle },
            { id: "users", label: "User Accounts", icon: Users },
          ],
        };
      case "compliance":
        return {
          title: "Compliance Admin",
          description: "Ensure platform meets HMRC compliance standards",
          color: "amber",
          tabs: [
            { id: "overview", label: "Overview", icon: Shield },
            { id: "audits", label: "Compliance Audits", icon: FileText },
            { id: "rules", label: "Rule Management", icon: Settings },
          ],
        };
      case "super":
        return {
          title: "Super Admin",
          description: "Full system access and role management",
          color: "purple",
          tabs: [
            { id: "overview", label: "Overview", icon: Shield },
            { id: "users", label: "All Users", icon: Users },
            { id: "roles", label: "Role Permissions", icon: Key },
            { id: "system", label: "System Settings", icon: Settings },
          ],
        };
    }
  };

  const config = getRoleConfig();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-slate-100">
                  GACE Admin Portal
                </h1>
                <span
                  className={`rounded-full bg-${config.color}-500/20 px-2 py-0.5 text-xs font-semibold text-${config.color}-300`}
                >
                  {config.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">{config.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher for Demo */}
            <select
              value={adminRole}
              onChange={(e) => onRoleChange(e.target.value as AdminRole)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              <option value="support">Support Admin</option>
              <option value="compliance">Compliance Admin</option>
              <option value="super">Super Admin</option>
            </select>
            
            <button className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
              Notifications
            </button>
            
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                AD
              </div>
              <span className="text-sm text-slate-300">Admin</span>
            </div>
            
            <button
              onClick={onLogout}
              className="rounded-lg border border-rose-500/40 bg-slate-900 px-3 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-950/60"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6">
          {config.tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* Overview Tab - Common to all roles */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Total Users
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-slate-50">
                    1,247
                  </div>
                  <div className="mt-1 text-xs text-emerald-400">
                    +12% this month
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Active Accounts
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-slate-50">
                    1,089
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    87% activation rate
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    {role === "support" ? "Open Tickets" : "Pending Reviews"}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-amber-400">
                    23
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Requires attention
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    System Status
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-slate-50">
                      Operational
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-emerald-400">
                    99.8% uptime
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="mb-4 font-semibold text-slate-100">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      type: "user",
                      message: "New user registration: john.doe@example.com",
                      time: "2 minutes ago",
                      icon: Users,
                      color: "text-sky-400",
                    },
                    {
                      type: "support",
                      message: "Support ticket resolved: Password reset issue",
                      time: "15 minutes ago",
                      icon: CheckCircle,
                      color: "text-emerald-400",
                    },
                    {
                      type: "compliance",
                      message: "Compliance audit completed for Q4 2025",
                      time: "1 hour ago",
                      icon: FileText,
                      color: "text-amber-400",
                    },
                    {
                      type: "system",
                      message: "System backup completed successfully",
                      time: "2 hours ago",
                      icon: Shield,
                      color: "text-indigo-400",
                    },
                  ].map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-800/50 p-3"
                      >
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 ${activity.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-slate-300">
                            {activity.message}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Support Admin - Tickets */}
          {activeTab === "tickets" && role === "support" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-100">
                Support Tickets
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: "#1234",
                    user: "john.doe@example.com",
                    issue: "Unable to reset password",
                    status: "open",
                    priority: "high",
                  },
                  {
                    id: "#1233",
                    user: "jane.smith@example.com",
                    issue: "Email verification not received",
                    status: "in-progress",
                    priority: "medium",
                  },
                  {
                    id: "#1232",
                    user: "bob.wilson@example.com",
                    issue: "Question about asset upload",
                    status: "open",
                    priority: "low",
                  },
                ].map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-100">
                            {ticket.id}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              ticket.status === "open"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-sky-500/20 text-sky-300"
                            }`}
                          >
                            {ticket.status}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              ticket.priority === "high"
                                ? "bg-rose-500/20 text-rose-300"
                                : ticket.priority === "medium"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-slate-300">
                          {ticket.issue}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          User: {ticket.user}
                        </div>
                      </div>
                      <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-100">
                  User Management
                </h2>
                <input
                  type="search"
                  placeholder="Search users..."
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      {
                        email: "john.doe@example.com",
                        type: "End User",
                        status: "active",
                        joined: "2025-11-15",
                      },
                      {
                        email: "accountant@firm.com",
                        type: "Accountant",
                        status: "active",
                        joined: "2025-11-10",
                      },
                      {
                        email: "jane.smith@example.com",
                        type: "End User",
                        status: "pending",
                        joined: "2025-11-25",
                      },
                    ].map((user, index) => (
                      <tr key={index} className="hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {user.type}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              user.status === "active"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-400">
                          {user.joined}
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-sm text-indigo-400 hover:text-indigo-300">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Role Permissions - Super Admin Only */}
          {activeTab === "roles" && role === "super" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-100">
                Role Permissions
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    role: "Support Admin",
                    description: "Handle user support and account issues",
                    permissions: [
                      "View user accounts",
                      "Reset passwords",
                      "Manage support tickets",
                    ],
                    color: "sky",
                  },
                  {
                    role: "Compliance Admin",
                    description: "Ensure HMRC compliance",
                    permissions: [
                      "Audit compliance rules",
                      "Review tax calculations",
                      "Update regulatory requirements",
                    ],
                    color: "amber",
                  },
                  {
                    role: "Super Admin",
                    description: "Full system access",
                    permissions: [
                      "All permissions",
                      "Manage admin roles",
                      "System configuration",
                    ],
                    color: "purple",
                  },
                ].map((roleInfo) => (
                  <div
                    key={roleInfo.role}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-${roleInfo.color}-500/20`}
                    >
                      <UserCheck
                        className={`h-5 w-5 text-${roleInfo.color}-400`}
                      />
                    </div>
                    <h3 className="font-semibold text-slate-100">
                      {roleInfo.role}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {roleInfo.description}
                    </p>
                    <ul className="mt-3 space-y-1">
                      {roleInfo.permissions.map((perm, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs text-slate-300"
                        >
                          <CheckCircle className="h-3 w-3 text-emerald-400" />
                          {perm}
                        </li>
                      ))}
                    </ul>
                    <button className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700">
                      Edit Permissions
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};