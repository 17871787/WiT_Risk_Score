import React from 'react';
import { TrendingUp, TrendingDown, Target, Leaf } from 'lucide-react';
import { useCalculations } from '../../hooks/useCalculations';
import { MetricCard } from '../ui/MetricCard';
import { PERFORMANCE_THRESHOLDS } from '../../constants/emissions';

export const PerformanceMetrics: React.FC = () => {
  const { performanceMetrics, emissions } = useCalculations();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Emissions"
          value={performanceMetrics.emissions.toFixed(2)}
          unit="kg CO₂e/L"
          icon={performanceMetrics.emissions > PERFORMANCE_THRESHOLDS.EMISSIONS_TARGET ? TrendingUp : TrendingDown}
          iconColor={performanceMetrics.emissions > PERFORMANCE_THRESHOLDS.EMISSIONS_TARGET ? "text-red-500" : "text-green-500"}
          valueColor={performanceMetrics.emissions > PERFORMANCE_THRESHOLDS.EMISSIONS_TARGET ? "text-red-600" : "text-green-600"}
          bgColor="bg-gray-50"
        />

        <MetricCard
          title="Feed Efficiency"
          value={performanceMetrics.feedEfficiency.toFixed(2)}
          unit="L/kg"
          icon={Target}
          iconColor={performanceMetrics.feedEfficiency >= PERFORMANCE_THRESHOLDS.FEED_EFFICIENCY_TARGET ? "text-green-500" : "text-blue-500"}
          valueColor={performanceMetrics.feedEfficiency >= PERFORMANCE_THRESHOLDS.FEED_EFFICIENCY_TARGET ? "text-green-600" : "text-blue-600"}
          bgColor="bg-gray-50"
        />

        <MetricCard
          title="Protein Efficiency"
          value={performanceMetrics.proteinEfficiency.toFixed(1)}
          unit="%"
          icon={Leaf}
          iconColor={performanceMetrics.proteinEfficiency >= PERFORMANCE_THRESHOLDS.PROTEIN_EFFICIENCY_TARGET ? "text-green-500" : "text-yellow-500"}
          valueColor={performanceMetrics.proteinEfficiency >= PERFORMANCE_THRESHOLDS.PROTEIN_EFFICIENCY_TARGET ? "text-green-600" : "text-yellow-600"}
          bgColor="bg-gray-50"
        />

        <MetricCard
          title="N Efficiency"
          value={performanceMetrics.nitrogenEfficiency.toFixed(1)}
          unit="%"
          icon={Leaf}
          iconColor={performanceMetrics.nitrogenEfficiency >= PERFORMANCE_THRESHOLDS.NITROGEN_EFFICIENCY_TARGET ? "text-green-500" : "text-yellow-500"}
          valueColor={performanceMetrics.nitrogenEfficiency >= PERFORMANCE_THRESHOLDS.NITROGEN_EFFICIENCY_TARGET ? "text-green-600" : "text-yellow-600"}
          bgColor="bg-gray-50"
        />
      </div>
    </div>
  );
};