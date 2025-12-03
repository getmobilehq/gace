import React, { useState } from "react";
import { Calculator, TrendingDown, Info } from "lucide-react";

type Country = "UK" | "Nigeria";

interface DtaInputs {
  residenceCountry: Country;
  sourceCountry: Country;
  incomeType: string;
  grossIncome: number;
  foreignTaxPaid: number;
  residenceTaxRate: number; // e.g. 0.25 for 25%
}

export const DtaCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<DtaInputs>({
    residenceCountry: "UK",
    sourceCountry: "Nigeria",
    incomeType: "Dividend",
    grossIncome: 10000,
    foreignTaxPaid: 1000,
    residenceTaxRate: 0.20,
  });

  const handleChange = (field: keyof DtaInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]:
        field === "grossIncome" ||
        field === "foreignTaxPaid" ||
        field === "residenceTaxRate"
          ? Number(value)
          : (value as any),
    }));
  };

  const {
    residenceCountry,
    sourceCountry,
    incomeType,
    grossIncome,
    foreignTaxPaid,
    residenceTaxRate,
  } = inputs;

  const residenceTaxBeforeRelief = grossIncome * residenceTaxRate;
  const maxCreditAllowed = residenceTaxBeforeRelief;
  const creditUsed = Math.min(foreignTaxPaid, maxCreditAllowed);
  const residenceTaxAfterRelief = Math.max(
    residenceTaxBeforeRelief - creditUsed,
    0
  );
  const totalEffectiveTax = foreignTaxPaid + residenceTaxAfterRelief;
  const dtaSavings = residenceTaxBeforeRelief - residenceTaxAfterRelief;
  const effectiveRate = grossIncome > 0 ? (totalEffectiveTax / grossIncome) * 100 : 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
          <Calculator className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            UK / Nigeria DTA Calculator
          </h2>
          <p className="text-sm text-slate-400">
            Calculate tax savings with Double Taxation Agreement
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 rounded-xl border border-sky-500/40 bg-sky-500/10 p-4 text-sm text-sky-100">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" />
          <p className="text-sky-100/80">
            This calculator applies the UK–Nigeria Double Taxation Agreement to
            show how much tax you save when foreign tax is credited in your
            country of residence.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Country of Residence
          </label>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
            value={residenceCountry}
            onChange={(e) =>
              handleChange("residenceCountry", e.target.value)
            }
          >
            <option value="UK">United Kingdom</option>
            <option value="Nigeria">Nigeria</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Source Country
          </label>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
            value={sourceCountry}
            onChange={(e) => handleChange("sourceCountry", e.target.value)}
          >
            <option value="UK">United Kingdom</option>
            <option value="Nigeria">Nigeria</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Income Type
          </label>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
            value={incomeType}
            onChange={(e) => handleChange("incomeType", e.target.value)}
          >
            <option>Dividend</option>
            <option>Interest</option>
            <option>Capital Gain</option>
            <option>Employment Income</option>
            <option>Rental Income</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Gross Income (£)
          </label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
            value={grossIncome}
            onChange={(e) => handleChange("grossIncome", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Foreign Tax Paid (£)
          </label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
            value={foreignTaxPaid}
            onChange={(e) => handleChange("foreignTaxPaid", e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-500">
            Tax already paid in {sourceCountry}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Residence Tax Rate (decimal)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
            value={residenceTaxRate}
            onChange={(e) =>
              handleChange("residenceTaxRate", e.target.value)
            }
          />
          <p className="mt-1 text-xs text-slate-500">
            Enter 0.20 for 20% or 0.25 for 25%
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <h3 className="font-semibold text-slate-100">
            Tax Breakdown with DTA Applied
          </h3>
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">
              {dtaSavings > 0 ? "Savings Identified" : "No Additional Savings"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
            <div className="text-xs text-slate-400">
              Tax in Source Country ({sourceCountry})
            </div>
            <div className="mt-1 text-xl font-semibold text-slate-100">
              £{foreignTaxPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
            <div className="text-xs text-slate-400">
              {residenceCountry} Tax Before DTA
            </div>
            <div className="mt-1 text-xl font-semibold text-slate-100">
              £{residenceTaxBeforeRelief.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <div className="text-xs text-emerald-300">DTA Credit Used</div>
            <div className="mt-1 text-xl font-semibold text-emerald-300">
              £{creditUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
            <div className="text-xs text-slate-400">
              {residenceCountry} Tax After DTA
            </div>
            <div className="mt-1 text-xl font-semibold text-slate-100">
              £{residenceTaxAfterRelief.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <div className="text-sm font-semibold text-indigo-300">
                  Total Effective Tax
                </div>
                <div className="text-2xl font-bold text-indigo-300">
                  £{totalEffectiveTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="space-y-2 text-sm text-indigo-100/80">
                <p>
                  <span className="font-semibold text-emerald-300">
                    DTA Savings: £{dtaSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </p>
                <p>
                  You save £{dtaSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in {residenceCountry} tax because
                  of the UK–Nigeria Double Taxation Agreement.
                </p>
                <p className="pt-2 border-t border-indigo-500/30">
                  Effective Tax Rate: <span className="font-semibold">{effectiveRate.toFixed(2)}%</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-400">
          <p>
            <strong className="text-slate-300">Note:</strong> This is a
            simplified DTA illustration for demonstration purposes. Actual tax
            rates and relief depend on your personal tax position, income type,
            current legislation, and specific provisions of the UK-Nigeria Double
            Taxation Agreement. Always consult with a qualified tax advisor for
            your specific circumstances.
          </p>
        </div>
      </div>
    </div>
  );
};
