// Performance metrics calculations

import { FarmParameters, PerformanceMetrics } from '../../types';
import { PERFORMANCE_THRESHOLDS, CALC_CONSTANTS } from '../../constants/emissions';
import { safeDivide, calculatePercentage, clamp } from '../utils/math';

/**
 * Calculate feed efficiency (L milk / kg feed)
 */
export const calculateFeedEfficiency = (
  milkYield: number,
  concentrateFeed: number,
  seasonalFactor: number = 1
): number => {
  const adjustedFeed = concentrateFeed * seasonalFactor;
  const annualFeedUse = adjustedFeed * 365;
  return safeDivide(milkYield, annualFeedUse, 0);
};

/**
 * Calculate protein efficiency
 */
export const calculateProteinEfficiency = (
  concentrateFeed: number,
  crudeProtein: number,
  seasonalFactor: number = 1
): number => {
  const adjustedFeed = concentrateFeed * seasonalFactor;
  const baseEfficiency = 14.3;
  const feedAdjustment = 0.1 * (adjustedFeed - 8.08);
  const proteinAdjustment = 0.05 * (17 - crudeProtein);
  
  return baseEfficiency - feedAdjustment + proteinAdjustment;
};

/**
 * Calculate nitrogen efficiency
 */
export const calculateNitrogenEfficiency = (
  nitrogenRate: number,
  grazingMonths: number,
  milkYield: number,
  seasonalFactor: number = 1
): number => {
  const adjustedNitrogen = nitrogenRate * seasonalFactor;
  const baseEfficiency = 17.6;
  const nitrogenAdjustment = 0.02 * (adjustedNitrogen - 180);
  const grazingAdjustment = 0.1 * safeDivide(grazingMonths, 12);
  const yieldAdjustment = 0.001 * (milkYield - 8500);
  
  const efficiency = baseEfficiency - nitrogenAdjustment + grazingAdjustment + yieldAdjustment;
  
  // Nitrogen efficiency should be between 5% and 50% for dairy farms
  return clamp(efficiency, 5, 50);
};

/**
 * Calculate replacement rate
 */
export const calculateReplacementRate = (avgLactations: number): number => {
  return safeDivide(100, avgLactations, 100);
};

/**
 * Calculate retention rate
 */
export const calculateRetentionRate = (replacementRate: number): number => {
  return 100 - replacementRate;
};

/**
 * Calculate percentage of heifers calving under 25 months
 */
export const calculateCalvingUnder25Pct = (ageFirstCalving: number): number => {
  if (ageFirstCalving <= 25) return 100;
  
  // Decrease by 10% for each month over 25
  const monthsOver = ageFirstCalving - 25;
  const percentage = 100 - (monthsOver * 10);
  
  return Math.max(0, percentage);
};

/**
 * Calculate percentage hitting calving interval target
 */
export const calculateHitCalvingIntervalPct = (calvingInterval: number): number => {
  const target = PERFORMANCE_THRESHOLDS.CALVING_INTERVAL_TARGET;
  
  if (calvingInterval <= target) return 100;
  
  // Decrease by 0.5% for each day over target
  const daysOver = calvingInterval - target;
  const percentage = 100 - (daysOver * 0.5);
  
  return Math.max(0, percentage);
};

/**
 * Calculate overall herd effectiveness
 */
export const calculateOverallHerdEffectiveness = (
  calvingUnder25Pct: number,
  hitCalvingIntervalPct: number,
  retentionRate: number
): number => {
  // Multiply all three factors and scale to percentage
  const effectiveness = safeDivide(
    calvingUnder25Pct * hitCalvingIntervalPct * retentionRate,
    10000
  );
  
  return clamp(effectiveness, 0, 100);
};

/**
 * Calculate all performance metrics
 */
export const calculatePerformanceMetrics = (
  params: FarmParameters,
  emissions: number,
  costPerLitre: number,
  seasonalFeedFactor: number,
  seasonalNitrogenFactor: number
): PerformanceMetrics => {
  const feedEfficiency = calculateFeedEfficiency(
    params.milkYield,
    params.concentrateFeed,
    seasonalFeedFactor
  );
  
  const proteinEfficiency = calculateProteinEfficiency(
    params.concentrateFeed,
    params.crudeProtein,
    seasonalFeedFactor
  );
  
  const nitrogenEfficiency = calculateNitrogenEfficiency(
    params.nitrogenRate,
    params.grazingMonths,
    params.milkYield,
    seasonalNitrogenFactor
  );
  
  const replacementRate = calculateReplacementRate(params.avgLactations);
  const retentionRate = calculateRetentionRate(replacementRate);
  const calvingUnder25Pct = calculateCalvingUnder25Pct(params.ageFirstCalving);
  const hitCalvingIntervalPct = calculateHitCalvingIntervalPct(params.calvingInterval);
  
  const overallHerdEffectiveness = calculateOverallHerdEffectiveness(
    calvingUnder25Pct,
    hitCalvingIntervalPct,
    retentionRate
  );
  
  return {
    emissions,
    feedEfficiency,
    proteinEfficiency,
    nitrogenEfficiency,
    costPerLitre,
    overallHerdEffectiveness,
    calvingUnder25Pct,
    hitCalvingIntervalPct,
    retentionRate,
    replacementRate
  };
};