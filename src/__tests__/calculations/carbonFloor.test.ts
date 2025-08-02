import {
  theoreticalMinimum,
  percentageAboveTM,
  getTMInterpretation,
  gapToTM,
  calculateReductionOpportunities
} from '../../lib/calculations/carbonFloor';

describe('Carbon Floor (Theoretical Minimum) Calculations', () => {
  describe('theoreticalMinimum', () => {
    it('should calculate TM correctly for different herd sizes', () => {
      expect(theoreticalMinimum(100)).toBe(200000); // 100 cows * 2000 kg
      expect(theoreticalMinimum(250)).toBe(500000); // 250 cows * 2000 kg
      expect(theoreticalMinimum(1)).toBe(2000);     // 1 cow * 2000 kg
    });

    it('should handle zero herd size', () => {
      expect(theoreticalMinimum(0)).toBe(0);
    });

    it('should scale linearly with herd size', () => {
      const tm50 = theoreticalMinimum(50);
      const tm100 = theoreticalMinimum(100);
      expect(tm100).toBe(tm50 * 2);
    });
  });

  describe('percentageAboveTM', () => {
    it('should calculate percentage correctly', () => {
      const currentEmissions = 300000; // kg CO2e
      const herdSize = 100;
      const percentage = percentageAboveTM(currentEmissions, herdSize);
      expect(percentage).toBe(50); // 300k is 50% above 200k
    });

    it('should return 0 when at theoretical minimum', () => {
      const currentEmissions = 200000;
      const herdSize = 100;
      expect(percentageAboveTM(currentEmissions, herdSize)).toBe(0);
    });

    it('should handle emissions below TM (negative percentage)', () => {
      const currentEmissions = 150000;
      const herdSize = 100;
      expect(percentageAboveTM(currentEmissions, herdSize)).toBe(-25);
    });

    it('should handle large percentages above TM', () => {
      const currentEmissions = 600000;
      const herdSize = 100;
      expect(percentageAboveTM(currentEmissions, herdSize)).toBe(200);
    });

    it('should handle zero herd size gracefully', () => {
      expect(percentageAboveTM(100000, 0)).toBe(0);
    });
  });

  describe('getTMInterpretation', () => {
    it('should categorize performance correctly', () => {
      expect(getTMInterpretation(5).category).toBe('Excellent');
      expect(getTMInterpretation(5).color).toBe('text-green-700');
      
      expect(getTMInterpretation(15).category).toBe('Good');
      expect(getTMInterpretation(15).color).toBe('text-blue-700');
      
      expect(getTMInterpretation(35).category).toBe('Average');
      expect(getTMInterpretation(35).color).toBe('text-yellow-700');
      
      expect(getTMInterpretation(60).category).toBe('Poor');
      expect(getTMInterpretation(60).color).toBe('text-red-700');
    });

    it('should handle negative percentages (below TM)', () => {
      const interpretation = getTMInterpretation(-10);
      expect(interpretation.category).toBe('Excellent');
      expect(interpretation.description).toContain('biological minimum');
    });

    it('should provide appropriate descriptions', () => {
      expect(getTMInterpretation(5).description).toContain('biological minimum');
      expect(getTMInterpretation(60).description).toContain('Major improvements');
    });
  });

  describe('calculateReductionOpportunities', () => {
    const baseParams = {
      herdSize: 100,
      milkYield: 8000,
      systemType: 'confined' as const,
      feedQuality: 7,
      concentrateFeed: 8,
      avgLactations: 3.5,
      ageFirstCalving: 24,
      calvingInterval: 380,
      grazingMonths: 0,
      nitrogenRate: 200,
      crudeProtein: 16.5,
      soyaContent: 20,
      deforestationFree: false,
      methaneInhibitor: false,
      improvedManure: false,
      manureSystem: 'liquid/slurry' as const,
      season: 'Annual' as const,
      feedCarbonFootprint: 300,
      loanAmount: 0,
      loanTerm: 60,
      treesPerHa: 0,
      hedgerowLength: 0,
      soilCarbonContent: 2,
      coverCropsHa: 0,
      renewableEnergyKw: 0,
      dieselReductionPercent: 0
    };

    it('should return true when total reduction exceeds gap', () => {
      const currentEmissions = 250000;
      const result = calculateReductionOpportunities(baseParams, currentEmissions);
      expect(result.totalPotentialReduction).toBeGreaterThan(0);
      expect(result.canReachTM).toBe(true);
    });

    it('should return false when total reduction is insufficient', () => {
      const params = { ...baseParams, feedQuality: 9, methaneInhibitor: true };
      const currentEmissions = 400000;
      const result = calculateReductionOpportunities(params, currentEmissions);
      expect(result.canReachTM).toBe(false);
    });

    it('should return true when already below TM', () => {
      const currentEmissions = 180000;
      const result = calculateReductionOpportunities(baseParams, currentEmissions);
      expect(result.canReachTM).toBe(true);
      expect(result.totalPotentialReduction).toBe(0);
    });

    it('should suggest appropriate improvements', () => {
      const currentEmissions = 300000;
      const result = calculateReductionOpportunities(baseParams, currentEmissions);
      expect(result.feedQualityImprovement).toBe(2); // From 7 to 9
      expect(result.methaneInhibitorAdoption).toBe(true);
      expect(result.manureSystemUpgrade).toBe('Anaerobic digester');
    });
  });

  describe('gapToTM', () => {
    it('should calculate gap correctly', () => {
      const currentEmissions = 350000;
      const herdSize = 100;
      expect(gapToTM(currentEmissions, herdSize)).toBe(150000);
    });

    it('should return 0 when at or below TM', () => {
      expect(gapToTM(200000, 100)).toBe(0);
      expect(gapToTM(150000, 100)).toBe(0);
    });

    it('should handle different herd sizes', () => {
      expect(gapToTM(600000, 200)).toBe(200000); // 600k - 400k
      expect(gapToTM(100000, 25)).toBe(50000);   // 100k - 50k
    });
  });

  describe('Integration scenarios', () => {
    it('should handle high-performing farm near TM', () => {
      const herdSize = 200;
      const currentEmissions = 420000; // 2100 kg/cow
      
      const tm = theoreticalMinimum(herdSize);
      const percentAbove = percentageAboveTM(currentEmissions, herdSize);
      const interpretation = getTMInterpretation(percentAbove);
      
      expect(tm).toBe(400000);
      expect(percentAbove).toBe(5);
      expect(interpretation.category).toBe('Excellent');
    });

    it('should handle average farm with improvement potential', () => {
      const herdSize = 150;
      const currentEmissions = 450000; // 3000 kg/cow
      
      const tm = theoreticalMinimum(herdSize);
      const percentAbove = percentageAboveTM(currentEmissions, herdSize);
      const gap = gapToTM(currentEmissions, herdSize);
      
      expect(tm).toBe(300000);
      expect(percentAbove).toBe(50);
      expect(gap).toBe(150000);
    });

    it('should handle poor-performing farm far from TM', () => {
      const herdSize = 100;
      const currentEmissions = 500000; // 5000 kg/cow
      
      const percentAbove = percentageAboveTM(currentEmissions, herdSize);
      const interpretation = getTMInterpretation(percentAbove);
      const gap = gapToTM(currentEmissions, herdSize);
      
      expect(percentAbove).toBe(150);
      expect(interpretation.category).toBe('Poor'); // Categories are: Excellent, Good, Average, Poor
      expect(gap).toBe(300000);
    });
  });

  describe('Environmental variable override', () => {
    it('should use default value when env var not set', () => {
      // This test assumes REACT_APP_TM_PER_COW is not set
      const tm = theoreticalMinimum(100);
      expect(tm).toBe(200000); // Default 2000 kg/cow
    });

    // Note: Testing env var override would require mocking process.env
    // which is better done in the constants.test.ts file
  });
});