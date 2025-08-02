import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ReductionMeasure } from '../../lib/calculations/reductionPathway';

interface ReductionPathwayChartProps {
  measures: ReductionMeasure[];
  currentEmissions: number;
  targetEmissions: number;
}

const CATEGORY_COLORS = {
  Feed: '#10b981',
  Manure: '#8b5cf6',
  Technology: '#3b82f6',
  Management: '#f59e0b',
};

export const ReductionPathwayChart: React.FC<ReductionPathwayChartProps> = ({
  measures,
  currentEmissions,
  targetEmissions,
}) => {
  // Prepare data for waterfall chart
  const chartData: Array<{
    name: string;
    value: number;
    type: string;
    base?: number;
    category?: string;
  }> = [
    {
      name: 'Current',
      value: currentEmissions,
      type: 'current',
    },
  ];

  let cumulativeReduction = 0;
  measures.forEach((measure) => {
    chartData.push({
      name: measure.name,
      value: -measure.potentialReduction,
      base: currentEmissions - cumulativeReduction,
      type: 'reduction',
      category: measure.category,
    });
    cumulativeReduction += measure.potentialReduction;
  });

  chartData.push({
    name: 'Projected',
    value: currentEmissions - cumulativeReduction,
    type: 'projected',
  });

  chartData.push({
    name: 'Target (TM)',
    value: targetEmissions,
    type: 'target',
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      if (data.type === 'reduction') {
        const measure = measures.find(m => m.name === data.name);
        return (
          <div className="bg-white p-3 border rounded shadow-lg">
            <p className="font-semibold">{data.name}</p>
            <p className="text-sm text-gray-600">Category: {measure?.category}</p>
            <p className="text-sm">Reduction: {Math.abs(data.value).toFixed(0)} kg CO₂e/year</p>
            <p className="text-sm">Difficulty: {measure?.difficulty}</p>
            <p className="text-sm">Time: {measure?.timeToImplement} months</p>
          </div>
        );
      }
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">Emissions: {data.value.toFixed(0)} kg CO₂e/year</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Emissions Reduction Pathway</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              fontSize={12}
            />
            <YAxis 
              label={{ value: 'Emissions (kg CO₂e/year)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.type === 'current' ? '#ef4444' :
                    entry.type === 'reduction' ? CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] :
                    entry.type === 'projected' ? '#3b82f6' :
                    '#8b5cf6'
                  }
                  fillOpacity={entry.type === 'target' ? 0.5 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900">Current Emissions</h4>
          <p className="text-2xl font-bold text-blue-900">{currentEmissions.toFixed(0)}</p>
          <p className="text-sm text-blue-700">kg CO₂e/year</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900">Potential Reduction</h4>
          <p className="text-2xl font-bold text-green-900">
            {measures.reduce((sum, m) => sum + m.potentialReduction, 0).toFixed(0)}
          </p>
          <p className="text-sm text-green-700">kg CO₂e/year</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Reduction Measures by Category</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => {
            const categoryMeasures = measures.filter(m => m.category === category);
            const totalReduction = categoryMeasures.reduce((sum, m) => sum + m.potentialReduction, 0);
            if (totalReduction === 0) return null;
            
            return (
              <div key={category} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                <span className="text-sm">
                  {category}: {totalReduction.toFixed(0)} kg CO₂e
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};