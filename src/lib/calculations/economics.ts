// Economic calculations for the farm

import { FarmParameters, CostBreakdownItem } from '../../types';
import { ECONOMIC_CONSTANTS, CALC_CONSTANTS } from '../../constants/emissions';
import { safeDivide, ensurePositive, calculatePercentage } from '../utils/math';

/**
 * Calculate annual feed cost
 */
export const calculateAnnualFeedCost = (
  concentrateFeed: number,
  feedCost: number,
  seasonalFactor: number = 1
): number => {
  const adjustedFeed = concentrateFeed * seasonalFactor;
  return adjustedFeed * feedCost * 365;
};

/**
 * Calculate annual nitrogen cost
 */
export const calculateAnnualNitrogenCost = (
  nitrogenRate: number,
  seasonalFactor: number = 1
): number => {
  const adjustedNitrogen = nitrogenRate * seasonalFactor;
  return adjustedNitrogen * EMISSION_FACTORS.NITROGEN_MULTIPLIER;
};

/**
 * Calculate operational costs
 */
export const calculateOperationalCost = (milkYield: number): number => {
  return ECONOMIC_CONSTANTS.OPERATIONAL_COST_FACTOR * milkYield;
};

/**
 * Calculate heifer rearing costs
 */
export const calculateHeiferCost = (
  avgLactations: number,
  ageFirstCalving: number
): number => {
  const replacementRate = safeDivide(100, avgLactations);
  const heiferRearingCostPerHead = ECONOMIC_CONSTANTS.HEIFER_REARING_COST_PER_MONTH * ageFirstCalving;
  return safeDivide(heiferRearingCostPerHead * replacementRate, 100);
};

/**
 * Calculate total annual cost per cow
 */
export const calculateTotalAnnualCost = (params: {
  concentrateFeed: number;
  feedCost: number;
  nitrogenRate: number;
  milkYield: number;
  avgLactations: number;
  ageFirstCalving: number;
  seasonalFeedFactor: number;
  seasonalNitrogenFactor: number;
}): number => {
  const feedCost = calculateAnnualFeedCost(
    params.concentrateFeed,
    params.feedCost,
    params.seasonalFeedFactor
  );
  const nitrogenCost = calculateAnnualNitrogenCost(
    params.nitrogenRate,
    params.seasonalNitrogenFactor
  );
  const operationalCost = calculateOperationalCost(params.milkYield);
  const heiferCost = calculateHeiferCost(params.avgLactations, params.ageFirstCalving);
  
  return feedCost + nitrogenCost + operationalCost + heiferCost;
};

/**
 * Calculate cost per litre
 */
export const calculateCostPerLitre = (
  totalAnnualCost: number,
  milkYield: number
): number => {
  return safeDivide(totalAnnualCost, milkYield);
};

/**
 * Calculate cost breakdown
 */
export const calculateCostBreakdown = (params: {
  concentrateFeed: number;
  feedCost: number;
  nitrogenRate: number;
  milkYield: number;
  avgLactations: number;
  ageFirstCalving: number;
  seasonalFeedFactor: number;
  seasonalNitrogenFactor: number;
}): CostBreakdownItem[] => {
  const feedCost = calculateAnnualFeedCost(
    params.concentrateFeed,
    params.feedCost,
    params.seasonalFeedFactor
  );
  const nitrogenCost = calculateAnnualNitrogenCost(
    params.nitrogenRate,
    params.seasonalNitrogenFactor
  );
  const operationalCost = calculateOperationalCost(params.milkYield);
  const heiferCost = calculateHeiferCost(params.avgLactations, params.ageFirstCalving);
  
  const totalCost = feedCost + nitrogenCost + operationalCost + heiferCost;
  
  if (totalCost === 0) {
    return [
      { name: 'Feed Costs', value: 40, amount: 0 },
      { name: 'Nitrogen Costs', value: 10, amount: 0 },
      { name: 'Operational Costs', value: 35, amount: 0 },
      { name: 'Heifer Costs', value: 15, amount: 0 }
    ];
  }
  
  return [
    {
      name: 'Feed Costs',
      value: calculatePercentage(feedCost, totalCost),
      amount: feedCost
    },
    {
      name: 'Nitrogen Costs',
      value: calculatePercentage(nitrogenCost, totalCost),
      amount: nitrogenCost
    },
    {
      name: 'Operational Costs',
      value: calculatePercentage(operationalCost, totalCost),
      amount: operationalCost
    },
    {
      name: 'Heifer Costs',
      value: calculatePercentage(heiferCost, totalCost),
      amount: heiferCost
    }
  ];
};

/**
 * Calculate farm revenue
 */
export const calculateFarmRevenue = (
  milkYield: number,
  herdSize: number,
  milkPrice: number = ECONOMIC_CONSTANTS.MILK_PRICE
): number => {
  return milkYield * herdSize * milkPrice;
};

/**
 * Calculate farm profit
 */
export const calculateFarmProfit = (
  revenue: number,
  totalCost: number
): number => {
  return revenue - totalCost;
};

/**
 * Import fix for EMISSION_FACTORS
 */
import { EMISSION_FACTORS } from '../../constants/emissions';