import React from 'react';
import { Target } from 'lucide-react';
import { FarmSummary } from './FarmSummary';
import { OverflowTabRow, TabDef } from './OverflowTabRow';
import { useCalculations } from '../hooks/useCalculations';
import { useView } from '../context/ViewContext';
import { PERFORMANCE_THRESHOLDS } from '../constants/emissions';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useView();
  const calculations = useCalculations();
  
  const getTabWarning = (tabId: string): boolean => {
    switch (tabId) {
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
      case 'scenarios':
        return false; // No warnings for scenarios tab
      default:
        return false;
    }
  };
  
  const tabs: TabDef[] = [
    { id: 'basic', label: 'Basic', alert: getTabWarning('basic') },
    { id: 'farm', label: 'Farm', alert: getTabWarning('farm') },
    { id: 'heifer', label: 'Heifer', alert: getTabWarning('heifer') },
    { id: 'sequestration', label: 'Sequestration', emoji: '💰', alert: getTabWarning('sequestration') },
    { id: 'effectiveness', label: 'Effectiveness', alert: getTabWarning('effectiveness') },
    { id: 'scenarios', label: 'Scenarios', emoji: '🚀' },
  ];
  
  return (
    <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="mr-2" size={20} />
          Parameters
        </h2>
        
        {/* Tabs with overflow menu */}
        <OverflowTabRow
          tabs={tabs}
          active={activeTab}
          onSelect={(id) => setActiveTab(id as any)}
        />
        
        {/* Tab content now rendered in dashboards */}
      </div>

      {/* Farm Summary */}
      <FarmSummary />
    </div>
  );
};