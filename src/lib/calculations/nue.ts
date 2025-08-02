// Nitrogen Use Efficiency (NUE) calculation functions

import { FarmParameters } from '../../types';
import { safeDivide, ensurePositive } from '../utils/math';

// Constants for NUE calculations
export const NUE_CONSTANTS = {
  MILK_N_CONTENT: 0.0055, // kg N per L milk
  HECTARES_PER_COW: 0.5, // assumed average land allocation per cow
  FEED_N_CONTENT: {
    // N content by protein percentage (simplified linear relationship)
    BASE: 0.016, // 1.6% N at 10% CP
    MULTIPLIER: 0.0016 // 0.16% N per 1% CP increase
  },
  MANURE_N_EFFICIENCY: {
    'Liquid/slurry': 0.45, // 45% N utilization
    'Solid': 0.35,
    'Daily spread': 0.30,
    'Anaerobic digester': 0.55, // Best efficiency
    'Pasture': 0.25 // Direct deposition, lower efficiency
  },
  NUE_THRESHOLDS: {
    POOR: 60,      // < 60%
    AVERAGE: 80,   // 60-80%
    GOOD: 100,     // 80-100%
    // > 100% is Excellent
  }
} as const;

/**
 * Calculate feed N content based on crude protein
 */
export const calculateFeedNContent = (crudeProtein: number): number => {
  // Protein to N conversion (protein = N × 6.25)
  return safeDivide(crudeProtein, 625, 0.025); // Convert percentage to decimal
};

/**
 * Calculate total N inputs to the farm system
 */
export const calculateNInputs = (params: FarmParameters): number => {
  // Applied N fertilizer (kg N/cow/year)
  const appliedNPerCow = params.nitrogenRate * NUE_CONSTANTS.HECTARES_PER_COW;
  
  // Feed N inputs (kg N/cow/year)
  const feedNContent = calculateFeedNContent(params.crudeProtein);
  const feedNPerCow = params.concentrateFeed * 365 * feedNContent;
  
  // Total N inputs
  return appliedNPerCow + feedNPerCow;
};

/**
 * Calculate N outputs in milk production
 */
export const calculateNOutputs = (params: FarmParameters): number => {
  // Milk N output (kg N/cow/year)
  return params.milkYield * NUE_CONSTANTS.MILK_N_CONTENT;
};

/**
 * Calculate Nitrogen Use Efficiency percentage
 */
export const calculateNUE = (params: FarmParameters): number => {
  const nOutputs = calculateNOutputs(params);
  const nInputs = calculateNInputs(params);
  
  // NUE = (N outputs / N inputs) × 100
  const nue = safeDivide(nOutputs, nInputs, 0) * 100;
  
  // Cap at reasonable maximum (150%)
  return Math.min(nue, 150);
};

/**
 * Get NUE interpretation
 */
export const getNUEInterpretation = (nue: number): {
  category: string;
  color: string;
  bgColor: string;
  description: string;
} => {
  if (nue >= NUE_CONSTANTS.NUE_THRESHOLDS.GOOD) {
    return {
      category: 'Excellent',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      description: 'Outstanding nitrogen efficiency'
    };
  } else if (nue >= NUE_CONSTANTS.NUE_THRESHOLDS.AVERAGE) {
    return {
      category: 'Good',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      description: 'Above average nitrogen efficiency'
    };
  } else if (nue >= NUE_CONSTANTS.NUE_THRESHOLDS.POOR) {
    return {
      category: 'Average',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      description: 'Room for improvement in N management'
    };
  } else {
    return {
      category: 'Poor',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      description: 'Significant N losses to environment'
    };
  }
};

/**
 * Calculate potential NUE improvement from better practices
 */
export const calculateNUEImprovement = (
  currentParams: FarmParameters,
  improvedParams: Partial<FarmParameters>
): number => {
  const currentNUE = calculateNUE(currentParams);
  const improvedNUE = calculateNUE({ ...currentParams, ...improvedParams });
  return improvedNUE - currentNUE;
};

/**
 * Get recommended N management practices based on current NUE
 */
export const getNUERecommendations = (params: FarmParameters, nue: number): string[] => {
  const recommendations: string[] = [];
  
  if (params.nitrogenRate > 200) {
    recommendations.push('Reduce N fertilizer application rate to <200 kg N/ha');
  }
  
  if (params.crudeProtein > 18) {
    recommendations.push('Optimize dietary protein to 16-18% CP');
  }
  
  if (params.manureSystem !== 'Anaerobic digester' && nue < 80) {
    recommendations.push('Consider anaerobic digestion for better N recovery');
  }
  
  if (params.milkYield < 8000 && nue < 80) {
    recommendations.push('Improve milk productivity to dilute N losses');
  }
  
  if (params.feedQuality < 8) {
    recommendations.push('Improve feed quality for better N utilization');
  }
  
  return recommendations;
};