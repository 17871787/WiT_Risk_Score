import React, { useMemo } from 'react';
import { LineChart, Trees } from 'lucide-react';
import { useCalculations } from '../../hooks/useCalculations';
import { ProjectionYear } from '../../types';

export const NetCarbonProjection: React.FC = () => {
  const {
    totalFarmEmissions,
    sequestration,
    totalFarmProduction
  } = useCalculations();
  
  // Generate 10-year projection
  const projection = useMemo((): ProjectionYear[] => {
    const years: ProjectionYear[] = [];
    
    for (let year = 0; year <= 10; year++) {
      // Assume gradual improvements and sequestration growth
      const yieldImprovement = 1 + (year * 0.01); // 1% annual yield improvement
      const efficiencyImprovement = 1 - (year * 0.02); // 2% annual efficiency gain
      const sequestrationGrowth = year === 0 ? 0 : Math.min(year * 0.15, 1); // Sequestration ramps up
      
      const projectedEmissions = totalFarmEmissions * efficiencyImprovement;
      const projectedSequestration = sequestration.totalSequestration * sequestrationGrowth;
      const projectedNet = projectedEmissions - projectedSequestration;
      
      years.push({
        year: 2025 + year,
        grossEmissions: projectedEmissions,
        sequestration: projectedSequestration,
        netEmissions: projectedNet,
        production: totalFarmProduction * yieldImprovement,
        intensity: projectedNet / (totalFarmProduction * yieldImprovement)
      });
    }
    
    return years;
  }, [totalFarmEmissions, sequestration.totalSequestration, totalFarmProduction]);
  
  const maxEmissions = Math.max(...projection.map(p => p.grossEmissions));
  const minEmissions = Math.min(...projection.map(p => p.netEmissions));
  const range = maxEmissions - minEmissions;
  const padding = range * 0.1;
  
  const yMax = maxEmissions + padding;
  const yMin = Math.min(0, minEmissions - padding);
  
  const scaleY = (value: number) => 320 - ((value - yMin) / (yMax - yMin)) * 280;
  const scaleX = (index: number) => 60 + (index / (projection.length - 1)) * 600;
  
  const carbonNeutralYear = projection.findIndex(p => p.netEmissions <= 0);
  const yearsToNeutral = carbonNeutralYear === -1 ? 
    Math.ceil(projection[0].netEmissions / (sequestration.totalSequestration / 10)) : 
    carbonNeutralYear;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <LineChart className="mr-2 text-green-600" size={20} />
        10-Year Net Carbon Glide Path
      </h2>
      
      <div className="relative" style={{ height: '400px' }}>
        <svg width="100%" height="360" viewBox="0 0 700 360" preserveAspectRatio="xMidYMid meet">
          {/* Grid Background */}
          <rect x="60" y="30" width="600" height="290" fill="#f9fafb" rx="4" />
          
          {/* Zero line if in range */}
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
          
          {/* Area fill between gross and net emissions */}
          <path
            d={`
              M ${projection.map((p, i) => `${scaleX(i)},${scaleY(p.grossEmissions)}`).join(' L ')}
              L ${projection.slice().reverse().map((p, i) => `${scaleX(projection.length - 1 - i)},${scaleY(p.netEmissions)}`).join(' L ')}
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
            points={projection.map((p, i) => `${scaleX(i)},${scaleY(p.grossEmissions)}`).join(' ')}
          />
          
          {/* Net Emissions Line */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={projection.map((p, i) => `${scaleX(i)},${scaleY(p.netEmissions)}`).join(' ')}
          />
          
          {/* Data Points */}
          {projection.map((p, i) => {
            const x = scaleX(i);
            return (
              <g key={i}>
                <circle cx={x} cy={scaleY(p.grossEmissions)} r="4" fill="white" stroke="#DC2626" strokeWidth="2" />
                <circle cx={x} cy={scaleY(p.netEmissions)} r="4" fill="white" stroke="#10B981" strokeWidth="2" />
                
                {/* Carbon neutral achievement marker */}
                {p.netEmissions <= 0 && i > 0 && projection[i-1].netEmissions > 0 && (
                  <g>
                    <circle cx={x} cy={scaleY(0)} r="8" fill="#10B981" />
                    <text x={x} y={scaleY(0) + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                      ✓
                    </text>
                    <text x={x} y={scaleY(0) - 15} textAnchor="middle" fontSize="9" fill="#10B981" fontWeight="bold">
                      Carbon Neutral
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {projection.map((p, i) => {
            const x = scaleX(i);
            return (
              <text key={i} x={x} y="340" textAnchor="middle" fontSize="11" fill="#6b7280">
                {p.year}
              </text>
            );
          })}
          
          {/* Y-axis title */}
          <text x="20" y="175" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="500" transform="rotate(-90 20 175)">
            Emissions (t CO₂e/year)
          </text>
          
          {/* Chart annotations */}
          <text x="360" y="15" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="600">
            Path to Net Zero: {projection[0].netEmissions <= 0 ? 'Achieved!' : `${yearsToNeutral} years at current rate`}
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
      
      {/* Carbon Credits Potential */}
      <div className="bg-green-50 p-4 rounded-lg mt-6">
        <h4 className="text-sm font-semibold text-green-800 mb-3">Carbon Credit Potential</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-green-700">Annual Sequestration</div>
            <div className="text-xl font-bold text-green-800">
              {sequestration.totalSequestration.toFixed(0)} t CO₂e
            </div>
          </div>
          <div>
            <div className="text-xs text-green-700">Value @ £25/tonne</div>
            <div className="text-xl font-bold text-green-800">
              £{(sequestration.totalSequestration * 25).toFixed(0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-green-700">10-Year Value</div>
            <div className="text-xl font-bold text-green-800">
              £{(sequestration.totalSequestration * 25 * 10).toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};