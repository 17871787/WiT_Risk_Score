// Hook for Nitrogen Use Efficiency calculations

import { useMemo } from 'react';
import { useFarmStore } from '../context/FarmContext';
import { 
  calculateNUE, 
  calculateNInputs, 
  calculateNOutputs,
  getNUEInterpretation,
  getNUERecommendations,
  NUE_CONSTANTS
} from '../lib/calculations/nue';

export interface NUEData {
  nue: number;
  nInputs: number;
  nOutputs: number;
  interpretation: ReturnType<typeof getNUEInterpretation>;
  recommendations: string[];
  milkNContent: number;
  nBalance: number; // N surplus/deficit
}

export const useNue = (): NUEData => {
  const { parameters } = useFarmStore();
  
  return useMemo(() => {
    const nue = calculateNUE(parameters);
    const nInputs = calculateNInputs(parameters);
    const nOutputs = calculateNOutputs(parameters);
    const interpretation = getNUEInterpretation(nue);
    const recommendations = getNUERecommendations(parameters, nue);
    
    return {
      nue,
      nInputs,
      nOutputs,
      interpretation,
      recommendations,
      milkNContent: NUE_CONSTANTS.MILK_N_CONTENT,
      nBalance: nInputs - nOutputs
    };
  }, [parameters]);
};