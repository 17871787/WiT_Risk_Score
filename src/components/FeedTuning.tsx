import React from 'react';
import { Slider } from './ui/Slider';
import { useFarmStore } from '../context/FarmContext';

export const FeedTuning: React.FC = () => {
  const { parameters, updateParameter } = useFarmStore();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Feed Parameters</h3>
      
      <div className="space-y-4">
        <Slider
          label="Feed Quality"
          value={parameters.feedQuality}
          onChange={(value) => updateParameter('feedQuality', value)}
          min={1}
          max={10}
          step={1}
          unit=""
          decimals={0}
          info="Higher quality feed improves efficiency"
        />
        
        <Slider
          label="Concentrate Feed"
          value={parameters.concentrateFeed}
          onChange={(value) => updateParameter('concentrateFeed', value)}
          min={0}
          max={12}
          step={0.5}
          unit=" kg/day"
          decimals={1}
        />
        
        <Slider
          label="Feed Carbon Footprint"
          value={parameters.feedCarbonFootprint}
          onChange={(value) => updateParameter('feedCarbonFootprint', value)}
          min={0.3}
          max={2.0}
          step={0.1}
          unit=" kg CO₂e/kg"
          decimals={1}
        />
      </div>
    </div>
  );
};