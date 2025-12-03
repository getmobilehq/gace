/**
 * UK Tax Rates and Allowances for Tax Year 2025/26
 * Source: HMRC official rates
 */

export const UK_TAX_YEAR = "2025/26";

// Income Tax Bands (England, Wales, Northern Ireland)
export const INCOME_TAX_BANDS = {
  personalAllowance: 12570,
  bands: [
    { name: "Basic Rate", threshold: 50270, rate: 0.2 }, // £0 - £37,700
    { name: "Higher Rate", threshold: 125140, rate: 0.4 }, // £37,701 - £125,140
    { name: "Additional Rate", threshold: Infinity, rate: 0.45 }, // £125,140+
  ],
};

// Capital Gains Tax
export const CAPITAL_GAINS_TAX = {
  annualExemption: 3000, // Reduced from previous years
  rates: {
    basicRate: 0.1, // For basic rate taxpayers
    higherRate: 0.2, // For higher/additional rate taxpayers
    property: {
      basicRate: 0.18,
      higherRate: 0.28,
    },
  },
};

// Inheritance Tax
export const INHERITANCE_TAX = {
  nilRateBand: 325000,
  residenceNilRateBand: 175000, // Additional for main residence
  rate: 0.4,
  reducedRate: 0.36, // If 10%+ left to charity
};

// National Insurance (for reference)
export const NATIONAL_INSURANCE = {
  class1Employee: {
    lowerEarningsLimit: 6396,
    primaryThreshold: 12570,
    upperEarningsLimit: 50270,
    rates: {
      main: 0.12, // £12,570 - £50,270
      additional: 0.02, // £50,270+
    },
  },
};

// Foreign Tax Credits - Nigeria Example
export const NIGERIA_TAX_RATES = {
  country: "Nigeria",
  currency: "NGN",
  incomeTax: {
    bands: [
      { threshold: 300000, rate: 0.07 },
      { threshold: 600000, rate: 0.11 },
      { threshold: 1100000, rate: 0.15 },
      { threshold: 1600000, rate: 0.19 },
      { threshold: 3200000, rate: 0.21 },
      { threshold: Infinity, rate: 0.24 },
    ],
  },
  corporateTax: 0.3,
  capitalGainsTax: 0.1,
  vatRate: 0.075,
};

// Double Taxation Agreement (DTA) Data
export const DTA_TREATIES: Record<
  string,
  {
    country: string;
    type: "credit" | "exemption" | "hybrid";
    maxCreditPercentage: number;
    specificProvisions: string[];
  }
> = {
  NG: {
    country: "Nigeria",
    type: "credit",
    maxCreditPercentage: 100,
    specificProvisions: [
      "Income from immovable property taxed in source country",
      "Business profits taxed where permanent establishment exists",
      "Dividends: 15% withholding tax (7.5% if beneficial owner owns 10%+)",
      "Interest: 12.5% withholding tax",
      "Royalties: 12.5% withholding tax",
    ],
  },
  US: {
    country: "United States",
    type: "credit",
    maxCreditPercentage: 100,
    specificProvisions: [
      "Dividends: 15% withholding (5% for 10%+ ownership)",
      "Interest: 0% on government bonds, 0% on bank loans",
      "Royalties: 0% withholding",
    ],
  },
  AE: {
    country: "United Arab Emirates",
    type: "credit",
    maxCreditPercentage: 100,
    specificProvisions: [
      "No income tax in UAE for individuals",
      "Property rental income exempt in UAE",
      "UK can tax UAE-sourced income",
    ],
  },
  // Add more countries as needed
};

// Compliance Deadlines
export const COMPLIANCE_DEADLINES = {
  selfAssessment: {
    paperReturn: "31 October",
    onlineReturn: "31 January",
    paymentDeadline: "31 January",
    secondPaymentOnAccount: "31 July",
  },
  foreignAssetReporting: {
    worldwideIncome: "Within Self Assessment",
    foreignBankAccounts: "Within Self Assessment",
    trustReporting: "Within Self Assessment or 31 October",
  },
};

// Asset Valuation Thresholds
export const REPORTING_THRESHOLDS = {
  foreignIncome: 2000, // Must declare if over £2,000
  foreignAssets: 50000, // HMRC may require detailed reporting
  propertyAbroad: 0, // Always report property income regardless of amount
  trusts: 0, // Always report trust income
};

// Exchange Rates (sample - should be fetched from API in production)
export const EXCHANGE_RATES: Record<string, number> = {
  NGN: 0.00063, // 1 NGN = 0.00063 GBP (example rate)
  USD: 0.79, // 1 USD = 0.79 GBP
  EUR: 0.86, // 1 EUR = 0.86 GBP
  AED: 0.22, // 1 AED = 0.22 GBP
  // Add more as needed
};

/**
 * Get current exchange rate (in production, fetch from API)
 */
export function getExchangeRate(fromCurrency: string): number {
  return EXCHANGE_RATES[fromCurrency] || 1;
}

/**
 * Convert foreign currency to GBP
 */
export function convertToGBP(amount: number, currency: string): number {
  if (currency === "GBP") return amount;
  const rate = getExchangeRate(currency);
  return amount * rate;
}

/**
 * Get tax year string
 */
export function getTaxYear(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // UK tax year runs April 6 - April 5
  if (month < 3 || (month === 3 && date.getDate() < 6)) {
    return `${year - 1}/${year}`;
  }
  return `${year}/${year + 1}`;
}
