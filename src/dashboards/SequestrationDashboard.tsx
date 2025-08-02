import React from 'react';
import { DashboardProps } from '../hooks/useDashboardState';
import { SequestrationParameters } from '../components/parameters/SequestrationParameters';
import { NetCarbonProjectionV2 } from '../components/charts/NetCarbonProjectionV2';
import { ReductionPathwayDisplay } from '../components/ReductionPathwayDisplay';

const SequestrationDashboard: React.FC<DashboardProps> = ({ state, actions }) => {
  const creditValue = state.sequestration.totalSequestration * 25; // £25 per tonne CO₂e
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Carbon Sequestration & Credits</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sequestration Parameters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Sequestration Options</h3>
          <SequestrationParameters />
        </div>
        
        {/* Sequestration Metrics & Projection */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Annual Sequestration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Sequestration</p>
                <p className="text-2xl font-bold text-green-600">{state.sequestration.totalSequestration.toFixed(1)} t CO₂e</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Potential Credit Value</p>
                <p className="text-2xl font-bold text-green-600">£{creditValue.toFixed(0)}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Hedgerows</span>
                <span>{state.sequestration.hedgerowSequestration.toFixed(1)} t</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trees</span>
                <span>{state.sequestration.treeSequestration.toFixed(1)} t</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Soil</span>
                <span>{state.sequestration.soilCarbonSequestration.toFixed(1)} t</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 10-Year Projection */}
      <div className="mt-6">
        <NetCarbonProjectionV2 />
      </div>
      
      {/* Reduction Pathway Analysis */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Reduction Pathway to Theoretical Minimum</h3>
        <ReductionPathwayDisplay />
      </div>
    </div>
  );
};

export default SequestrationDashboard;