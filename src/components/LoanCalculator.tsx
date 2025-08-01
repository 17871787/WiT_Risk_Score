import React, { useMemo } from 'react';
import { Phone } from 'lucide-react';
import { useCalculations } from '../hooks/useCalculations';
import { useFarmStore } from '../context/FarmContext';
import { getRiskScore, getInterestRate, calculateMonthlyRepayment, calculateTotalRepaid } from '../lib/calculations/risk';
import { RiskScoreBadge } from './RiskScoreBadge';
import { Slider } from './ui/Slider';

export const LoanCalculator: React.FC = () => {
  const { emissionsIntensity } = useCalculations();
  const { loanAmount, loanTerm, updateLoanParameter } = useFarmStore();
  
  const riskScore = useMemo(
    () => getRiskScore(emissionsIntensity),
    [emissionsIntensity]
  );
  
  const interestRate = useMemo(
    () => getInterestRate(riskScore, loanAmount),
    [riskScore, loanAmount]
  );
  
  const monthlyRepayment = useMemo(
    () => calculateMonthlyRepayment(loanAmount, interestRate, loanTerm),
    [loanAmount, interestRate, loanTerm]
  );
  
  const totalRepaid = useMemo(
    () => calculateTotalRepaid(monthlyRepayment, loanTerm),
    [monthlyRepayment, loanTerm]
  );
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Financing Options</h3>
      
      <div className="mb-4">
        <span className="text-sm text-gray-600 mr-2">Risk Score:</span>
        <RiskScoreBadge score={riskScore} />
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="loan-amount" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (£)
          </label>
          <input
            id="loan-amount"
            name="loan-amount"
            type="number"
            value={loanAmount}
            onChange={(e) => updateLoanParameter('loanAmount', Number(e.target.value))}
            step={50000}
            min={100000}
            max={10000000}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <Slider
          label="Term (years)"
          value={loanTerm}
          onChange={(value) => updateLoanParameter('loanTerm', value)}
          min={1}
          max={25}
          step={1}
          decimals={0}
          showValue={true}
        />
      </div>
      
      <div className="mt-6 space-y-3 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Interest Rate:</span>
          <span className="text-sm font-semibold">{(interestRate * 100).toFixed(1)}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Monthly Repayment:</span>
          <span className="text-lg font-bold text-blue-600">
            £{monthlyRepayment.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total Repaid:</span>
          <span className="text-lg font-bold text-gray-800">
            £{totalRepaid.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href={`mailto:relationship.manager@bank.com?subject=GHG%20Loan%20Inquiry%20-%20Risk%20Score%3A%20${riskScore}`}
          className="w-full text-center bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <Phone className="mr-2" size={18} />
          Click here to speak to your Relationship Manager
        </a>
      </div>
    </div>
  );
};