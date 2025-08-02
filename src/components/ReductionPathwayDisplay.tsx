import React, { useMemo } from 'react';
import { useFarmStore } from '../context/FarmContext';
import { 
  calculateReductionPathway, 
  calculateImplementationTimeline,
  calculateFinancingNeeds 
} from '../lib/calculations/reductionPathway';
import { ReductionPathwayChart } from './charts/ReductionPathwayChart';

export const ReductionPathwayDisplay: React.FC = () => {
  const parameters = useFarmStore((state) => state.parameters);
  
  const pathway = useMemo(() => 
    calculateReductionPathway(parameters), 
    [parameters]
  );
  
  const timeline = useMemo(() => 
    calculateImplementationTimeline(pathway),
    [pathway]
  );
  
  const financing = useMemo(() => 
    calculateFinancingNeeds(pathway),
    [pathway]
  );

  const gapPercentage = ((pathway.gap / pathway.currentEmissions) * 100).toFixed(1);
  const reductionPercentage = ((pathway.totalPotentialReduction / pathway.currentEmissions) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${pathway.canReachTarget ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <h3 className={`font-semibold ${pathway.canReachTarget ? 'text-green-900' : 'text-yellow-900'}`}>
            Target Status
          </h3>
          <p className={`text-2xl font-bold ${pathway.canReachTarget ? 'text-green-900' : 'text-yellow-900'}`}>
            {pathway.canReachTarget ? 'Achievable' : 'Challenging'}
          </p>
          <p className={`text-sm ${pathway.canReachTarget ? 'text-green-700' : 'text-yellow-700'}`}>
            {pathway.canReachTarget 
              ? 'Theoretical minimum can be reached'
              : 'Additional measures needed'
            }
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Gap to TM</h3>
          <p className="text-2xl font-bold text-blue-900">{gapPercentage}%</p>
          <p className="text-sm text-blue-700">
            {pathway.gap.toFixed(0)} kg CO₂e/year
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900">Reduction Potential</h3>
          <p className="text-2xl font-bold text-purple-900">{reductionPercentage}%</p>
          <p className="text-sm text-purple-700">
            {pathway.measures.length} measures identified
          </p>
        </div>
      </div>

      {/* Reduction Pathway Chart */}
      <ReductionPathwayChart 
        measures={pathway.measures}
        currentEmissions={pathway.currentEmissions}
        targetEmissions={pathway.targetEmissions}
      />

      {/* Implementation Timeline */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Implementation Timeline</h3>
        <div className="space-y-2">
          {timeline.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">{item.year}</span>
                <span className="text-sm">{item.measure}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  -{((item.cumulativeReduction / pathway.currentEmissions) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600">cumulative</p>
              </div>
            </div>
          ))}
          {timeline.length > 5 && (
            <p className="text-sm text-gray-600 text-center pt-2">
              +{timeline.length - 5} more measures
            </p>
          )}
        </div>
      </div>

      {/* Financing Overview */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Investment Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Investment</p>
            <p className="text-lg font-semibold">${financing.totalInvestment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Annual Payment</p>
            <p className="text-lg font-semibold">${financing.annualPayment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payback Period</p>
            <p className="text-lg font-semibold">{financing.paybackPeriod.toFixed(1)} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">10-Year NPV</p>
            <p className={`text-lg font-semibold ${financing.netPresentValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${financing.netPresentValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Measures */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Reduction Measures (Ranked by ROI)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Measure</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Reduction</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cost/Year</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">ROI</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Difficulty</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pathway.measures.map((measure) => {
                const roi = (measure.potentialReduction * 0.02) / (measure.cost / parameters.herdSize) * 100;
                return (
                  <tr key={measure.id}>
                    <td className="px-4 py-2 text-sm">{measure.name}</td>
                    <td className="px-4 py-2 text-sm">{measure.category}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      {measure.potentialReduction.toFixed(0)} kg CO₂e
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      ${measure.cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">
                      {roi.toFixed(0)}%
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        measure.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        measure.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {measure.difficulty}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};