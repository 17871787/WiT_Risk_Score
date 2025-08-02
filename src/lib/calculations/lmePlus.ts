// LME+NUE combined sustainability metric

import { FarmParameters } from '../../types';
import { calculateLME } from './lme';
import { calculateNUE } from './nue';
import { safeDivide } from '../utils/math';

export interface LMEPlusResult {
  lme: number;
  nue: number;
  lmePlus: number;
  sustainabilityScore: number; // 0-100 scale
  interpretation: {
    category: string;
    color: string;
    bgColor: string;
    description: string;
  };
}

/**
 * Calculate LME+NUE combined metric
 * LME+NUE = LME × (NUE/100)
 */
export const calculateLMEPlus = (params: FarmParameters): LMEPlusResult => {
  // Calculate individual metrics
  const lmeResult = calculateLME({
    annualMilkYield: params.milkYield,
    averageLactations: params.avgLactations,
    ageAtFirstCalving: params.ageFirstCalving,
    calvingInterval: params.calvingInterval,
    feedQuality: params.feedQuality,
    systemType: params.systemType,
    concentrateFeed: params.concentrateFeed,
    manureSystem: params.manureSystem,
    grazingMonths: params.grazingMonths,
    feedCarbonFootprint: params.feedCarbonFootprint,
    soyaContent: params.soyaContent,
    deforestationFree: params.deforestationFree,
    nitrogenRate: params.nitrogenRate,
    season: params.season
  });
  
  const nue = calculateNUE(params);
  
  // Combined metric: LME weighted by NUE efficiency
  const lmePlus = lmeResult.lme * safeDivide(nue, 100, 1);
  
  // Sustainability score (0-100 scale)
  // Based on both emissions efficiency (LME) and nitrogen efficiency (NUE)
  const lmeScore = Math.min(safeDivide(lmeResult.lme, 15, 0) * 50, 50); // Max 50 points
  const nueScore = Math.min(safeDivide(nue, 150, 0) * 50, 50); // Max 50 points
  const sustainabilityScore = lmeScore + nueScore;
  
  // Get interpretation
  const interpretation = getLMEPlusInterpretation(lmePlus, sustainabilityScore);
  
  return {
    lme: lmeResult.lme,
    nue,
    lmePlus,
    sustainabilityScore,
    interpretation
  };
};

/**
 * Get interpretation for LME+NUE metric
 */
const getLMEPlusInterpretation = (lmePlus: number, sustainabilityScore: number): LMEPlusResult['interpretation'] => {
  if (sustainabilityScore >= 80 && lmePlus >= 10) {
    return {
      category: 'Excellent',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      description: 'Industry-leading sustainability performance'
    };
  } else if (sustainabilityScore >= 65 && lmePlus >= 8) {
    return {
      category: 'Good',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      description: 'Above average environmental efficiency'
    };
  } else if (sustainabilityScore >= 50 && lmePlus >= 6) {
    return {
      category: 'Average',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      description: 'Room for improvement in both metrics'
    };
  } else {
    return {
      category: 'Poor',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      description: 'Significant opportunities for improvement'
    };
  }
};

/**
 * Calculate potential LME+NUE improvement
 */
export const calculateLMEPlusImprovement = (
  currentParams: FarmParameters,
  improvedParams: Partial<FarmParameters>
): number => {
  const current = calculateLMEPlus(currentParams);
  const improved = calculateLMEPlus({ ...currentParams, ...improvedParams });
  return improved.lmePlus - current.lmePlus;
};