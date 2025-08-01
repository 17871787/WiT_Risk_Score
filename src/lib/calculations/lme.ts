// Lifetime Methane Efficiency (LME) calculations

import { 
  LMECalculationParams, 
  LMEResult, 
  LMEInterpretation 
} from '../../types';
import { 
  EMISSION_FACTORS, 
  SYSTEM_FACTORS, 
  LME_THRESHOLDS,
  CALC_CONSTANTS 
} from '../../constants/emissions';
import { safeDivide, ensurePositive } from '../utils/math';
import { calculateEmissions } from './emissions';

/**
 * Get LME interpretation based on score
 */
export const getLMEInterpretation = (lme: number): LMEInterpretation => {
  if (lme > LME_THRESHOLDS.EXCELLENT) {
    return { 
      text: "Excellent efficiency", 
      color: "text-green-600", 
      bgColor: "bg-green-50" 
    };
  }
  if (lme > LME_THRESHOLDS.GOOD) {
    return { 
      text: "Good efficiency", 
      color: "text-blue-600", 
      bgColor: "bg-blue-50" 
    };
  }
  if (lme > LME_THRESHOLDS.AVERAGE) {
    return { 
      text: "Average efficiency", 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-50" 
    };
  }
  if (lme > LME_THRESHOLDS.BELOW_AVERAGE) {
    return { 
      text: "Below average", 
      color: "text-orange-600", 
      bgColor: "bg-orange-50" 
    };
  }
  return { 
    text: "Poor efficiency", 
    color: "text-red-600", 
    bgColor: "bg-red-50" 
  };
};

/**
 * Calculate Lifetime Methane Efficiency
 */
export const calculateLME = (params: LMECalculationParams): LMEResult => {
  const {
    annualMilkYield,
    averageLactations,
    ageAtFirstCalving,
    calvingInterval,
    feedQuality,
    systemType,
    concentrateFeed,
    manureSystem,
    grazingMonths,
    feedCarbonFootprint,
    soyaContent,
    deforestationFree,
    nitrogenRate,
    season
  } = params;

  // 1. Calculate lifetime production
  const lifetimeProduction = annualMilkYield * 
    averageLactations * 
    CALC_CONSTANTS.PERSISTENCE_FACTOR;

  // 2. Calculate daily enteric emissions (kg CO2-eq)
  const dailyYield = safeDivide(annualMilkYield, CALC_CONSTANTS.DAYS_PER_LACTATION);
  const estimatedDMI = (dailyYield * CALC_CONSTANTS.DMI_YIELD_FACTOR) + CALC_CONSTANTS.BASE_DMI;
  
  // Feed quality adjustment (better feed = lower emissions)
  const feedQualityAdjustment = EMISSION_FACTORS.FEED_QUALITY_BASE - 
    (feedQuality * EMISSION_FACTORS.FEED_QUALITY_FACTOR);
  
  const dailyEnteric = (EMISSION_FACTORS.METHANE_BASE + 
    (estimatedDMI * EMISSION_FACTORS.METHANE_DMI_FACTOR)) * feedQualityAdjustment;

  // 3. Calculate lifetime days
  const productiveDays = averageLactations * CALC_CONSTANTS.DAYS_PER_LACTATION;
  const totalDays = (ageAtFirstCalving * CALC_CONSTANTS.DAYS_PER_MONTH) + 
    (averageLactations * calvingInterval);
  const nonProductiveDays = Math.max(0, totalDays - productiveDays);

  // 4. Calculate lifetime methane emissions
  const lifetimeEmissions = (dailyEnteric * productiveDays) + 
    (dailyEnteric * EMISSION_FACTORS.NON_PRODUCTIVE_FACTOR * nonProductiveDays);

  // 5. Calculate base LME
  const baseLME = safeDivide(lifetimeProduction, lifetimeEmissions, 0);

  // 6. Apply system adjustment factor
  const systemFactor = SYSTEM_FACTORS[systemType] || SYSTEM_FACTORS.moderate;
  const adjustedLME = baseLME * systemFactor;

  // Calculate original emissions for comparison
  const farmParams = {
    annualMilkYield,
    concentrateFeed,
    manureSystem,
    grazingMonths,
    feedCarbonFootprint,
    soyaContent,
    deforestationFree,
    nitrogenRate,
    season,
    // Add required fields with defaults
    herdSize: 150,
    systemType,
    feedQuality,
    feedCost: 0.35,
    crudeProtein: 17,
    milkYield: annualMilkYield,
    avgLactations: averageLactations,
    calvingInterval,
    ageFirstCalving,
    cullingAge: 6,
    birthweight: 40,
    landType: 'Lowland' as const,
    forageContent: 'Mixed 15-75%' as const,
    treePlantingHa: 0,
    hedgerowKm: 0,
    soilCarbonHa: 0,
    coverCropsHa: 0,
    renewableEnergyKw: 0,
    methaneInhibitor: false,
    improvedManure: false
  };
  
  const emissions = calculateEmissions(farmParams);
  const originalEmissions = safeDivide(emissions.totalAnnualEmissions, annualMilkYield);

  return {
    lme: ensurePositive(adjustedLME),
    lifetimeProduction: Math.round(ensurePositive(lifetimeProduction)),
    lifetimeEmissions: Math.round(ensurePositive(lifetimeEmissions)),
    interpretation: getLMEInterpretation(adjustedLME),
    originalEmissions
  };
};