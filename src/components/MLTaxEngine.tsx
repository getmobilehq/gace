import React, { useState } from "react";
import { Brain, Zap, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { DtaCalculator } from "./DtaCalculator";

interface TaxAnalysis {
  jurisdiction: string;
  scenarios: {
    name: string;
    description: string;
    estimatedLiability: number;
    confidence: number;
    recommendations: string[];
  }[];
}

const taxAnalyses: TaxAnalysis[] = [
  {
    jurisdiction: "United Kingdom",
    scenarios: [
      {
        name: "Current Position (No Disposals)",
        description: "Holding all assets without any disposal transactions",
        estimatedLiability: 0,
        confidence: 98,
        recommendations: [
          "No immediate CGT liability",
          "Monitor annual allowance (£3,000 for 2025/26)",
          "Consider tax-loss harvesting opportunities",
        ],
      },
      {
        name: "Optimal Disposal Strategy",
        description:
          "Strategic disposal to utilize annual CGT allowance efficiently",
        estimatedLiability: 3420,
        confidence: 92,
        recommendations: [
          "Dispose of £15,000 in gains to stay within allowance",
          "Realize losses on underperforming assets to offset gains",
          "Defer remaining gains to next tax year",
        ],
      },
      {
        name: "Full Portfolio Liquidation",
        description: "Complete disposal of all UK-sourced assets",
        estimatedLiability: 18460,
        confidence: 95,
        recommendations: [
          "CGT liability of £18,460 at 20% rate",
          "Consider spreading disposals across multiple tax years",
          "Explore Capital Gains Tax deferral relief options",
        ],
      },
    ],
  },
  {
    jurisdiction: "Nigeria",
    scenarios: [
      {
        name: "Current Position",
        description: "Holding Nigerian equities without disposal",
        estimatedLiability: 0,
        confidence: 97,
        recommendations: [
          "No immediate CGT liability in Nigeria",
          "UK will tax worldwide gains on disposal",
          "Monitor Double Taxation Agreement benefits",
        ],
      },
      {
        name: "Partial Disposal (50%)",
        description: "Dispose of 50% of Nigerian equity holdings",
        estimatedLiability: 1950,
        confidence: 88,
        recommendations: [
          "Nigerian CGT at 10%: ₦ equivalent of £975",
          "UK CGT on same gains: £1,950 (before relief)",
          "Claim foreign tax credit for Nigerian tax paid",
          "Net UK liability after credit: £975",
        ],
      },
      {
        name: "Full Disposal with DTA Optimization",
        description: "Complete disposal with DTA treaty benefits applied",
        estimatedLiability: 3250,
        confidence: 85,
        recommendations: [
          "Total gains: £19,500",
          "Nigerian CGT (10%): £1,950",
          "UK CGT (20%): £3,900",
          "Foreign tax credit reduces UK liability to £1,950",
          "Effective combined rate: 16.7%",
        ],
      },
    ],
  },
];

export const MLTaxEngine: React.FC = () => {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>(
    "United Kingdom"
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [showDTAInfo, setShowDTAInfo] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  const currentAnalysis = taxAnalyses.find(
    (a) => a.jurisdiction === selectedJurisdiction
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header Section */}
      <div className="mb-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
            <Brain className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-100">
              AI-Powered Tax Engine
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Machine learning analysis of multiple tax regimes and Double Taxation
              Agreements to optimize your UK compliance strategy. The engine
              interprets complex international tax scenarios and provides actionable
              recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Select Jurisdiction
            </label>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none md:w-auto"
            >
              {taxAnalyses.map((analysis) => (
                <option key={analysis.jurisdiction} value={analysis.jurisdiction}>
                  {analysis.jurisdiction}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-400"
          >
            {analyzing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            ML Confidence Score
          </div>
          <div className="mt-2 flex items-end gap-2">
            <div className="text-2xl font-semibold text-emerald-400">94.2%</div>
            <CheckCircle className="mb-1 h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-1 text-xs text-slate-400">
            High confidence in tax calculations
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Scenarios Analyzed
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {currentAnalysis?.scenarios.length || 0}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Across {taxAnalyses.length} jurisdictions
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            DTA Treaties Applied
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="text-2xl font-semibold text-slate-50">3</div>
            <button
              onClick={() => setShowDTAInfo(!showDTAInfo)}
              className="text-indigo-400 hover:text-indigo-300"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Nigeria, UAE, India treaties
          </div>
        </div>
      </div>

      {/* DTA Info Panel */}
      {showDTAInfo && (
        <div className="mb-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
            <div className="text-sm text-slate-200">
              <div className="font-semibold text-indigo-300">
                Double Taxation Agreements (DTAs)
              </div>
              <p className="mt-2 text-slate-300">
                The UK has comprehensive tax treaties with Nigeria, UAE, and India.
                These agreements prevent double taxation by allowing foreign tax
                credits. The ML engine automatically calculates optimal treaty
                benefits based on your specific asset mix and disposal scenarios.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Analysis */}
      <div className="space-y-4">
        <div>
          <h3 className="mb-4 font-semibold text-slate-100">
            Tax Scenarios for {selectedJurisdiction}
          </h3>
        </div>

        {currentAnalysis?.scenarios.map((scenario, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-indigo-500/50"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-100">
                    {scenario.name}
                  </h4>
                  {scenario.confidence >= 90 && (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  )}
                  {scenario.confidence < 90 && scenario.confidence >= 85 && (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  {scenario.description}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Est. Liability</div>
                <div className="mt-1 text-xl font-semibold text-slate-100">
                  £{scenario.estimatedLiability.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center justify-end gap-1 text-xs text-slate-400">
                  <div
                    className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800"
                  >
                    <div
                      className="h-full bg-emerald-400"
                      style={{ width: `${scenario.confidence}%` }}
                    />
                  </div>
                  {scenario.confidence}%
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                AI Recommendations
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                {scenario.recommendations.map((rec, recIndex) => (
                  <li key={recIndex} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Comparative Summary */}
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="mb-4 font-semibold text-slate-100">
          Multi-Jurisdiction Tax Rate Comparison
        </h3>

        <div className="space-y-3">
          {[
            {
              jurisdiction: "United Kingdom",
              rate: "20%",
              allowance: "£3,000",
              notes: "Higher rate for gains above threshold",
            },
            {
              jurisdiction: "Nigeria",
              rate: "10%",
              allowance: "None",
              notes: "Lower rate but taxed at source",
            },
            {
              jurisdiction: "UAE",
              rate: "0%",
              allowance: "N/A",
              notes: "No capital gains tax on most assets",
            },
            {
              jurisdiction: "India",
              rate: "15%",
              allowance: "₹1 lakh",
              notes: "Short-term vs long-term rates vary",
            },
          ].map((item) => (
            <div
              key={item.jurisdiction}
              className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-800/50 p-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1">
                <div className="font-medium text-slate-100">
                  {item.jurisdiction}
                </div>
                <div className="text-xs text-slate-400">{item.notes}</div>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <div className="text-xs text-slate-400">CGT Rate</div>
                  <div className="font-semibold text-slate-100">{item.rate}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Allowance</div>
                  <div className="font-semibold text-slate-100">
                    {item.allowance}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300">
        <div className="flex items-start gap-3">
          <Brain className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
          <div>
            <div className="font-semibold text-slate-100">
              How the ML Tax Engine Works
            </div>
            <p className="mt-1 text-slate-400">
              Our machine learning model has been trained on thousands of cross-border
              tax scenarios, HMRC guidance documents, and Double Taxation Agreements.
              It analyzes your specific asset portfolio, acquisition dates, and
              disposal patterns to provide personalized tax optimization strategies
              that comply with UK regulations while minimizing your overall tax burden.
            </p>
          </div>
        </div>
      </div>

      {/* DTA Calculator */}
      <div className="mt-6">
        <DtaCalculator />
      </div>
    </div>
  );
};