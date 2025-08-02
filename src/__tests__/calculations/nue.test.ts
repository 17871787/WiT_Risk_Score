import { 
  calculateNUE, 
  calculateNInputs, 
  calculateNOutputs, 
  getNUEInterpretation,
  calculateFeedNContent,
  getNUERecommendations
} from '../../lib/calculations/nue';
import { FarmParameters } from '../../types';

describe('NUE Calculations', () => {
  const baseParams: FarmParameters = {
    herdSize: 100,
    milkYield: 8000,
    systemType: 'confined',
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
    manureSystem: 'liquid/slurry',
    season: 'Annual',
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

  describe('calculateFeedNContent', () => {
    it('should calculate N content from crude protein correctly', () => {
      expect(calculateFeedNContent(16.5)).toBeCloseTo(0.0264, 4);
      expect(calculateFeedNContent(18)).toBeCloseTo(0.0288, 4);
      expect(calculateFeedNContent(12)).toBeCloseTo(0.0192, 4);
    });
  });

  describe('calculateNInputs', () => {
    it('should calculate total N inputs correctly', () => {
      const inputs = calculateNInputs(baseParams);
      // 200 kg N/ha * 0.5 ha/cow + 8 kg/day * 365 days * 0.0264 kg N/kg
      const expected = 100 + (8 * 365 * 0.0264);
      expect(inputs).toBeCloseTo(expected, 1);
    });

    it('should handle zero nitrogen rate', () => {
      const params = { ...baseParams, nitrogenRate: 0 };
      const inputs = calculateNInputs(params);
      expect(inputs).toBeGreaterThan(0); // Still has feed inputs
    });

    it('should handle zero concentrate feed', () => {
      const params = { ...baseParams, concentrateFeed: 0 };
      const inputs = calculateNInputs(params);
      expect(inputs).toBe(100); // Only fertilizer N
    });
  });

  describe('calculateNOutputs', () => {
    it('should calculate milk N output correctly', () => {
      const outputs = calculateNOutputs(baseParams);
      expect(outputs).toBe(8000 * 0.0055); // 44 kg N/cow/year
    });

    it('should scale with milk yield', () => {
      const lowYield = { ...baseParams, milkYield: 6000 };
      const highYield = { ...baseParams, milkYield: 10000 };
      
      expect(calculateNOutputs(lowYield)).toBe(33);
      expect(calculateNOutputs(highYield)).toBe(55);
    });
  });

  describe('calculateNUE', () => {
    it('should calculate NUE percentage correctly', () => {
      const nue = calculateNUE(baseParams);
      expect(nue).toBeGreaterThan(20);
      expect(nue).toBeLessThan(50);
    });

    it('should cap NUE at 150%', () => {
      // Extreme case: very low inputs, high outputs
      const params = { 
        ...baseParams, 
        nitrogenRate: 10,
        concentrateFeed: 1,
        crudeProtein: 10,
        milkYield: 12000
      };
      const nue = calculateNUE(params);
      expect(nue).toBeLessThanOrEqual(150);
    });

    it('should handle edge case with zero inputs gracefully', () => {
      const params = { 
        ...baseParams, 
        nitrogenRate: 0,
        concentrateFeed: 0,
        milkYield: 0
      };
      const nue = calculateNUE(params);
      expect(nue).toBe(0); // safeDivide returns 0 for 0/0
    });

    it('should improve with better milk yield', () => {
      const lowYield = { ...baseParams, milkYield: 6000 };
      const highYield = { ...baseParams, milkYield: 10000 };
      
      expect(calculateNUE(highYield)).toBeGreaterThan(calculateNUE(lowYield));
    });

    it('should decrease with higher N inputs', () => {
      const lowN = { ...baseParams, nitrogenRate: 100 };
      const highN = { ...baseParams, nitrogenRate: 300 };
      
      expect(calculateNUE(lowN)).toBeGreaterThan(calculateNUE(highN));
    });
  });

  describe('getNUEInterpretation', () => {
    it('should categorize NUE correctly', () => {
      expect(getNUEInterpretation(120).category).toBe('Excellent');
      expect(getNUEInterpretation(90).category).toBe('Good');
      expect(getNUEInterpretation(70).category).toBe('Average');
      expect(getNUEInterpretation(50).category).toBe('Poor');
    });

    it('should return appropriate colors', () => {
      expect(getNUEInterpretation(120).color).toBe('text-green-700');
      expect(getNUEInterpretation(50).color).toBe('text-red-700');
    });
  });

  describe('getNUERecommendations', () => {
    it('should recommend reducing N when rate is high', () => {
      const params = { ...baseParams, nitrogenRate: 250 };
      const recommendations = getNUERecommendations(params, 60);
      expect(recommendations).toContain('Reduce N fertilizer application rate to <200 kg N/ha');
    });

    it('should recommend optimizing protein when CP is high', () => {
      const params = { ...baseParams, crudeProtein: 20 };
      const recommendations = getNUERecommendations(params, 60);
      expect(recommendations).toContain('Optimize dietary protein to 16-18% CP');
    });

    it('should recommend anaerobic digestion for poor NUE', () => {
      const params = { ...baseParams, manureSystem: 'liquid/slurry' as const };
      const recommendations = getNUERecommendations(params, 50);
      expect(recommendations).toContain('Consider anaerobic digestion for better N recovery');
    });

    it('should not recommend changes for good performance', () => {
      const params = { 
        ...baseParams, 
        nitrogenRate: 150,
        crudeProtein: 16,
        milkYield: 9000,
        feedQuality: 9
      };
      const recommendations = getNUERecommendations(params, 90);
      expect(recommendations.length).toBe(0);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle high-performing pasture farm', () => {
      const params: FarmParameters = {
        ...baseParams,
        systemType: 'pasture',
        milkYield: 7500,
        nitrogenRate: 150,
        crudeProtein: 15,
        feedQuality: 9,
        concentrateFeed: 4
      };
      
      const nue = calculateNUE(params);
      expect(nue).toBeGreaterThan(35);
      expect(nue).toBeLessThan(50);
    });

    it('should handle intensive confined system', () => {
      const params: FarmParameters = {
        ...baseParams,
        systemType: 'confined',
        milkYield: 11000,
        nitrogenRate: 250,
        crudeProtein: 18,
        concentrateFeed: 12
      };
      
      const nue = calculateNUE(params);
      expect(nue).toBeGreaterThan(25);
      expect(nue).toBeLessThan(40);
    });

    it('should handle struggling farm with poor efficiency', () => {
      const params: FarmParameters = {
        ...baseParams,
        milkYield: 6000,
        nitrogenRate: 200,
        crudeProtein: 19,
        feedQuality: 5,
        concentrateFeed: 6
      };
      
      const nue = calculateNUE(params);
      expect(nue).toBeLessThan(30);
      expect(getNUEInterpretation(nue).category).toBe('Poor');
    });
  });
});