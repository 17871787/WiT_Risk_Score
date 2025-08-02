import React, { useMemo } from 'react';
import { useFarmStore } from '../context/FarmContext';
import { calculateReductionPathway } from '../lib/calculations/reductionPathway';
import { 
  calculateFinancingPackage, 
  calculateFinancingEligibility,
  FINANCING_OPTIONS 
} from '../lib/calculations/greenFinancing';

interface GreenFinancingDisplayProps {
  pathway?: ReturnType<typeof calculateReductionPathway>;
}

export const GreenFinancingDisplay: React.FC<GreenFinancingDisplayProps> = ({ pathway: providedPathway }) => {
  const parameters = useFarmStore((state) => state.parameters);
  const loanAmount = useFarmStore((state) => state.loanAmount);
  
  // Calculate pathway if not provided
  const pathway = useMemo(() => 
    providedPathway || calculateReductionPathway(parameters),
    [providedPathway, parameters]
  );
  
  // Estimate annual revenue (simplified)
  const annualRevenue = useMemo(() => 
    parameters.milkYield * parameters.herdSize * 0.35, // $0.35/L milk
    [parameters.milkYield, parameters.herdSize]
  );
  
  // Calculate emissions reduction percentage
  const emissionsReduction = useMemo(() => 
    (pathway.totalPotentialReduction / pathway.currentEmissions) * 100,
    [pathway]
  );
  
  // Calculate financing eligibility
  const eligibility = useMemo(() => 
    calculateFinancingEligibility(
      annualRevenue,
      loanAmount,
      720, // Assume good credit score
      emissionsReduction
    ),
    [annualRevenue, loanAmount, emissionsReduction]
  );
  
  // Calculate optimal financing package
  const financingPackage = useMemo(() => 
    calculateFinancingPackage(pathway, 720, loanAmount),
    [pathway, loanAmount]
  );

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Eligibility Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Financing Eligibility</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Max Loan Amount</p>
            <p className="text-xl font-bold text-green-900">
              {formatCurrency(eligibility.maxLoanAmount)}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Annual Revenue</p>
            <p className="text-xl font-bold text-blue-900">
              {formatCurrency(annualRevenue)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <p className="text-sm text-gray-600">Debt Service Ratio</p>
            <p className="text-xl font-bold text-purple-900">
              {formatPercent(eligibility.debtServiceRatio)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-sm text-gray-600">Green Bonus Rate</p>
            <p className="text-xl font-bold text-yellow-900">
              {formatPercent(eligibility.greenBonus)}
            </p>
          </div>
        </div>
      </div>

      {/* Financing Package Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recommended Financing Package</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(financingPackage.totalInvestment)}
            </p>
            <p className="text-sm text-gray-600">Total Investment Needed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(financingPackage.totalMonthlyCost)}
            </p>
            <p className="text-sm text-gray-600">Monthly Payment</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {financingPackage.paybackPeriod.toFixed(1)} years
            </p>
            <p className="text-sm text-gray-600">Payback Period</p>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-600">Total Financing Cost</p>
            <p className="font-semibold">{formatCurrency(financingPackage.totalFinancingCost)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Present Value</p>
            <p className={`font-semibold ${financingPackage.netPresentValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(financingPackage.netPresentValue)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Internal Rate of Return</p>
            <p className="font-semibold">{formatPercent(financingPackage.internalRateOfReturn)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Carbon Cost Effectiveness</p>
            <p className="font-semibold">${financingPackage.carbonCostEffectiveness.toFixed(2)}/kg CO₂e</p>
          </div>
        </div>
      </div>

      {/* Financing Options Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Financing Sources</h3>
        <div className="space-y-4">
          {financingPackage.financingOptions.map((financing, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{financing.option.name}</h4>
                  <p className="text-sm text-gray-600">{financing.option.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  financing.option.type === 'grant' ? 'bg-green-100 text-green-800' :
                  financing.option.type === 'loan' ? 'bg-blue-100 text-blue-800' :
                  financing.option.type === 'carbon-credit' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {financing.option.type}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <span className="ml-1 font-semibold">{formatCurrency(financing.amount)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Monthly:</span>
                  <span className="ml-1 font-semibold">{formatCurrency(financing.monthlyCost)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Rate:</span>
                  <span className="ml-1 font-semibold">
                    {formatPercent(financing.option.interestRate - financing.option.greenDiscount)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Term:</span>
                  <span className="ml-1 font-semibold">{financing.option.term} years</span>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                <span className="text-green-600 font-semibold">
                  {financing.carbonBenefit.toFixed(0)} kg CO₂e reduction funded
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Financing Options */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">All Available Green Financing Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eligibility.eligibleOptions.map((option) => (
            <div key={option.id} className="border rounded-lg p-4">
              <h4 className="font-semibold">{option.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Amount:</span>
                  <span className="font-semibold">{formatCurrency(option.maxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-semibold">{formatPercent(option.interestRate)}</span>
                </div>
                {option.greenDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Green Discount:</span>
                    <span className="font-semibold">-{formatPercent(option.greenDiscount)}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <p className="text-xs text-gray-600 font-semibold">Requirements:</p>
                <ul className="text-xs text-gray-600 mt-1">
                  {option.requirements.map((req, i) => (
                    <li key={i} className="ml-2">• {req}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Ready to Get Started?</h3>
        <p className="text-green-800 mb-4">
          Your farm qualifies for multiple green financing options that can help you achieve 
          a {emissionsReduction.toFixed(1)}% reduction in emissions while improving profitability.
        </p>
        <div className="flex gap-4">
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Download Financing Report
          </button>
          <button className="bg-white text-green-600 border border-green-600 px-6 py-2 rounded hover:bg-green-50">
            Schedule Consultation
          </button>
        </div>
      </div>
    </div>
  );
};