import { getRiskScore, getInterestRate, calculateMonthlyRepayment, calculateTotalRepaid } from '../risk';

describe('Risk Score Calculations', () => {
  describe('getRiskScore', () => {
    it('should return Low for low emissions and small loans', () => {
      expect(getRiskScore(0.5, 500000)).toBe('Low');
      expect(getRiskScore(0.9, 1000000)).toBe('Low');
      expect(getRiskScore(0.99, 1400000)).toBe('Low');
    });

    it('should bump risk level for larger loans', () => {
      // Low emissions + medium loan = Medium risk
      expect(getRiskScore(0.9, 1500000)).toBe('Medium');
      expect(getRiskScore(0.9, 2000000)).toBe('Medium');
      
      // Low emissions + large loan = High risk
      expect(getRiskScore(0.9, 4000000)).toBe('High');
      expect(getRiskScore(0.9, 6000000)).toBe('High');
    });

    it('should return Medium for medium emissions', () => {
      expect(getRiskScore(1.0, 500000)).toBe('Medium');
      expect(getRiskScore(1.2, 1000000)).toBe('Medium');
      expect(getRiskScore(1.5, 1400000)).toBe('Medium');
    });

    it('should bump Medium to High for large loans', () => {
      expect(getRiskScore(1.2, 1500000)).toBe('High');
      expect(getRiskScore(1.2, 4000000)).toBe('High');
    });

    it('should return High for high emissions regardless of loan', () => {
      expect(getRiskScore(1.51, 100000)).toBe('High');
      expect(getRiskScore(2.0, 500000)).toBe('High');
      expect(getRiskScore(3.0, 10000000)).toBe('High');
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