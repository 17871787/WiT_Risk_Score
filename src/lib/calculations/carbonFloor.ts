// Theoretical Minimum (biological floor) calculations

import { FarmParameters } from '../../types';
import { THEORETICAL_MINIMUM } from './constants';

// Use centralized constants with environment variable override capability
export const TM_CONSTANTS = {
  // Base biological minimum per cow (kg CO2e/year)
  // Can be overridden via REACT_APP_TM_PER_COW environment variable
  BASE_PER_COW: THEORETICAL_MINIMUM.BASE_KG_CO2E_PER_COW,
  
  // Percentage thresholds for interpretation
  THRESHOLDS: {
    EXCELLENT: 10,    // Within 10% of TM
    GOOD: 25,         // Within 25% of TM
    AVERAGE: 50,      // Within 50% of TM
    // Above 50% is Poor
  },
  
  // Regional reference values for comparison
  REGIONAL_REFERENCES: THEORETICAL_MINIMUM.REFERENCES
} as const;

/**
 * Calculate the theoretical minimum emissions for a given herd size
 * This represents the biological floor below which emissions cannot go
 */
export const theoreticalMinimum = (herdSize: number): number => {
  return herdSize * TM_CONSTANTS.BASE_PER_COW;
};

/**
 * Calculate percentage above theoretical minimum
 */
export const percentageAboveTM = (currentEmissions: number, herdSize: number): number => {
  const tm = theoreticalMinimum(herdSize);
  if (tm === 0) return 0;
  return ((currentEmissions - tm) / tm) * 100;
};

/**
 * Get interpretation of distance from theoretical minimum
 */
export const getTMInterpretation = (percentAbove: number): {
  category: string;
  color: string;
  description: string;
} => {
  if (percentAbove <= TM_CONSTANTS.THRESHOLDS.EXCELLENT) {
    return {
      category: 'Excellent',
      color: 'text-green-700',
      description: 'Near biological minimum - outstanding efficiency'
    };
  } else if (percentAbove <= TM_CONSTANTS.THRESHOLDS.GOOD) {
    return {
      category: 'Good',
      color: 'text-blue-700',
      description: 'Well-optimized operations'
    };
  } else if (percentAbove <= TM_CONSTANTS.THRESHOLDS.AVERAGE) {
    return {
      category: 'Average',
      color: 'text-yellow-700',
      description: 'Significant reduction opportunities exist'
    };
  } else {
    return {
      category: 'Poor',
      color: 'text-red-700',
      description: 'Major improvements needed'
    };
  }
};

/**
 * Calculate gap to theoretical minimum
 */
export const gapToTM = (currentEmissions: number, herdSize: number): number => {
  const tm = theoreticalMinimum(herdSize);
  return Math.max(0, currentEmissions - tm);
};

/**
 * Calculate reduction opportunities to reach TM by target year
 */
export const calculateReductionOpportunities = (
  params: FarmParameters,
  currentEmissions: number,
  targetYear: number = 2035
): {
  feedQualityImprovement: number;
  methaneInhibitorAdoption: boolean;
  manureSystemUpgrade: string | null;
  totalPotentialReduction: number;
  canReachTM: boolean;
} => {
  const tm = theoreticalMinimum(params.herdSize);
  const gap = currentEmissions - tm;
  
  if (gap <= 0) {
    return {
      feedQualityImprovement: 0,
      methaneInhibitorAdoption: false,
      manureSystemUpgrade: null,
      totalPotentialReduction: 0,
      canReachTM: true
    };
  }
  
  let potentialReduction = 0;
  const opportunities = {
    feedQualityImprovement: 0,
    methaneInhibitorAdoption: false,
    manureSystemUpgrade: null as string | null,
    totalPotentialReduction: 0,
    canReachTM: false
  };
  
  // Feed quality improvement potential (up to 15% reduction)
  if (params.feedQuality < 9) {
    opportunities.feedQualityImprovement = 9 - params.feedQuality;
    potentialReduction += currentEmissions * 0.015 * opportunities.feedQualityImprovement;
  }
  
  // Methane inhibitor potential (15% reduction)
  if (!params.methaneInhibitor) {
    opportunities.methaneInhibitorAdoption = true;
    potentialReduction += currentEmissions * 0.15;
  }
  
  // Manure system upgrade potential
  if (params.manureSystem !== 'Anaerobic digester') {
    opportunities.manureSystemUpgrade = 'Anaerobic digester';
    // Estimate 10% reduction from manure system upgrade
    potentialReduction += currentEmissions * 0.10;
  }
  
  opportunities.totalPotentialReduction = potentialReduction;
  opportunities.canReachTM = potentialReduction >= gap;
  
  return opportunities;
};