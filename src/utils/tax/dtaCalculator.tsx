import { DTA_TREATIES, convertToGBP } from "./taxData";

export interface ForeignTaxPaid {
  country: string;
  countryCode: string;
  incomeType: "employment" | "property" | "dividend" | "interest" | "business";
  foreignIncome: number; // In local currency
  foreignCurrency: string;
  foreignTaxPaid: number; // In local currency
  exchangeRate: number;
}

export interface DTACalculationResult {
  totalForeignIncome: number; // In GBP
  totalForeignTaxPaid: number; // In GBP
  ukTaxOnForeignIncome: number;
  dtaRelief: number; // Tax credit available
  netUKTaxDue: number;
  reliefBreakdown: Array<{
    country: string;
    income: number;
    foreignTax: number;
    ukTax: number;
    relief: number;
    reliefType: "credit" | "exemption" | "hybrid";
  }>;
  recommendations: string[];
}

export class DTACalculator {
  /**
   * Calculate DTA relief and net UK tax due
   */
  calculate(
    foreignTaxRecords: ForeignTaxPaid[],
    ukTaxRate: number = 0.4 // Default to higher rate
  ): DTACalculationResult {
    let totalForeignIncome = 0;
    let totalForeignTaxPaid = 0;
    let totalDTARelief = 0;
    const reliefBreakdown: DTACalculationResult["reliefBreakdown"] = [];
    const recommendations: string[] = [];

    // Process each foreign tax record
    for (const record of foreignTaxRecords) {
      const incomeGBP = convertToGBP(record.foreignIncome, record.foreignCurrency);
      const taxPaidGBP = convertToGBP(record.foreignTaxPaid, record.foreignCurrency);

      totalForeignIncome += incomeGBP;
      totalForeignTaxPaid += taxPaidGBP;

      // Get DTA treaty info
      const treaty = DTA_TREATIES[record.countryCode];
      const reliefType = treaty?.type || "credit";

      // Calculate UK tax on this foreign income
      const ukTaxOnIncome = incomeGBP * ukTaxRate;

      // Calculate relief based on DTA type
      let relief = 0;
      
      if (reliefType === "credit") {
        // Credit method: Lower of foreign tax paid or UK tax due
        relief = Math.min(taxPaidGBP, ukTaxOnIncome);
      } else if (reliefType === "exemption") {
        // Exemption method: Income exempt from UK tax
        relief = ukTaxOnIncome;
      } else {
        // Hybrid method: Combination based on income type
        relief = Math.min(taxPaidGBP, ukTaxOnIncome);
      }

      // Apply max credit percentage from treaty
      if (treaty && treaty.maxCreditPercentage < 100) {
        relief = relief * (treaty.maxCreditPercentage / 100);
      }

      totalDTARelief += relief;

      reliefBreakdown.push({
        country: record.country,
        income: incomeGBP,
        foreignTax: taxPaidGBP,
        ukTax: ukTaxOnIncome,
        relief,
        reliefType,
      });

      // Generate recommendations
      if (taxPaidGBP > ukTaxOnIncome) {
        recommendations.push(
          `Excess tax paid in ${record.country}: £${(taxPaidGBP - ukTaxOnIncome).toFixed(2)} cannot be refunded by HMRC`
        );
      }

      if (taxPaidGBP < ukTaxOnIncome * 0.5) {
        recommendations.push(
          `Low foreign tax in ${record.country}: Consider tax planning opportunities`
        );
      }
    }

    const ukTaxOnForeignIncome = totalForeignIncome * ukTaxRate;
    const netUKTaxDue = Math.max(0, ukTaxOnForeignIncome - totalDTARelief);

    // Add general recommendations
    if (totalForeignIncome > 50000) {
      recommendations.push(
        "High foreign income detected: Ensure all countries' tax returns are filed"
      );
    }

    if (reliefBreakdown.length > 3) {
      recommendations.push(
        "Multiple jurisdictions: Consider specialist tax advice for complex DTA scenarios"
      );
    }

    return {
      totalForeignIncome,
      totalForeignTaxPaid,
      ukTaxOnForeignIncome,
      dtaRelief: totalDTARelief,
      netUKTaxDue,
      reliefBreakdown,
      recommendations,
    };
  }

  /**
   * Check if DTA exists between UK and country
   */
  hasDTA(countryCode: string): boolean {
    return !!DTA_TREATIES[countryCode];
  }

  /**
   * Get DTA treaty details
   */
  getDTATreaty(countryCode: string) {
    return DTA_TREATIES[countryCode] || null;
  }

  /**
   * Calculate optimal tax structure recommendations
   */
  recommendOptimalStructure(foreignTaxRecords: ForeignTaxPaid[]) {
    const recommendations: Array<{
      priority: "high" | "medium" | "low";
      category: string;
      suggestion: string;
      potentialSaving?: number;
    }> = [];

    for (const record of foreignTaxRecords) {
      const incomeGBP = convertToGBP(record.foreignIncome, record.foreignCurrency);
      const taxPaidGBP = convertToGBP(record.foreignTaxPaid, record.foreignCurrency);

      // Check for structuring opportunities
      if (record.incomeType === "property" && incomeGBP > 30000) {
        recommendations.push({
          priority: "high",
          category: "Property Structure",
          suggestion: `Consider holding ${record.country} property through UK company for better tax efficiency`,
          potentialSaving: incomeGBP * 0.1, // Estimate
        });
      }

      if (record.incomeType === "dividend" && taxPaidGBP < incomeGBP * 0.1) {
        recommendations.push({
          priority: "medium",
          category: "Dividend Optimization",
          suggestion: `Low foreign tax on ${record.country} dividends - verify withholding tax rate under DTA`,
        });
      }

      if (record.incomeType === "business" && incomeGBP > 50000) {
        recommendations.push({
          priority: "high",
          category: "Business Structure",
          suggestion: `Review permanent establishment status in ${record.country} - may affect tax liability`,
        });
      }
    }

    // General recommendations
    const totalForeignIncome = foreignTaxRecords.reduce(
      (sum, r) => sum + convertToGBP(r.foreignIncome, r.foreignCurrency),
      0
    );

    if (totalForeignIncome > 100000) {
      recommendations.push({
        priority: "high",
        category: "Remittance Basis",
        suggestion: "Consider remittance basis of taxation if you're non-UK domiciled",
        potentialSaving: totalForeignIncome * 0.15,
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Validate foreign tax records for completeness
   */
  validateTaxRecords(foreignTaxRecords: ForeignTaxPaid[]) {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const record of foreignTaxRecords) {
      // Check for missing data
      if (!record.country || !record.countryCode) {
        errors.push(`Missing country information for income record`);
      }

      if (record.foreignIncome <= 0) {
        errors.push(`Invalid income amount for ${record.country}`);
      }

      if (record.foreignTaxPaid < 0) {
        errors.push(`Invalid tax paid amount for ${record.country}`);
      }

      // Check for suspicious values
      const effectiveTaxRate = (record.foreignTaxPaid / record.foreignIncome) * 100;
      
      if (effectiveTaxRate > 50) {
        warnings.push(
          `High tax rate (${effectiveTaxRate.toFixed(1)}%) in ${record.country} - verify accuracy`
        );
      }

      if (effectiveTaxRate < 5 && record.incomeType !== "capital_gain") {
        warnings.push(
          `Low tax rate (${effectiveTaxRate.toFixed(1)}%) in ${record.country} - ensure compliance`
        );
      }

      // Check DTA exists
      if (!this.hasDTA(record.countryCode)) {
        warnings.push(
          `No DTA treaty data for ${record.country} (${record.countryCode}) - unilateral relief may apply`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Singleton instance
export const dtaCalculator = new DTACalculator();
