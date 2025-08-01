import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useCalculations } from '../hooks/useCalculations';

export const FarmSummary: React.FC = () => {
  const {
    totalFarmEmissions,
    sequestration,
    netFarmEmissions,
    totalFarmProduction,
    totalFarmCost,
    totalFarmProfit
  } = useCalculations();
  
  return (
    <div className="mt-8 pt-6 border-t">
      <h3 className="text-sm font-semibold mb-4 flex items-center">
        <TrendingUp className="mr-2" size={16} />
        Farm Summary
      </h3>
      
      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">Gross Emissions</div>
          <div className="text-lg font-bold text-red-600">
            {totalFarmEmissions.toFixed(0)} t CO₂e/year
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 mb-1">Sequestration</div>
          <div className="text-lg font-bold text-green-600">
            {sequestration.totalSequestration.toFixed(0)} t CO₂e/year
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 mb-1">Net Emissions</div>
          <div className={`text-lg font-bold ${
            netFarmEmissions > 0 ? 'text-orange-600' : 'text-green-600'
          }`}>
            {netFarmEmissions.toFixed(0)} t CO₂e/year
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 mb-1">Total Production</div>
          <div className="text-lg font-bold text-blue-600">
            {totalFarmProduction.toFixed(0)}k L/year
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 mb-1">Total Cost</div>
          <div className="text-lg font-bold text-orange-600">
            £{(totalFarmCost / 1000).toFixed(0)}k
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 mb-1">Est. Annual Profit</div>
          <div className={`text-lg font-bold ${
            totalFarmProfit > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            £{(totalFarmProfit / 1000).toFixed(0)}k
          </div>
        </div>
      </div>
    </div>
  );
};