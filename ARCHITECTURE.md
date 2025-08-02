# GHG WHAT-IF Tool - Architecture Documentation

## 🏗️ Project Overview

The GHG WHAT-IF Tool is a React/TypeScript application for dairy farm greenhouse gas optimization and carbon footprint analysis. It features a modular architecture with lazy-loaded dashboards, real-time calculations, and comprehensive sustainability metrics.

## 📁 Project Structure

```
ghg-tool/
├── src/
│   ├── components/           # UI components
│   │   ├── charts/          # Data visualization components
│   │   ├── chat/            # Chat interface components
│   │   ├── financing/       # Financial calculators
│   │   ├── parameters/      # Parameter input components
│   │   ├── scenarios/       # Scenario planning components
│   │   └── ui/              # Reusable UI elements
│   ├── constants/           # Application constants
│   ├── context/             # State management (Zustand)
│   ├── dashboards/          # Dashboard views (lazy loaded)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Business logic
│   │   ├── calculations/    # Core calculation engines
│   │   └── utils/           # Utility functions
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── dist/                    # Build output
├── public/                  # Static assets
└── scripts/                 # Build and test scripts
```

## 🏛️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                                │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  ViewProvider │  │    Header    │  │     Sidebar        │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │   Dashboard Router        │
                    │   (Lazy Loaded)           │
                    └─────────────┬─────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐  ┌────────────▼─────────┐  ┌───────────▼────────┐
│BasicDashboard  │  │EffectivenessDashboard│  │SequestrationDash.  │
│                │  │                       │  │                    │
│ - FarmImpactV2 │  │ - LMEDisplay         │  │ - NetCarbonProjV2  │
│ - FeedTuning   │  │ - NUEDisplay         │  │ - Parameters       │
│ - LoanCalc     │  │ - LMEPlusDisplay     │  │                    │
│ - Metrics      │  │                       │  │                    │
└────────────────┘  └───────────────────────┘  └────────────────────┘
        │                         │                         │
        └─────────────────────────┴─────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │    Zustand Store          │
                    │   (FarmContext)           │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Calculation Engine      │
                    │   - Emissions             │
                    │   - NUE                   │
                    │   - LME                   │
                    │   - Risk Scoring          │
                    │   - Carbon Floor (TM)     │
                    └───────────────────────────┘
```

## 🔧 Core Technologies

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Key Components

### 1. **State Management (Zustand)**

```typescript
// src/context/FarmContext.tsx
interface FarmState {
  parameters: FarmParameters;
  loanAmount: number;
  loanTerm: number;
  updateParameter: <K extends keyof FarmParameters>(key: K, value: FarmParameters[K]) => void;
  updateMultipleParameters: (updates: Partial<FarmParameters>) => void;
  updateLoanParameter: (key: 'loanAmount' | 'loanTerm', value: number) => void;
  resetParameters: () => void;
}
```

### 2. **Dashboard Architecture**

Each dashboard is lazy-loaded and receives standardized props:

```typescript
interface DashboardProps {
  state: DashboardState;
  actions: DashboardActions;
}
```

**Available Dashboards:**
- `BasicDashboard` - Main overview with key metrics
- `FarmDashboard` - Detailed farm parameters
- `HeiferDashboard` - Heifer management
- `SequestrationDashboard` - Carbon sequestration planning
- `EffectivenessDashboard` - LME, NUE, and combined metrics
- `ScenarioDashboard` - Scenario planning and comparison

### 3. **Calculation Engines**

Located in `src/lib/calculations/`:

- **emissions.ts** - Core GHG emission calculations
- **lme.ts** - Lifetime Methane Efficiency
- **nue.ts** - Nitrogen Use Efficiency (V3)
- **lmePlus.ts** - Combined LME+NUE metric (V3)
- **carbonFloor.ts** - Theoretical Minimum calculations (V4)
- **risk.ts** - Risk scoring based on emissions + loan
- **sequestration.ts** - Carbon sequestration calculations
- **economics.ts** - Cost and profit calculations

### 4. **Custom Hooks**

- **useCalculations** - Main calculation orchestrator
- **useGlidePath** - 10-year carbon projection (V4)
- **useNue** - Nitrogen efficiency calculations (V3)
- **useDashboardState** - Dashboard state management
- **useEmissions** - Emission calculations
- **useLME** - LME calculations

## 🔄 Data Flow

1. **User Input** → Components update Zustand store via `updateParameter`
2. **Store Update** → Triggers recalculation in hooks
3. **Calculations** → Memoized results prevent unnecessary recomputation
4. **UI Update** → Components re-render with new values

## 🚀 Performance Optimizations

1. **Code Splitting**: All dashboards are lazy-loaded
2. **Memoization**: Heavy calculations use `useMemo`
3. **Suspense Boundaries**: Smooth loading states
4. **Tree Shaking**: Vite removes unused code
5. **Component Optimization**: Small, focused components

## 🔒 Type Safety

The project uses comprehensive TypeScript types:

```typescript
// Core parameter types
export interface FarmParameters {
  herdSize: number;
  season: Season;
  systemType: SystemType;
  feedQuality: number;
  // ... 40+ parameters
}

// Calculation result types
export interface EmissionBreakdown {
  entericEmissions: number;
  manureEmissions: number;
  feedEmissions: number;
  // ...
}
```

## 🧪 Testing Strategy

- Unit tests for calculation functions
- Integration tests for state management
- Lighthouse CI for performance monitoring
- TypeScript for compile-time type checking

## 🌐 Deployment

- **Platform**: Vercel
- **URL**: https://ghg-tool-five.vercel.app
- **CI/CD**: GitHub Actions + Vercel integration
- **Environment**: Production builds optimized by Vite

## 📊 Key Features by Version

### V1-V2 (Completed)
- Core emissions calculations
- Risk scoring
- Loan calculator
- Scenario builder
- Dashboard architecture
- Performance optimizations

### V3 (Completed)
- Feed quality parameters
- NUE (Nitrogen Use Efficiency)
- LME+NUE combined metric
- Enhanced effectiveness dashboard

### V4 (In Progress)
- Theoretical Minimum (TM)
- Net-Carbon Glide Path 2.0
- Reduction pathway logic (Sprint 2)
- Green financing module (Sprint 3)
- Scenario-financing linkage (Sprint 4)

## 🔌 External Integrations

- **Vercel Analytics** (if enabled)
- **Lighthouse CI** for performance tracking
- **GitHub Actions** for automated testing

## 📝 Configuration Files

- **vite.config.ts** - Build configuration
- **tsconfig.json** - TypeScript configuration
- **tailwind.config.js** - Tailwind CSS setup
- **vercel.json** - Deployment configuration
- **.lighthouse-ci.json** - Performance monitoring

## 🚦 Environment Variables

Currently no environment variables are required. All constants are in the codebase.

## 🔐 Security Considerations

- No sensitive data stored client-side
- All calculations happen in the browser
- No external API calls (except deployment)
- Input validation on all user inputs
- Safe division operations prevent crashes

## 📈 Scalability

The architecture supports:
- Adding new dashboards (lazy-loaded)
- Extending calculation engines
- Adding new parameter types
- Implementing new visualization components
- Integrating external data sources

## 🛠️ Development Workflow

1. **Local Development**: `npm run dev`
2. **Type Checking**: `npm run type-check`
3. **Build**: `npm run build`
4. **Deploy**: `vercel --prod`
5. **Test**: `npm test`

## 📚 Key Directories Explained

### `/src/components/charts/`
Visual components for data display (emissions, projections, metrics)

### `/src/lib/calculations/`
Pure functions for all mathematical operations, no React dependencies

### `/src/hooks/`
React hooks that connect calculations to components

### `/src/dashboards/`
Top-level views that compose multiple components

### `/src/context/`
Global state management with Zustand

### `/src/types/`
All TypeScript interfaces and types

## 🎯 Design Principles

1. **Separation of Concerns**: UI, state, and logic are separated
2. **Immutability**: State updates create new objects
3. **Type Safety**: Full TypeScript coverage
4. **Performance**: Memoization and lazy loading
5. **Modularity**: Small, focused components
6. **Testability**: Pure functions for calculations

---

*Last Updated: August 2025*
*Version: 4.0-dev*