import React from 'react';
import { LineChart, Trees, Info } from 'lucide-react';
import { useGlidePath } from '../../hooks/useGlidePath';
import { useCalculations } from '../../hooks/useCalculations';

const NetCarbonProjectionV2Component: React.FC = () => {
  const { years, canReachNetZero, canReachTM } = useGlidePath();
  const { sequestration } = useCalculations();
  
  if (years.length === 0) return null;
  
  // Find chart bounds
  const maxEmissions = Math.max(...years.map(y => y.gross));
  const minEmissions = Math.min(...years.map(y => Math.min(y.net, 0)));
  const tmValue = years[0].theoreticalMinimum;
  
  const range = maxEmissions - minEmissions;
  const padding = range * 0.1;
  
  const yMax = maxEmissions + padding;
  const yMin = Math.min(0, minEmissions - padding);
  
  const scaleY = (value: number) => 320 - ((value - yMin) / (yMax - yMin)) * 280;
  const scaleX = (index: number) => 60 + (index / (years.length - 1)) * 600;
  
  const carbonNeutralYear = years.findIndex(y => y.net <= 0);
  const tmReachedYear = years.findIndex(y => y.gross <= y.theoreticalMinimum);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <LineChart className="mr-2 text-green-600" size={20} />
        Net-Carbon Glide Path 2.0
      </h2>
      
      <div className="relative" style={{ height: '400px' }}>
        <svg width="100%" height="360" viewBox="0 0 700 360" preserveAspectRatio="xMidYMid meet">
          {/* Grid Background */}
          <rect x="60" y="30" width="600" height="290" fill="#f9fafb" rx="4" />
          
          {/* Zero line */}
          {yMin < 0 && yMax > 0 && (
            <line 
              x1="60" 
              y1={scaleY(0)} 
              x2="660" 
              y2={scaleY(0)} 
              stroke="#10B981" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
          )}
          
          {/* Theoretical Minimum line */}
          <line 
            x1="60" 
            y1={scaleY(tmValue)} 
            x2="660" 
            y2={scaleY(tmValue)} 
            stroke="#8B5CF6" 
            strokeWidth="2.5" 
            strokeDasharray="8,4"
          />
          
          {/* Grid Lines - Horizontal */}
          {[0, 25, 50, 75, 100].map(pct => {
            const y = 320 - (pct / 100 * 290);
            return (
              <line 
                key={pct} 
                x1="60" 
                y1={y} 
                x2="660" 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="1" 
                strokeDasharray="3,3"
              />
            );
          })}
          
          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map(pct => {
            const value = yMin + (pct / 100) * (yMax - yMin);
            const y = 320 - (pct / 100 * 290);
            return (
              <text 
                key={pct} 
                x="50" 
                y={y + 4} 
                textAnchor="end" 
                fontSize="10" 
                fill="#6b7280"
              >
                {Math.round(value)}
              </text>
            );
          })}
          
          {/* TM label */}
          <text 
            x="665" 
            y={scaleY(tmValue) + 4} 
            textAnchor="start" 
            fontSize="10" 
            fill="#8B5CF6"
            fontWeight="500"
          >
            TM
          </text>
          
          {/* Area fill between gross and net emissions */}
          <path
            d={`
              M ${years.map((y, i) => `${scaleX(i)},${scaleY(y.gross)}`).join(' L ')}
              L ${years.slice().reverse().map((y, i) => `${scaleX(years.length - 1 - i)},${scaleY(y.net)}`).join(' L ')}
              Z
            `}
            fill="#10B981"
            opacity="0.2"
          />
          
          {/* Gross Emissions Line */}
          <polyline
            fill="none"
            stroke="#DC2626"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={years.map((y, i) => `${scaleX(i)},${scaleY(y.gross)}`).join(' ')}
          />
          
          {/* Net Emissions Line */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={years.map((y, i) => `${scaleX(i)},${scaleY(y.net)}`).join(' ')}
          />
          
          {/* Data Points with hover areas */}
          {years.map((yearData, i) => {
            const x = scaleX(i);
            return (
              <g key={i}>
                {/* Hover area */}
                <rect 
                  x={x - 20} 
                  y="30" 
                  width="40" 
                  height="290" 
                  fill="transparent"
                  className="cursor-pointer"
                >
                  <title>
                    {yearData.year}:
                    Gross: {yearData.gross.toFixed(1)}t
                    TM: {yearData.theoreticalMinimum.toFixed(1)}t
                    Above TM: {yearData.percentAboveTM.toFixed(0)}%
                    Sequestration: {yearData.sequestration.toFixed(1)}t
                    Net: {yearData.net.toFixed(1)}t
                  </title>
                </rect>
                
                <circle cx={x} cy={scaleY(yearData.gross)} r="4" fill="white" stroke="#DC2626" strokeWidth="2" />
                <circle cx={x} cy={scaleY(yearData.net)} r="4" fill="white" stroke="#10B981" strokeWidth="2" />
                
                {/* Carbon neutral achievement marker */}
                {yearData.net <= 0 && i > 0 && years[i-1].net > 0 && (
                  <g>
                    <circle cx={x} cy={scaleY(0)} r="8" fill="#10B981" />
                    <text x={x} y={scaleY(0) + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                      ✓
                    </text>
                    <text x={x} y={scaleY(0) - 15} textAnchor="middle" fontSize="9" fill="#10B981" fontWeight="bold">
                      Net Zero
                    </text>
                  </g>
                )}
                
                {/* TM achievement marker */}
                {yearData.gross <= yearData.theoreticalMinimum && i > 0 && years[i-1].gross > years[i-1].theoreticalMinimum && (
                  <g>
                    <circle cx={x} cy={scaleY(tmValue)} r="8" fill="#8B5CF6" />
                    <text x={x} y={scaleY(tmValue) + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                      ✓
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {years.filter((_, i) => i % 2 === 0).map((y, i) => {
            const x = scaleX(i * 2);
            return (
              <text key={i} x={x} y="340" textAnchor="middle" fontSize="11" fill="#6b7280">
                {y.year}
              </text>
            );
          })}
          
          {/* Y-axis title */}
          <text x="20" y="175" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="500" transform="rotate(-90 20 175)">
            Emissions (t CO₂e/year)
          </text>
        </svg>
        
        {/* Legend */}
        <div className="flex gap-6 justify-center mt-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="16">
              <circle cx="8" cy="8" r="4" fill="white" stroke="#DC2626" strokeWidth="2" />
            </svg>
            <span className="text-xs text-gray-700">Gross Emissions</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="16">
              <line x1="0" y1="8" x2="16" y2="8" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="6,2" />
            </svg>
            <span className="text-xs text-gray-700">Theoretical Minimum</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="16">
              <rect x="0" y="4" width="16" height="8" fill="#10B981" opacity="0.2" />
            </svg>
            <span className="text-xs text-gray-700">Sequestration</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="16">
              <circle cx="8" cy="8" r="4" fill="white" stroke="#10B981" strokeWidth="2" />
            </svg>
            <span className="text-xs text-gray-700">Net Emissions</span>
          </div>
        </div>
      </div>
      
      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Current Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Current Status</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Above TM:</span>
              <span className="font-semibold">{years[0].percentAboveTM.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Net Emissions:</span>
              <span className="font-semibold">{years[0].net.toFixed(1)}t</span>
            </div>
          </div>
        </div>
        
        {/* TM Info */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center">
            Theoretical Minimum
            <button className="ml-1 text-purple-600 hover:text-purple-800">
              <Info size={14} />
              <span className="sr-only">Biological floor information</span>
            </button>
          </h4>
          <div className="text-xs text-purple-700 mb-1">Biological floor: {tmValue.toFixed(1)}t CO₂e</div>
          <div className="text-xs text-purple-600">
            {canReachTM ? 
              `Can reach TM by ${years[tmReachedYear].year}` : 
              'Additional measures needed to reach TM'
            }
          </div>
        </div>
        
        {/* Carbon Credits */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-green-800 mb-2">Carbon Credits</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Annual:</span>
              <span className="font-semibold">£{(sequestration.totalSequestration * 25).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">10-Year:</span>
              <span className="font-semibold">£{(sequestration.totalSequestration * 25 * 10).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const NetCarbonProjectionV2 = React.memo(NetCarbonProjectionV2Component);