import React from 'react';
import { Target } from 'lucide-react';
import { useCalculations } from '../../hooks/useCalculations';
import { MetricCard } from '../ui/MetricCard';

export const FarmImpact: React.FC = () => {
  const {
    parameters,
    totalFarmEmissions,
    netFarmEmissions,
    totalFarmProduction,
    totalFarmProfit,
    sequestration,
    emissionsIntensity
  } = useCalculations();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Target className="mr-2" size={18} />
        Total Farm Impact ({parameters.herdSize} cows)
      </h2>
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