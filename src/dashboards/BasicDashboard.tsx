import React from 'react';
import { DashboardProps } from '../hooks/useDashboardState';
import { CostBreakdown } from '../components/charts/CostBreakdown';
import { PerformanceMetrics } from '../components/charts/PerformanceMetrics';
import { FarmImpact } from '../components/charts/FarmImpact';
import { LoanCalculator } from '../components/LoanCalculator';

const BasicDashboard: React.FC<DashboardProps> = ({ state, actions }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <LoanCalculator />
        </div>
        <CostBreakdown />
        <PerformanceMetrics />
        <div className="col-span-1 lg:col-span-2">
          <FarmImpact />
        </div>
      </div>
    </div>
  );
};

export default BasicDashboard;