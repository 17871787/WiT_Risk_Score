import React from 'react';
import { Download, AlertTriangle } from 'lucide-react';
import { useCalculations } from '../hooks/useCalculations';
import { exportToCSV } from '../lib/utils/export';
import { calculatePerformancePenalty } from '../lib/calculations/emissions';

export const Header: React.FC = () => {
  const {
    parameters,
    emissionsIntensity,
    netFarmEmissions,
    costPerLitre,
    performanceMetrics
  } = useCalculations();
  
  const performancePenalty = calculatePerformancePenalty(parameters);
  const penaltyPercentage = ((performancePenalty - 1) * 100).toFixed(0);
  
  const handleExport = () => {
    exportToCSV({
      parameters,
      calculations: {
        emissionsIntensity,
        netFarmEmissions,
        costPerLitre,
        performanceMetrics
      }
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-800">GHG WHAT-IF Tool</h1>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Dairy Farm Optimizer
          </span>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          {performancePenalty > 1.05 && (
            <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
              <AlertTriangle size={16} />
              <span className="font-medium">+{penaltyPercentage}% emissions penalty</span>
            </div>
          )}
          <div className="text-center">
            <div className="font-semibold text-gray-900">{parameters.herdSize} cows</div>
            <div className="text-xs text-gray-500">Herd Size</div>
          </div>
          <div className="text-center">
            <div className={`font-semibold ${emissionsIntensity > 1.2 ? 'text-red-600' : 'text-gray-900'}`}>
              {emissionsIntensity.toFixed(2)} kg CO₂e/L
            </div>
            <div className="text-xs text-gray-500">Emissions</div>
          </div>
          <div className="text-center">
            <div className={`font-semibold ${netFarmEmissions > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {netFarmEmissions.toFixed(0)} t/yr
            </div>
            <div className="text-xs text-gray-500">Net Carbon</div>
          </div>
          <div className="text-center">
            <div className={`font-semibold ${costPerLitre > 0.35 ? 'text-red-600' : 'text-gray-900'}`}>
              £{costPerLitre.toFixed(3)}/L
            </div>
            <div className="text-xs text-gray-500">Cost</div>
          </div>
          <div className="text-center">
            <div className={`font-semibold ${
              performanceMetrics.overallHerdEffectiveness >= 70 ? 'text-green-600' : 
              performanceMetrics.overallHerdEffectiveness >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {performanceMetrics.overallHerdEffectiveness.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Effectiveness</div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Export data to CSV"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};