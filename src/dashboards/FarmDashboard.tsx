import React from 'react';
import { DashboardProps } from '../hooks/useDashboardState';
import { FarmParameters } from '../components/parameters/FarmParameters';

const FarmDashboard: React.FC<DashboardProps> = ({ state, actions }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Farm Production & Metrics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farm Parameters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Farm Parameters</h3>
          <FarmParameters />
        </div>
        
        {/* Production Metrics */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Production Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Annual Production</p>
                <p className="text-2xl font-bold">{(state.parameters.milkYield * state.parameters.herdSize / 1000).toFixed(0)}k L</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cost per Litre</p>
                <p className="text-2xl font-bold">£{state.costPerLitre.toFixed(3)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Herd Efficiency</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Feed Efficiency</span>
                <span className="font-bold">{state.performanceMetrics.feedEfficiency.toFixed(2)} L/kg DM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calving Interval Target</span>
                <span className={state.parameters.calvingInterval <= 13 ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
                  {state.parameters.calvingInterval} months
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDashboard;