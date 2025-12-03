import {
  INCOME_TAX_BANDS,
  CAPITAL_GAINS_TAX,
  INHERITANCE_TAX,
  convertToGBP,
} from "./taxData";

export interface TaxInput {
  // Income
  ukEmploymentIncome: number;
  ukSelfEmploymentIncome: number;
  ukPropertyIncome: number;
  ukPensionIncome: number;
  ukDividendIncome: number;
  ukInterestIncome: number;

  // Foreign Income (in GBP)
  foreignEmploymentIncome: number;
  foreignPropertyIncome: number;
  foreignDividendIncome: number;
  foreignInterestIncome: number;
  foreignBusinessIncome: number;

  // Capital Gains
  capitalGainsProperty: number;
  capitalGainsShares: number;
  capitalGainsOther: number;

  // Deductions
  pensionContributions: number;
  charitableDonations: number;
  businessExpenses: number;
}

export interface TaxCalculationResult {
  // Income Tax
  totalIncome: number;
  taxableIncome: number;
  incomeTaxDue: number;
  incomeTaxBreakdown: Array<{
    band: string;
    amount: number;
    rate: number;
    tax: number;
  }>;

  // Capital Gains Tax
  totalCapitalGains: number;
  taxableCapitalGains: number;
  capitalGainsTaxDue: number;

  // Summary
  totalTaxLiability: number;
  effectiveTaxRate: number;

  // Allowances Used
  personalAllowanceUsed: number;
  capitalGainsAllowanceUsed: number;
}

export class UKTaxCalculator {
  /**
   * Calculate total UK tax liability
   */
  calculate(input: TaxInput): TaxCalculationResult {
    // Calculate total income
    const totalUKIncome =
      input.ukEmploymentIncome +
      input.ukSelfEmploymentIncome +
      input.ukPropertyIncome +
      input.ukPensionIncome +
      input.ukDividendIncome +
      input.ukInterestIncome;

    const totalForeignIncome =
      input.foreignEmploymentIncome +
      input.foreignPropertyIncome +
      input.foreignDividendIncome +
      input.foreignInterestIncome +
      input.foreignBusinessIncome;

    const totalIncome = totalUKIncome + totalForeignIncome;

    // Calculate deductions
    const totalDeductions =
      input.pensionContributions +
      input.charitableDonations +
      input.businessExpenses;

    const adjustedIncome = Math.max(0, totalIncome - totalDeductions);

    // Calculate income tax
    const incomeTaxResult = this.calculateIncomeTax(adjustedIncome);

    // Calculate capital gains tax
    const totalCapitalGains =
      input.capitalGainsProperty +
      input.capitalGainsShares +
      input.capitalGainsOther;

    const capitalGainsTaxResult = this.calculateCapitalGainsTax(
      totalCapitalGains,
      adjustedIncome,
      input.capitalGainsProperty
    );

    // Calculate total liability
    const totalTaxLiability =
      incomeTaxResult.totalTax + capitalGainsTaxResult.totalTax;

    const effectiveTaxRate =
      totalIncome > 0 ? (totalTaxLiability / totalIncome) * 100 : 0;

    return {
      totalIncome,
      taxableIncome: incomeTaxResult.taxableIncome,
      incomeTaxDue: incomeTaxResult.totalTax,
      incomeTaxBreakdown: incomeTaxResult.breakdown,
      totalCapitalGains,
      taxableCapitalGains: capitalGainsTaxResult.taxableGains,
      capitalGainsTaxDue: capitalGainsTaxResult.totalTax,
      totalTaxLiability,
      effectiveTaxRate,
      personalAllowanceUsed: incomeTaxResult.personalAllowanceUsed,
      capitalGainsAllowanceUsed: capitalGainsTaxResult.exemptionUsed,
    };
  }

  /**
   * Calculate income tax
   */
  private calculateIncomeTax(grossIncome: number) {
    const personalAllowance = INCOME_TAX_BANDS.personalAllowance;
    
    // Personal allowance reduces by £1 for every £2 over £100,000
    const reducedAllowance = Math.max(
      0,
      personalAllowance - Math.max(0, (grossIncome - 100000) / 2)
    );

    const taxableIncome = Math.max(0, grossIncome - reducedAllowance);

    const breakdown: Array<{
      band: string;
      amount: number;
      rate: number;
      tax: number;
    }> = [];

    let remainingIncome = taxableIncome;
    let totalTax = 0;
    let previousThreshold = 0;

    for (const band of INCOME_TAX_BANDS.bands) {
      if (remainingIncome <= 0) break;

      const bandWidth = band.threshold - previousThreshold;
      const taxableInBand = Math.min(remainingIncome, bandWidth);
      const taxForBand = taxableInBand * band.rate;

      breakdown.push({
        band: band.name,
        amount: taxableInBand,
        rate: band.rate,
        tax: taxForBand,
      });

      totalTax += taxForBand;
      remainingIncome -= taxableInBand;
      previousThreshold = band.threshold;
    }

    return {
      taxableIncome,
      totalTax,
      breakdown,
      personalAllowanceUsed: reducedAllowance,
    };
  }

  /**
   * Calculate capital gains tax
   */
  private calculateCapitalGainsTax(
    totalGains: number,
    income: number,
    propertyGains: number
  ) {
    const annualExemption = CAPITAL_GAINS_TAX.annualExemption;
    const exemptionUsed = Math.min(totalGains, annualExemption);
    const taxableGains = Math.max(0, totalGains - annualExemption);

    if (taxableGains === 0) {
      return { taxableGains: 0, totalTax: 0, exemptionUsed };
    }

    // Determine if taxpayer is basic rate or higher rate
    const basicRateLimit = INCOME_TAX_BANDS.bands[0].threshold;
    const isBasicRate = income < basicRateLimit;

    // Calculate remaining basic rate band
    const remainingBasicRate = Math.max(0, basicRateLimit - income);

    // Property gains
    const propertyGainsNet = Math.max(0, propertyGains - annualExemption);
    const propertyInBasicBand = Math.min(propertyGainsNet, remainingBasicRate);
    const propertyInHigherBand = Math.max(0, propertyGainsNet - propertyInBasicBand);

    const propertyTax =
      propertyInBasicBand * CAPITAL_GAINS_TAX.rates.property.basicRate +
      propertyInHigherBand * CAPITAL_GAINS_TAX.rates.property.higherRate;

    // Other gains (shares, etc.)
    const otherGains = taxableGains - propertyGainsNet;
    const otherInBasicBand = Math.min(
      otherGains,
      Math.max(0, remainingBasicRate - propertyInBasicBand)
    );
    const otherInHigherBand = Math.max(0, otherGains - otherInBasicBand);

    const otherTax =
      otherInBasicBand * CAPITAL_GAINS_TAX.rates.basicRate +
      otherInHigherBand * CAPITAL_GAINS_TAX.rates.higherRate;

    const totalTax = propertyTax + otherTax;

    return { taxableGains, totalTax, exemptionUsed };
  }

  /**
   * Calculate inheritance tax (basic calculation)
   */
  calculateInheritanceTax(
    estateValue: number,
    residenceValue: number = 0,
    charitableGifts: number = 0
  ) {
    const nilRateBand = INHERITANCE_TAX.nilRateBand;
    const residenceNilRateBand = INHERITANCE_TAX.residenceNilRateBand;

    // Total nil rate band (including residence nil rate band if applicable)
    const totalNilRateBand = nilRateBand + 
      (residenceValue > 0 ? residenceNilRateBand : 0);

    // Check if 10%+ left to charity for reduced rate
    const charitablePercentage = (charitableGifts / estateValue) * 100;
    const taxRate =
      charitablePercentage >= 10
        ? INHERITANCE_TAX.reducedRate
        : INHERITANCE_TAX.rate;

    const taxableEstate = Math.max(0, estateValue - totalNilRateBand);
    const ihtDue = taxableEstate * taxRate;

    return {
      estateValue,
      nilRateBandUsed: Math.min(estateValue, totalNilRateBand),
      taxableEstate,
      taxRate,
      ihtDue,
    };
  }

  /**
   * Calculate tax savings from pension contributions
   */
  calculatePensionRelief(contribution: number, income: number) {
    const incomeTaxResult = this.calculateIncomeTax(income);
    const withPensionResult = this.calculateIncomeTax(
      income - contribution
    );

    const taxSavings = incomeTaxResult.totalTax - withPensionResult.totalTax;

    return {
      contribution,
      taxSavings,
      effectiveRelief: (taxSavings / contribution) * 100,
    };
  }
}

// Singleton instance
export const ukTaxCalculator = new UKTaxCalculator();
