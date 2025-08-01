import React from 'react';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { useCalculations } from '../../hooks/useCalculations';
import { useFarmStore } from '../../context/FarmContext';
import { calculateLME } from '../../lib/calculations/lme';
import { LME_THRESHOLDS } from '../../constants/emissions';

export const LMEDisplay: React.FC = () => {
  const { lmeResult, parameters } = useCalculations();
  const { updateParameter } = useFarmStore();
  const { lme, lifetimeProduction, lifetimeEmissions, interpretation } = lmeResult;
  
  // Calculate potential improvements
  const calculateImprovement = (changes: Partial<typeof parameters>) => {
    const newParams = { ...parameters, ...changes };
    const newResult = calculateLME({
      annualMilkYield: newParams.milkYield,
      averageLactations: newParams.avgLactations,
      ageAtFirstCalving: newParams.ageFirstCalving,
      calvingInterval: newParams.calvingInterval,
      feedQuality: newParams.feedQuality,
      systemType: newParams.systemType,
      concentrateFeed: newParams.concentrateFeed,
      manureSystem: newParams.manureSystem,
      grazingMonths: newParams.grazingMonths,
      feedCarbonFootprint: newParams.feedCarbonFootprint,
      soyaContent: newParams.soyaContent,
      deforestationFree: newParams.deforestationFree,
      nitrogenRate: newParams.nitrogenRate,
      season: newParams.season
    });
    return newResult.lme - lme;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Target className="mr-2 text-yellow-600" size={20} />
        Lifetime Methane Efficiency (LME)
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LME Score Display */}
        <div className={`${interpretation.bgColor} rounded-lg p-6 text-center`}>
          <div className="text-sm font-medium text-gray-600 mb-2">
            Liters of milk per kg CO₂-eq of Methane
          </div>
          <div className={`text-6xl font-bold ${interpretation.color} mb-4`}>
            {lme.toFixed(2)}
          </div>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${interpretation.bgColor} ${interpretation.color} border-2 border-current`}>
            {interpretation.text}
          </div>
          <div className="text-xs text-gray-600 mt-4">
            Higher values indicate better methane efficiency
          </div>
        </div>
        
        {/* LME Components */}
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-blue-800 font-semibold">Lifetime Milk Production</div>
                <div className="text-xs text-blue-600">Total milk produced per cow</div>
              </div>
              <div className="text-2xl font-bold text-blue-700">{lifetimeProduction.toLocaleString()} L</div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              {parameters.avgLactations.toFixed(1)} lactations × {parameters.milkYield.toLocaleString()} L/year × 0.9 persistence
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-red-800 font-semibold">Lifetime Methane Emissions</div>
                <div className="text-xs text-red-600">Total enteric methane per cow</div>
              </div>
              <div className="text-2xl font-bold text-red-700">{lifetimeEmissions.toLocaleString()} kg CO₂-eq</div>
            </div>
            <div className="mt-2 text-xs text-red-600">
              Productive + non-productive period emissions
            </div>
          </div>
        </div>
      </div>
      
      {/* LME Equation */}
      <div className="bg-yellow-50 p-4 rounded-lg mt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          LME Equation
        </h4>
        <div className="text-center">
          <div className="inline-block bg-white px-4 py-2 rounded border border-yellow-300">
            <span className="text-sm font-mono">
              LME = Lifetime Milk Production (L) / Lifetime Methane Emissions (kg CO₂-eq)
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-3 text-center">
          A focused metric on biological methane efficiency of the herd
        </div>
      </div>
      
      {/* Benchmark Comparison */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Industry Benchmarks
        </h4>
        <div className="relative h-20 bg-gradient-to-r from-red-100 via-yellow-100 via-blue-100 to-green-100 rounded-lg">
          <div className="absolute inset-0 flex items-center px-4">
            {[
              { value: LME_THRESHOLDS.BELOW_AVERAGE, label: 'Poor', position: 10 },
              { value: LME_THRESHOLDS.AVERAGE, label: 'Average', position: 30 },
              { value: LME_THRESHOLDS.GOOD, label: 'Good', position: 50 },
              { value: LME_THRESHOLDS.EXCELLENT, label: 'Excellent', position: 70 },
            ].map((benchmark, index) => (
              <div
                key={index}
                className="absolute flex flex-col items-center"
                style={{ left: `${benchmark.position}%` }}
              >
                <div className="w-0.5 h-12 bg-gray-400"></div>
                <div className="text-xs font-medium text-gray-700 mt-1">
                  {benchmark.value}
                </div>
                <div className="text-xs text-gray-500">
                  {benchmark.label}
                </div>
              </div>
            ))}
            
            {/* Current position marker */}
            <div
              className="absolute flex flex-col items-center"
              style={{ 
                left: `${Math.min(90, Math.max(10, (lme / 15) * 80))}%` 
              }}
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-white text-xs font-bold">
                  {lme.toFixed(1)}
                </div>
              </div>
              <div className="text-xs font-medium text-gray-700 mt-1">
                Your Farm
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Impact Calculator */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Potential Impact Calculator
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded">
            <div className="font-medium text-gray-700 mb-1">
              If +1000 L/year yield:
            </div>
            <div className="text-green-600 font-semibold">
              LME: {(lme + calculateImprovement({ milkYield: parameters.milkYield + 1000 })).toFixed(2)}
            </div>
            <div className="text-gray-500 mt-1">
              +{calculateImprovement({ milkYield: parameters.milkYield + 1000 }).toFixed(2)} improvement
            </div>
          </div>
          
          <div className="bg-white p-3 rounded">
            <div className="font-medium text-gray-700 mb-1">
              If +1 lactation:
            </div>
            <div className="text-green-600 font-semibold">
              LME: {(lme + calculateImprovement({ avgLactations: parameters.avgLactations + 1 })).toFixed(2)}
            </div>
            <div className="text-gray-500 mt-1">
              +{calculateImprovement({ avgLactations: parameters.avgLactations + 1 }).toFixed(2)} improvement
            </div>
          </div>
          
          <div className="bg-white p-3 rounded">
            <div className="font-medium text-gray-700 mb-1">
              If feed quality 9/10:
            </div>
            <div className="text-green-600 font-semibold">
              LME: {(lme + calculateImprovement({ feedQuality: 9 })).toFixed(2)}
            </div>
            <div className="text-gray-500 mt-1">
              +{calculateImprovement({ feedQuality: 9 }).toFixed(2)} improvement
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};