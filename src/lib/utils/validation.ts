// Input validation utilities

import { FarmParameters } from '../../types';
import { CALC_CONSTANTS, PERFORMANCE_THRESHOLDS } from '../../constants/emissions';

/**
 * Validate and sanitize a numeric input within bounds
 */
export const validateNumericInput = (
  value: string | number,
  min: number,
  max: number,
  decimals?: number
): number => {
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(parsed)) {
    return min;
  }
  
  const clamped = Math.max(min, Math.min(max, parsed));
  
  if (decimals !== undefined) {
    return Math.round(clamped * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
  
  return clamped;
};

/**
 * Validate farm parameters
 */
export const validateFarmParameters = (params: Partial<FarmParameters>): string[] => {
  const errors: string[] = [];
  
  // Validate herd size
  if (params.herdSize !== undefined && (params.herdSize < 1 || params.herdSize > 10000)) {
    errors.push('Herd size must be between 1 and 10,000');
  }
  
  // Validate milk yield
  if (params.milkYield !== undefined && (params.milkYield < 1000 || params.milkYield > 20000)) {
    errors.push('Milk yield must be between 1,000 and 20,000 L/cow/year');
  }
  
  // Validate feed quality
  if (params.feedQuality !== undefined && (params.feedQuality < 1 || params.feedQuality > 10)) {
    errors.push('Feed quality must be between 1 and 10');
  }
  
  // Validate age at first calving
  if (params.ageFirstCalving !== undefined && (params.ageFirstCalving < 18 || params.ageFirstCalving > 36)) {
    errors.push('Age at first calving must be between 18 and 36 months');
  }
  
  // Validate calving interval
  if (params.calvingInterval !== undefined && (params.calvingInterval < 300 || params.calvingInterval > 600)) {
    errors.push('Calving interval must be between 300 and 600 days');
  }
  
  // Validate average lactations
  if (params.avgLactations !== undefined && (params.avgLactations < 1 || params.avgLactations > 10)) {
    errors.push('Average lactations must be between 1 and 10');
  }
  
  // Validate concentrate feed
  if (params.concentrateFeed !== undefined && (params.concentrateFeed < 0 || params.concentrateFeed > 30)) {
    errors.push('Concentrate feed must be between 0 and 30 kg/day');
  }
  
  // Validate percentages
  if (params.soyaContent !== undefined && (params.soyaContent < 0 || params.soyaContent > 100)) {
    errors.push('Soya content must be between 0 and 100%');
  }
  
  if (params.crudeProtein !== undefined && 
      (params.crudeProtein < CALC_CONSTANTS.MIN_CRUDE_PROTEIN || 
       params.crudeProtein > CALC_CONSTANTS.MAX_CRUDE_PROTEIN)) {
    errors.push(`Crude protein must be between ${CALC_CONSTANTS.MIN_CRUDE_PROTEIN} and ${CALC_CONSTANTS.MAX_CRUDE_PROTEIN}%`);
  }
  
  // Validate nitrogen rate
  if (params.nitrogenRate !== undefined && 
      (params.nitrogenRate < CALC_CONSTANTS.MIN_NITROGEN_RATE || 
       params.nitrogenRate > CALC_CONSTANTS.MAX_NITROGEN_RATE)) {
    errors.push(`Nitrogen rate must be between ${CALC_CONSTANTS.MIN_NITROGEN_RATE} and ${CALC_CONSTANTS.MAX_NITROGEN_RATE} kg N/Ha/Year`);
  }
  
  return errors;
};

/**
 * Sanitize string input for CSV export
 */
export const sanitizeForCSV = (value: any): string => {
  const str = String(value ?? '');
  // Remove potentially dangerous characters
  const cleaned = str.replace(/[\r\n\t<>'"]/g, ' ');
  // If contains comma, wrap in quotes
  return cleaned.includes(',') ? `"${cleaned}"` : cleaned;
};

/**
 * Sanitize user input for LLM prompts
 */
export const sanitizeForPrompt = (input: string): string => {
  // Remove potentially dangerous characters and limit length
  return input
    .replace(/[<>'"\\]/g, '')
    .trim()
    .substring(0, 500);
};

/**
 * Validate sequestration parameters
 */
export const validateSequestrationParams = (params: Partial<FarmParameters>): string[] => {
  const errors: string[] = [];
  
  if (params.treePlantingHa !== undefined && params.treePlantingHa < 0) {
    errors.push('Tree planting area cannot be negative');
  }
  
  if (params.hedgerowKm !== undefined && params.hedgerowKm < 0) {
    errors.push('Hedgerow length cannot be negative');
  }
  
  if (params.soilCarbonHa !== undefined && params.soilCarbonHa < 0) {
    errors.push('Soil carbon area cannot be negative');
  }
  
  if (params.coverCropsHa !== undefined && params.coverCropsHa < 0) {
    errors.push('Cover crops area cannot be negative');
  }
  
  if (params.renewableEnergyKw !== undefined && params.renewableEnergyKw < 0) {
    errors.push('Renewable energy capacity cannot be negative');
  }
  
  return errors;
};