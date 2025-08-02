# Calculation Map - GHG WHAT-IF Tool

## 🧮 Calculation Engine Overview

All calculations are pure functions located in `/src/lib/calculations/`. Each calculation module exports functions that take parameters and return results without side effects.

## 📊 Core Calculations

### 1. **Emissions Calculations** (`emissions.ts`)

| Function | Formula | Key Factors |
|----------|---------|-------------|
| `calculateEmissions()` | Total = Enteric + Manure + Feed + Deforestation + Nitrogen | All emission sources |
| `calculatePerformancePenalty()` | 1 + Σ(penalties), max 40% | Poor KPIs increase emissions |
| `getSeasonalAdjustments()` | Season-specific multipliers | Spring/Winter higher |
| `calculateEntericEmissions()` | BASE_ENTERIC + (feed × FEED_MULTIPLIER) | Feed quality impact |

**Key Constants:**
- BASE_ENTERIC: 2400 kg CO₂e/cow/year
- FEED_MULTIPLIER: 35 kg CO₂e per kg concentrate
- Performance penalties: 10-15% per poor metric

### 2. **LME Calculations** (`lme.ts`)

| Function | Formula | Purpose |
|----------|---------|---------|
| `calculateLME()` | Lifetime Production / Lifetime Emissions | Main efficiency metric |
| `calculateLifetimeProduction()` | Σ(lactation yields) | Total milk over lifetime |
| `calculateLifetimeEmissions()` | Σ(annual emissions × time) | Total GHG over lifetime |
| `calculateDryMatterIntake()` | BASE_DMI + (yield × DMI_YIELD_FACTOR) | Feed requirements |

**Key Formula:**
```
LME = (Milk Yield × Lactations × 305 days) / 
      (Annual Emissions × Total Lifetime Days / 365)
```

### 3. **NUE Calculations** (`nue.ts`) [V3]

| Function | Formula | Purpose |
|----------|---------|---------|
| `calculateNUE()` | (N Outputs / N Inputs) × 100 | Nitrogen efficiency % |
| `calculateNInputs()` | Applied N + Feed N | Total N entering system |
| `calculateNOutputs()` | Milk Yield × 0.0055 | N leaving in milk |
| `calculateFeedNContent()` | Crude Protein / 625 | Convert protein to N |

**Key Constants:**
- MILK_N_CONTENT: 0.0055 kg N/L
- HECTARES_PER_COW: 0.5
- Protein to N: Divide by 6.25

### 4. **Carbon Floor Calculations** (`carbonFloor.ts`) [V4]

| Function | Formula | Purpose |
|----------|---------|---------|
| `theoreticalMinimum()` | Herd Size × 2000 | Biological floor |
| `percentageAboveTM()` | ((Current - TM) / TM) × 100 | Distance from minimum |
| `gapToTM()` | max(0, Current - TM) | Reduction needed |

**Basis:**
```
TM = 13g CH₄/L × 25L/day × 365 days × 28 GWP₁₀₀ 
   ≈ 2000 kg CO₂e/cow/year
```

### 5. **Risk Calculations** (`risk.ts`)

| Function | Formula | Purpose |
|----------|---------|---------|
| `calculateRiskScore()` | Base Risk + Leverage Adjustment | Financial risk |
| `getRiskCategory()` | Based on emissions intensity | Low/Medium/High |
| `calculateInterestRate()` | Base Rate - Risk Discount | Loan pricing |

**Risk Matrix:**
- Low: < 0.9 kg CO₂e/L
- Medium: 0.9 - 1.2 kg CO₂e/L  
- High: > 1.2 kg CO₂e/L

### 6. **Economic Calculations** (`economics.ts`)

| Function | Formula | Purpose |
|----------|---------|---------|
| `calculateTotalCosts()` | Feed + Labor + Vet + Other | Annual costs |
| `calculateRevenue()` | Milk Production × Price | Annual revenue |
| `calculateProfit()` | Revenue - Costs | Net profit |

**Cost Breakdown:**
- Feed: ~50% of total costs
- Labor: ~20%
- Vet/Health: ~10%
- Other: ~20%

### 7. **Sequestration Calculations** (`sequestration.ts`)

| Function | Formula | Rate |
|----------|---------|------|
| Trees | Area × 3.67 | t CO₂e/ha/year |
| Hedgerows | Length × 0.6 | t CO₂e/km/year |
| Soil Carbon | Area × 1.5 | t CO₂e/ha/year |
| Cover Crops | Area × 0.8 | t CO₂e/ha/year |
| Renewables | Capacity × 0.4 | t CO₂e/kW/year |

### 8. **Combined Metrics** (`lmePlus.ts`) [V3]

| Function | Formula | Purpose |
|----------|---------|---------|
| `calculateLMEPlus()` | LME × (NUE / 100) | Combined sustainability |
| Sustainability Score | (LME/15×50) + (NUE/150×50) | 0-100 scale |

## 🔄 Calculation Dependencies

```
Parameters
    ├── Emissions
    │   ├── Risk Score
    │   ├── LME
    │   │   └── LME+NUE
    │   └── Glide Path
    ├── NUE
    │   └── LME+NUE
    └── Economics
        └── Profit Margin
```

## 🎯 Hook Integration

Each calculation has a corresponding hook that:
1. Pulls parameters from Zustand store
2. Calls calculation functions
3. Memoizes results
4. Returns typed data

| Hook | Calculation | Returns |
|------|-------------|---------|
| `useEmissions()` | emissions.ts | EmissionBreakdown |
| `useLME()` | lme.ts | LMEResult |
| `useNue()` | nue.ts | NUEData |
| `useGlidePath()` | carbonFloor.ts + projections | GlidePathData |
| `useCalculations()` | All core calculations | Comprehensive results |

## 📈 Performance Considerations

### Calculation Complexity

| Calculation | Complexity | Memoization |
|-------------|------------|-------------|
| Emissions | O(1) | Yes |
| LME | O(n) lactations | Yes |
| NUE | O(1) | Yes |
| Glide Path | O(n) years | Yes |
| Scenarios | O(n) practices | Yes |

### Optimization Strategies

1. **Pure Functions**: No side effects, easy to test
2. **Memoization**: Prevent recalculation
3. **Selective Updates**: Only recalc affected metrics
4. **Batch Updates**: Group parameter changes

## 🧪 Testing Calculations

Each calculation module has corresponding tests:

```typescript
// Example test structure
describe('calculateEmissions', () => {
  it('should calculate base emissions correctly', () => {
    const result = calculateEmissions(mockParams);
    expect(result.totalAnnualEmissions).toBeCloseTo(expectedValue);
  });
});
```

## 📊 Validation Rules

| Parameter | Min | Max | Default |
|-----------|-----|-----|---------|
| Herd Size | 1 | 10,000 | 150 |
| Milk Yield | 1,000 | 20,000 | 8,500 |
| Feed Quality | 1 | 10 | 7 |
| Age First Calving | 18 | 36 | 24.7 |
| Nitrogen Rate | 0 | 300 | 180 |

## 🔍 Common Calculation Patterns

### 1. **Safe Division**
```typescript
safeDivide(numerator, denominator, fallback)
```

### 2. **Percentage Calculation**
```typescript
(value / total) × 100
```

### 3. **Linear Interpolation**
```typescript
base + (factor × multiplier)
```

### 4. **Clamping**
```typescript
Math.max(min, Math.min(max, value))
```

---

*This map covers all calculation modules as of V4 Sprint 1*