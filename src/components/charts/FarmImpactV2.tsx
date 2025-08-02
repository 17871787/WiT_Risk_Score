import React from 'react';
import { Target, Info } from 'lucide-react';
import { useCalculations } from '../../hooks/useCalculations';
import { theoreticalMinimum, percentageAboveTM, getTMInterpretation } from '../../lib/calculations/carbonFloor';
import { MetricCard } from '../ui/MetricCard';

export const FarmImpactV2: React.FC = () => {
  const {
    parameters,
    totalFarmEmissions,
    netFarmEmissions,
    totalFarmProduction,
    totalFarmProfit,
    sequestration,
    emissionsIntensity
  } = useCalculations();
  
  // Calculate TM metrics
  const tm = theoreticalMinimum(parameters.herdSize) / 1000; // Convert to tonnes
  const percentAbove = percentageAboveTM(totalFarmEmissions, parameters.herdSize);
  const tmInterpretation = getTMInterpretation(percentAbove);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Target className="mr-2" size={18} />
        Total Farm Impact ({parameters.herdSize} cows)
      </h2>
      
      {/* TM Status Banner */}
      <div className={`${tmInterpretation.color.replace('text-', 'bg-').replace('700', '50')} rounded-lg p-3 mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={16} className={tmInterpretation.color} />
            <span className={`text-sm font-medium ${tmInterpretation.color}`}>
              {percentAbove.toFixed(0)}% above Theoretical Minimum
            </span>
          </div>
          <span className={`text-xs ${tmInterpretation.color}`}>
            {tmInterpretation.category}
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-600">
          Biological floor: {tm.toFixed(0)}t CO₂e/year • Gap: {(totalFarmEmissions - tm).toFixed(0)}t
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Gross Emissions"
          value={totalFarmEmissions.toFixed(0)}
          unit="t CO₂e/year"
          subtitle={`${(totalFarmEmissions / parameters.herdSize).toFixed(1)} t/cow`}
          bgColor="bg-red-50"
          valueColor="text-red-600"
        />

        <MetricCard
          title="Net Emissions"
          value={netFarmEmissions.toFixed(0)}
          unit="t CO₂e/year"
          subtitle={`${sequestration.totalSequestration.toFixed(0)} t sequestered`}
          bgColor="bg-green-50"
          valueColor={netFarmEmissions > 0 ? "text-orange-600" : "text-green-600"}
        />

        <MetricCard
          title="Total Production"
          value={totalFarmProduction.toFixed(0)}
          unit="k L/year"
          subtitle={`${parameters.milkYield.toLocaleString()} L/cow`}
          bgColor="bg-blue-50"
          valueColor="text-blue-600"
        />

        <MetricCard
          title="Est. Annual Profit"
          value={`£${(totalFarmProfit / 1000).toFixed(0)}k`}
          subtitle={`£${(totalFarmProfit / parameters.herdSize).toFixed(0)}/cow`}
          bgColor="bg-yellow-50"
          valueColor={totalFarmProfit > 0 ? "text-green-600" : "text-red-600"}
        />
      </div>
      
      <div className="mt-4 pt-4 border-t text-sm text-gray-600 flex justify-between">
        <span>Carbon intensity: <strong>{emissionsIntensity.toFixed(2)} kg CO₂e/L</strong></span>
        <span>Net intensity: <strong>{(netFarmEmissions / totalFarmProduction).toFixed(3)} kg CO₂e/L</strong></span>
      </div>
    </div>
  );
};