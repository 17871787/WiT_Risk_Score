// Type definitions for the GHG Tool

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type SystemType = 'intensive' | 'moderate' | 'extensive';
export type ManureSystem = 'Liquid/slurry' | 'Solid' | 'Daily spread' | 'Anaerobic digester' | 'Pasture';
export type LandType = 'Lowland' | 'Upland' | 'Hill';
export type ForageContent = 'Low <15%' | 'Mixed 15-75%' | 'High >75%';
export type MessageType = 'info' | 'query' | 'error';

export interface FarmParameters {
  // Basic parameters
  herdSize: number;
  season: Season;
  systemType: SystemType;
  feedQuality: number; // 1-10 scale
  concentrateFeed: number; // kg/day
  feedCost: number; // £/kg
  feedCarbonFootprint: number; // kg CO2e/kg
  soyaContent: number; // percentage
  deforestationFree: boolean;
  nitrogenRate: number; // kg N/Ha/Year
  crudeProtein: number; // percentage
  
  // Farm management
  milkYield: number; // L/cow/year
  avgLactations: number;
  calvingInterval: number; // days
  ageFirstCalving: number; // months
  cullingAge: number; // years
  birthweight: number; // kg
  grazingMonths: number; // months/year
  manureSystem: ManureSystem;
  landType: LandType;
  forageContent: ForageContent;
  
  // Sequestration activities
  treePlantingHa: number;
  hedgerowKm: number;
  soilCarbonHa: number;
  coverCropsHa: number;
  renewableEnergyKw: number;
  methaneInhibitor: boolean;
  improvedManure: boolean;
}

export interface LMECalculationParams {
  annualMilkYield: number;
  averageLactations: number;
  ageAtFirstCalving: number;
  calvingInterval: number;
  feedQuality: number;
  systemType: SystemType;
  concentrateFeed: number;
  manureSystem: ManureSystem;
  grazingMonths: number;
  feedCarbonFootprint: number;
  soyaContent: number;
  deforestationFree: boolean;
  nitrogenRate: number;
  season: Season;
}

export interface LMEResult {
  lme: number;
  lifetimeProduction: number;
  lifetimeEmissions: number;
  interpretation: LMEInterpretation;
  originalEmissions: number;
}

export interface LMEInterpretation {
  text: string;
  color: string;
  bgColor: string;
}

export interface EmissionBreakdown {
  entericEmissions: number;
  manureEmissions: number;
  feedEmissions: number;
  deforestationEmissions: number;
  nitrogenEmissions: number;
  totalAnnualEmissions: number;
}

export interface SequestrationBreakdown {
  treeSequestration: number;
  hedgerowSequestration: number;
  soilCarbonSequestration: number;
  coverCropSequestration: number;
  renewableOffset: number;
  methaneReduction: number;
  improvedManureReduction: number;
  totalSequestration: number;
}

export interface ProjectionYear {
  year: number;
  grossEmissions: number;
  sequestration: number;
  netEmissions: number;
  production: number;
  intensity: number;
}

export interface OptimizationSuggestion {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
}

export interface CostBreakdownItem {
  name: string;
  value: number; // percentage
  amount: number; // £
}

export interface PerformanceMetrics {
  emissions: number; // kg CO2e/L
  feedEfficiency: number; // L/kg
  proteinEfficiency: number; // %
  nitrogenEfficiency: number; // %
  costPerLitre: number; // £/L
  overallHerdEffectiveness: number; // %
  calvingUnder25Pct: number; // %
  hitCalvingIntervalPct: number; // %
  retentionRate: number; // %
  replacementRate: number; // %
}

export interface ChatMessage {
  type: MessageType;
  text: string;
  timestamp: Date;
}

export interface FinancingOption {
  name: string;
  type: 'capital' | 'nature';
  cost: number;
  annualReturn: number;
  co2Reduction: number;
  paybackYears: number;
  description: string;
}