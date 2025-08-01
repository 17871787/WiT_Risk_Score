import React from 'react';
import { useCalculations } from '../../hooks/useCalculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CHART_ANIMATION_DURATION } from '../../constants/ui';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export const CostBreakdown: React.FC = () => {
  const { costBreakdown, totalAnnualCost } = useCalculations();
  
  const data = costBreakdown.map((item, index) => ({
    name: item.name,
    value: item.value,
    amount: item.amount,
    color: COLORS[index]
  }));
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded border border-gray-200">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-sm">£{payload[0].payload.amount.toFixed(0)} ({payload[0].value}%)</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Cost Breakdown (£/cow/year)</h2>
      <div className="flex items-center">
        <div className="w-48 h-48 relative mr-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                isAnimationActive={CHART_ANIMATION_DURATION > 0}
                animationDuration={CHART_ANIMATION_DURATION}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-500">Total Cost</div>
              <div className="text-xl font-bold">£{totalAnnualCost.toFixed(0)}</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{backgroundColor: item.color}}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  £{item.amount.toFixed(0)}
                </span>
                <span className="text-xs text-gray-500 ml-1">({item.value}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};