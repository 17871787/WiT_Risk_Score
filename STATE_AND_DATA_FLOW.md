# State Management & Data Flow - GHG WHAT-IF Tool

## 🏪 State Architecture

### Primary State Store (Zustand)

```typescript
// src/context/FarmContext.tsx
const useFarmStore = create<FarmState>((set) => ({
  // State
  parameters: FarmParameters (40+ fields),
  loanAmount: number,
  loanTerm: number,
  
  // Actions
  updateParameter: (key, value) => set(...),
  updateMultipleParameters: (updates) => set(...),
  updateLoanParameter: (key, value) => set(...),
  resetParameters: () => set(...)
}));
```

### Secondary State (ViewContext)

```typescript
// src/context/ViewContext.tsx
interface ViewContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}
```

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
│  (Slider Change, Select Change, Toggle, Button Click)           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENT ACTION                            │
│  onChange={(value) => updateParameter('feedQuality', value)}    │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ZUSTAND STORE UPDATE                        │
│  - Immutable state update                                        │
│  - Triggers re-render of subscribed components                  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        HOOKS RECALCULATE                         │
│  useCalculations() → useEmissions() → emissions.ts              │
│                   → useLME() → lme.ts                          │
│                   → useNue() → nue.ts                          │
│                   → useGlidePath() → carbonFloor.ts            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MEMOIZED RESULTS                            │
│  useMemo prevents unnecessary recalculations                     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     COMPONENT RE-RENDER                          │
│  Only components using changed data re-render                    │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 State Shape

### FarmParameters (Core State)

```typescript
{
  // Basic (7 fields)
  herdSize: 150,
  season: 'Summer',
  systemType: 'intensive',
  feedQuality: 7,
  concentrateFeed: 8.08,
  feedCost: 0.35,
  feedCarbonFootprint: 0.75,
  
  // Nutrition (3 fields)
  soyaContent: 0,
  deforestationFree: false,
  crudeProtein: 17,
  
  // Environmental (1 field)
  nitrogenRate: 180,
  
  // Production (6 fields)
  milkYield: 8500,
  avgLactations: 3.9,
  calvingInterval: 380,
  ageFirstCalving: 24.7,
  cullingAge: 6.12,
  birthweight: 40,
  
  // Management (4 fields)
  grazingMonths: 7,
  manureSystem: 'Liquid/slurry',
  landType: 'Lowland',
  forageContent: 'Mixed 15-75%',
  
  // Sequestration (7 fields)
  treePlantingHa: 0,
  hedgerowKm: 0,
  soilCarbonHa: 0,
  coverCropsHa: 0,
  renewableEnergyKw: 0,
  methaneInhibitor: false,
  improvedManure: false,
  
  // Financial (separate)
  loanAmount: 500000,
  loanTerm: 10
}
```

## 🧮 Calculation Flow

### 1. **Primary Calculations** (useCalculations hook)

```
Parameters → useCalculations() → {
  emissions: EmissionBreakdown,
  sequestration: SequestrationBreakdown,
  totalFarmEmissions: number,
  netFarmEmissions: number,
  emissionsIntensity: number,
  totalFarmProduction: number,
  totalFarmProfit: number,
  lmeResult: LMEResult,
  performanceMetrics: PerformanceMetrics
}
```

### 2. **Specialized Calculations**

```
Parameters → useNue() → {
  nue: number,
  nInputs: number,
  nOutputs: number,
  interpretation: object,
  recommendations: string[]
}

Parameters → useGlidePath() → {
  years: GlidePathYear[],
  canReachNetZero: boolean,
  canReachTM: boolean
}
```

## 🔗 Data Dependencies

### Critical Path Dependencies

1. **Emissions Calculation**
   ```
   herdSize × season × systemType × feedQuality 
   → entericEmissions → totalEmissions → emissionsIntensity
   ```

2. **LME Calculation**
   ```
   milkYield × avgLactations × ageFirstCalving 
   → lifetimeProduction → LME score
   ```

3. **NUE Calculation**
   ```
   nitrogenRate × crudeProtein × milkYield 
   → nInputs/nOutputs → NUE percentage
   ```

4. **Risk Score**
   ```
   emissionsIntensity × loanAmount 
   → riskCategory → interestRate
   ```

## 📈 Performance Optimizations

### Memoization Strategy

```typescript
// Heavy calculations are memoized
const emissions = useMemo(() => 
  calculateEmissions(parameters), 
  [parameters]
);

// Dependent calculations also memoized
const netEmissions = useMemo(() => 
  emissions.total - sequestration.total, 
  [emissions.total, sequestration.total]
);
```

### Update Batching

```typescript
// Multiple parameter updates in one action
updateMultipleParameters({
  feedQuality: 8,
  concentrateFeed: 9,
  nitrogenRate: 150
});
```

## 🎯 State Update Patterns

### 1. **Single Parameter Update**
```
User moves slider → updateParameter('milkYield', 9000) → Recalculate
```

### 2. **Scenario Application**
```
Toggle scenario → updateMultipleParameters(scenarioParams) → Batch recalculate
```

### 3. **Dashboard Switch**
```
Click tab → setActiveTab('effectiveness') → Lazy load dashboard
```

### 4. **Reset**
```
Reset button → resetParameters() → All defaults restored
```

## 🔍 State Debugging

### Key Inspection Points

1. **Store State**: `useFarmStore.getState()`
2. **Calculation Results**: Check `useCalculations()` output
3. **Render Triggers**: React DevTools Profiler
4. **Memoization**: Check dependency arrays

### Common State Issues

1. **Stale Calculations**: Missing dependencies in useMemo
2. **Excessive Renders**: Not memoizing expensive operations
3. **State Sync**: ViewContext and FarmContext mismatch

## 🏗️ State Extension Points

### Adding New Parameters

1. Add to `FarmParameters` interface
2. Add to `defaultParameters`
3. Add validation in `validateFarmParameters`
4. Create UI component with `updateParameter`

### Adding New Calculations

1. Create calculation function in `/lib/calculations/`
2. Create custom hook in `/hooks/`
3. Add to `useCalculations` if core metric
4. Memoize results

### Adding New State Slices

```typescript
// Example: Adding user preferences
interface UserPreferences {
  theme: 'light' | 'dark';
  units: 'metric' | 'imperial';
}

const usePreferencesStore = create<...>(...);
```

## 📊 State Metrics

- **Total State Fields**: 40+
- **Calculated Values**: 50+
- **Memoized Calculations**: 15+
- **Update Frequency**: ~100ms debounced
- **State Size**: ~2KB serialized

---

*This document represents the complete state management architecture as of V4*