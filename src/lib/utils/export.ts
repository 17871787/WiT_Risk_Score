// CSV export functionality

import { sanitizeForCSV } from './validation';
import { ECONOMIC_CONSTANTS } from '../../constants/emissions';

interface ExportData {
  parameters: any;
  calculations: any;
}

export const exportToCSV = (data: ExportData) => {
  const { parameters, calculations } = data;
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Prepare comprehensive data export
  const csvData = [
    // Header section
    ['GHG WHAT-IF Tool Export', currentDate],
    ['Farm ID', 'DEMO_FARM_001'],
    [''],
    
    // Basic Parameters
    ['BASIC PARAMETERS'],
    ['Parameter', 'Value', 'Unit'],
    ['Herd Size', parameters.herdSize, 'cows'],
    ['Season', parameters.season, ''],
    ['System Type', parameters.systemType, ''],
    ['Feed Quality Score', parameters.feedQuality, '1-10'],
    ['Concentrate Feed', parameters.concentrateFeed, 'kg/day'],
    ['Feed Cost', parameters.feedCost, '£/kg'],
    ['Feed Carbon Footprint', parameters.feedCarbonFootprint, 'kg CO2e/kg'],
    ['Soya Content', parameters.soyaContent, '%'],
    ['Deforestation Free Certified', parameters.deforestationFree ? 'Yes' : 'No', ''],
    ['Nitrogen Application Rate', parameters.nitrogenRate, 'kg N/Ha/Year'],
    ['Crude Protein', parameters.crudeProtein, '%'],
    [''],
    
    // Farm Management
    ['FARM MANAGEMENT'],
    ['Parameter', 'Value', 'Unit'],
    ['Annual Milk Yield', parameters.milkYield, 'L/cow/year'],
    ['Average Lactations', parameters.avgLactations, 'number'],
    ['Calving Interval', parameters.calvingInterval, 'days'],
    ['Age at First Calving', parameters.ageFirstCalving, 'months'],
    ['Grazing Months', parameters.grazingMonths, 'months/year'],
    ['Manure System', parameters.manureSystem, ''],
    [''],
    
    // Performance Metrics
    ['PERFORMANCE METRICS'],
    ['Metric', 'Value', 'Unit', 'Target', 'Status'],
    ['Emissions Intensity', calculations.emissionsIntensity.toFixed(3), 'kg CO2e/L', '1.2', calculations.emissionsIntensity <= 1.2 ? 'Pass' : 'Fail'],
    ['Feed Efficiency', calculations.performanceMetrics.feedEfficiency.toFixed(2), 'L/kg feed', '2.3', calculations.performanceMetrics.feedEfficiency >= 2.3 ? 'Pass' : 'Fail'],
    ['Cost per Litre', calculations.costPerLitre.toFixed(3), '£/L', '0.35', calculations.costPerLitre <= 0.35 ? 'Pass' : 'Fail'],
    ['Overall Herd Effectiveness', calculations.performanceMetrics.overallHerdEffectiveness.toFixed(1), '%', '70', calculations.performanceMetrics.overallHerdEffectiveness >= 70 ? 'Pass' : 'Fail'],
    ['']
  ];
  
  // Convert to CSV string
  const csvContent = csvData.map(row => 
    row.map(cell => sanitizeForCSV(cell)).join(',')
  ).join('\n');
  
  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GHG_WhatIf_Export_${currentDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up - with timeout for Safari
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
};