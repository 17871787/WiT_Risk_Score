import React from 'react';
import { RiskScore } from '../lib/calculations/risk';

interface RiskScoreBadgeProps {
  score: RiskScore;
}

export const RiskScoreBadge: React.FC<RiskScoreBadgeProps> = ({ score }) => {
  const getColorClasses = (score: RiskScore) => {
    switch (score) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorClasses(score)}`}>
      {score} Risk
    </span>
  );
};