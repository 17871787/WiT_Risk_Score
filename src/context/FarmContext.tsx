// Farm state management using Zustand

import { create } from 'zustand';
import { FarmParameters } from '../types';

interface FarmState {
  parameters: FarmParameters;
  updateParameter: <K extends keyof FarmParameters>(
    key: K, 
    value: FarmParameters[K]
  ) => void;
  updateMultipleParameters: (updates: Partial<FarmParameters>) => void;
  resetParameters: () => void;
}

const defaultParameters: FarmParameters = {
  // Basic parameters
  herdSize: 150,
  season: 'Summer',
  systemType: 'intensive',
  feedQuality: 7,
  concentrateFeed: 8.08,
  feedCost: 0.35,
  feedCarbonFootprint: 0.75,
  soyaContent: 0,
  deforestationFree: false,
  nitrogenRate: 180,
  crudeProtein: 17,
  
  // Farm management
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
  
  // Sequestration activities
  treePlantingHa: 0,
  hedgerowKm: 0,
  soilCarbonHa: 0,
  coverCropsHa: 0,
  renewableEnergyKw: 0,
  methaneInhibitor: false,
  improvedManure: false
};

export const useFarmStore = create<FarmState>((set) => ({
  parameters: defaultParameters,
  
  updateParameter: (key, value) => 
    set((state) => ({
      parameters: {
        ...state.parameters,
        [key]: value
      }
    })),
  
  updateMultipleParameters: (updates) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        ...updates
      }
    })),
  
  resetParameters: () => 
    set({ parameters: defaultParameters })
}));