import React, { useState } from "react";
import {
  Upload,
  FileText,
  Link2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Trash2,
  Send,
  Database,
  Activity,
  FileWarning,
  Users,
  Server,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DocumentUploader, type UploadedFile } from "./DocumentUploader";

interface DocumentIngestionProps {
  userRole: "end-user" | "accountant" | "admin" | "compliance-admin" | "super-admin";
}

export const DocumentIngestion: React.FC<DocumentIngestionProps> = ({
  userRole,
}) => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: "FirstBank_Statement_Nov2024.pdf",
      type: "Bank Statement",
      country: "Nigeria",
      status: "completed",
      uploadedDate: "2024-11-25",
      size: "2.4 MB",
      uploadedBy: "John Doe",
    },
    {
      id: 2,
      name: "Dubai_Property_Rental_Q4.pdf",
      type: "Rental Summary",
      country: "UAE",
      status: "processing",
      uploadedDate: "2024-11-26",
      size: "1.8 MB",
      uploadedBy: "John Doe",
    },
    {
      id: 3,
      name: "Binance_Transactions_2024.csv",
      type: "Crypto CSV",
      country: "Global",
      status: "failed",
      uploadedDate: "2024-11-27",
      size: "456 KB",
      uploadedBy: "John Doe",
      error: "Unsupported date format",
    },
    {
      id: 4,
      name: "ICICI_Investment_Summary.pdf",
      type: "Investment PDF",
      country: "India",
      status: "completed",
      uploadedDate: "2024-11-24",
      size: "3.1 MB",
      uploadedBy: "Sarah Johnson",
    },
  ]);

  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      name: "First Bank Nigeria",
      type: "Open Banking",
      status: "active",
      lastSync: "2 hours ago",
    },
    {
      id: 2,
      name: "Binance",
      type: "Crypto Exchange",
      status: "active",
      lastSync: "1 day ago",
    },
  ]);

  const [manualEntries, setManualEntries] = useState([
    {
      id: 1,
      type: "Cash Deposit",
      amount: "₦2,500,000",
      country: "Nigeria",
      date: "2024-11-20",
      status: "verified",
    },
    {
      id: 2,
      type: "Property Sale",
      amount: "AED 450,000",
      country: "UAE",
      date: "2024-10-15",
      status: "pending",
    },
  ]);

  const [clients] = useState([
    { id: 1, name: "John Doe", pendingDocs: 3, status: "incomplete" },
    { id: 2, name: "Sarah Johnson", pendingDocs: 0, status: "complete" },
    { id: 3, name: "Michael Chen", pendingDocs: 5, status: "incomplete" },
    { id: 4, name: "Amara Obi", pendingDocs: 1, status: "incomplete" },
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop logic here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-400 bg-emerald-500/20";
      case "processing":
        return "text-blue-400 bg-blue-500/20";
      case "failed":
        return "text-red-400 bg-red-500/20";
      case "pending":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-slate-400 bg-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Role-specific tabs
  const getTabs = () => {
    const baseTabs = [
      { id: "upload", label: "Upload Documents", icon: Upload },
      { id: "connect", label: "Connected Accounts", icon: Link2 },
      { id: "manual", label: "Manual Entry", icon: Edit3 },
      { id: "history", label: "Document History", icon: FileText },
    ];

    if (userRole === "accountant") {
      baseTabs.push({ id: "clients", label: "Client Documents", icon: Users });
    }

    if (userRole === "admin" || userRole === "compliance-admin" || userRole === "super-admin") {
      baseTabs.push({ id: "monitoring", label: "Monitoring", icon: Activity });
    }

    if (userRole === "compliance-admin") {
      baseTabs.push({ id: "edge-cases", label: "Edge Cases", icon: FileWarning });
    }

    if (userRole === "super-admin") {
      baseTabs.push({ id: "system", label: "System Health", icon: Server });
    }

    return baseTabs;
  };

  const tabs = getTabs();

  const handleUploadComplete = (files: UploadedFile[]) => {
    console.log("Files uploaded:", files);
    // In production, this would update the database
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-slate-100">Document & Data Ingestion</h1>
        <p className="mt-2 text-slate-400">
          {userRole === "end-user" && "Upload documents, connect accounts, and manage your financial data"}
          {userRole === "accountant" && "Manage client documents and data submissions"}
          {userRole === "admin" && "Monitor document processing and ingestion health"}
          {userRole === "compliance-admin" && "Oversee edge-case documents and compliance matters"}
          {userRole === "super-admin" && "Ensure ingestion services run reliably under load"}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-800">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Upload Documents Tab */}
        {activeTab === "upload" && (
          <div className="space-y-6">
            {/* Upload Area with new DocumentUploader */}
            <DocumentUploader
              onUploadComplete={handleUploadComplete}
              maxFiles={10}
              maxSizeMB={50}
              acceptedTypes={[".pdf", ".png", ".jpg", ".jpeg", ".csv", ".xlsx", ".doc", ".docx"]}
            />

            {/* Document Type Categories */}
            <div>
              <h3 className="mb-4 text-slate-100">
                Supported Document Types
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    name: "Bank Statements",
                    icon: FileText,
                    description: "Foreign bank account statements",
                    color: "blue",
                  },
                  {
                    name: "Investment PDFs",
                    icon: TrendingUp,
                    description: "Stock, bond, mutual fund reports",
                    color: "emerald",
                  },
                  {
                    name: "Rental Summaries",
                    icon: FileText,
                    description: "Property rental income documents",
                    color: "purple",
                  },
                  {
                    name: "Crypto CSVs",
                    icon: Database,
                    description: "Cryptocurrency transaction exports",
                    color: "amber",
                  },
                ].map((type) => (
                  <div
                    key={type.name}
                    className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                  >
                    <div
                      className={`mb-3 inline-flex rounded-lg bg-${type.color}-500/20 p-2`}
                    >
                      <type.icon className={`h-5 w-5 text-${type.color}-400`} />
                    </div>
                    <div className="font-medium text-slate-200">{type.name}</div>
                    <p className="mt-1 text-sm text-slate-400">
                      {type.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Upload Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <div className="text-sm text-slate-400">Total Uploaded</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-2xl text-slate-100">47</div>
                  <div className="text-sm text-emerald-400">+12 this month</div>
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <div className="text-sm text-slate-400">Processing</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-2xl text-slate-100">3</div>
                  <div className="text-sm text-blue-400">In progress</div>
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <div className="text-sm text-slate-400">Failed</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-2xl text-slate-100">2</div>
                  <div className="text-sm text-red-400">Needs attention</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connected Accounts Tab */}
        {activeTab === "connect" && (
          <div className="space-y-6">
            {/* Available Connections */}
            <div>
              <h3 className="mb-4 text-slate-100">
                Available Connections
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    name: "Open Banking (UK)",
                    description: "Connect UK bank accounts automatically",
                    icon: Link2,
                    color: "blue",
                  },
                  {
                    name: "Crypto Exchanges",
                    description: "Binance, Coinbase, Kraken",
                    icon: Database,
                    color: "amber",
                  },
                ].map((connection) => (
                  <div
                    key={connection.name}
                    className="rounded-lg border border-slate-800 bg-slate-900/50 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`rounded-lg bg-${connection.color}-500/20 p-3`}
                        >
                          <connection.icon
                            className={`h-6 w-6 text-${connection.color}-400`}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-slate-100">
                            {connection.name}
                          </div>
                          <p className="mt-1 text-sm text-slate-400">
                            {connection.description}
                          </p>
                        </div>
                      </div>
                      <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700">
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Accounts List */}
            <div>
              <h3 className="mb-4 text-slate-100">
                Connected Accounts
              </h3>
              <div className="space-y-3">
                {connectedAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-100">
                          {account.name}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-slate-400">
                          <span>{account.type}</span>
                          <span>•</span>
                          <span>Last synced: {account.lastSync}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                        Sync Now
                      </button>
                      <button className="rounded-lg border border-red-900/50 bg-red-950/50 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-900/50">
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manual Entry Tab */}
        {activeTab === "manual" && (
          <div className="space-y-6">
            {/* Manual Entry Form */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="mb-4 text-slate-100">
                Add Manual Entry
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Entry Type
                  </label>
                  <select className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100">
                    <option>Cash Deposit</option>
                    <option>Property Sale</option>
                    <option>Investment Income</option>
                    <option>Rental Income</option>
                    <option>Business Income</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Country
                  </label>
                  <select className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100">
                    <option>Nigeria</option>
                    <option>UAE</option>
                    <option>India</option>
                    <option>Kenya</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Amount
                  </label>
                  <input
                    type="text"
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-slate-300">
                    Description / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add any additional details..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                  Cancel
                </button>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700">
                  Add Entry
                </button>
              </div>
            </div>

            {/* Existing Manual Entries */}
            <div>
              <h3 className="mb-4 text-slate-100">
                Manual Entries
              </h3>
              <div className="space-y-3">
                {manualEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                        <Edit3 className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-100">
                          {entry.type} - {entry.country}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-slate-400">
                          <span className="font-medium text-slate-300">
                            {entry.amount}
                          </span>
                          <span>•</span>
                          <span>{entry.date}</span>
                          <span>•</span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${getStatusColor(
                              entry.status
                            )}`}
                          >
                            {entry.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                        Edit
                      </button>
                      <button className="rounded-lg border border-red-900/50 bg-red-950/50 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-900/50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Document History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-slate-100 placeholder-slate-500"
                />
              </div>
              <select className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100">
                <option>All Types</option>
                <option>Bank Statements</option>
                <option>Investment PDFs</option>
                <option>Rental Summaries</option>
                <option>Crypto CSVs</option>
              </select>
              <select className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100">
                <option>All Status</option>
                <option>Completed</option>
                <option>Processing</option>
                <option>Failed</option>
              </select>
            </div>

            {/* Documents Table */}
            <div className="overflow-hidden rounded-lg border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-800 bg-slate-900/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-400">
                        Document Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-400">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-400">
                        Country
                      </th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-400">
                        Upload Date
                      </th>
                      {(userRole === "accountant" || userRole === "admin") && (
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-400">
                          Uploaded By
                        </th>
                      )}
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {uploadedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-800/50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-slate-400" />
                            <div>
                              <div className="text-sm text-slate-100">
                                {file.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {file.size}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          {file.type}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          {file.country}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${getStatusColor(
                              file.status
                            )}`}
                          >
                            {getStatusIcon(file.status)}
                            {file.status}
                          </span>
                          {file.error && (
                            <div className="mt-1 text-xs text-red-400">
                              {file.error}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          {file.uploadedDate}
                        </td>
                        {(userRole === "accountant" || userRole === "admin") && (
                          <td className="px-4 py-4 text-sm text-slate-300">
                            {file.uploadedBy}
                          </td>
                        )}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 transition-colors hover:bg-slate-700">
                              <Download className="h-4 w-4" />
                            </button>
                            {file.status === "failed" && (
                              <button className="rounded-lg border border-indigo-900/50 bg-indigo-950/50 p-2 text-indigo-400 transition-colors hover:bg-indigo-900/50">
                                Retry
                              </button>
                            )}
                            <button className="rounded-lg border border-red-900/50 bg-red-950/50 p-2 text-red-400 transition-colors hover:bg-red-900/50">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Client Documents Tab (Accountant Only) */}
        {activeTab === "clients" && userRole === "accountant" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-100">Client Document Status</h3>
              <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700">
                <Send className="h-4 w-4" />
                Request Documents
              </button>
            </div>

            <div className="grid gap-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          client.status === "complete"
                            ? "bg-emerald-500/20"
                            : "bg-amber-500/20"
                        }`}
                      >
                        {client.status === "complete" ? (
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-100">
                          {client.name}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          {client.pendingDocs > 0
                            ? `${client.pendingDocs} document${
                                client.pendingDocs > 1 ? "s" : ""
                              } pending`
                            : "All documents submitted"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                        View Documents
                      </button>
                      {client.pendingDocs > 0 && (
                        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700">
                          <Send className="h-4 w-4" />
                          Send Reminder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monitoring Tab (Admin Roles) */}
        {activeTab === "monitoring" &&
          (userRole === "admin" ||
            userRole === "compliance-admin" ||
            userRole === "super-admin") && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                      Total Ingested Today
                    </div>
                    <Activity className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="mt-2 text-2xl text-slate-100">127</div>
                  <div className="mt-1 text-xs text-emerald-400">
                    +23% vs yesterday
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">OCR Success Rate</div>
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl text-slate-100">94.2%</div>
                  <div className="mt-1 text-xs text-emerald-400">
                    Within target
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">Failed Uploads</div>
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="mt-2 text-2xl text-slate-100">8</div>
                  <div className="mt-1 text-xs text-red-400">
                    Requires attention
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">Processing Queue</div>
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="mt-2 text-2xl text-slate-100">12</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Avg wait: 3 min
                  </div>
                </div>
              </div>

              {/* Recent Failures */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="mb-4 text-slate-100">Recent Failures</h3>
                <div className="space-y-3">
                  {[
                    {
                      file: "Binance_Transactions_2024.csv",
                      error: "Unsupported date format",
                      user: "John Doe",
                      time: "2 hours ago",
                    },
                    {
                      file: "Bank_Statement_Scan.jpg",
                      error: "OCR confidence too low (32%)",
                      user: "Sarah Johnson",
                      time: "4 hours ago",
                    },
                    {
                      file: "Mixed_Funds_Report.pdf",
                      error: "Unable to categorize transaction types",
                      user: "Michael Chen",
                      time: "6 hours ago",
                    },
                  ].map((failure, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between rounded-lg border border-red-900/30 bg-red-950/20 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <div>
                          <div className="font-medium text-slate-100">
                            {failure.file}
                          </div>
                          <div className="mt-1 text-sm text-red-400">
                            {failure.error}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                            <span>{failure.user}</span>
                            <span>•</span>
                            <span>{failure.time}</span>
                          </div>
                        </div>
                      </div>
                      <button className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                        Investigate
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unsupported Formats */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="mb-4 text-slate-100">
                  Unsupported Format Reports
                </h3>
                <div className="space-y-2">
                  {[
                    { format: ".xls (legacy Excel)", count: 3 },
                    { format: ".doc (legacy Word)", count: 2 },
                    { format: ".tiff images", count: 1 },
                  ].map((format, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 p-3"
                    >
                      <span className="text-sm text-slate-300">
                        {format.format}
                      </span>
                      <span className="text-sm text-slate-400">
                        {format.count} attempt{format.count > 1 ? "s" : ""} today
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Edge Cases Tab (Compliance Admin) */}
        {activeTab === "edge-cases" && userRole === "compliance-admin" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-slate-100">
                Edge-Case Document Review
              </h3>
              <p className="text-sm text-slate-400">
                Documents requiring special compliance consideration
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  file: "Mixed_Source_Funds.pdf",
                  user: "Michael Chen",
                  issue: "Mixed business and personal funds",
                  priority: "high",
                  date: "2024-11-27",
                },
                {
                  id: 2,
                  file: "Crypto_Mining_Income.csv",
                  user: "Amara Obi",
                  issue: "Unclear tax treatment for mining vs. trading",
                  priority: "medium",
                  date: "2024-11-26",
                },
                {
                  id: 3,
                  file: "Cross_Border_Inheritance.pdf",
                  user: "John Doe",
                  issue: "Inheritance from non-treaty country",
                  priority: "high",
                  date: "2024-11-25",
                },
              ].map((edgeCase) => (
                <div
                  key={edgeCase.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                          edgeCase.priority === "high"
                            ? "bg-red-500/20"
                            : "bg-amber-500/20"
                        }`}
                      >
                        <FileWarning
                          className={`h-5 w-5 ${
                            edgeCase.priority === "high"
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-slate-100">
                            {edgeCase.file}
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              edgeCase.priority === "high"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {edgeCase.priority} priority
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-slate-300">
                          <strong>Issue:</strong> {edgeCase.issue}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                          <span>User: {edgeCase.user}</span>
                          <span>•</span>
                          <span>Submitted: {edgeCase.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700">
                        Review & Categorize
                      </button>
                      <button className="whitespace-nowrap rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                        Request Info
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Health Tab (Super Admin) */}
        {activeTab === "system" && userRole === "super-admin" && (
          <div className="space-y-6">
            {/* Service Status */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "Upload Service",
                  status: "operational",
                  uptime: "99.98%",
                  response: "142ms",
                },
                {
                  name: "OCR Engine",
                  status: "operational",
                  uptime: "99.94%",
                  response: "3.2s",
                },
                {
                  name: "Data Processing",
                  status: "degraded",
                  uptime: "97.12%",
                  response: "8.7s",
                },
                {
                  name: "Storage Service",
                  status: "operational",
                  uptime: "99.99%",
                  response: "89ms",
                },
              ].map((service) => (
                <div
                  key={service.name}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-100">
                      {service.name}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${
                        service.status === "operational"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          service.status === "operational"
                            ? "bg-emerald-400"
                            : "bg-amber-400"
                        }`}
                      />
                      {service.status}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Uptime (30d)</div>
                      <div className="mt-1 text-slate-100">{service.uptime}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Avg Response</div>
                      <div className="mt-1 text-slate-100">
                        {service.response}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load Metrics */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="mb-4 text-slate-100">Load Metrics</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-sm text-slate-400">Current Load</div>
                  <div className="mt-2 text-2xl text-slate-100">42%</div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: "42%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Peak Today</div>
                  <div className="mt-2 text-2xl text-slate-100">78%</div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: "78%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Capacity Buffer</div>
                  <div className="mt-2 text-2xl text-slate-100">58%</div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: "58%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="mb-4 text-slate-100">System Alerts</h3>
              <div className="space-y-3">
                {[
                  {
                    level: "warning",
                    message: "Data processing service experiencing delays",
                    time: "15 minutes ago",
                  },
                  {
                    level: "info",
                    message: "Scheduled maintenance window: Dec 1, 02:00 GMT",
                    time: "2 hours ago",
                  },
                ].map((alert, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                      alert.level === "warning"
                        ? "border-amber-900/30 bg-amber-950/20"
                        : "border-blue-900/30 bg-blue-950/20"
                    }`}
                  >
                    <AlertCircle
                      className={`h-5 w-5 ${
                        alert.level === "warning"
                          ? "text-amber-400"
                          : "text-blue-400"
                      }`}
                    />
                    <div className="flex-1">
                      <div
                        className={`text-sm ${
                          alert.level === "warning"
                            ? "text-amber-300"
                            : "text-blue-300"
                        }`}
                      >
                        {alert.message}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {alert.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};