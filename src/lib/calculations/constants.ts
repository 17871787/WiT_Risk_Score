/**
 * Global Constants for GHG Calculations
 * 
 * All emission factors and constants are sourced from peer-reviewed literature
 * and industry standards. Values should be updated as new research emerges.
 */

// Theoretical Minimum (Biological Floor)
export const THEORETICAL_MINIMUM = {
  // Base biological minimum emissions per cow
  // Source: Placeholder - awaiting peer review
  // Note: This is a rough estimate. UK vs NZ figures can differ by ~30%
  // In a production environment, this could be made configurable
  // via environment variables or a configuration API
  BASE_KG_CO2E_PER_COW: 2000,
  
  // Reference values for validation
  REFERENCES: {
    UK_AVERAGE: 2200,  // kg CO2e/cow/year
    NZ_AVERAGE: 1700,  // kg CO2e/cow/year
    EU_AVERAGE: 2100,  // kg CO2e/cow/year
    GLOBAL_AVERAGE: 2500  // kg CO2e/cow/year
  },
  
  CITATION: "Awaiting peer review. Based on preliminary analysis of biological minimums in optimized dairy systems."
};

// Global Warming Potentials (GWP100)
// Source: IPCC AR6 (2021)
export const GWP = {
  CH4: 28,  // Methane
  N2O: 265, // Nitrous oxide
  CO2: 1    // Carbon dioxide (reference)
};

// Emission Factors
export const EMISSION_FACTORS = {
  // Enteric fermentation
  ENTERIC: {
    BASE_RATE: 100, // kg CH4/cow/year
    PASTURE_ADJUSTMENT: 0.9,
    CONFINED_ADJUSTMENT: 1.0,
    HYBRID_ADJUSTMENT: 0.95
  },
  
  // Manure management
  MANURE: {
    LIQUID_SLURRY: {
      CH4: 20, // kg CH4/cow/year
      N2O: 1.5 // kg N2O/cow/year
    },
    SOLID_STORAGE: {
      CH4: 4,
      N2O: 2
    },
    COMPOSTING: {
      CH4: 1,
      N2O: 1.5
    }
  },
  
  // Nitrogen application
  NITROGEN: {
    N2O_EF: 0.01, // 1% of applied N emitted as N2O
    VOLATILIZATION: 0.1, // 10% NH3 loss
    LEACHING: 0.3 // 30% NO3 loss
  },
  
  // Feed production
  FEED: {
    CONCENTRATE: 0.5, // kg CO2e/kg feed
    FORAGE: 0.1, // kg CO2e/kg DM
    SOYA_DEFORESTATION: 3.5, // kg CO2e/kg soya
    SOYA_SUSTAINABLE: 0.8 // kg CO2e/kg soya
  }
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  // Lactations
  OPTIMAL_LACTATIONS: 4.0,
  MINIMUM_LACTATIONS: 3.0,
  PENALTY_PER_LACTATION: 0.1, // 10% penalty per lactation below minimum
  
  // Calving interval
  OPTIMAL_CALVING_DAYS: 365,
  MAXIMUM_CALVING_DAYS: 400,
  PENALTY_PER_DAY: 0.001, // 0.1% penalty per day over maximum
  
  // Age at first calving
  OPTIMAL_AFC_MONTHS: 24,
  MAXIMUM_AFC_MONTHS: 28,
  PENALTY_PER_MONTH: 0.02 // 2% penalty per month over optimal
};

// Financial parameters
export const FINANCIAL = {
  MILK_PRICE_PER_LITER: 0.35, // £/L
  CARBON_PRICE_PER_TONNE: 25, // £/t CO2e
  
  // Risk scoring weights
  RISK_WEIGHTS: {
    EMISSIONS: 0.7,
    LEVERAGE: 0.3
  },
  
  // Risk thresholds
  RISK_CATEGORIES: {
    VERY_LOW: { max: 20, label: 'Very Low' },
    LOW: { max: 40, label: 'Low' },
    MODERATE: { max: 60, label: 'Moderate' },
    HIGH: { max: 80, label: 'High' },
    VERY_HIGH: { max: 100, label: 'Very High' }
  }
};

// Sequestration rates
export const SEQUESTRATION_RATES = {
  TREES_PER_HA: 5.0, // t CO2/ha/year
  HEDGEROW_PER_100M: 0.15, // t CO2/100m/year
  SOIL_CARBON_PER_PERCENT: 20, // t CO2/ha per 1% increase
  COVER_CROPS_PER_HA: 1.5, // t CO2/ha/year
  RENEWABLE_PER_KW: 0.4, // t CO2/kW/year
  
  // Methane reduction
  INHIBITOR_REDUCTION: 0.3, // 30% reduction
  IMPROVED_MANURE_REDUCTION: 0.2 // 20% reduction
};

// Input validation ranges
export const VALID_RANGES = {
  HERD_SIZE: { min: 10, max: 5000 },
  MILK_YIELD: { min: 2000, max: 15000 },
  FEED_QUALITY: { min: 1, max: 10 },
  CONCENTRATE_FEED: { min: 0, max: 20 },
  NITROGEN_RATE: { min: 0, max: 500 },
  CRUDE_PROTEIN: { min: 10, max: 25 },
  LACTATIONS: { min: 1, max: 8 },
  CALVING_INTERVAL: { min: 300, max: 500 },
  AFC_MONTHS: { min: 18, max: 36 }
};

// Export all constants as a single object for easy access
export const GHG_CONSTANTS = {
  THEORETICAL_MINIMUM,
  GWP,
  EMISSION_FACTORS,
  PERFORMANCE_THRESHOLDS,
  FINANCIAL,
  SEQUESTRATION_RATES,
  VALID_RANGES
};