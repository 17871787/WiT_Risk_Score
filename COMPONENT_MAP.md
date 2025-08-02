# Component Map - GHG WHAT-IF Tool

## 🗺️ Complete Component Hierarchy

```
App.tsx
├── ViewProvider (context/ViewContext.tsx)
├── Header (components/Header.tsx)
│   └── RiskScoreBadge (components/RiskScoreBadge.tsx)
├── Sidebar (components/Sidebar.tsx)
│   └── OverflowTabRow (components/OverflowTabRow.tsx)
└── Dashboard Router (lazy loaded)
    ├── BasicDashboard (dashboards/BasicDashboard.tsx)
    │   ├── LoanCalculator (components/LoanCalculator.tsx)
    │   ├── FeedTuning (components/FeedTuning.tsx) [V3]
    │   ├── CostBreakdown (components/charts/CostBreakdown.tsx)
    │   ├── PerformanceMetrics (components/charts/PerformanceMetrics.tsx)
    │   └── FarmImpactV2 (components/charts/FarmImpactV2.tsx) [V4]
    │
    ├── FarmDashboard (dashboards/FarmDashboard.tsx)
    │   ├── FarmParameters (components/parameters/FarmParameters.tsx)
    │   ├── FarmSummary (components/FarmSummary.tsx)
    │   └── LMEDisplay (components/charts/LMEDisplay.tsx)
    │
    ├── HeiferDashboard (dashboards/HeiferDashboard.tsx)
    │   └── HeiferParameters (components/parameters/HeiferParameters.tsx)
    │
    ├── SequestrationDashboard (dashboards/SequestrationDashboard.tsx)
    │   ├── SequestrationParameters (components/parameters/SequestrationParameters.tsx)
    │   └── NetCarbonProjectionV2 (components/charts/NetCarbonProjectionV2.tsx) [V4]
    │
    ├── EffectivenessDashboard (dashboards/EffectivenessDashboard.tsx)
    │   ├── EffectivenessDisplay (components/EffectivenessDisplay.tsx)
    │   ├── NUEDisplay (components/charts/NUEDisplay.tsx) [V3]
    │   └── LMEPlusDisplay (components/charts/LMEPlusDisplay.tsx) [V3]
    │
    └── ScenarioDashboard (dashboards/ScenarioDashboard.tsx)
        ├── ScenarioBuilder (components/scenarios/ScenarioBuilder.tsx)
        └── ScenarioComparison (components/scenarios/ScenarioComparison.tsx)
```

## 📊 Component Details

### Core Layout Components

| Component | Location | Purpose | Dependencies |
|-----------|----------|---------|--------------|
| App | src/App.tsx | Root component, routing | ViewContext, all dashboards |
| Header | src/components/Header.tsx | Top navigation bar | RiskScoreBadge, useCalculations |
| Sidebar | src/components/Sidebar.tsx | Navigation tabs | ViewContext, OverflowTabRow |
| DashboardLoading | src/components/DashboardLoading.tsx | Loading state | None |

### Dashboard Components

| Dashboard | Key Features | Version Added |
|-----------|--------------|---------------|
| BasicDashboard | Overview, loans, feed tuning | V1, enhanced V3-V4 |
| FarmDashboard | Detailed parameters, LME | V1 |
| HeiferDashboard | Heifer management | V1 |
| SequestrationDashboard | Carbon planning, glide path | V1, enhanced V4 |
| EffectivenessDashboard | LME, NUE, combined metrics | V1, enhanced V3 |
| ScenarioDashboard | What-if scenarios | V2 |

### Chart Components

| Component | Location | Displays | Version |
|-----------|----------|----------|---------|
| CostBreakdown | charts/CostBreakdown.tsx | Pie chart of costs | V1 |
| PerformanceMetrics | charts/PerformanceMetrics.tsx | Key performance indicators | V1 |
| FarmImpact | charts/FarmImpact.tsx | Total emissions (original) | V1 |
| FarmImpactV2 | charts/FarmImpactV2.tsx | Emissions + TM metrics | V4 |
| LMEDisplay | charts/LMEDisplay.tsx | Lifetime methane efficiency | V1 |
| NUEDisplay | charts/NUEDisplay.tsx | Nitrogen use efficiency | V3 |
| LMEPlusDisplay | charts/LMEPlusDisplay.tsx | Combined sustainability | V3 |
| NetCarbonProjection | charts/NetCarbonProjection.tsx | 10-year projection (original) | V1 |
| NetCarbonProjectionV2 | charts/NetCarbonProjectionV2.tsx | Projection + TM line | V4 |

### Parameter Components

| Component | Location | Manages | Inputs |
|-----------|----------|---------|--------|
| FarmParameters | parameters/FarmParameters.tsx | Core farm settings | 15+ sliders |
| HeiferParameters | parameters/HeiferParameters.tsx | Heifer metrics | 8 parameters |
| SequestrationParameters | parameters/SequestrationParameters.tsx | Carbon capture | 7 parameters |
| BasicParameters | parameters/BasicParameters.tsx | Basic settings (unused) | N/A |

### Feature Components

| Component | Purpose | Key Features | Version |
|-----------|---------|--------------|---------|
| LoanCalculator | Financial planning | Risk-based rates | V2 |
| FeedTuning | Feed optimization | Quality, carbon, amount | V3 |
| ScenarioBuilder | What-if analysis | 6 practice toggles | V2 |
| ScenarioComparison | Side-by-side view | Baseline vs scenario | V2 |
| EffectivenessDisplay | LME details | Breakdown, factors | V1 |

### UI Components

| Component | Location | Purpose | Usage |
|-----------|----------|---------|-------|
| Slider | ui/Slider.tsx | Numeric input | All parameters |
| Select | ui/Select.tsx | Dropdown selection | Season, system type |
| MetricCard | ui/MetricCard.tsx | Metric display | Dashboard cards |
| OverflowTabRow | components/OverflowTabRow.tsx | Tab overflow menu | Sidebar |
| RiskScoreBadge | components/RiskScoreBadge.tsx | Risk indicator | Header |

## 🔗 Component Dependencies

### Most Used Components
1. **Slider** - Used in all parameter components
2. **useCalculations** - Used by most display components
3. **useFarmStore** - Global state access
4. **MetricCard** - Standard metric display

### Component Coupling
- **Tightly Coupled**: Dashboards ↔ Their specific parameter components
- **Loosely Coupled**: UI components ↔ Feature components
- **Shared Dependencies**: All components → FarmContext (Zustand)

## 🎨 Component Patterns

### 1. **Dashboard Pattern**
```typescript
const Dashboard: React.FC<DashboardProps> = ({ state, actions }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Components */}
      </div>
    </div>
  );
};
```

### 2. **Parameter Component Pattern**
```typescript
const Parameters: React.FC = () => {
  const { parameters, updateParameter } = useFarmStore();
  return (
    <div className="space-y-4">
      <Slider
        value={parameters.someValue}
        onChange={(value) => updateParameter('someValue', value)}
        // ...props
      />
    </div>
  );
};
```

### 3. **Chart Component Pattern**
```typescript
const Chart: React.FC = () => {
  const data = useCalculations();
  const chartData = useMemo(() => processData(data), [data]);
  return <ResponsiveContainer>{/* Recharts */}</ResponsiveContainer>;
};
```

## 📁 File Organization

```
components/
├── charts/          # All visualization components
├── chat/            # Chat interface (future)
├── financing/       # Financial components (future)
├── parameters/      # Input parameter groups
├── scenarios/       # Scenario planning
└── ui/              # Reusable UI elements
```

## 🚀 Component Loading Strategy

1. **Eager Loaded**: App, Header, Sidebar, UI components
2. **Lazy Loaded**: All dashboards and their children
3. **Code Split**: Each dashboard is a separate chunk

## 📊 Component Metrics

- **Total Components**: ~40
- **Lazy Loaded**: 6 dashboards
- **Reusable UI**: 5 components
- **Chart Components**: 9
- **Parameter Groups**: 4
- **Version-specific**: 8 (V3-V4 additions)

---

*This map represents the complete component structure as of V4 Sprint 1*