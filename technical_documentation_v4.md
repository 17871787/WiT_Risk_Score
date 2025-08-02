# Technical Documentation - GHG WHAT-IF Tool (Version 4.0)

## Table of Contents
1. [Core Equations](#core-equations)
2. [V3 Features - Nitrogen Use Efficiency](#v3-features---nitrogen-use-efficiency)
3. [V4 Features - Theoretical Minimum & Pathways](#v4-features---theoretical-minimum--pathways)
4. [Conversion Formulas](#conversion-formulas)
5. [Hardcoded Constants](#hardcoded-constants)
6. [Assumptions](#assumptions)
7. [Default Values](#default-values)
8. [Validation Limits](#validation-limits)

---

## Core Equations

### 1. Emissions Calculations

#### 1.1 Enteric Methane Emissions
```
Daily Enteric = (METHANE_BASE + (DMI × METHANE_DMI_FACTOR)) × Feed_Quality_Adjustment × Seasonal_Factor

Where:
- METHANE_BASE = 8.5 kg CO₂e/day
- METHANE_DMI_FACTOR = 0.85
- Feed_Quality_Adjustment = FEED_QUALITY_BASE - (feedQuality × FEED_QUALITY_FACTOR)
- FEED_QUALITY_BASE = 1.2
- FEED_QUALITY_FACTOR = 0.03
```

#### 1.2 Dry Matter Intake (DMI) Estimation
```
DMI = (Daily_Yield × DMI_YIELD_FACTOR) + BASE_DMI

Where:
- Daily_Yield = Annual_Milk_Yield / DAYS_PER_LACTATION
- DMI_YIELD_FACTOR = 0.4
- BASE_DMI = 12
- DAYS_PER_LACTATION = 305
```

#### 1.3 Feed-Related Emissions
```
Feed_Emissions = Concentrate_Feed × 365 × Feed_Carbon_Footprint × (1 + Soya_Impact)

Where:
- Soya_Impact = (Soya_Content / 100) × SOYA_IMPACT_MULTIPLIER
- SOYA_IMPACT_MULTIPLIER = 2.5 (if not deforestation-free)
- SOYA_IMPACT_MULTIPLIER = 0 (if deforestation-free)
```

#### 1.4 Manure Emissions
```
Manure_Emissions = Base_Manure × System_Factor × Seasonal_Factor

Where:
- Base_Manure = 3.2 kg CO₂e/day
- System_Factor depends on manure system:
  - Solid: 0.8
  - Liquid/slurry: 1.0
  - Pasture: 0.3
  - Anaerobic digester: 0.4 (NEW)
  - Daily spread: 0.6
```

#### 1.5 Nitrogen Emissions
```
N2O_Emissions = (Nitrogen_Rate × HECTARES_PER_COW × N2O_EMISSION_FACTOR) / 1000

Where:
- HECTARES_PER_COW = 0.6
- N2O_EMISSION_FACTOR = 5.7 kg N₂O per kg N
- N2O to CO₂e conversion = 298
```

#### 1.6 Performance Penalties (NEW)
```
Performance_Penalty = 1 + min(0.4, Penalty_Sum)

Where Penalty_Sum includes:
- Milk Yield Penalty: (8000 - milkYield) / 8000 × 0.10 (if < 8000 L)
- Fertility Penalty: (ageFirstCalving - 24) / 24 × 0.08 (if > 24 months)
- Lactation Penalty: (4 - avgLactations) / 4 × 0.06 (if < 4)
- Calving Interval Penalty: (calvingInterval - 385) / 385 × 0.05 (if > 385 days)
- Feed Quality Penalty: (7 - feedQuality) / 7 × 0.04 (if < 7)
- System Penalty: 0.03 if extensive, 0 otherwise
```

#### 1.7 Total Annual Emissions
```
Total_Emissions = Base_Emissions × Performance_Penalty

Where Base_Emissions = (Daily_Enteric + Feed_Emissions/365 + Manure_Emissions + Electricity_Emissions) × 365 + N2O_Emissions_Annual
```

#### 1.8 Emissions Intensity
```
Emissions_Intensity = Total_Annual_Emissions / Annual_Milk_Yield
```

### 2. Lifetime Methane Efficiency (LME)

#### 2.1 LME Calculation
```
LME = (Lifetime_Production / Lifetime_Emissions) × System_Factor

Where:
- Lifetime_Production = Annual_Milk_Yield × Average_Lactations × PERSISTENCE_FACTOR
- PERSISTENCE_FACTOR = 0.94
```

#### 2.2 Lifetime Days Calculation
```
Productive_Days = Average_Lactations × DAYS_PER_LACTATION
Total_Days = (Age_First_Calving × DAYS_PER_MONTH) + (Average_Lactations × Calving_Interval)
Non_Productive_Days = Total_Days - Productive_Days
```

#### 2.3 Lifetime Emissions
```
Lifetime_Emissions = (Daily_Enteric × Productive_Days) + (Daily_Enteric × NON_PRODUCTIVE_FACTOR × Non_Productive_Days)

Where:
- NON_PRODUCTIVE_FACTOR = 0.6
```

### 3. Sequestration Calculations

#### 3.1 Tree Planting
```
Tree_Sequestration = Tree_Planting_Ha × TREE_SEQUESTRATION_RATE

Where:
- TREE_SEQUESTRATION_RATE = 12 t CO₂e/ha/year
```

#### 3.2 Hedgerow
```
Hedgerow_Sequestration = Hedgerow_Km × HEDGEROW_SEQUESTRATION_RATE

Where:
- HEDGEROW_SEQUESTRATION_RATE = 0.5 t CO₂e/km/year
```

#### 3.3 Soil Carbon
```
Soil_Carbon_Sequestration = Soil_Carbon_Ha × SOIL_CARBON_RATE

Where:
- SOIL_CARBON_RATE = 2.5 t CO₂e/ha/year
```

#### 3.4 Cover Crops
```
Cover_Crops_Sequestration = Cover_Crops_Ha × COVER_CROPS_RATE

Where:
- COVER_CROPS_RATE = 1.5 t CO₂e/ha/year
```

#### 3.5 Technology Reductions
```
Methane_Inhibitor_Reduction = Total_Enteric_Emissions × 0.15 (if enabled)
Improved_Manure_Reduction = Total_Manure_Emissions × 0.30 (if enabled)
```

### 4. Economic Calculations

#### 4.1 Total Annual Cost
```
Total_Cost = Feed_Cost + Nitrogen_Cost + Labor_Cost + Veterinary_Cost + Other_Costs

Where:
- Feed_Cost = Concentrate_Feed × Feed_Cost_Per_Kg × 365 × Seasonal_Factor
- Nitrogen_Cost = (Nitrogen_Rate × HECTARES_PER_COW × NITROGEN_COST_PER_KG) × Seasonal_Factor
- Labor_Cost = BASE_LABOR_COST × Productivity_Factor
- Veterinary_Cost = BASE_VET_COST × Health_Factor
```

#### 4.2 Revenue Calculation
```
Revenue = Milk_Yield × Milk_Price × Herd_Size

Where:
- Milk_Price = BASE_MILK_PRICE × Quality_Premium
- BASE_MILK_PRICE = £0.40/L
```

### 5. Performance Metrics

#### 5.1 Feed Efficiency
```
Feed_Efficiency = Milk_Yield / (Concentrate_Feed × 365)
```

#### 5.2 Carbon Efficiency
```
Carbon_Efficiency = 1 / Emissions_Intensity
```

### 6. Risk Score Calculation

#### 6.1 Composite Risk Score
```
Base_Risk = 
  - 'Low' if Emissions_Intensity < 1.0
  - 'Medium' if 1.0 ≤ Emissions_Intensity ≤ 1.5
  - 'High' if Emissions_Intensity > 1.5

Leverage_Bump = 
  - 0 if Loan_Amount < £1.5m
  - 1 if £1.5m ≤ Loan_Amount < £4m
  - 2 if Loan_Amount ≥ £4m

Final_Risk = min('High', Base_Risk + Leverage_Bump)
```

### 7. Loan Calculations

#### 7.1 Monthly Repayment (Amortizing Loan)
```
Monthly_Payment = Principal × r / (1 - (1 + r)^(-n))

Where:
- r = Annual_Rate / 12
- n = Years × 12
```

## V3 Features - Nitrogen Use Efficiency

### 8. Nitrogen Use Efficiency (NUE)

#### 8.1 NUE Calculation
```
NUE = (N_Outputs / N_Inputs) × 100

Where:
N_Outputs = Milk_Yield × 0.0055  // kg N/cow/year (milk N content)
N_Inputs = Applied_N + Feed_N

Applied_N = N_Rate × Hectares_Per_Cow
Feed_N = Concentrate_Feed × 365 × Feed_N_Content
Feed_N_Content = Crude_Protein / 625  // Protein to N conversion
```

#### 8.2 N Balance
```
N_Balance = N_Inputs - N_Outputs  // kg N/cow/year surplus
N_Loss_CO2e = N_Balance × 4.5     // Approximate N2O emissions equivalent
```

### 9. LME+NUE Combined Metric

#### 9.1 LME+NUE Calculation
```
LME+NUE = LME × (NUE / 100)

Sustainability_Score = min(50, LME/15 × 50) + min(50, NUE/150 × 50)
```

#### 9.2 Interpretation Thresholds
- Excellent: Score ≥ 80 and LME+NUE ≥ 10
- Good: Score ≥ 65 and LME+NUE ≥ 8
- Average: Score ≥ 50 and LME+NUE ≥ 6
- Poor: Below average thresholds

## V4 Features - Theoretical Minimum & Pathways

### 10. Theoretical Minimum (Biological Floor)

#### 10.1 TM Calculation
```
TM = Herd_Size × 2000 kg CO₂e/year

Based on:
- 13g CH₄/L milk × 25L/day × 365 days × 28 GWP₁₀₀ ≈ 2000 kg CO₂e/cow/year
```

#### 10.2 Performance Metrics
```
Percentage_Above_TM = ((Current_Emissions - TM) / TM) × 100
Gap_to_TM = max(0, Current_Emissions - TM)
```

#### 10.3 Interpretation Thresholds
- Excellent: ≤10% above TM
- Good: ≤25% above TM  
- Average: ≤50% above TM
- Poor: >50% above TM

### 11. Glide Path Projections

#### 11.1 Annual Technology Reduction
```
Projected_Gross(year) = Current_Gross × (1 - 0.02)^years
// 2% annual reduction from technology improvements
```

#### 11.2 Sequestration Ramp
```
Projected_Sequestration(year) = Total_Sequestration × min(1, year/5)
// Full sequestration potential reached in 5 years
```

### 12. Reduction Pathway Analysis

#### 12.1 Reduction Measures
```
Available Measures:
1. Feed Quality Improvement: 1.5% reduction per quality point
2. Methane Inhibitor: 15% reduction in enteric emissions
3. Anaerobic Digester: 10% reduction in manure emissions
4. Precision Feeding: 8% reduction in overall emissions
5. Genetic Improvement: 12% reduction over 5 years
6. Heat Abatement: 5% reduction
7. Renewable Energy: 3% reduction
8. Optimized Reproduction: 7% reduction
```

#### 12.2 ROI Calculation
```
ROI = (Annual_Carbon_Value / Annual_Cost) × 100

Where:
Annual_Carbon_Value = Emission_Reduction × Carbon_Price
Carbon_Price = $25/tonne CO₂e
```

### 13. Green Financing

#### 13.1 Financing Options
```
1. Green Agriculture Loan: 3.5% base rate, 1.5% green discount
2. Equipment Finance: 4.5% base rate, 1% green discount
3. Government Grant: 0% rate, up to £100k
4. Carbon Credit Advance: 6% rate, based on future credits
5. Blended Finance: 2.5% rate, combined loan/grant
```

#### 13.2 Financing Eligibility
```
Max_Loan = Available_Debt_Service × Term_Factor

Where:
Available_Debt_Service = Annual_Revenue × 0.3 - Existing_Debt_Service
Green_Bonus = 2% if emissions reduction > 20%, 1% if > 10%
```

#### 13.3 NPV Calculation
```
NPV = -Initial_Investment + Σ(Annual_Savings / (1 + Discount_Rate)^year)

Where:
Annual_Savings = Carbon_Value + Operational_Savings
Discount_Rate = 5%
```

## Conversion Formulas

### Greenhouse Gas Conversions
- **CH₄ to CO₂e**: CH₄ × 28 (GWP over 100 years)
- **N₂O to CO₂e**: N₂O × 298 (GWP over 100 years)

### Unit Conversions
- **Days per month**: 30.44
- **Days per lactation**: 305
- **Days per year**: 365
- **Hectares per cow**: 0.6 (typical dairy farm)
- **Protein to N**: Divide by 6.25

## Hardcoded Constants

### Emission Factors
```typescript
EMISSION_FACTORS = {
  METHANE_BASE: 8.5,              // kg CO₂e/day base enteric
  METHANE_DMI_FACTOR: 0.85,       // kg CO₂e per kg DMI
  MANURE_BASE: 3.2,               // kg CO₂e/day base manure
  ELECTRICITY_BASE: 0.8,          // kg CO₂e/day electricity
  N2O_PER_KG_N: 5.7,             // kg N₂O per kg N applied
  N2O_TO_CO2E: 298,              // N₂O GWP factor
  FEED_QUALITY_BASE: 1.2,         // Base adjustment factor
  FEED_QUALITY_FACTOR: 0.03,      // Per unit improvement
  NON_PRODUCTIVE_FACTOR: 0.6,     // Emissions factor for dry cows
  MILKING_ELECTRICITY: 0.052      // kWh per liter milk
}
```

### Calculation Constants
```typescript
CALC_CONSTANTS = {
  DMI_YIELD_FACTOR: 0.4,          // DMI per L milk
  BASE_DMI: 12,                   // Base DMI kg/day
  DAYS_PER_LACTATION: 305,        // Standard lactation length
  DAYS_PER_MONTH: 30.44,          // Average days per month
  PERSISTENCE_FACTOR: 0.94,       // Lactation curve adjustment
  DAYS_PER_YEAR: 365
}
```

### Economic Constants
```typescript
ECONOMIC_CONSTANTS = {
  BASE_MILK_PRICE: 0.40,          // £/L
  NITROGEN_COST_PER_KG: 1.2,      // £/kg N
  BASE_LABOR_COST: 150,           // £/cow/year
  BASE_VET_COST: 80,              // £/cow/year
  OTHER_COSTS_BASE: 120,          // £/cow/year
  HECTARES_PER_COW: 0.6,          // Typical stocking rate
  CARBON_PRICE: 25                // $/tonne CO₂e
}
```

### Sequestration Rates
```typescript
SEQUESTRATION_RATES = {
  TREE_PER_HA: 12,                // t CO₂e/ha/year
  HEDGEROW_PER_KM: 0.5,           // t CO₂e/km/year
  SOIL_CARBON_PER_HA: 2.5,        // t CO₂e/ha/year
  COVER_CROPS_PER_HA: 1.5,        // t CO₂e/ha/year
  RENEWABLE_PER_KW: 0.4           // t CO₂e/kW/year
}
```

### NUE Constants
```typescript
NUE_CONSTANTS = {
  MILK_N_CONTENT: 0.0055,         // kg N per L milk
  HECTARES_PER_COW: 0.5,          // Average land allocation
  MANURE_N_EFFICIENCY: {
    'Liquid/slurry': 0.45,        // 45% N utilization
    'Solid': 0.35,
    'Daily spread': 0.30,
    'Anaerobic digester': 0.55,   // Best efficiency
    'Pasture': 0.25
  },
  NUE_THRESHOLDS: {
    POOR: 60,                     // < 60%
    AVERAGE: 80,                  // 60-80%
    GOOD: 100                     // 80-100%
  }
}
```

### TM Constants (V4)
```typescript
TM_CONSTANTS = {
  BASE_PER_COW: 2000,             // kg CO₂e/year biological minimum
  THRESHOLDS: {
    EXCELLENT: 10,                // Within 10% of TM
    GOOD: 25,                     // Within 25% of TM
    AVERAGE: 50                   // Within 50% of TM
  },
  ANNUAL_TECH_REDUCTION: 0.02     // 2% per year
}
```

### Reduction Pathway Constants (V4)
```typescript
REDUCTION_POTENTIALS = {
  feedQuality: 0.015,             // 1.5% per quality point
  methaneInhibitor: 0.15,         // 15% reduction
  manureDigester: 0.10,           // 10% reduction
  precisionFeeding: 0.08,         // 8% reduction
  improvedGenetics: 0.12,         // 12% over 5 years
  heatAbatement: 0.05,            // 5% reduction
  renewableEnergy: 0.03,          // 3% reduction
  optimizedReproduction: 0.07     // 7% reduction
}

MEASURE_COSTS = {
  feedQuality: 50,                // per quality point per cow
  methaneInhibitor: 200,          // per cow per year
  manureDigester: 150,            // per cow per year
  precisionFeeding: 100,          // per cow per year
  improvedGenetics: 80,           // per cow per year
  heatAbatement: 60,              // per cow per year
  renewableEnergy: 120,           // per cow per year
  optimizedReproduction: 40       // per cow per year
}
```

### Financing Constants (V4)
```typescript
FINANCING_OPTIONS = {
  GREEN_LOAN: {
    maxAmount: 1000000,
    baseRate: 0.035,
    greenDiscount: 0.015,
    term: 10
  },
  EQUIPMENT_FINANCE: {
    maxAmount: 500000,
    baseRate: 0.045,
    greenDiscount: 0.01,
    term: 7
  },
  GOVT_GRANT: {
    maxAmount: 100000,
    rate: 0,
    term: 0
  },
  CARBON_ADVANCE: {
    maxAmount: 200000,
    baseRate: 0.06,
    term: 5
  },
  BLENDED_FINANCE: {
    maxAmount: 750000,
    baseRate: 0.025,
    greenDiscount: 0.02,
    term: 8
  }
}
```

### Seasonal Factors
```typescript
SEASONAL_FACTORS = {
  Spring: { feed: 1.0, manure: 0.95, grazing: 1.1, nitrogen: 0.9 },
  Summer: { feed: 0.95, manure: 0.9, grazing: 1.0, nitrogen: 0.85 },
  Autumn: { feed: 1.05, manure: 1.0, grazing: 0.9, nitrogen: 1.0 },
  Winter: { feed: 1.15, manure: 1.1, grazing: 0.0, nitrogen: 1.2 }
}
```

### System Factors
```typescript
SYSTEM_FACTORS = {
  intensive: 1.1,    // >7000 L/cow/year
  moderate: 1.0,     // 4000-7000 L/cow/year
  extensive: 0.9     // <4000 L/cow/year
}
```

### Manure System Factors
```typescript
MANURE_SYSTEM_FACTORS = {
  'Solid': 0.8,
  'Liquid/slurry': 1.0,
  'Pasture': 0.3,
  'Daily spread': 0.6,
  'Anaerobic digester': 0.4
}
```

## Assumptions

### Production Assumptions
1. **Standard lactation length**: 305 days
2. **Persistence factor**: 0.94 (accounts for lactation curve)
3. **Average days per month**: 30.44
4. **Typical stocking rate**: 0.6 hectares per cow

### Emissions Assumptions
1. **Dry matter intake**: Linear relationship with milk yield (0.4 kg DMI per L milk)
2. **Base DMI**: 12 kg/day for maintenance
3. **Non-productive cow emissions**: 60% of lactating cow emissions
4. **Feed quality impact**: 3% emission reduction per quality unit increase
5. **Methane inhibitor effectiveness**: 15% reduction in enteric emissions
6. **Improved manure management**: 30% reduction in manure emissions
7. **Performance penalties**: Up to 40% increase for poor management

### Economic Assumptions
1. **Base milk price**: £0.40 per liter
2. **Quality premiums**: Applied based on compositional quality
3. **Labor costs**: £150 per cow per year base
4. **Veterinary costs**: £80 per cow per year base
5. **Other costs**: £120 per cow per year base
6. **Carbon credit value**: $25 per tonne CO₂e

### Sequestration Assumptions
1. **Tree planting**: 12 t CO₂e/ha/year for 20 years
2. **Hedgerows**: 0.5 t CO₂e/km/year
3. **Soil carbon**: 2.5 t CO₂e/ha/year for 10 years
4. **Cover crops**: 1.5 t CO₂e/ha/year
5. **Renewable energy**: 0.4 t CO₂e/kW installed/year

### Financial Risk Assumptions
1. **Environmental risk thresholds**:
   - Low: < 1.0 kg CO₂e/L
   - Medium: 1.0-1.5 kg CO₂e/L
   - High: > 1.5 kg CO₂e/L
2. **Leverage impact**: Higher loan amounts increase risk category
3. **Interest rate matrix**: Risk and loan size determine rates
4. **Green financing discounts**: 1-2% for qualifying projects

### V4 Specific Assumptions
1. **Theoretical minimum**: 2000 kg CO₂e/cow/year is biological floor
2. **Technology improvement**: 2% annual reduction potential
3. **Measure effectiveness**: Based on peer-reviewed studies
4. **Implementation time**: 1-24 months depending on complexity
5. **ROI calculations**: Based on $25/tonne carbon value

## Default Values

### Farm Parameters
```typescript
{
  herdSize: 150,
  season: 'Summer',
  systemType: 'intensive',
  feedQuality: 7,
  concentrateFeed: 8.08,
  feedCost: 0.35,
  feedCarbonFootprint: 0.75,
  soyaContent: 0,
  deforestationFree: false,
  nitrogenRate: 180,
  crudeProtein: 17,
  milkYield: 8500,
  avgLactations: 3.9,
  calvingInterval: 380,
  ageFirstCalving: 24.7,
  cullingAge: 6.12,
  birthweight: 40,
  grazingMonths: 7,
  manureSystem: 'Liquid/slurry',
  landType: 'Lowland',
  forageContent: 'Mixed 15-75%',
  treePlantingHa: 0,
  hedgerowKm: 0,
  soilCarbonHa: 0,
  coverCropsHa: 0,
  renewableEnergyKw: 0,
  methaneInhibitor: false,
  improvedManure: false
}
```

### Loan Parameters
```typescript
{
  loanAmount: 500000,    // £
  loanTerm: 10          // years
}
```

## Validation Limits

### Production Parameters
| Parameter | Min | Max | Step | Unit |
|-----------|-----|-----|------|------|
| Herd Size | 1 | 2000 | 1 | cows |
| Milk Yield | 2000 | 15000 | 50 | L/cow/year |
| Concentrate Feed | 0 | 20 | 0.1 | kg/day |
| Feed Quality | 1 | 10 | 1 | score |
| Feed Cost | 0.20 | 0.60 | 0.01 | £/kg |
| Feed Carbon | 0.3 | 2.0 | 0.05 | kg CO₂e/kg |
| Soya Content | 0 | 40 | 1 | % |
| Nitrogen Rate | 0 | 300 | 10 | kg N/ha |
| Crude Protein | 12 | 24 | 0.5 | % |

### Reproduction Parameters
| Parameter | Min | Max | Step | Unit |
|-----------|-----|-----|------|------|
| Average Lactations | 1 | 8 | 0.1 | count |
| Calving Interval | 340 | 450 | 5 | days |
| Age First Calving | 20 | 36 | 0.1 | months |
| Culling Age | 2 | 12 | 0.1 | years |
| Birth Weight | 25 | 60 | 1 | kg |
| Grazing Months | 0 | 12 | 1 | months |

### Sequestration Parameters
| Parameter | Min | Max | Step | Unit |
|-----------|-----|-----|------|------|
| Tree Planting | 0 | 100 | 0.5 | ha |
| Hedgerow | 0 | 50 | 0.5 | km |
| Soil Carbon | 0 | 200 | 1 | ha |
| Cover Crops | 0 | 200 | 1 | ha |
| Renewable Energy | 0 | 500 | 10 | kW |

### Financial Parameters
| Parameter | Min | Max | Step | Unit |
|-----------|-----|-----|------|------|
| Loan Amount | 100,000 | 10,000,000 | 50,000 | £ |
| Loan Term | 1 | 25 | 1 | years |

### Performance Thresholds
```typescript
PERFORMANCE_THRESHOLDS = {
  FEED_CARBON_FOOTPRINT_LIMIT: 1.0,     // kg CO₂e/kg
  SOYA_CONTENT_WARNING: 20,              // %
  CALVING_INTERVAL_TARGET: 385,          // days
  AGE_FIRST_CALVING_TARGET: 24,          // months
  EMISSIONS_INTENSITY_TARGET: 1.2,       // kg CO₂e/L
  COST_PER_LITRE_TARGET: 0.30,          // £/L
  OVERALL_HERD_EFFECTIVENESS_TARGET: 75, // %
  NUE_TARGET: 80,                       // %
  LME_TARGET: 8000,                     // L milk/t CO₂e
  TM_EXCELLENT: 110,                    // % of theoretical minimum
  TM_GOOD: 125                          // % of theoretical minimum
}
```

### LME Thresholds
```typescript
LME_THRESHOLDS = {
  EXCELLENT: 9000,    // L milk/t CO₂e
  GOOD: 8000,
  AVERAGE: 7000,
  BELOW_AVERAGE: 6000
}
```

### NUE Thresholds (V3)
```typescript
NUE_THRESHOLDS = {
  EXCELLENT: 100,     // > 100%
  GOOD: 80,           // 80-100%
  AVERAGE: 60,        // 60-80%
  POOR: 40            // < 60%
}
```

### TM Performance Categories (V4)
```typescript
TM_CATEGORIES = {
  EXCELLENT: { max: 110, color: 'green' },     // Within 10% of TM
  GOOD: { max: 125, color: 'blue' },           // Within 25% of TM
  AVERAGE: { max: 150, color: 'yellow' },      // Within 50% of TM
  POOR: { max: Infinity, color: 'red' }        // Over 50% above TM
}
```

## Data Quality Notes

1. **Emission factors**: Based on IPCC 2019 guidelines and UK-specific research
2. **Economic data**: Representative of UK dairy sector 2023-2024
3. **Sequestration rates**: Conservative estimates from peer-reviewed literature
4. **Seasonal adjustments**: Based on temperate climate patterns
5. **System factors**: Derived from UK dairy farm surveys
6. **NUE benchmarks**: Based on European dairy sustainability targets
7. **TM calculations**: Based on biological limits from rumen physiology studies
8. **Financing rates**: Based on current green finance market conditions

## Calculation Precision

- **Emissions**: Calculated to 3 decimal places, displayed to 1
- **Costs**: Calculated to 2 decimal places, displayed as whole numbers
- **Percentages**: Calculated to 4 decimal places, displayed to 1
- **LME**: Calculated as float, displayed as whole number
- **NUE**: Calculated to 2 decimal places, displayed to 1
- **Financial**: All monetary values in GBP (£)
- **NPV/IRR**: Calculated to 4 decimal places, displayed to 1

## Version History

- **V1.0**: Core emissions and LME calculations
- **V2.0**: Risk scoring and loan calculator
- **V3.0**: Nitrogen Use Efficiency (NUE) integration
- **V4.0**: Theoretical Minimum and Reduction Pathways

---

*Last Updated: August 2025*
*Version: 4.0.0*
*Documentation prepared for GHG WHAT-IF Tool with complete V4 features*