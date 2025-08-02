import React from 'react';
import { useNue } from '../../hooks/useNue';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const NUEDisplay: React.FC = () => {
  const { nue, nInputs, nOutputs, interpretation, recommendations, nBalance } = useNue();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Nitrogen Use Efficiency (NUE)</h3>
      
      <div className="space-y-4">
        {/* Main NUE Metric */}
        <div className={`${interpretation.bgColor} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current NUE</p>
              <p className={`text-3xl font-bold ${interpretation.color}`}>
                {nue.toFixed(1)}%
              </p>
              <p className={`text-sm ${interpretation.color} mt-1`}>
                {interpretation.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{interpretation.description}</p>
            </div>
          </div>
        </div>
        
        {/* N Balance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded p-3">
            <div className="flex items-center gap-2">
              <ArrowDown className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-gray-600">N Inputs</p>
            </div>
            <p className="text-xl font-semibold text-blue-700">
              {nInputs.toFixed(1)} kg N/cow
            </p>
          </div>
          
          <div className="bg-green-50 rounded p-3">
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-green-600" />
              <p className="text-sm text-gray-600">N Outputs</p>
            </div>
            <p className="text-xl font-semibold text-green-700">
              {nOutputs.toFixed(1)} kg N/cow
            </p>
          </div>
        </div>
        
        {/* N Surplus */}
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-600">N Surplus (potential loss)</p>
          <p className="text-lg font-semibold text-gray-700">
            {nBalance.toFixed(1)} kg N/cow/year
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {(nBalance * 4.5).toFixed(0)} kg CO₂e equivalent
          </p>
        </div>
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Recommendations to improve NUE:
            </p>
            <ul className="space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};