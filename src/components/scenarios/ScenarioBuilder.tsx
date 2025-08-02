import React from 'react';
import { Plus, Minus, Zap, Leaf, Calendar, Package } from 'lucide-react';
import { useFarmStore } from '../../context/FarmContext';
import { useCalculations } from '../../hooks/useCalculations';

interface Practice {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  apply: () => void;
  revert: () => void;
  isApplied: () => boolean;
  impact: string;
}

export const ScenarioBuilder: React.FC = () => {
  const store = useFarmStore();
  const { parameters, updateParameter } = store;
  const calculations = useCalculations();
  
  // Calculate current emissions for impact display
  const baselineEmissions = calculations.totalFarmEmissions;
  
  const practices: Practice[] = [
    {
      id: 'extend-grazing',
      name: 'Extend Grazing Period',
      description: 'Add 1 month to grazing season',
      icon: <Calendar className="w-5 h-5" />,
      apply: () => updateParameter('grazingMonths', Math.min(12, parameters.grazingMonths + 1)),
      revert: () => updateParameter('grazingMonths', Math.max(0, parameters.grazingMonths - 1)),
      isApplied: () => parameters.grazingMonths > 7, // Default is 7
      impact: '-3% emissions'
    },
    {
      id: 'solar-panels',
      name: 'Install Solar Panels',
      description: 'Add 50 kW renewable capacity',
      icon: <Zap className="w-5 h-5" />,
      apply: () => updateParameter('renewableEnergyKw', parameters.renewableEnergyKw + 50),
      revert: () => updateParameter('renewableEnergyKw', Math.max(0, parameters.renewableEnergyKw - 50)),
      isApplied: () => parameters.renewableEnergyKw > 0,
      impact: '-20 t CO₂e/year'
    },
    {
      id: 'methane-inhibitor',
      name: 'Methane Inhibitor Feed',
      description: 'Add feed additives to reduce enteric emissions',
      icon: <Package className="w-5 h-5" />,
      apply: () => updateParameter('methaneInhibitor', true),
      revert: () => updateParameter('methaneInhibitor', false),
      isApplied: () => parameters.methaneInhibitor,
      impact: '-15% enteric'
    },
    {
      id: 'improved-manure',
      name: 'Upgrade Manure System',
      description: 'Implement covered storage and treatment',
      icon: <Leaf className="w-5 h-5" />,
      apply: () => updateParameter('improvedManure', true),
      revert: () => updateParameter('improvedManure', false),
      isApplied: () => parameters.improvedManure,
      impact: '-30% manure'
    },
    {
      id: 'tree-planting',
      name: 'Plant Trees',
      description: 'Add 5 hectares of woodland',
      icon: <Leaf className="w-5 h-5" />,
      apply: () => updateParameter('treePlantingHa', parameters.treePlantingHa + 5),
      revert: () => updateParameter('treePlantingHa', Math.max(0, parameters.treePlantingHa - 5)),
      isApplied: () => parameters.treePlantingHa > 0,
      impact: '+60 t CO₂e/year seq'
    },
    {
      id: 'reduce-nitrogen',
      name: 'Optimize Nitrogen Use',
      description: 'Reduce application by 20 kg/ha',
      icon: <Minus className="w-5 h-5" />,
      apply: () => updateParameter('nitrogenRate', Math.max(100, parameters.nitrogenRate - 20)),
      revert: () => updateParameter('nitrogenRate', parameters.nitrogenRate + 20),
      isApplied: () => parameters.nitrogenRate < 180, // Default is 180
      impact: '-5% N₂O'
    },
    {
      id: 'improve-feed-quality',
      name: 'Improve Feed Quality',
      description: 'Upgrade feed quality by 2 points',
      icon: <Package className="w-5 h-5" />,
      apply: () => updateParameter('feedQuality', Math.min(10, parameters.feedQuality + 2)),
      revert: () => updateParameter('feedQuality', Math.max(1, parameters.feedQuality - 2)),
      isApplied: () => parameters.feedQuality > 7, // Default is 7
      impact: '+15% NUE'
    },
    {
      id: 'reduce-concentrate',
      name: 'Optimize Concentrate Feed',
      description: 'Reduce concentrate by 1 kg/day',
      icon: <Minus className="w-5 h-5" />,
      apply: () => updateParameter('concentrateFeed', Math.max(0, parameters.concentrateFeed - 1)),
      revert: () => updateParameter('concentrateFeed', parameters.concentrateFeed + 1),
      isApplied: () => parameters.concentrateFeed < 8, // Default is ~8
      impact: '+10% feed efficiency'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Quick Scenario Builder
        </h3>
        <p className="text-sm text-blue-700">
          Toggle practices below to see their impact on your emissions and costs. 
          Each change updates calculations in real-time.
        </p>
      </div>

      <div className="space-y-3">
        {practices.map((practice) => (
          <div
            key={practice.id}
            className={`
              border rounded-lg p-4 transition-all cursor-pointer
              ${practice.isApplied() 
                ? 'bg-green-50 border-green-300' 
                : 'bg-white border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => practice.isApplied() ? practice.revert() : practice.apply()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-lg
                  ${practice.isApplied() ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-600'}
                `}>
                  {practice.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {practice.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {practice.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-xs font-medium text-green-600">
                      {practice.impact}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className={`
                  px-3 py-1 rounded-md text-sm font-medium transition-colors
                  ${practice.isApplied() 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  practice.isApplied() ? practice.revert() : practice.apply();
                }}
              >
                {practice.isApplied() ? 'Active' : 'Apply'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary of Active Practices */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Active Practices Summary
        </h4>
        <div className="space-y-1">
          {practices.filter(p => p.isApplied()).map(practice => (
            <div key={practice.id} className="flex items-center text-sm text-gray-600">
              <Plus className="w-4 h-4 text-green-600 mr-2" />
              {practice.name}
            </div>
          ))}
          {practices.filter(p => p.isApplied()).length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No practices applied yet. Click on any practice above to see its impact.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};