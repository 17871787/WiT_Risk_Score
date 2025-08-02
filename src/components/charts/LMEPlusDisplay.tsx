import React, { useMemo } from 'react';
import { useFarmStore } from '../../context/FarmContext';
import { calculateLMEPlus } from '../../lib/calculations/lmePlus';
import { TrendingUp, Leaf } from 'lucide-react';

export const LMEPlusDisplay: React.FC = () => {
  const { parameters } = useFarmStore();
  
  const lmePlusData = useMemo(() => {
    return calculateLMEPlus(parameters);
  }, [parameters]);
  
  const { lme, nue, lmePlus, sustainabilityScore, interpretation } = lmePlusData;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">LME+NUE Combined Metric</h3>
        <Leaf className="w-5 h-5 text-green-600" />
      </div>
      
      <div className="space-y-4">
        {/* Combined Metric */}
        <div className={`${interpretation.bgColor} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">LME+NUE Score</p>
              <p className={`text-3xl font-bold ${interpretation.color}`}>
                {lmePlus.toFixed(1)}
              </p>
              <p className={`text-sm ${interpretation.color} mt-1`}>
                {interpretation.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Sustainability</p>
              <p className="text-2xl font-semibold text-gray-700">
                {sustainabilityScore.toFixed(0)}/100
              </p>
            </div>
          </div>
          <p className={`text-xs ${interpretation.color} mt-2`}>
            {interpretation.description}
          </p>
        </div>
        
        {/* Component Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-gray-600">LME</p>
            </div>
            <p className="text-xl font-semibold text-blue-700">
              {lme.toFixed(1)} L/kg CO₂e
            </p>
            <p className="text-xs text-gray-500">Emissions efficiency</p>
          </div>
          
          <div className="bg-green-50 rounded p-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <p className="text-sm text-gray-600">NUE</p>
            </div>
            <p className="text-xl font-semibold text-green-700">
              {nue.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">Nitrogen efficiency</p>
          </div>
        </div>
        
        {/* Progress Bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Emissions Performance</span>
              <span>{Math.min((lme / 15) * 100, 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((lme / 15) * 100, 100)}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Nitrogen Performance</span>
              <span>{Math.min((nue / 150) * 100, 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((nue / 150) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Interpretation */}
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500">
            This metric combines emissions efficiency (LME) with nitrogen use efficiency (NUE) 
            to provide a comprehensive sustainability assessment. Higher scores indicate better 
            environmental performance across both carbon and nitrogen cycles.
          </p>
        </div>
      </div>
    </div>
  );
};