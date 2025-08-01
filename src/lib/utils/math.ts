// Math utility functions with safety checks

/**
 * Safely divide two numbers, returning a fallback value if denominator is 0
 */
export const safeDivide = (numerator: number, denominator: number, fallback: number = 0): number => {
  if (denominator === 0 || isNaN(denominator) || isNaN(numerator)) {
    return fallback;
  }
  return numerator / denominator;
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Round to a specified number of decimal places
 */
export const roundTo = (value: number, decimals: number): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Parse a numeric value safely, always returning a number
 */
export const parseNumeric = (value: string | number, fallback: number = 0): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? fallback : value;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Calculate percentage safely
 */
export const calculatePercentage = (part: number, whole: number, decimals: number = 1): number => {
  const percentage = safeDivide(part, whole, 0) * 100;
  return roundTo(percentage, decimals);
};

/**
 * Sum an array of numbers safely
 */
export const safeSum = (numbers: number[]): number => {
  return numbers.reduce((sum, num) => {
    const value = isNaN(num) ? 0 : num;
    return sum + value;
  }, 0);
};

/**
 * Calculate average safely
 */
export const safeAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return safeDivide(safeSum(numbers), numbers.length);
};

/**
 * Ensure a value is positive
 */
export const ensurePositive = (value: number, fallback: number = 0): number => {
  return value > 0 ? value : fallback;
};