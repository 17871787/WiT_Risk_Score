// Custom hook for all calculations with memoization

import { useMemo } from 'react';
import { useFarmStore } from '../context/FarmContext';
import { 
  calculateEmissions, 
  calculateSequestration,
  calculateEmissionsIntensity,
  calculateTotalFarmEmissions,
  calculateNetEmissions,
  getSeasonalAdjustments
} from '../lib/calculations/emissions';
import { calculateLME } from '../lib/calculations/lme';
import {
  calculateTotalAnnualCost,
  calculateCostPerLitre,
  calculateCostBreakdown,
  calculateFarmRevenue,
  calculateFarmProfit
} from '../lib/calculations/economics';
import {
  calculatePerformanceMetrics
} from '../lib/calculations/performance';
import { ECONOMIC_CONSTANTS } from '../constants/emissions';

export const useCalculations = () => {
  const parameters = useFarmStore((state) => state.parameters);
  
  // Seasonal adjustments
  const seasonalFactors = useMemo(
    () => getSeasonalAdjustments(parameters.season),
    [parameters.season]
  );
  
  // Emissions calculations
  const emissions = useMemo(
    () => calculateEmissions(parameters),
    [parameters]
  );
  
  const emissionsIntensity = useMemo(
    () => calculateEmissionsIntensity(emissions.totalAnnualEmissions, parameters.milkYield),
    [emissions.totalAnnualEmissions, parameters.milkYield]
  );
  
  // Sequestration calculations
  const sequestration = useMemo(
    () => calculateSequestration(parameters),
    [parameters]
  );
  
  // Farm-level calculations
  const totalFarmEmissions = useMemo(
    () => calculateTotalFarmEmissions(emissions.totalAnnualEmissions, parameters.herdSize),
    [emissions.totalAnnualEmissions, parameters.herdSize]
  );
  
  const netFarmEmissions = useMemo(
    () => calculateNetEmissions(totalFarmEmissions, sequestration.totalSequestration),
    [totalFarmEmissions, sequestration.totalSequestration]
  );
  
  const totalFarmProduction = useMemo(
    () => (parameters.milkYield * parameters.herdSize) / 1000,
    [parameters.milkYield, parameters.herdSize]
  );
  
  // Economic calculations
  const totalAnnualCost = useMemo(
    () => calculateTotalAnnualCost({
      concentrateFeed: parameters.concentrateFeed,
      feedCost: parameters.feedCost,
      nitrogenRate: parameters.nitrogenRate,
      milkYield: parameters.milkYield,
      avgLactations: parameters.avgLactations,
      ageFirstCalving: parameters.ageFirstCalving,
      seasonalFeedFactor: seasonalFactors.feed,
      seasonalNitrogenFactor: seasonalFactors.nitrogen
    }),
    [parameters, seasonalFactors]
  );
  
  const costPerLitre = useMemo(
    () => calculateCostPerLitre(totalAnnualCost, parameters.milkYield),
    [totalAnnualCost, parameters.milkYield]
  );
  
  const costBreakdown = useMemo(
    () => calculateCostBreakdown({
      concentrateFeed: parameters.concentrateFeed,
      feedCost: parameters.feedCost,
      nitrogenRate: parameters.nitrogenRate,
      milkYield: parameters.milkYield,
      avgLactations: parameters.avgLactations,
      ageFirstCalving: parameters.ageFirstCalving,
      seasonalFeedFactor: seasonalFactors.feed,
      seasonalNitrogenFactor: seasonalFactors.nitrogen
    }),
    [parameters, seasonalFactors]
  );
  
  const totalFarmCost = useMemo(
    () => totalAnnualCost * parameters.herdSize,
    [totalAnnualCost, parameters.herdSize]
  );
  
  const totalFarmRevenue = useMemo(
    () => calculateFarmRevenue(parameters.milkYield, parameters.herdSize),
    [parameters.milkYield, parameters.herdSize]
  );
  
  const totalFarmProfit = useMemo(
    () => calculateFarmProfit(totalFarmRevenue, totalFarmCost),
    [totalFarmRevenue, totalFarmCost]
  );
  
  // LME calculations
  const lmeResult = useMemo(
    () => calculateLME({
      annualMilkYield: parameters.milkYield,
      averageLactations: parameters.avgLactations,
      ageAtFirstCalving: parameters.ageFirstCalving,
      calvingInterval: parameters.calvingInterval,
      feedQuality: parameters.feedQuality,
      systemType: parameters.systemType,
      concentrateFeed: parameters.concentrateFeed,
      manureSystem: parameters.manureSystem,
      grazingMonths: parameters.grazingMonths,
      feedCarbonFootprint: parameters.feedCarbonFootprint,
      soyaContent: parameters.soyaContent,
      deforestationFree: parameters.deforestationFree,
      nitrogenRate: parameters.nitrogenRate,
      season: parameters.season
    }),
    [parameters]
  );
  
  // Performance metrics
  const performanceMetrics = useMemo(
    () => calculatePerformanceMetrics(
      parameters,
      emissionsIntensity,
      costPerLitre,
      seasonalFactors.feed,
      seasonalFactors.nitrogen
    ),
    [parameters, emissionsIntensity, costPerLitre, seasonalFactors]
  );
  
  return {
    // Parameters
    parameters,
    seasonalFactors,
    
    // Emissions
    emissions,
    emissionsIntensity,
    totalFarmEmissions,
    
    // Sequestration
    sequestration,
    netFarmEmissions,
    
    // Production
    totalFarmProduction,
    
    // Economics
    totalAnnualCost,
    costPerLitre,
    costBreakdown,
    totalFarmCost,
    totalFarmRevenue,
    totalFarmProfit,
    
    // LME
    lmeResult,
    
    // Performance
    performanceMetrics
  };
};