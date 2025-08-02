// Reduction pathway calculations for reaching Theoretical Minimum
import { FarmParameters } from '../../types';
import { theoreticalMinimum } from './carbonFloor';
import { calculateEmissions, calculateTotalFarmEmissions } from './emissions';

export interface ReductionMeasure {
  id: string;
  name: string;
  description: string;
  potentialReduction: number; // kg CO2e/year
  cost: number; // $/year
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeToImplement: number; // months
  category: 'Feed' | 'Manure' | 'Technology' | 'Management';
}

export interface ReductionPathway {
  currentEmissions: number;
  targetEmissions: number;
  gap: number;
  measures: ReductionMeasure[];
  totalPotentialReduction: number;
  totalCost: number;
  timeToTarget: number; // years
  canReachTarget: boolean;
}

// Reduction potential percentages for various measures
const REDUCTION_POTENTIALS = {
  feedQuality: 0.015, // 1.5% per quality point improvement
  methaneInhibitor: 0.15, // 15% reduction
  manureDigester: 0.10, // 10% reduction
  precisionFeeding: 0.08, // 8% reduction
  improvedGenetics: 0.12, // 12% reduction over 5 years
  heatAbatement: 0.05, // 5% reduction
  renewableEnergy: 0.03, // 3% reduction
  optimizedReproduction: 0.07, // 7% reduction
} as const;

// Cost estimates per cow per year
const MEASURE_COSTS = {
  feedQuality: 50, // per quality point
  methaneInhibitor: 200,
  manureDigester: 150,
  precisionFeeding: 100,
  improvedGenetics: 80,
  heatAbatement: 60,
  renewableEnergy: 120,
  optimizedReproduction: 40,
} as const;

export const calculateReductionPathway = (
  params: FarmParameters,
  targetYear: number = 2035
): ReductionPathway => {
  const currentYear = new Date().getFullYear();
  const timeToTarget = targetYear - currentYear;
  
  // Calculate current emissions
  const emissionsBreakdown = calculateEmissions(params);
  const currentEmissions = calculateTotalFarmEmissions(emissionsBreakdown.totalAnnualEmissions, params.herdSize) * 1000; // Convert back to kg
  const targetEmissions = theoreticalMinimum(params.herdSize);
  const gap = currentEmissions - targetEmissions;
  
  const measures: ReductionMeasure[] = [];
  let totalPotentialReduction = 0;
  let totalCost = 0;
  
  // 1. Feed quality improvement
  if (params.feedQuality < 9) {
    const improvement = 9 - params.feedQuality;
    const reduction = currentEmissions * REDUCTION_POTENTIALS.feedQuality * improvement;
    const cost = MEASURE_COSTS.feedQuality * improvement * params.herdSize;
    
    measures.push({
      id: 'feed-quality',
      name: 'Improve Feed Quality',
      description: `Upgrade feed quality from ${params.feedQuality}/10 to 9/10`,
      potentialReduction: reduction,
      cost,
      difficulty: 'Easy',
      timeToImplement: 3,
      category: 'Feed'
    });
    
    totalPotentialReduction += reduction;
    totalCost += cost;
  }
  
  // 2. Methane inhibitor adoption
  if (!params.methaneInhibitor) {
    const reduction = currentEmissions * REDUCTION_POTENTIALS.methaneInhibitor;
    const cost = MEASURE_COSTS.methaneInhibitor * params.herdSize;
    
    measures.push({
      id: 'methane-inhibitor',
      name: 'Adopt Methane Inhibitors',
      description: 'Add 3-NOP or similar feed additives to reduce enteric methane',
      potentialReduction: reduction,
      cost,
      difficulty: 'Easy',
      timeToImplement: 1,
      category: 'Technology'
    });
    
    totalPotentialReduction += reduction;
    totalCost += cost;
  }
  
  // 3. Manure system upgrade
  if (params.manureSystem !== 'Anaerobic digester') {
    const reduction = currentEmissions * REDUCTION_POTENTIALS.manureDigester;
    const cost = MEASURE_COSTS.manureDigester * params.herdSize;
    
    measures.push({
      id: 'manure-digester',
      name: 'Install Anaerobic Digester',
      description: 'Upgrade manure management to anaerobic digestion with biogas capture',
      potentialReduction: reduction,
      cost,
      difficulty: 'Hard',
      timeToImplement: 12,
      category: 'Manure'
    });
    
    totalPotentialReduction += reduction;
    totalCost += cost;
  }
  
  // 4. Precision feeding system
  if (totalPotentialReduction < gap) {
    const reduction = currentEmissions * REDUCTION_POTENTIALS.precisionFeeding;
    const cost = MEASURE_COSTS.precisionFeeding * params.herdSize;
    
    measures.push({
      id: 'precision-feeding',
      name: 'Implement Precision Feeding',
      description: 'Individual cow feeding optimization with smart feeders',
      potentialReduction: reduction,
      cost,
      difficulty: 'Medium',
      timeToImplement: 6,
      category: 'Technology'
    });
    
    totalPotentialReduction += reduction;
    totalCost += cost;
  }
  
  // 5. Genetic improvement program
  if (totalPotentialReduction < gap) {
    const reduction = currentEmissions * REDUCTION_POTENTIALS.improvedGenetics;
    const cost = MEASURE_COSTS.improvedGenetics * params.herdSize;
    
    measures.push({
      id: 'improved-genetics',
      name: 'Accelerate Genetic Progress',
      description: 'Select for low-methane genetics and improved feed efficiency',
      potentialReduction: reduction,
      cost,
      difficulty: 'Medium',
      timeToImplement: 24,
      category: 'Management'
    });
    
    totalPotentialReduction += reduction;
    totalCost += cost;
  }
  
  // 6. Heat abatement systems
  if (totalPotentialReduction < gap) {
    const reduction = currentEmissions * REDUCTION_POTENTIALS.heatAbatement;
    const cost = MEASURE_COSTS.heatAbatement * params.herdSize;
    
    measures.push({
      id: 'heat-abatement',
      name: 'Install Heat Abatement',
      description: 'Cooling systems to reduce heat stress and improve efficiency',
      potentialReduction: reduction,
      cost,
      difficulty: 'Medium',
      timeToImplement: 3,
      category: 'Technology'
    });
    
    totalPotentialReduction += reduction;
    totalCost += cost;
  }
  
  // 7. Renewable energy
  if (totalPotentialReduction < gap) {
    const reduction = currentEmissions * REDUCTION_POTENTIALS.renewableEnergy;
    const cost = MEASURE_COSTS.renewableEnergy * params.herdSize;
    
    measures.push({
      id: 'renewable-energy',
      name: 'Switch to Renewable Energy',
      description: 'Solar panels and renewable energy for farm operations',
      potentialReduction: reduction,
      cost,
      difficulty: 'Hard',
      timeToImplement: 6,
      category: 'Technology'
    });
    
    totalPotentialReduction += reduction;
    totalCost += cost;
  }
  
  // 8. Optimized reproduction
  if (params.ageFirstCalving > 22 || params.calvingInterval > 380) {
    const reduction = currentEmissions * REDUCTION_POTENTIALS.optimizedReproduction;
    const cost = MEASURE_COSTS.optimizedReproduction * params.herdSize;
    
    measures.push({
      id: 'optimized-reproduction',
      name: 'Optimize Reproduction',
      description: 'Improve fertility management to reduce heifer overhead',
      potentialReduction: reduction,
      cost,
      difficulty: 'Easy',
      timeToImplement: 12,
      category: 'Management'
    });
    
    totalPotentialReduction += reduction;
    totalCost += cost;
  }
  
  // Sort measures by ROI (reduction per dollar)
  measures.sort((a, b) => {
    const roiA = a.potentialReduction / a.cost;
    const roiB = b.potentialReduction / b.cost;
    return roiB - roiA;
  });
  
  return {
    currentEmissions,
    targetEmissions,
    gap,
    measures,
    totalPotentialReduction,
    totalCost,
    timeToTarget,
    canReachTarget: totalPotentialReduction >= gap * 0.9 // 90% of gap
  };
};

// Calculate implementation timeline
export const calculateImplementationTimeline = (
  pathway: ReductionPathway
): Array<{
  year: number;
  measure: string;
  cumulativeReduction: number;
  remainingGap: number;
}> => {
  const currentYear = new Date().getFullYear();
  const timeline: Array<{
    year: number;
    measure: string;
    cumulativeReduction: number;
    remainingGap: number;
  }> = [];
  let cumulativeReduction = 0;
  
  // Group measures by implementation time
  const measuresByTime = pathway.measures.reduce((acc, measure) => {
    const implYear = currentYear + Math.ceil(measure.timeToImplement / 12);
    if (!acc[implYear]) acc[implYear] = [];
    acc[implYear].push(measure);
    return acc;
  }, {} as Record<number, ReductionMeasure[]>);
  
  // Build timeline
  Object.keys(measuresByTime)
    .sort((a, b) => Number(a) - Number(b))
    .forEach(year => {
      measuresByTime[Number(year)].forEach(measure => {
        cumulativeReduction += measure.potentialReduction;
        timeline.push({
          year: Number(year),
          measure: measure.name,
          cumulativeReduction,
          remainingGap: Math.max(0, pathway.gap - cumulativeReduction)
        });
      });
    });
  
  return timeline;
};

// Calculate financing needs for reduction pathway
export const calculateFinancingNeeds = (
  pathway: ReductionPathway,
  interestRate: number = 0.04
): {
  totalInvestment: number;
  annualPayment: number;
  paybackPeriod: number;
  netPresentValue: number;
} => {
  const totalInvestment = pathway.totalCost;
  const annualSavings = pathway.totalPotentialReduction * 0.02; // Assume $0.02/kg CO2e carbon credit
  const loanTerm = 10; // years
  
  // Calculate annual payment (loan amortization)
  const monthlyRate = interestRate / 12;
  const numPayments = loanTerm * 12;
  const annualPayment = totalInvestment * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1) * 12;
  
  // Calculate simple payback period
  const paybackPeriod = totalInvestment / annualSavings;
  
  // Calculate NPV over 10 years
  let npv = -totalInvestment;
  for (let year = 1; year <= 10; year++) {
    npv += annualSavings / Math.pow(1 + interestRate, year);
  }
  
  return {
    totalInvestment,
    annualPayment,
    paybackPeriod,
    netPresentValue: npv
  };
};