import React, { useMemo } from 'react';
import { DashboardProps } from '../hooks/useDashboardState';
import { GreenFinancingDisplay } from '../components/GreenFinancingDisplay';
import { calculateReductionPathway } from '../lib/calculations/reductionPathway';
import { useFarmStore } from '../context/FarmContext';

const FinancingDashboard: React.FC<DashboardProps> = ({ state, actions }) => {
  const parameters = useFarmStore((state) => state.parameters);
  
  // Calculate pathway for financing analysis
  const pathway = useMemo(() => 
    calculateReductionPathway(parameters),
    [parameters]
  );
  
  // Quick summary metrics
  const totalInvestment = pathway.totalCost;
  const emissionsReduction = (pathway.totalPotentialReduction / pathway.currentEmissions) * 100;
  const paybackYears = totalInvestment / (pathway.totalPotentialReduction * 25); // $25/tonne
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Green Financing Options</h2>
      
      {/* Investment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">Total Investment</p>
          <p className="text-2xl font-bold">${totalInvestment.toLocaleString()}</p>
          <p className="text-xs opacity-80 mt-1">For all measures</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">Emissions Reduction</p>
          <p className="text-2xl font-bold">{emissionsReduction.toFixed(1)}%</p>
          <p className="text-xs opacity-80 mt-1">From current levels</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">Simple Payback</p>
          <p className="text-2xl font-bold">{paybackYears.toFixed(1)} years</p>
          <p className="text-xs opacity-80 mt-1">From carbon credits</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <p className="text-sm opacity-90">Available Measures</p>
          <p className="text-2xl font-bold">{pathway.measures.length}</p>
          <p className="text-xs opacity-80 mt-1">Reduction options</p>
        </div>
      </div>
      
      {/* Main Financing Display */}
      <GreenFinancingDisplay pathway={pathway} />
    </div>
  );
};

export default FinancingDashboard;