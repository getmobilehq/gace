import React, { useState } from "react";
import { FileText, Download, Eye, Calendar, CheckCircle, Clock } from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: "self-assessment" | "cgt-return" | "foreign-income" | "annual-summary";
  taxYear: string;
  status: "draft" | "ready" | "filed" | "accepted";
  generatedDate: string;
  filingDeadline?: string;
  description: string;
  sections: string[];
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "UK Self Assessment Tax Return 2024/25",
    type: "self-assessment",
    taxYear: "2024/25",
    status: "ready",
    generatedDate: "2025-11-24",
    filingDeadline: "2026-01-31",
    description:
      "Complete Self Assessment return including all worldwide income, capital gains, and foreign tax credits. HMRC-ready format for online submission.",
    sections: [
      "SA100 Main Return",
      "SA108 Capital Gains",
      "SA106 Foreign Income",
      "Tax Calculation Summary",
      "Payment on Account Schedule",
    ],
  },
  {
    id: "2",
    title: "Capital Gains Tax Summary 2024/25",
    type: "cgt-return",
    taxYear: "2024/25",
    status: "draft",
    generatedDate: "2025-11-26",
    filingDeadline: "2026-01-31",
    description:
      "Detailed CGT calculation covering UK and foreign asset disposals with DTA adjustments and foreign tax credit claims.",
    sections: [
      "Disposal Summary by Asset",
      "Cost Basis Calculations",
      "Foreign Tax Credits Applied",
      "Annual Exemption Usage",
      "CGT Computation",
    ],
  },
  {
    id: "3",
    title: "Foreign Income Declaration 2024/25",
    type: "foreign-income",
    taxYear: "2024/25",
    status: "draft",
    generatedDate: "2025-11-20",
    filingDeadline: "2026-01-31",
    description:
      "Declaration of all foreign income sources including dividends, interest, and rental income from overseas properties.",
    sections: [
      "Nigerian Dividend Income",
      "UAE Property Rental Income",
      "US ETF Distributions",
      "Foreign Tax Paid",
      "Double Taxation Relief",
    ],
  },
  {
    id: "4",
    title: "Annual Compliance Summary 2023/24",
    type: "annual-summary",
    taxYear: "2023/24",
    status: "filed",
    generatedDate: "2025-01-15",
    description:
      "Filed and accepted annual summary of all tax obligations for the 2023/24 tax year.",
    sections: [
      "Income Summary",
      "CGT Summary",
      "Foreign Assets Report",
      "Payment History",
      "HMRC Acknowledgment",
    ],
  },
  {
    id: "5",
    title: "Annual Compliance Summary 2022/23",
    type: "annual-summary",
    taxYear: "2022/23",
    status: "accepted",
    generatedDate: "2024-01-20",
    description:
      "Completed and accepted filing for 2022/23 tax year. All obligations met.",
    sections: [
      "Income Summary",
      "CGT Summary",
      "Foreign Assets Report",
      "Payment History",
      "HMRC Acknowledgment",
    ],
  },
];

export const HMRCReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  const filteredReports = mockReports.filter((report) => {
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
    const matchesYear = filterYear === "all" || report.taxYear === filterYear;
    return matchesStatus && matchesYear;
  });

  const taxYears = [
    "all",
    ...Array.from(new Set(mockReports.map((r) => r.taxYear))),
  ];

  const draftCount = mockReports.filter((r) => r.status === "draft").length;
  const readyCount = mockReports.filter((r) => r.status === "ready").length;
  const filedCount = mockReports.filter(
    (r) => r.status === "filed" || r.status === "accepted"
  ).length;

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "draft":
        return "bg-slate-700 text-slate-300";
      case "ready":
        return "bg-emerald-500/20 text-emerald-300";
      case "filed":
        return "bg-sky-500/20 text-sky-300";
      case "accepted":
        return "bg-indigo-500/20 text-indigo-300";
    }
  };

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4" />;
      case "ready":
      case "filed":
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getReportTypeLabel = (type: Report["type"]) => {
    switch (type) {
      case "self-assessment":
        return "Self Assessment";
      case "cgt-return":
        return "CGT Return";
      case "foreign-income":
        return "Foreign Income";
      case "annual-summary":
        return "Annual Summary";
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Total Reports
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {mockReports.length}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Across {taxYears.length - 1} tax years
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="h-4 w-4" />
            <div className="text-xs font-medium uppercase tracking-[0.18em]">
              Draft Reports
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {draftCount}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Being prepared
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle className="h-4 w-4" />
            <div className="text-xs font-medium uppercase tracking-[0.18em]">
              Ready to File
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {readyCount}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            HMRC-compliant
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <FileText className="h-4 w-4" />
            <div className="text-xs font-medium uppercase tracking-[0.18em]">
              Filed Returns
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {filedCount}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Successfully submitted
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-400">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
              <option value="filed">Filed</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-400">Tax Year:</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {taxYears.map((year) => (
                <option key={year} value={year}>
                  {year === "all" ? "All Years" : year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
          <Download className="h-4 w-4" />
          Export All Reports
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-indigo-500/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-1 items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/20">
                  <FileText className="h-6 w-6 text-indigo-400" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100">
                      {report.title}
                    </h3>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    {report.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Tax Year: {report.taxYear}
                    </div>
                    <div>Type: {getReportTypeLabel(report.type)}</div>
                    <div>Generated: {report.generatedDate}</div>
                    {report.filingDeadline && (
                      <div className="font-medium text-amber-400">
                        Deadline: {report.filingDeadline}
                      </div>
                    )}
                  </div>

                  {/* Sections */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.sections.slice(0, 3).map((section, index) => (
                      <span
                        key={index}
                        className="rounded-lg border border-slate-700 bg-slate-800/50 px-2 py-1 text-[10px] text-slate-300"
                      >
                        {section}
                      </span>
                    ))}
                    {report.sections.length > 3 && (
                      <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-2 py-1 text-[10px] text-slate-400">
                        +{report.sections.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100 hover:border-indigo-500 hover:bg-slate-800"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-4 font-semibold text-slate-100">
            No reports match your filters
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Try adjusting your filter criteria
          </p>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/20">
                  <FileText className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {selectedReport.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {getReportTypeLabel(selectedReport.type)} • Tax Year{" "}
                    {selectedReport.taxYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-2 hover:bg-slate-800"
              >
                <span className="text-slate-400">✕</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">
                      Report Status
                    </h4>
                    <p className="mt-1 text-sm text-slate-400">
                      Generated on {selectedReport.generatedDate}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusColor(
                      selectedReport.status
                    )}`}
                  >
                    {getStatusIcon(selectedReport.status)}
                    {selectedReport.status.charAt(0).toUpperCase() +
                      selectedReport.status.slice(1)}
                  </span>
                </div>
                {selectedReport.filingDeadline && (
                  <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-semibold">
                        Filing Deadline: {selectedReport.filingDeadline}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-slate-100">
                  Description
                </h4>
                <p className="text-sm text-slate-300">
                  {selectedReport.description}
                </p>
              </div>

              {/* Sections */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-100">
                  Report Sections
                </h4>
                <div className="space-y-2">
                  {selectedReport.sections.map((section, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm"
                    >
                      <span className="text-slate-300">{section}</span>
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data Preview */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-100">
                  Preview (Sample Data)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between rounded-lg bg-slate-900/50 px-3 py-2">
                    <span className="text-slate-400">Total Income</span>
                    <span className="font-semibold text-slate-100">£84,500</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-slate-900/50 px-3 py-2">
                    <span className="text-slate-400">Capital Gains</span>
                    <span className="font-semibold text-slate-100">£22,350</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-slate-900/50 px-3 py-2">
                    <span className="text-slate-400">Foreign Tax Paid</span>
                    <span className="font-semibold text-slate-100">£2,180</span>
                  </div>
                  <div className="flex justify-between rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-3 py-2">
                    <span className="text-indigo-300">Estimated Tax Due</span>
                    <span className="font-semibold text-indigo-300">£6,780</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 font-medium text-slate-100 hover:border-indigo-500 hover:bg-slate-700">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                {selectedReport.status === "ready" && (
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700">
                    <FileText className="h-4 w-4" />
                    Submit to HMRC
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
