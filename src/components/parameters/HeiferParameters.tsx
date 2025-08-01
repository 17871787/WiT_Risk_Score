import React from 'react';
import { useFarmStore } from '../../context/FarmContext';
import { Slider } from '../ui/Slider';
import { PERFORMANCE_THRESHOLDS } from '../../constants/emissions';

export const HeiferParameters: React.FC = () => {
  const { parameters, updateParameter } = useFarmStore();
  
  return (
    <div className="space-y-6">
      {/* Age at First Calving */}
      <Slider
        label="Age at First Calving (Months)"
        value={parameters.ageFirstCalving}
        onChange={(value) => updateParameter('ageFirstCalving', value)}
        min={20}
        max={32}
        step={0.1}
        unit=" months"
        decimals={1}
        warning={{
          threshold: PERFORMANCE_THRESHOLDS.AGE_FIRST_CALVING_TARGET,
          message: 'Above optimal age - increases rearing costs'
        }}
      />

      {/* Grazing Months */}
      <Slider
        label="Annual Grazing Time (Months)"
        value={parameters.grazingMonths}
        onChange={(value) => updateParameter('grazingMonths', value)}
        min={0}
        max={12}
        step={0.5}
        unit=" months"
        decimals={1}
        info="More grazing reduces emissions and costs"
      />

      {/* Average Lactations (repeated for convenience) */}
      <Slider
        label="Average No. Lactations"
        value={parameters.avgLactations}
        onChange={(value) => updateParameter('avgLactations', value)}
        min={2}
        max={6}
        step={0.1}
        decimals={1}
        info="Longer productive life improves efficiency"
      />
    </div>
  );
};