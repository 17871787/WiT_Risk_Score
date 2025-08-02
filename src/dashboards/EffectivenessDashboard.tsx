import React from 'react';
import { DashboardProps } from '../hooks/useDashboardState';
import { EffectivenessDisplay } from '../components/EffectivenessDisplay';
import { NUEDisplay } from '../components/charts/NUEDisplay';
import { LMEPlusDisplay } from '../components/charts/LMEPlusDisplay';

const EffectivenessDashboard: React.FC<DashboardProps> = ({ state, actions }) => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Sustainability Effectiveness Metrics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LME Score Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">LME Score</h3>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600">
                {state.lmeResult.lme.toFixed(0)}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Target: ≥350 for sustainable dairy
              </p>
            </div>
          </div>
          
          {/* Benchmark Comparisons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Industry Benchmark</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Your LME</span>
                <span className="font-bold">{state.lmeResult.lme.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Industry Average</span>
                <span className="font-medium">320</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Top 10%</span>
                <span className="font-medium text-green-600">380+</span>
              </div>
            </div>
          </div>
          
          {/* NUE Display */}
          <NUEDisplay />
          
          {/* LME+NUE Combined Metric */}
          <LMEPlusDisplay />
          
          {/* Effectiveness Parameters Display */}
          <div className="col-span-1 lg:col-span-2">
            <EffectivenessDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffectivenessDashboard;