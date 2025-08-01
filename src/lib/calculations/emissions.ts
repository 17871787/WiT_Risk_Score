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
 * Calculate emissions breakdown for a farm
 */
export const calculateEmissions = (params: FarmParameters): EmissionBreakdown => {
  const seasonalFactors = getSeasonalAdjustments(params.season);
  const adjustedFeed = params.concentrateFeed * seasonalFactors.feed;
  const adjustedNitrogen = params.nitrogenRate * seasonalFactors.nitrogen;
  
  // Enteric emissions (kg CO2e/cow/year)
  const entericEmissions = EMISSION_FACTORS.BASE_ENTERIC + 
    (adjustedFeed * EMISSION_FACTORS.FEED_MULTIPLIER);
  
  // Manure emissions
  const baseManureEmissions = EMISSION_FACTORS.MANURE_SYSTEMS[params.manureSystem] || 
    EMISSION_FACTORS.MANURE_SYSTEMS['Liquid/slurry'];
  const manureEmissions = baseManureEmissions - 
    (params.grazingMonths * EMISSION_FACTORS.GRAZING_REDUCTION);
  
  // Feed production emissions
  const feedEmissions = adjustedFeed * 365 * params.feedCarbonFootprint;
  
  // Deforestation emissions
  const soyaKgPerYear = adjustedFeed * 365 * safeDivide(params.soyaContent, 100);
  const deforestationEmissions = params.deforestationFree ? 
    0 : soyaKgPerYear * EMISSION_FACTORS.DEFORESTATION_FACTOR;
  
  // Nitrogen emissions
  const nitrogenEmissions = adjustedNitrogen * EMISSION_FACTORS.NITROGEN_MULTIPLIER;
  
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