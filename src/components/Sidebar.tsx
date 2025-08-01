import React, { useState } from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { BasicParameters } from './parameters/BasicParameters';
import { FarmParameters } from './parameters/FarmParameters';
import { HeiferParameters } from './parameters/HeiferParameters';
import { SequestrationParameters } from './parameters/SequestrationParameters';
import { EffectivenessDisplay } from './EffectivenessDisplay';
import { FarmSummary } from './FarmSummary';
import { useCalculations } from '../hooks/useCalculations';
import { PERFORMANCE_THRESHOLDS } from '../constants/emissions';

type TabType = 'basic' | 'farm' | 'heifer' | 'sequestration' | 'effectiveness';

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const calculations = useCalculations();
  
  const getTabWarning = (tab: TabType): boolean => {
    switch (tab) {
      case 'basic':
        return calculations.parameters.feedCarbonFootprint > PERFORMANCE_THRESHOLDS.FEED_CARBON_FOOTPRINT_LIMIT ||
               (calculations.parameters.soyaContent > PERFORMANCE_THRESHOLDS.SOYA_CONTENT_WARNING && 
                !calculations.parameters.deforestationFree);
      case 'farm':
        return calculations.parameters.calvingInterval > PERFORMANCE_THRESHOLDS.CALVING_INTERVAL_TARGET ||
               calculations.parameters.milkYield < 8000;
      case 'heifer':
        return calculations.parameters.ageFirstCalving > PERFORMANCE_THRESHOLDS.AGE_FIRST_CALVING_TARGET ||
               calculations.parameters.grazingMonths < 6;
      case 'sequestration':
        return calculations.sequestration.totalSequestration < calculations.totalFarmEmissions * 0.1;
      case 'effectiveness':
        return calculations.performanceMetrics.overallHerdEffectiveness < PERFORMANCE_THRESHOLDS.OVERALL_HERD_EFFECTIVENESS_TARGET;
      default:
        return false;
    }
  };
  
  return (
    <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="mr-2" size={20} />
          Parameters
        </h2>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-4 border-b">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'basic' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Basic
            {getTabWarning('basic') && <span className="ml-1 text-red-500">●</span>}
          </button>
          <button
            onClick={() => setActiveTab('farm')}
            className={`px-3 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'farm' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Farm
            {getTabWarning('farm') && <span className="ml-1 text-orange-500">●</span>}
          </button>
          <button
            onClick={() => setActiveTab('heifer')}
            className={`px-3 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'heifer' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Heifer
            {getTabWarning('heifer') && <span className="ml-1 text-orange-500">●</span>}
          </button>
          <button
            onClick={() => setActiveTab('sequestration')}
            className={`px-3 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'sequestration' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sequestration
            <span className="text-xs ml-1">💰</span>
            {getTabWarning('sequestration') && <span className="ml-1 text-orange-500">●</span>}
          </button>
          <button
            onClick={() => setActiveTab('effectiveness')}
            className={`px-3 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'effectiveness' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Effectiveness
            {getTabWarning('effectiveness') && <span className="ml-1 text-orange-500">●</span>}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'basic' && <BasicParameters />}
          {activeTab === 'farm' && <FarmParameters />}
          {activeTab === 'heifer' && <HeiferParameters />}
          {activeTab === 'sequestration' && <SequestrationParameters />}
          {activeTab === 'effectiveness' && <EffectivenessDisplay />}
        </div>
      </div>

      {/* Farm Summary */}
      <FarmSummary />
    </div>
  );
};