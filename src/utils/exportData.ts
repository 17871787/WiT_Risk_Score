// Export functionality for GHG WHAT-IF Tool data
import { FarmParameters } from '../types';
import { calculateEmissions, calculateTotalFarmEmissions, calculateSequestration } from '../lib/calculations/emissions';
import { calculateLME } from '../lib/calculations/lme';
import { calculateNUE } from '../lib/calculations/nue';
import { theoreticalMinimum, percentageAboveTM, getTMInterpretation } from '../lib/calculations/carbonFloor';
import { calculateReductionPathway } from '../lib/calculations/reductionPathway';
import { calculateFinancingPackage } from '../lib/calculations/greenFinancing';

interface ExportData {
  timestamp: string;
  farmName: string;
  parameters: FarmParameters;
  emissions: {
    total: number;
    intensity: number;
    breakdown: {
      enteric: number;
      manure: number;
      feed: number;
      nitrogen: number;
    };
  };
  performance: {
    lme: number;
    nue: number;
    lmePlusNue: number;
    sustainabilityScore: number;
  };
  theoreticalMinimum: {
    tm: number;
    current: number;
    percentageAbove: number;
    category: string;
    gap: number;
  };
  sequestration: {
    total: number;
    breakdown: {
      trees: number;
      hedgerows: number;
      soil: number;
      coverCrops: number;
      renewable: number;
      methaneInhibitor: number;
      improvedManure: number;
    };
  };
  reductionPathway: {
    measures: Array<{
      name: string;
      potential: number;
      cost: number;
      roi: number;
    }>;
    totalPotential: number;
    totalCost: number;
    canReachTM: boolean;
  };
  financing: {
    totalInvestment: number;
    monthlyPayment: number;
    paybackPeriod: number;
    npv: number;
    irr: number;
  };
}

export const generateExportData = (parameters: FarmParameters): ExportData => {
  // Calculate emissions
  const emissionsBreakdown = calculateEmissions(parameters);
  const totalEmissions = calculateTotalFarmEmissions(emissionsBreakdown.totalAnnualEmissions, parameters.herdSize);
  const emissionsIntensity = emissionsBreakdown.totalAnnualEmissions / parameters.milkYield;
  
  // Calculate performance metrics
  const lmeResult = calculateLME({
    annualMilkYield: parameters.milkYield,
    averageLactations: parameters.avgLactations,
    ageAtFirstCalving: parameters.ageFirstCalving,
    calvingInterval: parameters.calvingInterval,
    feedQuality: parameters.feedQuality,
    systemType: parameters.systemType,
    concentrateFeed: parameters.concentrateFeed,
    manureSystem: parameters.manureSystem,
    grazingMonths: parameters.grazingMonths,
    feedCarbonFootprint: parameters.feedCarbonFootprint,
    soyaContent: parameters.soyaContent,
    deforestationFree: parameters.deforestationFree,
    nitrogenRate: parameters.nitrogenRate,
    season: parameters.season
  });
  
  const nueValue = calculateNUE(parameters);
  const lmePlusNue = lmeResult.lme * (nueValue / 100);
  const sustainabilityScore = Math.min(50, lmeResult.lme / 15 * 50) + Math.min(50, nueValue / 150 * 50);
  
  // Calculate theoretical minimum
  const tm = theoreticalMinimum(parameters.herdSize);
  const currentEmissionsKg = totalEmissions * 1000;
  const percentAbove = percentageAboveTM(currentEmissionsKg, parameters.herdSize);
  const tmInterpretation = getTMInterpretation(percentAbove);
  
  // Calculate sequestration
  const sequestrationResult = calculateSequestration(parameters);
  
  // Calculate reduction pathway
  const pathway = calculateReductionPathway(parameters);
  
  // Calculate financing
  const financing = calculateFinancingPackage(pathway, 720, 0);
  
  return {
    timestamp: new Date().toISOString(),
    farmName: `Farm_${parameters.herdSize}_cows`,
    parameters,
    emissions: {
      total: totalEmissions,
      intensity: emissionsIntensity,
      breakdown: {
        enteric: emissionsBreakdown.entericEmissions,
        manure: emissionsBreakdown.manureEmissions,
        feed: emissionsBreakdown.feedEmissions,
        nitrogen: emissionsBreakdown.nitrogenEmissions
      }
    },
    performance: {
      lme: lmeResult.lme,
      nue: nueValue,
      lmePlusNue,
      sustainabilityScore
    },
    theoreticalMinimum: {
      tm: tm / 1000, // Convert to tonnes
      current: totalEmissions,
      percentageAbove: percentAbove,
      category: tmInterpretation.category,
      gap: (currentEmissionsKg - tm) / 1000
    },
    sequestration: {
      total: sequestrationResult.totalSequestration,
      breakdown: {
        trees: sequestrationResult.treeSequestration,
        hedgerows: sequestrationResult.hedgerowSequestration,
        soil: sequestrationResult.soilCarbonSequestration,
        coverCrops: parameters.coverCropsHa * 1.5,
        renewable: parameters.renewableEnergyKw * 0.0004,
        methaneInhibitor: sequestrationResult.methaneReduction,
        improvedManure: sequestrationResult.improvedManureReduction
      }
    },
    reductionPathway: {
      measures: pathway.measures.map(m => ({
        name: m.name,
        potential: m.potentialReduction,
        cost: m.cost,
        roi: (m.potentialReduction * 0.025) / (m.cost / parameters.herdSize) * 100
      })),
      totalPotential: pathway.totalPotentialReduction,
      totalCost: pathway.totalCost,
      canReachTM: pathway.canReachTarget
    },
    financing: {
      totalInvestment: financing.totalInvestment,
      monthlyPayment: financing.totalMonthlyCost,
      paybackPeriod: financing.paybackPeriod,
      npv: financing.netPresentValue,
      irr: financing.internalRateOfReturn
    }
  };
};

export const exportToCSV = (data: ExportData): string => {
  const lines: string[] = [
    'GHG WHAT-IF Tool Export - Version 4.0',
    `Export Date: ${new Date(data.timestamp).toLocaleString()}`,
    `Farm: ${data.farmName}`,
    '',
    '=== EMISSIONS SUMMARY ===',
    `Total Annual Emissions,${data.emissions.total.toFixed(1)},t CO2e`,
    `Emissions Intensity,${data.emissions.intensity.toFixed(3)},kg CO2e/L`,
    '',
    'Emissions Breakdown',
    `Enteric Methane,${data.emissions.breakdown.enteric.toFixed(1)},kg CO2e/cow/year`,
    `Manure,${data.emissions.breakdown.manure.toFixed(1)},kg CO2e/cow/year`,
    `Feed,${data.emissions.breakdown.feed.toFixed(1)},kg CO2e/cow/year`,
    `Nitrogen,${data.emissions.breakdown.nitrogen.toFixed(1)},kg CO2e/cow/year`,
    '',
    '=== PERFORMANCE METRICS ===',
    `LME Score,${data.performance.lme.toFixed(0)},L milk/t CO2e`,
    `NUE,${data.performance.nue.toFixed(1)},%`,
    `LME+NUE Combined,${data.performance.lmePlusNue.toFixed(1)}`,
    `Sustainability Score,${data.performance.sustainabilityScore.toFixed(1)}/100`,
    '',
    '=== THEORETICAL MINIMUM ANALYSIS ===',
    `Theoretical Minimum,${data.theoreticalMinimum.tm.toFixed(1)},t CO2e`,
    `Current Emissions,${data.theoreticalMinimum.current.toFixed(1)},t CO2e`,
    `Above TM,${data.theoreticalMinimum.percentageAbove.toFixed(1)},%`,
    `Performance Category,${data.theoreticalMinimum.category}`,
    `Gap to TM,${data.theoreticalMinimum.gap.toFixed(1)},t CO2e`,
    '',
    '=== SEQUESTRATION ===',
    `Total Sequestration,${data.sequestration.total.toFixed(1)},t CO2e/year`,
    `Trees,${data.sequestration.breakdown.trees.toFixed(1)},t CO2e/year`,
    `Hedgerows,${data.sequestration.breakdown.hedgerows.toFixed(1)},t CO2e/year`,
    `Soil Carbon,${data.sequestration.breakdown.soil.toFixed(1)},t CO2e/year`,
    `Cover Crops,${data.sequestration.breakdown.coverCrops.toFixed(1)},t CO2e/year`,
    `Renewable Energy,${data.sequestration.breakdown.renewable.toFixed(1)},t CO2e/year`,
    `Methane Inhibitor,${data.sequestration.breakdown.methaneInhibitor.toFixed(1)},t CO2e/year`,
    `Improved Manure,${data.sequestration.breakdown.improvedManure.toFixed(1)},t CO2e/year`,
    '',
    '=== REDUCTION PATHWAY ===',
    `Total Reduction Potential,${(data.reductionPathway.totalPotential / 1000).toFixed(1)},t CO2e/year`,
    `Total Investment Needed,${data.reductionPathway.totalCost.toFixed(0)},£`,
    `Can Reach TM,${data.reductionPathway.canReachTM ? 'Yes' : 'No'}`,
    '',
    'Top Reduction Measures',
    'Measure,Potential (kg CO2e),Cost (£),ROI (%)'
  ];
  
  // Add top 5 reduction measures
  data.reductionPathway.measures
    .slice(0, 5)
    .forEach(measure => {
      lines.push(`${measure.name},${measure.potential.toFixed(0)},${measure.cost.toFixed(0)},${measure.roi.toFixed(0)}`);
    });
  
  lines.push(
    '',
    '=== FINANCING SUMMARY ===',
    `Total Investment,${data.financing.totalInvestment.toFixed(0)},£`,
    `Monthly Payment,${data.financing.monthlyPayment.toFixed(0)},£`,
    `Payback Period,${data.financing.paybackPeriod.toFixed(1)},years`,
    `NPV (10 years),${data.financing.npv.toFixed(0)},£`,
    `IRR,${(data.financing.irr * 100).toFixed(1)},%`,
    '',
    '=== FARM PARAMETERS ===',
    `Herd Size,${data.parameters.herdSize},cows`,
    `Milk Yield,${data.parameters.milkYield},L/cow/year`,
    `System Type,${data.parameters.systemType}`,
    `Feed Quality,${data.parameters.feedQuality}/10`,
    `Concentrate Feed,${data.parameters.concentrateFeed},kg/day`,
    `Nitrogen Rate,${data.parameters.nitrogenRate},kg N/ha`,
    `Crude Protein,${data.parameters.crudeProtein},%`,
    `Average Lactations,${data.parameters.avgLactations}`,
    `Age First Calving,${data.parameters.ageFirstCalving},months`,
    `Calving Interval,${data.parameters.calvingInterval},days`,
    `Manure System,${data.parameters.manureSystem}`,
    `Methane Inhibitor,${data.parameters.methaneInhibitor ? 'Yes' : 'No'}`,
    `Improved Manure,${data.parameters.improvedManure ? 'Yes' : 'No'}`
  );
  
  return lines.join('\n');
};

export const exportToJSON = (data: ExportData): string => {
  return JSON.stringify(data, null, 2);
};

export const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};