import React, { useMemo } from 'react';
import { DollarSign, TrendingDown, Clock, Percent } from 'lucide-react';
import { FarmParameters } from '../../types';
import { calculateReductionPathway } from '../../lib/calculations/reductionPathway';
import { calculateFinancingPackage } from '../../lib/calculations/greenFinancing';
import { calculateEmissions, calculateTotalFarmEmissions } from '../../lib/calculations/emissions';

interface ScenarioFinancingProps {
  baselineParams: FarmParameters;
  scenarioParams: FarmParameters;
  scenarioName: string;
}

export const ScenarioFinancing: React.FC<ScenarioFinancingProps> = ({
  baselineParams,
  scenarioParams,
  scenarioName
}) => {
  // Calculate emissions for both scenarios
  const baselineEmissions = useMemo(() => {
    const breakdown = calculateEmissions(baselineParams);
    return calculateTotalFarmEmissions(breakdown.totalAnnualEmissions, baselineParams.herdSize) * 1000;
  }, [baselineParams]);
  
  const scenarioEmissions = useMemo(() => {
    const breakdown = calculateEmissions(scenarioParams);
    return calculateTotalFarmEmissions(breakdown.totalAnnualEmissions, scenarioParams.herdSize) * 1000;
  }, [scenarioParams]);
  
  // Calculate reduction achieved
  const emissionsReduction = baselineEmissions - scenarioEmissions;
  const reductionPercentage = (emissionsReduction / baselineEmissions) * 100;
  
  // Calculate financing needs for the scenario
  const pathway = useMemo(() => 
    calculateReductionPathway(scenarioParams),
    [scenarioParams]
  );
  
  const financing = useMemo(() => 
    calculateFinancingPackage(pathway, 720, 0),
    [pathway]
  );
  
  // Identify which practices are active in this scenario
  const activePractices = useMemo(() => {
    const practices = [];
    
    if (scenarioParams.methaneInhibitor && !baselineParams.methaneInhibitor) {
      practices.push({ name: 'Methane Inhibitor', cost: 30000 });
    }
    if (scenarioParams.improvedManure && !baselineParams.improvedManure) {
      practices.push({ name: 'Improved Manure System', cost: 50000 });
    }
    if (scenarioParams.renewableEnergyKw > baselineParams.renewableEnergyKw) {
      const kWDiff = scenarioParams.renewableEnergyKw - baselineParams.renewableEnergyKw;
      practices.push({ name: `Solar Panels (${kWDiff} kW)`, cost: kWDiff * 1500 });
    }
    if (scenarioParams.treePlantingHa > baselineParams.treePlantingHa) {
      const haDiff = scenarioParams.treePlantingHa - baselineParams.treePlantingHa;
      practices.push({ name: `Tree Planting (${haDiff} ha)`, cost: haDiff * 2000 });
    }
    if (scenarioParams.grazingMonths > baselineParams.grazingMonths) {
      practices.push({ name: 'Extended Grazing', cost: 10000 });
    }
    if (scenarioParams.nitrogenRate < baselineParams.nitrogenRate) {
      practices.push({ name: 'Nitrogen Optimization', cost: 5000 });
    }
    
    return practices;
  }, [baselineParams, scenarioParams]);
  
  const totalInvestment = activePractices.reduce((sum, p) => sum + p.cost, 0);
  const annualCarbonValue = emissionsReduction * 0.025; // $25/tonne
  const simplePayback = totalInvestment / annualCarbonValue;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Financing Analysis: {scenarioName}
      </h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded">
          <div className="flex items-center gap-2 text-green-700 mb-1">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-medium">Emissions Reduction</span>
          </div>
          <p className="text-xl font-bold text-green-900">
            {reductionPercentage.toFixed(1)}%
          </p>
          <p className="text-xs text-green-600">
            {emissionsReduction.toFixed(0)} kg CO₂e/year
          </p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium">Total Investment</span>
          </div>
          <p className="text-xl font-bold text-blue-900">
            ${totalInvestment.toLocaleString()}
          </p>
          <p className="text-xs text-blue-600">
            One-time cost
          </p>
        </div>
        
        <div className="bg-purple-50 p-3 rounded">
          <div className="flex items-center gap-2 text-purple-700 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Simple Payback</span>
          </div>
          <p className="text-xl font-bold text-purple-900">
            {simplePayback.toFixed(1)} years
          </p>
          <p className="text-xs text-purple-600">
            From carbon credits
          </p>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded">
          <div className="flex items-center gap-2 text-yellow-700 mb-1">
            <Percent className="w-4 h-4" />
            <span className="text-xs font-medium">Monthly Payment</span>
          </div>
          <p className="text-xl font-bold text-yellow-900">
            ${financing.totalMonthlyCost.toFixed(0)}
          </p>
          <p className="text-xs text-yellow-600">
            With financing
          </p>
        </div>
      </div>
      
      {/* Active Practices */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Investment Breakdown</h4>
        <div className="space-y-2">
          {activePractices.map((practice, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">{practice.name}</span>
              <span className="text-sm font-medium">${practice.cost.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-sm font-bold">${totalInvestment.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Financing Options */}
      <div className="bg-gray-50 rounded p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommended Financing</h4>
        
        {financing.financingOptions.length > 0 ? (
          <div className="space-y-2">
            {financing.financingOptions.slice(0, 3).map((option, index) => (
              <div key={index} className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-medium">{option.option.name}</p>
                  <p className="text-xs text-gray-600">
                    ${option.amount.toLocaleString()} at {((option.option.interestRate - option.option.greenDiscount) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${option.monthlyCost.toFixed(0)}/mo</p>
                  <p className="text-xs text-gray-600">{option.option.term} years</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            No financing needed - practices already implemented
          </p>
        )}
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Financial Summary</span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>NPV (10 years):</span>
              <span className={financing.netPresentValue > 0 ? 'text-green-600 font-medium' : 'text-red-600'}>
                ${financing.netPresentValue.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>IRR:</span>
              <span className="font-medium">{(financing.internalRateOfReturn * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Carbon value/year:</span>
              <span className="font-medium">${annualCarbonValue.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      {totalInvestment > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            💡 This scenario qualifies for green financing with monthly payments as low as 
            <span className="font-semibold"> ${financing.totalMonthlyCost.toFixed(0)}</span>
          </p>
        </div>
      )}
    </div>
  );
};