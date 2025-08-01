import { calculateEmissions, calculateSequestration } from '../emissions';
import { FarmParameters } from '../../../types';

describe('Emissions Calculations', () => {
  const mockParams: FarmParameters = {
    herdSize: 150,
    season: 'Summer',
    systemType: 'intensive',
    feedQuality: 7,
    concentrateFeed: 8,
    feedCost: 0.35,
    feedCarbonFootprint: 0.75,
    soyaContent: 10,
    deforestationFree: false,
    nitrogenRate: 180,
    crudeProtein: 17,
    milkYield: 8500,
    avgLactations: 3.9,
    calvingInterval: 380,
    ageFirstCalving: 24.7,
    cullingAge: 6.12,
    birthweight: 40,
    grazingMonths: 7,
    manureSystem: 'Liquid/slurry',
    landType: 'Lowland',
    forageContent: 'Mixed 15-75%',
    treePlantingHa: 10,
    hedgerowKm: 5,
    soilCarbonHa: 20,
    coverCropsHa: 15,
    renewableEnergyKw: 50,
    methaneInhibitor: true,
    improvedManure: true
  };

  describe('calculateEmissions', () => {
    it('should calculate emissions correctly', () => {
      const result = calculateEmissions(mockParams);
      
      expect(result.entericEmissions).toBeGreaterThan(0);
      expect(result.manureEmissions).toBeGreaterThan(0);
      expect(result.feedEmissions).toBeGreaterThan(0);
      expect(result.nitrogenEmissions).toBeGreaterThan(0);
      expect(result.totalAnnualEmissions).toBe(
        result.entericEmissions + 
        result.manureEmissions + 
        result.feedEmissions + 
        result.deforestationEmissions + 
        result.nitrogenEmissions
      );
    });

    it('should handle zero deforestation emissions when certified', () => {
      const certifiedParams = { ...mockParams, deforestationFree: true };
      const result = calculateEmissions(certifiedParams);
      
      expect(result.deforestationEmissions).toBe(0);
    });

    it('should apply seasonal adjustments', () => {
      const winterParams = { ...mockParams, season: 'Winter' as const };
      const summerResult = calculateEmissions(mockParams);
      const winterResult = calculateEmissions(winterParams);
      
      expect(winterResult.entericEmissions).toBeGreaterThan(summerResult.entericEmissions);
    });
  });

  describe('calculateSequestration', () => {
    it('should calculate sequestration correctly', () => {
      const result = calculateSequestration(mockParams);
      
      expect(result.treeSequestration).toBeGreaterThan(0);
      expect(result.hedgerowSequestration).toBeGreaterThan(0);
      expect(result.soilCarbonSequestration).toBeGreaterThan(0);
      expect(result.coverCropSequestration).toBeGreaterThan(0);
      expect(result.renewableOffset).toBeGreaterThan(0);
      expect(result.methaneReduction).toBeGreaterThan(0);
      expect(result.improvedManureReduction).toBeGreaterThan(0);
    });

    it('should handle zero sequestration when no activities', () => {
      const noActivitiesParams = {
        ...mockParams,
        treePlantingHa: 0,
        hedgerowKm: 0,
        soilCarbonHa: 0,
        coverCropsHa: 0,
        renewableEnergyKw: 0,
        methaneInhibitor: false,
        improvedManure: false
      };
      
      const result = calculateSequestration(noActivitiesParams);
      expect(result.totalSequestration).toBe(0);
    });
  });
});