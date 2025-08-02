// Emission calculation functions

import { 
  FarmParameters, 
  EmissionBreakdown, 
  SequestrationBreakdown,
  Season,
  ManureSystem 
} from '../../types';
import { 
  EMISSION_FACTORS, 
  SEASONAL_FACTORS, 
  SEQUESTRATION_RATES,
  CALC_CONSTANTS 
} from '../../constants/emissions';
import { safeDivide, ensurePositive } from '../utils/math';

/**
 * Calculate seasonal adjustments
 */
export const getSeasonalAdjustments = (season: Season) => {
  return SEASONAL_FACTORS[season] || SEASONAL_FACTORS.Summer;
};

/**
 * Calculate performance penalty multiplier based on KPIs (excluding fertility which is handled separately)
 */
export const calculatePerformancePenalty = (params: FarmParameters): number => {
  let penaltySum = 0; // Use additive penalties
  
  // Poor milk yield penalty (below 8000L is inefficient)
  if (params.milkYield < 8000) {
    penaltySum += (8000 - params.milkYield) / 8000 * 0.10; // up to 10% penalty
  }
  
  // Feed efficiency penalty - high concentrate feed relative to yield
  const feedEfficiencyRatio = safeDivide(params.concentrateFeed * 365, params.milkYield, 1);
  if (feedEfficiencyRatio > 0.35) { // kg feed per L milk
    penaltySum += Math.min((feedEfficiencyRatio - 0.35) * 0.3, 0.15); // up to 15% penalty
  }
  
  // Poor feed quality penalty
  if (params.feedCarbonFootprint > 1.0) {
    penaltySum += Math.min((params.feedCarbonFootprint - 1.0) * 0.15, 0.10); // up to 10% penalty
  }
  
  // High nitrogen usage penalty
  if (params.nitrogenRate > 150) {
    penaltySum += Math.min((params.nitrogenRate - 150) / 300 * 0.10, 0.10); // up to 10% penalty
  }
  
  // Non-deforestation free soya penalty
  if (!params.deforestationFree && params.soyaContent > 10) {
    penaltySum += Math.min(params.soyaContent / 100 * 0.20, 0.10); // up to 10% penalty
  }
  
  // Limited grazing penalty
  if (params.grazingMonths < 6) {
    penaltySum += (6 - params.grazingMonths) / 12 * 0.08; // up to 8% penalty
  }
  
  // Cap total penalty at 40% increase (fertility adds more)
  return 1 + Math.min(penaltySum, 0.4);
};

/**
 * Calculate emissions breakdown for a farm
 */
export const calculateEmissions = (params: FarmParameters): EmissionBreakdown => {
  const seasonalFactors = getSeasonalAdjustments(params.season);
  const adjustedFeed = params.concentrateFeed * seasonalFactors.feed;
  const adjustedNitrogen = params.nitrogenRate * seasonalFactors.nitrogen;
  
  // Calculate heifer overhead factor - more heifers needed with poor fertility
  const replacementRate = safeDivide(1, params.avgLactations, 0.33); // Annual replacement rate
  const heiferMonths = params.ageFirstCalving; // Months to rear each heifer
  const heiferOverhead = replacementRate * safeDivide(heiferMonths, 12, 2); // Heifer-years per cow
  
  // Calculate productivity loss from extended calving intervals
  const optimalCalvingInterval = 365; // days
  const productivityLoss = params.calvingInterval > optimalCalvingInterval ? 
    safeDivide(params.calvingInterval - optimalCalvingInterval, 365, 0) * 0.15 : 0; // 15% loss per extra month
  
  // Total emissions multiplier includes heifer overhead and productivity loss
  const fertilityMultiplier = (1 + heiferOverhead * 0.3) * (1 + productivityLoss);
  
  // Get performance penalty multiplier
  const performancePenalty = calculatePerformancePenalty(params);
  
  // Combined multiplier
  const totalMultiplier = fertilityMultiplier * performancePenalty;
  
  // Enteric emissions (kg CO2e/cow/year) - affected by fertility and performance
  const baseEntericEmissions = EMISSION_FACTORS.BASE_ENTERIC + 
    (adjustedFeed * EMISSION_FACTORS.FEED_MULTIPLIER);
  const entericEmissions = baseEntericEmissions * totalMultiplier;
  
  // Manure emissions - worse with poor management and more animals
  const baseManureEmissions = EMISSION_FACTORS.MANURE_SYSTEMS[params.manureSystem] || 
    EMISSION_FACTORS.MANURE_SYSTEMS['Liquid/slurry'];
  const manureReduction = params.grazingMonths * EMISSION_FACTORS.GRAZING_REDUCTION;
  const manureEmissions = (baseManureEmissions - manureReduction) * totalMultiplier;
  
  // Feed production emissions - higher with inefficient feeding and more animals
  const feedEmissions = adjustedFeed * 365 * params.feedCarbonFootprint * totalMultiplier;
  
  // Deforestation emissions
  const soyaKgPerYear = adjustedFeed * 365 * safeDivide(params.soyaContent, 100);
  const deforestationEmissions = params.deforestationFree ? 
    0 : soyaKgPerYear * EMISSION_FACTORS.DEFORESTATION_FACTOR * totalMultiplier;
  
  // Nitrogen emissions - worse with over-application
  const nitrogenEmissions = adjustedNitrogen * EMISSION_FACTORS.NITROGEN_MULTIPLIER * totalMultiplier;
  
  // Total annual emissions
  const totalAnnualEmissions = entericEmissions + 
    ensurePositive(manureEmissions) + 
    feedEmissions + 
    deforestationEmissions + 
    nitrogenEmissions;
  
  return {
    entericEmissions: ensurePositive(entericEmissions),
    manureEmissions: ensurePositive(manureEmissions),
    feedEmissions: ensurePositive(feedEmissions),
    deforestationEmissions: ensurePositive(deforestationEmissions),
    nitrogenEmissions: ensurePositive(nitrogenEmissions),
    totalAnnualEmissions: ensurePositive(totalAnnualEmissions)
  };
};

/**
 * Calculate carbon sequestration from various activities
 */
export const calculateSequestration = (params: FarmParameters): SequestrationBreakdown => {
  // Nature-based solutions (t CO2e/year)
  const treeSequestration = params.treePlantingHa * SEQUESTRATION_RATES.TREES_PER_HA;
  const hedgerowSequestration = params.hedgerowKm * SEQUESTRATION_RATES.HEDGEROW_PER_KM;
  const soilCarbonSequestration = params.soilCarbonHa * SEQUESTRATION_RATES.SOIL_CARBON_PER_HA;
  const coverCropSequestration = params.coverCropsHa * SEQUESTRATION_RATES.COVER_CROPS_PER_HA;
  
  // Technology solutions
  const renewableOffset = params.renewableEnergyKw * SEQUESTRATION_RATES.RENEWABLE_PER_KW;
  
  // Methane reduction from inhibitors
  const emissions = calculateEmissions(params);
  const methaneReduction = params.methaneInhibitor ? 
    safeDivide(emissions.entericEmissions * SEQUESTRATION_RATES.METHANE_INHIBITOR_REDUCTION * params.herdSize, 1000) : 0;
  
  // Improved manure management reduction
  const improvedManureReduction = params.improvedManure ? 
    safeDivide(emissions.manureEmissions * SEQUESTRATION_RATES.IMPROVED_MANURE_REDUCTION * params.herdSize, 1000) : 0;
  
  const totalSequestration = treeSequestration + 
    hedgerowSequestration + 
    soilCarbonSequestration + 
    coverCropSequestration + 
    renewableOffset + 
    methaneReduction + 
    improvedManureReduction;
  
  return {
    treeSequestration: ensurePositive(treeSequestration),
    hedgerowSequestration: ensurePositive(hedgerowSequestration),
    soilCarbonSequestration: ensurePositive(soilCarbonSequestration),
    coverCropSequestration: ensurePositive(coverCropSequestration),
    renewableOffset: ensurePositive(renewableOffset),
    methaneReduction: ensurePositive(methaneReduction),
    improvedManureReduction: ensurePositive(improvedManureReduction),
    totalSequestration: ensurePositive(totalSequestration)
  };
};

/**
 * Calculate emissions intensity (kg CO2e/L milk)
 */
export const calculateEmissionsIntensity = (
  totalEmissions: number, 
  milkYield: number
): number => {
  return safeDivide(totalEmissions, milkYield, 0);
};

/**
 * Calculate total farm emissions (tonnes CO2e/year)
 */
export const calculateTotalFarmEmissions = (
  emissionsPerCow: number, 
  herdSize: number
): number => {
  return safeDivide(emissionsPerCow * herdSize, 1000, 0);
};

/**
 * Calculate net farm emissions after sequestration
 */
export const calculateNetEmissions = (
  grossEmissions: number, 
  sequestration: number
): number => {
  return grossEmissions - sequestration;
};