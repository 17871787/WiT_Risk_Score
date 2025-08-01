# GHG WHAT-IF Tool - Next Phase Roadmap

## Overview
Transform the existing prototype into a three-layer journey: **Measure → Model → Products**

## Quick Win Implemented ✅
- **Scenarios Tab**: Toggle practices to see real-time impact
- **Comparison View**: Side-by-side baseline vs scenario metrics
- **Practice Library**: 6 pre-configured interventions with instant feedback

## Three-Layer Journey

### Layer 1: Measure
**Goal**: "Give me a rock-solid baseline with zero faff"

**Features to Add**:
- [ ] Data connectors (OAuth to NMR, BPS/SAF XML)
- [ ] CSV drag-and-drop import
- [ ] Validation dashboard with completeness flags
- [ ] Auto-import from milk recording APIs

**Effort**: 2-3 sprints

### Layer 2: Model  
**Goal**: "Show me real-world levers, not just sliders"

**Features to Add**:
- [x] Practice library (basic version implemented)
- [ ] Scenario comparison (basic version implemented, needs enhancement)
- [ ] Investment modules with capex/ROI
- [ ] Multi-scenario management
- [ ] Export scenario reports

**Effort**: 3 sprints

### Layer 3: Products
**Goal**: "OK, what will Barclays fund & at what rate?"

**Features to Add**:
- [ ] Dynamic product catalogue API integration
- [ ] Eligibility badging based on emissions reduction
- [ ] Pre-filled enquiry forms
- [ ] Product recommendation engine
- [ ] Direct RM contact integration

**Effort**: 1-2 sprints (once Barclays API ready)

## Technical Improvements Needed

### Sprint 0: Tech Debt & Foundation
- [ ] Migrate remaining constants to `/constants`
- [ ] Add scenario state management (snapshot/restore)
- [ ] Create investment calculation engine
- [ ] Unit test practice library
- [ ] Add analytics tracking

### Data Structure: Practice Library
```typescript
interface Practice {
  id: string;
  category: 'feed' | 'manure' | 'energy' | 'sequestration';
  name: string;
  description: string;
  
  // Financial
  capex: number;
  opex: number;
  lifetime: number;
  
  // Impact functions
  emissionDelta: (state: FarmParameters) => number;
  costDelta: (state: FarmParameters) => number;
  
  // Constraints
  prerequisites?: string[];
  incompatibleWith?: string[];
}
```

### Data Structure: Investment Module
```typescript
interface Investment {
  id: string;
  name: string;
  capex: number;
  lifetime: number;
  annualOpex: number;
  
  // Impact calculations
  emissionReduction: (state: FarmParameters) => number;
  revenueImpact?: (state: FarmParameters) => number;
  
  // Financing
  eligibleProducts: string[];
  grantAvailable: boolean;
  grantPercentage?: number;
}
```

### Data Structure: Product Rules
```typescript
interface ProductRule {
  id: string;
  productName: string;
  provider: 'Barclays' | 'Other';
  
  // Eligibility
  minEmissionCut: number;  // percentage
  maxLoanAmount: number;
  eligiblePractices?: string[];
  
  // Pricing
  baseRate: number;
  greenDiscount: number;
  riskAdjustment: (risk: RiskScore) => number;
}
```

## Implementation Priority

### Phase 1: Enhanced Modeling (Current Sprint)
1. ✅ Basic scenario builder
2. ✅ Side-by-side comparison
3. [ ] Scenario save/load functionality
4. [ ] PDF export with charts
5. [ ] Investment ROI calculator

### Phase 2: Data Integration
1. [ ] CSV import wizard
2. [ ] Data validation UI
3. [ ] Historical data tracking
4. [ ] Baseline snapshot management

### Phase 3: Financial Products
1. [ ] Mock product API
2. [ ] Eligibility engine
3. [ ] Application pre-fill
4. [ ] Product comparison matrix

## Success Metrics
- **Measure**: 80% data completeness in <5 minutes
- **Model**: Average 3+ practices tested per session
- **Products**: 50% of scenarios lead to product enquiry

## Analytics to Track
```javascript
// Key events
track('practice_toggled', { practiceId, enabled });
track('scenario_compared', { baselineEmissions, scenarioEmissions });
track('product_viewed', { productId, eligibility });
track('enquiry_started', { loanAmount, riskScore, practices });
```

## Next Steps
1. Review and prioritize practice library additions
2. Design investment module UI
3. Define Barclays API requirements
4. Plan user testing sessions

---

*Last Updated: August 2025*