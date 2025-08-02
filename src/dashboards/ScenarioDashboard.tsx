import React, { useState, useMemo } from 'react';
import { DashboardProps } from '../hooks/useDashboardState';
import { ScenarioBuilder } from '../components/scenarios/ScenarioBuilder';
import { ScenarioComparison } from '../components/scenarios/ScenarioComparison';
import { ScenarioFinancing } from '../components/scenarios/ScenarioFinancing';
import { useFarmStore } from '../context/FarmContext';
import { FarmParameters } from '../types';

const ScenarioDashboard: React.FC<DashboardProps> = ({ state, actions }) => {
  const parameters = useFarmStore((state) => state.parameters);
  const [baselineParams] = useState<FarmParameters>({ ...parameters });
  
  // Determine if any scenario is active
  const hasActiveScenario = useMemo(() => {
    return parameters.methaneInhibitor !== baselineParams.methaneInhibitor ||
           parameters.improvedManure !== baselineParams.improvedManure ||
           parameters.renewableEnergyKw !== baselineParams.renewableEnergyKw ||
           parameters.treePlantingHa !== baselineParams.treePlantingHa ||
           parameters.grazingMonths !== baselineParams.grazingMonths ||
           parameters.nitrogenRate !== baselineParams.nitrogenRate;
  }, [parameters, baselineParams]);
  
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
      
      {/* Financing Analysis */}
      {hasActiveScenario && (
        <div className="mt-6">
          <ScenarioFinancing 
            baselineParams={baselineParams}
            scenarioParams={parameters}
            scenarioName="Current Scenario"
          />
        </div>
      )}
    </div>
  );
};

export default ScenarioDashboard;