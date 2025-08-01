import { 
  safeDivide, 
  clamp, 
  roundTo, 
  parseNumeric, 
  calculatePercentage,
  safeSum,
  safeAverage,
  ensurePositive 
} from '../math';

describe('Math Utilities', () => {
  describe('safeDivide', () => {
    it('should divide numbers correctly', () => {
      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(100, 4)).toBe(25);
    });

    it('should return fallback when dividing by zero', () => {
      expect(safeDivide(10, 0)).toBe(0);
      expect(safeDivide(10, 0, -1)).toBe(-1);
    });

    it('should handle NaN inputs', () => {
      expect(safeDivide(NaN, 5)).toBe(0);
      expect(safeDivide(5, NaN)).toBe(0);
      expect(safeDivide(NaN, NaN, 100)).toBe(100);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('roundTo', () => {
    it('should round to specified decimals', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(3.14159, 0)).toBe(3);
      expect(roundTo(3.14159, 4)).toBe(3.1416);
    });
  });

  describe('parseNumeric', () => {
    it('should parse string numbers', () => {
      expect(parseNumeric('3.14')).toBe(3.14);
      expect(parseNumeric('100')).toBe(100);
    });

    it('should return number inputs unchanged', () => {
      expect(parseNumeric(42)).toBe(42);
    });

    it('should return fallback for invalid inputs', () => {
      expect(parseNumeric('abc')).toBe(0);
      expect(parseNumeric('abc', 10)).toBe(10);
      expect(parseNumeric(NaN, 5)).toBe(5);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentages correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(50, 200, 0)).toBe(25);
    });

    it('should handle division by zero', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });
  });

  describe('safeSum', () => {
    it('should sum arrays correctly', () => {
      expect(safeSum([1, 2, 3, 4])).toBe(10);
      expect(safeSum([])).toBe(0);
    });

    it('should handle NaN values', () => {
      expect(safeSum([1, NaN, 3])).toBe(4);
    });
  });

  describe('safeAverage', () => {
    it('should calculate average correctly', () => {
      expect(safeAverage([2, 4, 6])).toBe(4);
    });

    it('should return 0 for empty array', () => {
      expect(safeAverage([])).toBe(0);
    });

    it('should handle NaN values', () => {
      expect(safeAverage([2, NaN, 6])).toBe(4);
    });
  });

  describe('ensurePositive', () => {
    it('should return positive values unchanged', () => {
      expect(ensurePositive(5)).toBe(5);
    });

    it('should return fallback for non-positive values', () => {
      expect(ensurePositive(0)).toBe(0);
      expect(ensurePositive(-5)).toBe(0);
      expect(ensurePositive(-5, 10)).toBe(10);
    });
  });
});