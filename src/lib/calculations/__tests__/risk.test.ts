import { getRiskScore, getInterestRate, calculateMonthlyRepayment, calculateTotalRepaid } from '../risk';

describe('Risk Score Calculations', () => {
  describe('getRiskScore', () => {
    it('should return Low for emissions intensity < 1.0', () => {
      expect(getRiskScore(0.5)).toBe('Low');
      expect(getRiskScore(0.9)).toBe('Low');
      expect(getRiskScore(0.99)).toBe('Low');
    });

    it('should return Medium for emissions intensity 1.0-1.5', () => {
      expect(getRiskScore(1.0)).toBe('Medium');
      expect(getRiskScore(1.2)).toBe('Medium');
      expect(getRiskScore(1.5)).toBe('Medium');
    });

    it('should return High for emissions intensity > 1.5', () => {
      expect(getRiskScore(1.51)).toBe('High');
      expect(getRiskScore(2.0)).toBe('High');
      expect(getRiskScore(3.0)).toBe('High');
    });
  });

  describe('getInterestRate', () => {
    it('should return correct rates for Low risk', () => {
      expect(getInterestRate('Low', 500000)).toBe(0.045);
      expect(getInterestRate('Low', 1500000)).toBe(0.040);
      expect(getInterestRate('Low', 6000000)).toBe(0.035);
    });

    it('should return correct rates for Medium risk', () => {
      expect(getInterestRate('Medium', 500000)).toBe(0.050);
      expect(getInterestRate('Medium', 1500000)).toBe(0.045);
      expect(getInterestRate('Medium', 6000000)).toBe(0.040);
    });

    it('should return correct rates for High risk', () => {
      expect(getInterestRate('High', 500000)).toBe(0.055);
      expect(getInterestRate('High', 1500000)).toBe(0.050);
      expect(getInterestRate('High', 6000000)).toBe(0.045);
    });
  });

  describe('calculateMonthlyRepayment', () => {
    it('should calculate correct monthly payment', () => {
      // £500,000 at 5% for 10 years
      const monthly = calculateMonthlyRepayment(500000, 0.05, 10);
      expect(Math.round(monthly)).toBe(5303);
    });

    it('should handle zero interest rate', () => {
      const monthly = calculateMonthlyRepayment(120000, 0, 10);
      expect(monthly).toBe(1000);
    });
  });

  describe('calculateTotalRepaid', () => {
    it('should calculate total amount correctly', () => {
      const total = calculateTotalRepaid(5303, 10);
      expect(total).toBe(636360);
    });
  });
});