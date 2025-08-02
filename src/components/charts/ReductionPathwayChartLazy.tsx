import React, { lazy } from 'react';
import { ChartWrapper } from './ChartWrapper';
import { ReductionMeasure } from '../../lib/calculations/reductionPathway';

// Lazy load the actual chart component
const ReductionPathwayChartComponent = lazy(() => 
  import('./ReductionPathwayChart').then(module => ({
    default: module.ReductionPathwayChart
  }))
);

interface ReductionPathwayChartProps {
  measures: ReductionMeasure[];
  currentEmissions: number;
  targetEmissions: number;
}

export const ReductionPathwayChartLazy: React.FC<ReductionPathwayChartProps> = (props) => {
  return (
    <ChartWrapper height={400}>
      <ReductionPathwayChartComponent {...props} />
    </ChartWrapper>
  );
};