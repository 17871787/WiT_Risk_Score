import React from 'react';
import { useFarmStore } from '../../context/FarmContext';
import { Slider } from '../ui/Slider';
import { Select } from '../ui/Select';
import { PERFORMANCE_THRESHOLDS, SEASONAL_FACTORS } from '../../constants/emissions';

export const BasicParameters: React.FC = () => {
  const { parameters, updateParameter } = useFarmStore();
  
  return (
    <div className="space-y-6">
      {/* Season Selector */}
      <Select
        label="Season"
        value={parameters.season}
        onChange={(value) => updateParameter('season', value as any)}
        options={Object.keys(SEASONAL_FACTORS)}
      />

      {/* System Type */}
      <Select
        label="System Type"
        value={parameters.systemType}
        onChange={(value) => updateParameter('systemType', value as any)}
        options={[
          { value: 'intensive', label: 'Intensive (>7000 L/yr)' },
          { value: 'moderate', label: 'Moderate (4-7k L/yr)' },
          { value: 'extensive', label: 'Extensive (<4000 L/yr)' }
        ]}
      />

      {/* Feed Quality */}
      <Slider
        label="Feed Quality"
        value={parameters.feedQuality}
        onChange={(value) => updateParameter('feedQuality', value)}
        min={1}
        max={10}
        step={1}
        unit="/10"
        info="Higher quality feed reduces methane emissions"
      />

      {/* Concentrate Feed */}
      <Slider
        label="Concentrate Feed (kg/day)"
        value={parameters.concentrateFeed}
        onChange={(value) => updateParameter('concentrateFeed', value)}
        min={0}
        max={20}
        step={0.1}
        decimals={1}
      />

      {/* Feed Cost */}
      <Slider
        label="Feed Cost (£/kg)"
        value={parameters.feedCost}
        onChange={(value) => updateParameter('feedCost', value)}
        min={0.20}
        max={0.60}
        step={0.01}
        unit="£"
        decimals={2}
      />

      {/* Feed Carbon Footprint */}
      <Slider
        label="Feed Carbon (kg CO₂e/kg)"
        value={parameters.feedCarbonFootprint}
        onChange={(value) => updateParameter('feedCarbonFootprint', value)}
        min={0.3}
        max={2.0}
        step={0.05}
        decimals={2}
        warning={{
          threshold: PERFORMANCE_THRESHOLDS.FEED_CARBON_FOOTPRINT_LIMIT,
          message: 'High carbon feed'
        }}
      />

      {/* Soya Content */}
      <div>
        <Slider
          label="Soya Content (%)"
          value={parameters.soyaContent}
          onChange={(value) => updateParameter('soyaContent', value)}
          min={0}
          max={40}
          step={1}
          unit="%"
          decimals={0}
          warning={{
            threshold: PERFORMANCE_THRESHOLDS.SOYA_CONTENT_WARNING,
            message: `+${((parameters.soyaContent / 100) * parameters.concentrateFeed * 365 * 3.5 / parameters.milkYield).toFixed(3)} kg CO₂e/L`
          }}
        />
        
        {parameters.soyaContent > 0 && (
          <div className="mt-2">
            <label htmlFor="deforestation-free-checkbox" className="flex items-center text-xs">
              <input
                id="deforestation-free-checkbox"
                name="deforestation-free-checkbox"
                type="checkbox"
                checked={parameters.deforestationFree}
                onChange={(e) => updateParameter('deforestationFree', e.target.checked)}
                className="mr-2"
              />
              Deforestation-free certified
            </label>
          </div>
        )}
      </div>

      {/* Nitrogen Application */}
      <Slider
        label="Nitrogen Rate (kg N/Ha/Year)"
        value={parameters.nitrogenRate}
        onChange={(value) => updateParameter('nitrogenRate', value)}
        min={0}
        max={300}
        step={5}
        decimals={0}
      />

      {/* Crude Protein */}
      <Slider
        label="Crude Protein (%)"
        value={parameters.crudeProtein}
        onChange={(value) => updateParameter('crudeProtein', value)}
        min={12}
        max={22}
        step={0.5}
        unit="%"
        decimals={1}
      />
    </div>
  );
};