// Emission factors and constants for GHG calculations

export const EMISSION_FACTORS = {
  // Enteric fermentation - calibrated for 0.78 minimum
  BASE_ENTERIC: 2400, // kg CO2e/cow/year
  FEED_MULTIPLIER: 35, // kg CO2e per kg of concentrate feed
  
  // Manure management emission factors (kg CO2e/cow/year)
  MANURE_SYSTEMS: {
    'Liquid/slurry': 500,
    'Solid': 300,
    'Daily spread': 150,
    'Anaerobic digester': 75,  // Best option
    'Pasture': 200
  },
  
  // Grazing reduction factor
  GRAZING_REDUCTION: 30, // kg CO2e reduction per grazing month
  
  // Deforestation
  DEFORESTATION_FACTOR: 3.5, // kg CO2e per kg of soya
  
  // Nitrogen
  NITROGEN_MULTIPLIER: 4.0, // kg CO2e per kg N applied
  
  // Feed quality adjustment
  FEED_QUALITY_BASE: 1.1,
  FEED_QUALITY_FACTOR: 0.02,
  
  // Methane calculation factors
  METHANE_BASE: 0.35,
  METHANE_DMI_FACTOR: 0.023,
  NON_PRODUCTIVE_FACTOR: 0.3 // Factor for non-productive period emissions
} as const;

// Seasonal adjustment factors
export const SEASONAL_FACTORS = {
  Spring: { feed: 1.1, nitrogen: 1.2 },
  Summer: { feed: 1.0, nitrogen: 1.0 },
  Autumn: { feed: 1.2, nitrogen: 0.8 },
  Winter: { feed: 1.3, nitrogen: 0.6 }
} as const;

// System type factors for LME calculation
export const SYSTEM_FACTORS = {
  'intensive': 0.9,
  'moderate': 1.0,
  'extensive': 1.1
} as const;

// Sequestration rates
export const SEQUESTRATION_RATES = {
  TREES_PER_HA: 3.67, // t CO2e/ha/year
  HEDGEROW_PER_KM: 0.6, // t CO2e/km/year
  SOIL_CARBON_PER_HA: 1.5, // t CO2e/ha/year
  COVER_CROPS_PER_HA: 0.8, // t CO2e/ha/year
  RENEWABLE_PER_KW: 0.4, // t CO2e/kW/year
  METHANE_INHIBITOR_REDUCTION: 0.15, // 15% reduction
  IMPROVED_MANURE_REDUCTION: 0.3 // 30% reduction
} as const;

// Economic constants
export const ECONOMIC_CONSTANTS = {
  MILK_PRICE: 0.32, // £/L
  CARBON_CREDIT_PRICE: 25, // £/tonne CO2e
  OPERATIONAL_COST_FACTOR: 0.25, // £/L base operational cost
  HEIFER_REARING_COST_PER_MONTH: 50, // £/month
  
  // Capital costs
  ANAEROBIC_DIGESTER_COST: 85000, // £
  SOLAR_PV_COST_PER_KW: 800, // £/kW
  FEED_MIXER_COST: 22000, // £
  TREE_PLANTING_COST_PER_HA: 3500, // £/ha
  HEDGEROW_COST_PER_KM: 800, // £/km
  SOIL_CARBON_ANNUAL_COST_PER_HA: 150, // £/ha/year
  COVER_CROP_ANNUAL_COST_PER_HA: 80, // £/ha/year
  
  // Savings and returns
  ANAEROBIC_DIGESTER_ANNUAL_SAVING: 3200, // £/year
  SOLAR_ANNUAL_SAVING_PER_KW: 120, // £/kW/year
  FEED_MIXER_SAVING_PER_COW: 45, // £/cow/year
  TREE_GRANT_PER_HA: 1200, // £/ha
  
  // Financing
  GREEN_LOAN_MAX: 250000, // £
  GREEN_LOAN_RATE_DISCOUNT: 0.005, // 0.5%
  CAPITAL_LOAN_APR: 0.029, // 2.9%
  NATURE_LOAN_APR: 0.024 // 2.4%
} as const;

// Thresholds and targets
export const PERFORMANCE_THRESHOLDS = {
  EMISSIONS_TARGET: 1.2, // kg CO2e/L
  COST_TARGET: 0.35, // £/L
  PROTEIN_EFFICIENCY_TARGET: 12, // %
  NITROGEN_EFFICIENCY_TARGET: 15, // %
  CALVING_INTERVAL_TARGET: 385, // days
  AGE_FIRST_CALVING_TARGET: 24, // months
  FEED_CARBON_FOOTPRINT_LIMIT: 1.0, // kg CO2e/kg
  SOYA_CONTENT_WARNING: 10, // %
  OVERALL_HERD_EFFECTIVENESS_TARGET: 70, // %
  LME_TARGET: 10, // L/kg CO2e
  FEED_EFFICIENCY_TARGET: 2.3, // L/kg feed
  RETENTION_RATE_TARGET: 75 // %
} as const;

// LME interpretation thresholds
export const LME_THRESHOLDS = {
  EXCELLENT: 12,
  GOOD: 10,
  AVERAGE: 8,
  BELOW_AVERAGE: 6
} as const;

// Calculation constants
export const CALC_CONSTANTS = {
  DAYS_PER_LACTATION: 305,
  PERSISTENCE_FACTOR: 0.9,
  BASE_DMI: 8, // Base dry matter intake
  DMI_YIELD_FACTOR: 0.4,
  DAYS_PER_MONTH: 30.5,
  MAX_CRUDE_PROTEIN: 22,
  MIN_CRUDE_PROTEIN: 12,
  MAX_NITROGEN_RATE: 300,
  MIN_NITROGEN_RATE: 0
} as const;

// Theoretical Minimum (biological floor)
export const THEORETICAL_MINIMUM = {
  BASE_PER_COW: 2000, // kg CO2e/year - biological minimum
  DESCRIPTION: 'Biological floor based on minimal enteric fermentation'
} as const;