import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoanCalculator } from './components/LoanCalculator';
import { CostBreakdown } from './components/charts/CostBreakdown';
import { PerformanceMetrics } from './components/charts/PerformanceMetrics';
import { FarmImpact } from './components/charts/FarmImpact';
import { LMEDisplay } from './components/charts/LMEDisplay';
import { NetCarbonProjection } from './components/charts/NetCarbonProjection';
import { useFarmStore } from './context/FarmContext';
import './styles/globals.css';

function App() {
  const parameters = useFarmStore(state => state.parameters);
  
  // Determine which view to show based on sidebar state
  const [mainView, setMainView] = React.useState<'default' | 'lme' | 'projection'>('default');
  
  // This would be controlled by sidebar in real implementation
  React.useEffect(() => {
    // Logic to switch views based on active tab could go here
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <Header />
        
        {mainView === 'default' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-1 lg:col-span-2">
              <LoanCalculator />
            </div>
            <CostBreakdown />
            <PerformanceMetrics />
            <FarmImpact />
            {/* Additional components would go here */}
          </div>
        )}
        
        {mainView === 'lme' && (
          <div className="grid grid-cols-1 gap-6">
            <LMEDisplay />
          </div>
        )}
        
        {mainView === 'projection' && (
          <div className="grid grid-cols-1 gap-6">
            <NetCarbonProjection />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;