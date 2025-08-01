import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useCalculations } from '../hooks/useCalculations';
import { useFarmStore } from '../context/FarmContext';
import { PERFORMANCE_THRESHOLDS } from '../constants/emissions';

export const EffectivenessDisplay: React.FC = () => {
  const { parameters, updateParameter } = useFarmStore();
  const { performanceMetrics } = useCalculations();
  
  const getStatusColor = (value: number, threshold: number, reverse: boolean = false) => {
    if (reverse) {
      return value <= threshold ? 'text-green-600' : value <= threshold * 1.2 ? 'text-yellow-600' : 'text-red-600';
    }
    return value >= threshold ? 'text-green-600' : value >= threshold * 0.8 ? 'text-yellow-600' : 'text-red-600';
  };
  
  const getBarColor = (value: number, threshold: number, reverse: boolean = false) => {
    if (reverse) {
      return value <= threshold ? 'bg-green-500' : value <= threshold * 1.2 ? 'bg-yellow-500' : 'bg-red-500';
    }
    return value >= threshold ? 'bg-green-500' : value >= threshold * 0.8 ? 'bg-yellow-500' : 'bg-red-500';
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-3">
          Overall Herd Effectiveness Score
        </h3>
        <div className="text-center mb-4">
          <div className={`text-4xl font-bold ${getStatusColor(
            performanceMetrics.overallHerdEffectiveness,
            PERFORMANCE_THRESHOLDS.OVERALL_HERD_EFFECTIVENESS_TARGET
          )}`}>
            {performanceMetrics.overallHerdEffectiveness.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Target: ≥{PERFORMANCE_THRESHOLDS.OVERALL_HERD_EFFECTIVENESS_TARGET}%
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Component 1: Calving < 25 months */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Heifers Calving &lt;25 months
              </span>
              <span className={`text-xs font-bold ${getStatusColor(
                performanceMetrics.calvingUnder25Pct,
                90
              )}`}>
                {performanceMetrics.calvingUnder25Pct.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getBarColor(
                  performanceMetrics.calvingUnder25Pct,
                  90
                )}`}
                style={{ width: `${performanceMetrics.calvingUnder25Pct}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Current: {parameters.ageFirstCalving.toFixed(1)} months
            </div>
          </div>

          {/* Component 2: Hit Calving Interval */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Achieving 380-day CI Target
              </span>
              <span className={`text-xs font-bold ${getStatusColor(
                performanceMetrics.hitCalvingIntervalPct,
                90
              )}`}>
                {performanceMetrics.hitCalvingIntervalPct.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getBarColor(
                  performanceMetrics.hitCalvingIntervalPct,
                  90
                )}`}
                style={{ width: `${performanceMetrics.hitCalvingIntervalPct}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Current: {parameters.calvingInterval} days
            </div>
          </div>

          {/* Component 3: Retention Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">
                Herd Retention Rate
              </span>
              <span className={`text-xs font-bold ${getStatusColor(
                performanceMetrics.retentionRate,
                PERFORMANCE_THRESHOLDS.RETENTION_RATE_TARGET
              )}`}>
                {performanceMetrics.retentionRate.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getBarColor(
                  performanceMetrics.retentionRate,
                  PERFORMANCE_THRESHOLDS.RETENTION_RATE_TARGET
                )}`}
                style={{ width: `${performanceMetrics.retentionRate}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Replacement: {performanceMetrics.replacementRate.toFixed(1)}% | 
              Avg lactations: {parameters.avgLactations.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-blue-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Calculation:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              {performanceMetrics.calvingUnder25Pct.toFixed(0)}% × 
              {performanceMetrics.hitCalvingIntervalPct.toFixed(0)}% × 
              {performanceMetrics.retentionRate.toFixed(0)}% = 
              <strong> {performanceMetrics.overallHerdEffectiveness.toFixed(1)}%</strong>
            </div>
            <div className="text-xs text-gray-500 italic">
              (% &lt;25mo) × (% hit CI) × (retention rate)
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Tips */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Improvement Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          {parameters.ageFirstCalving > 25 && (
            <li>• Reduce age at first calving to under 25 months through better heifer management</li>
          )}
          {parameters.calvingInterval > 380 && (
            <li>• Improve heat detection and breeding programs to achieve 380-day calving interval</li>
          )}
          {performanceMetrics.retentionRate < 75 && (
            <li>• Increase cow longevity through better health management and culling decisions</li>
          )}
          {performanceMetrics.overallHerdEffectiveness >= 70 && (
            <li>• Excellent performance! Maintain current management practices</li>
          )}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            updateParameter('ageFirstCalving', 24);
          }}
          className="text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 transition-colors"
        >
          Optimize Heifer Age
        </button>
        <button
          onClick={() => {
            updateParameter('calvingInterval', 380);
          }}
          className="text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 transition-colors"
        >
          Optimize Calving Interval
        </button>
      </div>
    </div>
  );
};