import React from 'react';
import { DashboardProps } from '../hooks/useDashboardState';
import { HeiferParameters } from '../components/parameters/HeiferParameters';

const HeiferDashboard: React.FC<DashboardProps> = ({ state, actions }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Heifer Management & Development</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heifer Parameters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Heifer Parameters</h3>
          <HeiferParameters />
        </div>
        
        {/* Heifer Metrics */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Development Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Age at First Calving</span>
                <span className={state.parameters.ageFirstCalving <= 24 ? 'text-green-600 font-bold' : state.parameters.ageFirstCalving <= 26 ? 'text-yellow-600 font-bold' : 'text-red-600 font-bold'}>
                  {state.parameters.ageFirstCalving} months
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Replacement Rate</span>
                <span className="font-bold">{(100 / state.parameters.avgLactations).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Grazing Period</span>
                <span className="font-bold">{state.parameters.grazingMonths} months</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Growth Performance</h3>
            <p className="text-sm text-gray-600 mb-2">Target: First calving at 24 months</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={state.parameters.ageFirstCalving <= 24 ? 'bg-green-500' : state.parameters.ageFirstCalving <= 26 ? 'bg-yellow-500' : 'bg-red-500'}
                style={{ width: `${Math.min(100, (24 / state.parameters.ageFirstCalving) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeiferDashboard;