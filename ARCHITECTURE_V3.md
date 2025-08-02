# GHG WHAT-IF Tool - Architecture v3

## Overview
Version 3 introduces Nitrogen Use Efficiency (NUE) integration into the Lifetime Methane Efficiency (LME) calculations, creating a more comprehensive sustainability metric.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            GHG WHAT-IF Tool v3                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐         ┌──────────────┐         ┌────────────────┐  │
│  │   App.tsx   │────────▶│ ViewContext  │────────▶│  Dashboards    │  │
│  │             │         │              │         │                │  │
│  │ - Providers │         │ - activeTab  │         │ - Basic        │  │
│  │ - Routing  │         │ - setTab     │         │ - Farm         │  │
│  └─────────────┘         └──────────────┘         │ - Heifer       │  │
│                                                   │ - Sequestration│  │
│                                                   │ - Effectiveness│  │
│                                                   │ - Scenarios    │  │
│                                                   └────────────────┘  │
│                                                           │            │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                        State Management                          │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │                                                                 │  │
│  │  ┌──────────────┐    ┌───────────────────┐    ┌─────────────┐ │  │
│  │  │ FarmContext  │───▶│ useDashboardState │───▶│   useNue    │ │  │
│  │  │  (Zustand)   │    │                   │    │   (NEW)     │ │  │
│  │  │              │    │ - parameters     │    │             │ │  │
│  │  │ - parameters │    │ - calculations   │    │ - nue %     │ │  │
│  │  │ - feedQuality│    │ - emissions      │    │ - category  │ │  │
│  │  │   (NEW)      │    │ - lme           │    └─────────────┘ │  │
│  │  │ - actions    │    │ - nue (NEW)     │                     │  │
│  │  └──────────────┘    └───────────────────┘                     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                         Calculations                             │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │                                                                 │  │
│  │  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐  │  │
│  │  │  Emissions  │    │     LME      │    │   LME + NUE      │  │  │
│  │  │             │    │              │    │     (NEW)        │  │  │
│  │  │ - Enteric   │    │ - Lifetime   │    │                  │  │  │
│  │  │ - Manure    │    │   Production │    │ lmeNue = lme ×   │  │  │
│  │  │ - Feed      │    │ - Lifetime   │    │          (nue/100)│  │  │
│  │  │ - Fertility │    │   Emissions  │    │                  │  │  │
│  │  └─────────────┘    └──────────────┘    └──────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                           Exports                                │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │                                                                 │  │
│  │  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐  │  │
│  │  │  CSV Export │    │  PDF Report  │    │   API Response   │  │  │
│  │  │             │    │              │    │                  │  │  │
│  │  │ + nue       │    │ + NUE gauge  │    │ + /nue endpoint │  │  │
│  │  │ + lmeRaw    │    │ + Feed recs  │    │ + lmeNueAdjusted│  │  │
│  │  │ + lmeNue    │    │ + v3 stamp   │    │                  │  │  │
│  │  └─────────────┘    └──────────────┘    └──────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
src/
├── App.tsx                     # Main app with lazy loading
├── context/
│   ├── FarmContext.tsx        # Zustand store + feed parameters
│   └── ViewContext.tsx        # Tab navigation state
├── hooks/
│   ├── useCalculations.ts     # Memoized calculations
│   ├── useDashboardState.ts   # Dashboard data aggregation
│   └── useNue.ts             # NEW: NUE calculations
├── lib/
│   └── calculations/
│       ├── emissions.ts       # Core emissions with fertility
│       ├── lme.ts            # LME calculations
│       ├── lmePlus.ts        # NEW: NUE-adjusted LME
│       └── nue.ts            # NEW: Nitrogen efficiency
├── dashboards/
│   ├── BasicDashboard.tsx    # + Feed tuning card
│   ├── EffectivenessDashboard.tsx # + NUE display
│   └── ScenarioDashboard.tsx # + Feed practices
└── components/
    ├── FeedTuning.tsx        # NEW: Feed parameter controls
    └── NueIndicator.tsx      # NEW: NUE gauge component
```

## Data Flow v3

1. **User Input** → FarmContext (including new feedQuality parameter)
2. **State Change** → useDashboardState recalculates
3. **NUE Hook** → Calculates nitrogen efficiency from parameters
4. **LME+ Calculation** → Combines LME with NUE multiplier
5. **Dashboard Update** → Shows both raw and adjusted metrics
6. **Export** → Includes all v3 fields

## Key Changes from v2

### New Parameters
- `feedQuality`: 1-10 scale for feed digestibility
- Restored direct control over feed parameters

### New Calculations
- **NUE**: `(Milk N output / Total N applied) × 100`
- **LME+NUE**: `LME × (NUE / 100)`

### New UI Components
- Feed Tuning card in BasicDashboard
- Dual LME display in EffectivenessDashboard
- NUE indicator with color coding
- Feed practices in Scenario Builder

### Export Changes
- CSV columns: Added `nue`, `lmeRaw`, `lmeNueAdjusted`
- PDF report: Added NUE gauge and feed recommendations
- API: New `/nue` field in response

## Performance Considerations

- NUE calculation is O(1) - simple arithmetic
- No additional API calls required
- Memoization prevents unnecessary recalculation
- Feed parameter changes trigger targeted updates

## Migration Guide

1. **Database**: No schema changes required
2. **API**: Additive changes only (backwards compatible)
3. **UI**: Feature flag for gradual rollout
4. **Exports**: Version detection for format selection

## Testing Strategy

- Unit tests for NUE calculations
- Integration tests for LME+NUE
- E2E tests for feed parameter flows
- Performance benchmarks (target: <100ms recalc)