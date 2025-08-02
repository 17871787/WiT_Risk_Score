import { useCalculations } from './useCalculations';
import { useFarmStore } from '../context/FarmContext';

/**
 * Gathers cross-dashboard data from existing context/calculations
 */
export const useDashboardState = () => {
  const calculations = useCalculations();
  const { parameters, loanAmount, loanTerm } = useFarmStore();
  
  return {
    // Core calculations
    emissions: calculations.emissions,
    emissionsIntensity: calculations.emissionsIntensity,
    totalFarmEmissions: calculations.totalFarmEmissions,
    netFarmEmissions: calculations.netFarmEmissions,
    
    // Sequestration
    sequestration: calculations.sequestration,
    
    // Economics
    totalAnnualCost: calculations.totalAnnualCost,
    costPerLitre: calculations.costPerLitre,
    costBreakdown: calculations.costBreakdown,
    totalFarmCost: calculations.totalFarmCost,
    totalFarmRevenue: calculations.totalFarmRevenue,
    totalFarmProfit: calculations.totalFarmProfit,
    
    // LME
    lmeResult: calculations.lmeResult,
    
    // Performance
    performanceMetrics: calculations.performanceMetrics,
    
    // Production
    totalFarmProduction: calculations.totalFarmProduction,
    
    // Parameters
    parameters,
    loanAmount,
    loanTerm,
    
    // Seasonal
    seasonalFactors: calculations.seasonalFactors,
  };
};

/**
 * Wraps setter functions for dashboard actions
 */
export const useDashboardActions = () => {
  const store = useFarmStore();
  
  return {
    updateParameter: store.updateParameter,
    updateMultipleParameters: store.updateMultipleParameters,
    updateLoanParameter: store.updateLoanParameter,
    resetParameters: store.resetParameters,
  };
};

// Type exports for dashboard props
export type DashboardState = ReturnType<typeof useDashboardState>;
export type DashboardActions = ReturnType<typeof useDashboardActions>;

export interface DashboardProps {
  state: DashboardState;
  actions: DashboardActions;
}