# Dashboard Migration Plan

## Overview
Migrate existing JSX components into the new dashboard architecture with lazy loading for optimal performance.

## Migration Map

### BasicDashboard.tsx
**Move from:** App.tsx default view
- CostBreakdown component
- PerformanceMetrics component
- FarmImpact component
- LoanCalculator (already in main grid)

### EffectivenessDashboard.tsx
**Move from:** EffectivenessDisplay component
- LME score panel
- Benchmark comparisons
- Improvement strategies
- Quick impact calculator

### FarmDashboard.tsx
**Move from:** FarmParameters component view
- Production metrics grid
- Herd cost analysis
- Milk yield feedback
- **Add:** Per-cow vs total toggle

### HeiferDashboard.tsx
**Move from:** HeiferParameters component view
- Calving age gauge
- Retention/culling bars
- **Add:** Growth curve chart

### SequestrationDashboard.tsx
**Move from:** SequestrationParameters & NetCarbonProjection
- Carbon glide-path SVG
- Sequestration options table
- 10-year projection
- **Add:** Credit revenue calculator

### ScenarioDashboard.tsx
**Already has:** ScenarioBuilder
**Move from:** ScenarioComparison component
- Practice toggles (keep existing)
- Comparison table
- **Add:** Save/load scenarios

## Implementation Steps

### 1. Setup Lazy Loading
```typescript
// In App.tsx
import { lazy, Suspense } from 'react';

const BasicDashboard = lazy(() => import('./dashboards/BasicDashboard'));
const FarmDashboard = lazy(() => import('./dashboards/FarmDashboard'));
// ... etc

// Wrap in Suspense
<Suspense fallback={<DashboardLoading />}>
  <ActiveDashboard state={state} actions={actions} />
</Suspense>
```

### 2. Move Components (Per Dashboard)
```typescript
// Example: BasicDashboard.tsx
import { CostBreakdown } from '../components/charts/CostBreakdown';
import { PerformanceMetrics } from '../components/charts/PerformanceMetrics';
import { FarmImpact } from '../components/charts/FarmImpact';
import { LoanCalculator } from '../components/LoanCalculator';

export default function BasicDashboard({ state, actions }: DashboardProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <LoanCalculator />
        </div>
        <CostBreakdown />
        <PerformanceMetrics />
        <FarmImpact />
      </div>
    </div>
  );
}
```

### 3. Update Imports
- Remove chart imports from App.tsx
- Update dashboard barrel exports
- Add loading component

### 4. Clean Up
- Delete old conditional rendering in App.tsx
- Remove unused imports
- Verify no orphaned components

## Performance Targets
- Current: 193KB gzipped
- Target: ~120KB gzipped
- Method: Lazy load Recharts per dashboard

## Testing Checklist
- [x] All tabs load without errors
- [x] Charts render correctly
- [x] State updates propagate
- [x] No console warnings
- [x] Bundle size reduced
- [x] Loading states work

## Migration Status
- [x] Lazy loading implemented in App.tsx
- [x] All dashboards converted to default exports
- [x] BasicDashboard populated with components
- [x] EffectivenessDashboard populated with LME display
- [x] FarmDashboard includes parameter forms
- [x] HeiferDashboard includes metrics and parameters
- [x] SequestrationDashboard includes projection chart
- [x] ScenarioDashboard includes builder and comparison
- [x] Sidebar content removed (now in dashboards)
- [x] Build successful with all TypeScript checks passing

## Order of Migration
1. BasicDashboard + EffectivenessDashboard (first pass)
2. FarmDashboard + HeiferDashboard (similar content)
3. SequestrationDashboard + ScenarioDashboard (complex charts)

---
*Ready for implementation post-compact*