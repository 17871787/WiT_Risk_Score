import React from 'react';
import { useFarmStore } from '../../context/FarmContext';
import { Slider } from '../ui/Slider';
import { Select } from '../ui/Select';
import { PERFORMANCE_THRESHOLDS, EMISSION_FACTORS } from '../../constants/emissions';

export const FarmParameters: React.FC = () => {
  const { parameters, updateParameter } = useFarmStore();
  
  return (
    <div className="space-y-6">
      {/* Herd Size */}
      <Slider
        label="Herd Size (cows)"
        value={parameters.herdSize}
        onChange={(value) => updateParameter('herdSize', value)}
        min={50}
        max={500}
        step={10}
        decimals={0}
      />

      {/* Milk Yield */}
      <Slider
        label="Milk Yield (L/cow/year)"
        value={parameters.milkYield}
        onChange={(value) => updateParameter('milkYield', value)}
        min={6000}
        max={12000}
        step={100}
        decimals={0}
        warning={{
          threshold: 8000,
          message: 'Below average yield'
        }}
      />

      {/* Average Lactations */}
      <Slider
        label="Average No. Lactations"
        value={parameters.avgLactations}
        onChange={(value) => updateParameter('avgLactations', value)}
        min={2}
        max={6}
        step={0.1}
        decimals={1}
        info="Higher lactations improve lifetime efficiency"
      />

      {/* Calving Interval */}
      <Slider
        label="Calving Interval (days)"
        value={parameters.calvingInterval}
        onChange={(value) => updateParameter('calvingInterval', value)}
        min={340}
        max={450}
        step={5}
        decimals={0}
        warning={{
          threshold: PERFORMANCE_THRESHOLDS.CALVING_INTERVAL_TARGET,
          message: 'Above optimal interval'
        }}
      />

      {/* Manure System */}
      <Select
        label="Manure System"
        value={parameters.manureSystem}
        onChange={(value) => updateParameter('manureSystem', value as any)}
        options={Object.keys(EMISSION_FACTORS.MANURE_SYSTEMS)}
      />
    </div>
  );
};