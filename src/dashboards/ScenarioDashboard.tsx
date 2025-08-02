import React from 'react';
import { DashboardProps } from '../hooks/useDashboardState';
import { ScenarioBuilder } from '../components/scenarios/ScenarioBuilder';
import { ScenarioComparison } from '../components/scenarios/ScenarioComparison';

const ScenarioDashboard: React.FC<DashboardProps> = ({ state, actions }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Scenario Planning & What-If Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Toggles */}
        <div>
          <ScenarioBuilder />
        </div>
        
        {/* Comparison View */}
        <div>
          <ScenarioComparison />
        </div>
      </div>
    </div>
  );
};

export default ScenarioDashboard;