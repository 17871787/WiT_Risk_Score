// Green financing calculations for sustainability investments
import { ReductionMeasure, ReductionPathway } from './reductionPathway';

export interface FinancingOption {
  id: string;
  name: string;
  description: string;
  type: 'loan' | 'grant' | 'subsidy' | 'carbon-credit' | 'blended';
  maxAmount: number;
  interestRate: number;
  term: number; // years
  requirements: string[];
  greenDiscount: number; // percentage discount for green initiatives
}

export interface FinancingPackage {
  totalInvestment: number;
  financingOptions: Array<{
    option: FinancingOption;
    amount: number;
    monthlyCost: number;
    totalCost: number;
    carbonBenefit: number; // kg CO2e reduced
  }>;
  totalMonthlyCost: number;
  totalFinancingCost: number;
  paybackPeriod: number;
  netPresentValue: number;
  internalRateOfReturn: number;
  carbonCostEffectiveness: number; // $/kg CO2e reduced
}

// Available financing options
export const FINANCING_OPTIONS: FinancingOption[] = [
  {
    id: 'green-loan',
    name: 'Green Agriculture Loan',
    description: 'Low-interest loan for environmental improvements',
    type: 'loan',
    maxAmount: 1000000,
    interestRate: 0.035, // 3.5%
    term: 10,
    requirements: ['Environmental impact assessment', 'Emissions reduction plan'],
    greenDiscount: 0.015 // 1.5% discount
  },
  {
    id: 'equipment-finance',
    name: 'Sustainable Equipment Finance',
    description: 'Asset finance for green technology',
    type: 'loan',
    maxAmount: 500000,
    interestRate: 0.045,
    term: 7,
    requirements: ['Equipment must reduce emissions by >10%'],
    greenDiscount: 0.01
  },
  {
    id: 'govt-grant',
    name: 'Government Sustainability Grant',
    description: 'Non-repayable grant for proven technologies',
    type: 'grant',
    maxAmount: 100000,
    interestRate: 0,
    term: 0,
    requirements: ['Must implement methane reduction', 'Monitoring required'],
    greenDiscount: 0
  },
  {
    id: 'carbon-advance',
    name: 'Carbon Credit Advance',
    description: 'Upfront payment against future carbon credits',
    type: 'carbon-credit',
    maxAmount: 200000,
    interestRate: 0.06,
    term: 5,
    requirements: ['Verified baseline emissions', 'Credit generation plan'],
    greenDiscount: 0
  },
  {
    id: 'blended-finance',
    name: 'Blended Finance Package',
    description: 'Combined loan and grant funding',
    type: 'blended',
    maxAmount: 750000,
    interestRate: 0.025,
    term: 8,
    requirements: ['Large-scale project', 'Multiple environmental benefits'],
    greenDiscount: 0.02
  }
];

// Calculate optimal financing package for reduction pathway
export const calculateFinancingPackage = (
  pathway: ReductionPathway,
  creditScore: number = 700,
  existingDebt: number = 0
): FinancingPackage => {
  const totalInvestment = pathway.totalCost;
  const financingOptions: FinancingPackage['financingOptions'] = [];
  
  // Sort measures by ROI to prioritize financing
  const sortedMeasures = [...pathway.measures].sort((a, b) => {
    const roiA = a.potentialReduction / a.cost;
    const roiB = b.potentialReduction / b.cost;
    return roiB - roiA;
  });
  
  let remainingCost = totalInvestment;
  
  // Try to match financing options to measures
  for (const measure of sortedMeasures) {
    if (remainingCost <= 0) break;
    
    // Find best financing option for this measure
    const bestOption = findBestFinancingOption(measure, creditScore);
    if (bestOption) {
      const amount = Math.min(measure.cost, bestOption.maxAmount, remainingCost);
      const effectiveRate = bestOption.interestRate - bestOption.greenDiscount;
      
      const financing = {
        option: bestOption,
        amount,
        monthlyCost: calculateMonthlyPayment(amount, effectiveRate, bestOption.term),
        totalCost: calculateTotalCost(amount, effectiveRate, bestOption.term),
        carbonBenefit: (measure.potentialReduction * amount) / measure.cost
      };
      
      financingOptions.push(financing);
      remainingCost -= amount;
    }
  }
  
  // Calculate aggregated metrics
  const totalMonthlyCost = financingOptions.reduce((sum, f) => sum + f.monthlyCost, 0);
  const totalFinancingCost = financingOptions.reduce((sum, f) => sum + f.totalCost, 0);
  const totalCarbonBenefit = financingOptions.reduce((sum, f) => sum + f.carbonBenefit, 0);
  
  // Calculate financial metrics
  const annualCarbonValue = totalCarbonBenefit * 0.025; // $25/tonne CO2e
  const paybackPeriod = totalFinancingCost / (annualCarbonValue * 12);
  
  const npv = calculateNPV(
    totalInvestment,
    annualCarbonValue,
    10,
    0.05
  );
  
  const irr = calculateIRR(
    totalInvestment,
    annualCarbonValue,
    10
  );
  
  return {
    totalInvestment,
    financingOptions,
    totalMonthlyCost,
    totalFinancingCost,
    paybackPeriod,
    netPresentValue: npv,
    internalRateOfReturn: irr,
    carbonCostEffectiveness: totalFinancingCost / totalCarbonBenefit
  };
};

// Find best financing option for a specific measure
const findBestFinancingOption = (
  measure: ReductionMeasure,
  creditScore: number
): FinancingOption | null => {
  // Grant for methane inhibitors
  if (measure.id === 'methane-inhibitor') {
    return FINANCING_OPTIONS.find(o => o.id === 'govt-grant') || null;
  }
  
  // Equipment finance for technology
  if (measure.category === 'Technology' && measure.cost > 50000) {
    return FINANCING_OPTIONS.find(o => o.id === 'equipment-finance') || null;
  }
  
  // Carbon credit advance for quick wins
  if (measure.difficulty === 'Easy' && measure.timeToImplement <= 6) {
    return FINANCING_OPTIONS.find(o => o.id === 'carbon-advance') || null;
  }
  
  // Blended finance for large projects
  if (measure.cost > 200000) {
    return FINANCING_OPTIONS.find(o => o.id === 'blended-finance') || null;
  }
  
  // Default to green loan
  return FINANCING_OPTIONS.find(o => o.id === 'green-loan') || null;
};

// Calculate monthly payment
const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  if (annualRate === 0 || years === 0) return 0; // Grant
  
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
};

// Calculate total cost of financing
const calculateTotalCost = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  if (annualRate === 0 || years === 0) return 0; // Grant
  
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  return monthlyPayment * years * 12;
};

// Calculate Net Present Value
const calculateNPV = (
  initialInvestment: number,
  annualCashFlow: number,
  years: number,
  discountRate: number
): number => {
  let npv = -initialInvestment;
  
  for (let year = 1; year <= years; year++) {
    npv += annualCashFlow / Math.pow(1 + discountRate, year);
  }
  
  return npv;
};

// Calculate Internal Rate of Return (simplified)
const calculateIRR = (
  initialInvestment: number,
  annualCashFlow: number,
  years: number
): number => {
  // Simplified IRR calculation
  // For more accurate results, use Newton-Raphson method
  let irr = 0;
  let npv = 0;
  
  // Try different rates
  for (let rate = 0; rate <= 1; rate += 0.001) {
    npv = -initialInvestment;
    for (let year = 1; year <= years; year++) {
      npv += annualCashFlow / Math.pow(1 + rate, year);
    }
    
    if (npv > 0) {
      irr = rate;
    } else {
      break;
    }
  }
  
  return irr;
};

// Calculate financing eligibility based on farm metrics
export const calculateFinancingEligibility = (
  annualRevenue: number,
  existingDebt: number,
  creditScore: number,
  emissionsReduction: number
): {
  maxLoanAmount: number;
  eligibleOptions: FinancingOption[];
  debtServiceRatio: number;
  greenBonus: number;
} => {
  // Debt service coverage ratio
  const maxDebtService = annualRevenue * 0.3; // 30% of revenue
  const currentDebtService = existingDebt * 0.1; // Assume 10% annual service
  const availableDebtService = maxDebtService - currentDebtService;
  
  // Green bonus for high reduction potential
  const greenBonus = emissionsReduction > 20 ? 0.02 : 
                    emissionsReduction > 10 ? 0.01 : 0;
  
  // Filter eligible options
  const eligibleOptions = FINANCING_OPTIONS.filter(option => {
    if (option.type === 'grant') return true;
    
    const requiredScore = option.type === 'loan' ? 650 : 700;
    return creditScore >= requiredScore;
  });
  
  // Calculate max loan amount based on debt service
  const avgRate = 0.04;
  const avgTerm = 8;
  const maxMonthlyPayment = availableDebtService / 12;
  const maxLoanAmount = maxMonthlyPayment * 
    (Math.pow(1 + avgRate/12, avgTerm*12) - 1) /
    (avgRate/12 * Math.pow(1 + avgRate/12, avgTerm*12));
  
  return {
    maxLoanAmount,
    eligibleOptions,
    debtServiceRatio: currentDebtService / annualRevenue,
    greenBonus
  };
};