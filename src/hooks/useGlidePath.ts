// Hook for Net-Carbon Glide Path calculations

import { useMemo } from 'react';
import { useFarmStore } from '../context/FarmContext';
import { useCalculations } from './useCalculations';
import { theoreticalMinimum } from '../lib/calculations/carbonFloor';
import { safeDivide } from '../lib/utils/math';

export interface GlidePathYear {
  year: number;
  gross: number;
  theoreticalMinimum: number;
  sequestration: number;
  net: number;
  percentAboveTM: number;
}

export interface GlidePathData {
  years: GlidePathYear[];
  currentYear: number;
  targetYear: number;
  canReachNetZero: boolean;
  canReachTM: boolean;
}

// Constants for glide path projections
const ANNUAL_TECH_REDUCTION = 0.02; // 2% per year technology improvement
const SEQUESTRATION_RAMP_YEARS = 5; // Years to full sequestration potential
const CURRENT_YEAR = new Date().getFullYear();
const PROJECTION_YEARS = 10;

export const useGlidePath = (): GlidePathData => {
  const { parameters } = useFarmStore();
  const { emissions, sequestration } = useCalculations();
  
  return useMemo(() => {
    const tm = theoreticalMinimum(parameters.herdSize);
    const totalFarmEmissions = emissions.totalAnnualEmissions * parameters.herdSize / 1000; // t CO2e
    const totalSequestration = sequestration.totalSequestration; // Already in tonnes
    
    const years: GlidePathYear[] = [];
    
    for (let i = 0; i < PROJECTION_YEARS; i++) {
      const year = CURRENT_YEAR + i;
      
      // Apply annual technology reduction to gross emissions
      const techReductionFactor = Math.pow(1 - ANNUAL_TECH_REDUCTION, i);
      const projectedGross = totalFarmEmissions * techReductionFactor;
      
      // Ramp up sequestration over first 5 years
      const sequestrationRampFactor = Math.min(1, i / SEQUESTRATION_RAMP_YEARS);
      const projectedSequestration = totalSequestration * sequestrationRampFactor;
      
      // Calculate net emissions
      const projectedNet = Math.max(0, projectedGross - projectedSequestration);
      
      // Calculate percentage above TM
      const percentAboveTM = safeDivide((projectedGross - tm / 1000), tm / 1000, 0) * 100;
      
      years.push({
        year,
        gross: projectedGross,
        theoreticalMinimum: tm / 1000, // Convert to tonnes
        sequestration: projectedSequestration,
        net: projectedNet,
        percentAboveTM
      });
    }
    
    // Determine if targets can be reached
    const finalYear = years[years.length - 1];
    const canReachNetZero = finalYear.net <= 0;
    const canReachTM = finalYear.gross <= finalYear.theoreticalMinimum;
    
    return {
      years,
      currentYear: CURRENT_YEAR,
      targetYear: CURRENT_YEAR + PROJECTION_YEARS - 1,
      canReachNetZero,
      canReachTM
    };
  }, [parameters, emissions, sequestration]);
};