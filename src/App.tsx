import React, { lazy, Suspense } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardLoading } from './components/DashboardLoading';
import { ViewProvider, useView, TabType } from './context/ViewContext';
import { useDashboardState, useDashboardActions, DashboardProps } from './hooks/useDashboardState';
import './styles/globals.css';

// Lazy load dashboard components
const BasicDashboard = lazy(() => import('./dashboards/BasicDashboard'));
const FarmDashboard = lazy(() => import('./dashboards/FarmDashboard'));
const HeiferDashboard = lazy(() => import('./dashboards/HeiferDashboard'));
const SequestrationDashboard = lazy(() => import('./dashboards/SequestrationDashboard'));
const EffectivenessDashboard = lazy(() => import('./dashboards/EffectivenessDashboard'));
const ScenarioDashboard = lazy(() => import('./dashboards/ScenarioDashboard'));

// Dashboard mapping
const DASHBOARD_MAP: Record<TabType, React.FC<DashboardProps>> = {
  basic: BasicDashboard,
  farm: FarmDashboard,
  heifer: HeiferDashboard,
  sequestration: SequestrationDashboard,
  effectiveness: EffectivenessDashboard,
  scenarios: ScenarioDashboard,
};

// Main app content that uses the view context
function AppContent() {
  const { activeTab } = useView();
  const state = useDashboardState();
  const actions = useDashboardActions();
  
  const ActiveDashboard = DASHBOARD_MAP[activeTab] || BasicDashboard;
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <Header />
        <Suspense fallback={<DashboardLoading />}>
          <ActiveDashboard state={state} actions={actions} />
        </Suspense>
      </div>
    </div>
  );
}

// Root app component with providers
function App() {
  return (
    <ViewProvider>
      <AppContent />
    </ViewProvider>
  );
}

export default App;