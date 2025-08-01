import React from 'react';
import { useFarmStore } from '../../context/FarmContext';
import { useCalculations } from '../../hooks/useCalculations';
import { Slider } from '../ui/Slider';

export const SequestrationParameters: React.FC = () => {
  const { parameters, updateParameter } = useFarmStore();
  const { sequestration } = useCalculations();
  
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-green-800 mb-2">
          Carbon Sequestration Activities
        </h3>
        <p className="text-xs text-green-700">
          Add nature-based and technology solutions to offset your farm's emissions.
        </p>
      </div>

      {/* Tree Planting */}
      <Slider
        label="Tree Planting (hectares)"
        value={parameters.treePlantingHa}
        onChange={(value) => updateParameter('treePlantingHa', value)}
        min={0}
        max={50}
        step={1}
        unit=" ha"
        decimals={0}
        info={parameters.treePlantingHa > 0 ? 
          `↓ ${sequestration.treeSequestration.toFixed(1)} t CO₂e/year` : 
          undefined
        }
      />

      {/* Hedgerows */}
      <Slider
        label="Hedgerow Planting (km)"
        value={parameters.hedgerowKm}
        onChange={(value) => updateParameter('hedgerowKm', value)}
        min={0}
        max={20}
        step={0.5}
        unit=" km"
        decimals={1}
        info={parameters.hedgerowKm > 0 ? 
          `↓ ${sequestration.hedgerowSequestration.toFixed(1)} t CO₂e/year` : 
          undefined
        }
      />

      {/* Soil Carbon */}
      <Slider
        label="Soil Carbon Management (ha)"
        value={parameters.soilCarbonHa}
        onChange={(value) => updateParameter('soilCarbonHa', value)}
        min={0}
        max={100}
        step={5}
        unit=" ha"
        decimals={0}
        info={parameters.soilCarbonHa > 0 ? 
          `↓ ${sequestration.soilCarbonSequestration.toFixed(1)} t CO₂e/year` : 
          undefined
        }
      />

      {/* Cover Crops */}
      <Slider
        label="Cover Crops (hectares)"
        value={parameters.coverCropsHa}
        onChange={(value) => updateParameter('coverCropsHa', value)}
        min={0}
        max={80}
        step={5}
        unit=" ha"
        decimals={0}
        info={parameters.coverCropsHa > 0 ? 
          `↓ ${sequestration.coverCropSequestration.toFixed(1)} t CO₂e/year` : 
          undefined
        }
      />

      {/* Renewable Energy */}
      <Slider
        label="Renewable Energy (kW)"
        value={parameters.renewableEnergyKw}
        onChange={(value) => updateParameter('renewableEnergyKw', value)}
        min={0}
        max={200}
        step={10}
        unit=" kW"
        decimals={0}
        info={parameters.renewableEnergyKw > 0 ? 
          `↓ ${sequestration.renewableOffset.toFixed(1)} t CO₂e/year` : 
          undefined
        }
      />

      {/* Technology Options */}
      <div className="space-y-3">
        <label htmlFor="methane-inhibitor-checkbox" className="flex items-center text-sm">
          <input
            id="methane-inhibitor-checkbox"
            name="methane-inhibitor-checkbox"
            type="checkbox"
            checked={parameters.methaneInhibitor}
            onChange={(e) => updateParameter('methaneInhibitor', e.target.checked)}
            className="mr-2"
          />
          <span className="font-medium">Methane Inhibitor Feed Additive</span>
        </label>
        {parameters.methaneInhibitor && (
          <div className="text-xs text-green-600 ml-6">
            ↓ {sequestration.methaneReduction.toFixed(1)} t CO₂e/year (15% reduction)
          </div>
        )}
        
        <label htmlFor="improved-manure-checkbox" className="flex items-center text-sm">
          <input
            id="improved-manure-checkbox"
            name="improved-manure-checkbox"
            type="checkbox"
            checked={parameters.improvedManure}
            onChange={(e) => updateParameter('improvedManure', e.target.checked)}
            className="mr-2"
          />
          <span className="font-medium">Improved Manure Management</span>
        </label>
        {parameters.improvedManure && (
          <div className="text-xs text-green-600 ml-6">
            ↓ {sequestration.improvedManureReduction.toFixed(1)} t CO₂e/year (30% reduction)
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg mt-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          Sequestration Summary
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-blue-700">Nature-based Solutions:</span>
            <span className="font-semibold text-blue-800">
              {(sequestration.treeSequestration + 
                sequestration.hedgerowSequestration + 
                sequestration.soilCarbonSequestration + 
                sequestration.coverCropSequestration).toFixed(1)} t CO₂e
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Technology Solutions:</span>
            <span className="font-semibold text-blue-800">
              {(sequestration.renewableOffset + 
                sequestration.methaneReduction + 
                sequestration.improvedManureReduction).toFixed(1)} t CO₂e
            </span>
          </div>
          <div className="flex justify-between border-t pt-1 mt-1">
            <span className="text-blue-700 font-medium">Total Sequestration:</span>
            <span className="font-bold text-blue-900">
              {sequestration.totalSequestration.toFixed(1)} t CO₂e/year
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};