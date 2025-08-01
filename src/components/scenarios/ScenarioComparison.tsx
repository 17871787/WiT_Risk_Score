import React, { useMemo } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useCalculations } from '../../hooks/useCalculations';
import { useFarmStore } from '../../context/FarmContext';

interface ComparisonRow {
  label: string;
  baseline: number;
  scenario: number;
  unit: string;
  format: (value: number) => string;
  inverse?: boolean; // true if lower is better (e.g., emissions)
}

export const ScenarioComparison: React.FC = () => {
  const calculations = useCalculations();
  const { parameters } = useFarmStore();
  
  // Store baseline values (you'd normally snapshot these when starting scenario mode)
  // For demo, we'll compare against hardcoded "typical" values
  const baselineValues = useMemo(() => ({
    grossEmissions: 1234, // Example baseline
    sequestration: 50,
    netEmissions: 1184,
    emissionsIntensity: 1.45,
    costPerLitre: 0.31,
    annualProfit: 125000,
    lme: 7500
  }), []);

  const rows: ComparisonRow[] = [
    {
      label: 'Gross Emissions',
      baseline: baselineValues.grossEmissions,
      scenario: calculations.totalFarmEmissions,
      unit: 't CO₂e/year',
      format: (v) => v.toFixed(0),
      inverse: true
    },
    {
      label: 'Sequestration',
      baseline: baselineValues.sequestration,
      scenario: calculations.sequestration.totalSequestration,
      unit: 't CO₂e/year',
      format: (v) => v.toFixed(0),
      inverse: false
    },
    {
      label: 'Net Emissions',
      baseline: baselineValues.netEmissions,
      scenario: calculations.netFarmEmissions,
      unit: 't CO₂e/year',
      format: (v) => v.toFixed(0),
      inverse: true
    },
    {
      label: 'Emissions Intensity',
      baseline: baselineValues.emissionsIntensity,
      scenario: calculations.emissionsIntensity,
      unit: 'kg CO₂e/L',
      format: (v) => v.toFixed(2),
      inverse: true
    },
    {
      label: 'Cost per Litre',
      baseline: baselineValues.costPerLitre,
      scenario: calculations.costPerLitre,
      unit: '£/L',
      format: (v) => v.toFixed(3),
      inverse: true
    },
    {
      label: 'Annual Profit',
      baseline: baselineValues.annualProfit,
      scenario: calculations.totalFarmProfit,
      unit: '£',
      format: (v) => `£${(v/1000).toFixed(0)}k`,
      inverse: false
    },
    {
      label: 'Lifetime Methane Efficiency',
      baseline: baselineValues.lme,
      scenario: calculations.lmeResult.lme,
      unit: 'L/t CO₂e',
      format: (v) => v.toFixed(0),
      inverse: false
    }
  ];

  const getChangeIcon = (delta: number, inverse: boolean) => {
    if (Math.abs(delta) < 0.01) return <Minus className="w-4 h-4 text-gray-400" />;
    const isImprovement = inverse ? delta < 0 : delta > 0;
    return isImprovement 
      ? <TrendingDown className="w-4 h-4 text-green-600" />
      : <TrendingUp className="w-4 h-4 text-red-600" />;
  };

  const getChangeColor = (delta: number, inverse: boolean) => {
    if (Math.abs(delta) < 0.01) return 'text-gray-600';
    const isImprovement = inverse ? delta < 0 : delta > 0;
    return isImprovement ? 'text-green-600' : 'text-red-600';
  };

  const formatPercentChange = (baseline: number, scenario: number) => {
    const change = ((scenario - baseline) / baseline) * 100;
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Scenario Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-sm font-medium text-gray-700">
                Metric
              </th>
              <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">
                Baseline
              </th>
              <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">
                Scenario
              </th>
              <th className="text-center px-4 py-2 text-sm font-medium text-gray-700">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const delta = row.scenario - row.baseline;
              const percentChange = formatPercentChange(row.baseline, row.scenario);
              
              return (
                <tr key={row.label} className="border-b hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <div>
                      <div className="font-medium text-gray-900">{row.label}</div>
                      <div className="text-xs text-gray-500">{row.unit}</div>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3 text-gray-700">
                    {row.format(row.baseline)}
                  </td>
                  <td className="text-right px-4 py-3 font-medium text-gray-900">
                    {row.format(row.scenario)}
                  </td>
                  <td className="text-center px-4 py-3">
                    <div className={`flex items-center justify-center space-x-1 ${getChangeColor(delta, row.inverse || false)}`}>
                      {getChangeIcon(delta, row.inverse || false)}
                      <span className="font-medium text-sm">
                        {percentChange}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Box */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <TrendingDown className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Overall Impact</h4>
            <p className="text-sm text-green-700 mt-1">
              Net emissions reduced by {Math.round(((baselineValues.netEmissions - calculations.netFarmEmissions) / baselineValues.netEmissions) * 100)}%
              {calculations.totalFarmProfit > baselineValues.annualProfit && 
                ` while increasing profit by £${((calculations.totalFarmProfit - baselineValues.annualProfit) / 1000).toFixed(0)}k`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};