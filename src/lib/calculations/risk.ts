// Risk score calculations

export type RiskScore = 'Low' | 'Medium' | 'High';

/**
 * Determine risk score based on emissions intensity
 * @param emissionsIntensity kg CO₂e per liter of milk
 * @returns Risk score category
 */
export const getRiskScore = (emissionsIntensity: number): RiskScore => {
  if (emissionsIntensity < 1.0) return 'Low';
  if (emissionsIntensity <= 1.5) return 'Medium';
  return 'High';
};

/**
 * Get interest rate based on risk score and loan amount
 * @param riskScore Risk category
 * @param loanAmount Loan amount in £
 * @returns Annual interest rate as decimal (e.g., 0.045 for 4.5%)
 */
export const getInterestRate = (riskScore: RiskScore, loanAmount: number): number => {
  const rateMatrix = {
    Low: {
      small: 0.045,    // < £1m
      medium: 0.040,   // £1-5m
      large: 0.035     // > £5m
    },
    Medium: {
      small: 0.050,
      medium: 0.045,
      large: 0.040
    },
    High: {
      small: 0.055,
      medium: 0.050,
      large: 0.045
    }
  };

  let sizeCategory: 'small' | 'medium' | 'large';
  if (loanAmount < 1000000) {
    sizeCategory = 'small';
  } else if (loanAmount <= 5000000) {
    sizeCategory = 'medium';
  } else {
    sizeCategory = 'large';
  }

  return rateMatrix[riskScore][sizeCategory];
};

/**
 * Calculate monthly repayment for an amortizing loan
 * @param principal Loan amount
 * @param annualRate Annual interest rate as decimal
 * @param years Loan term in years
 * @returns Monthly payment amount
 */
export const calculateMonthlyRepayment = (
  principal: number, 
  annualRate: number, 
  years: number
): number => {
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numPayments;
  }
  
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numPayments));
};

/**
 * Calculate total amount repaid over loan term
 * @param monthlyPayment Monthly payment amount
 * @param years Loan term in years
 * @returns Total amount repaid
 */
export const calculateTotalRepaid = (monthlyPayment: number, years: number): number => {
  return monthlyPayment * years * 12;
};