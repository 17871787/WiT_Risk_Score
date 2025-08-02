# Session Handoff - V3 NUE Integration

## Current State (August 2, 2025)

### What We've Accomplished Today
1. **Emissions Calibration**: 
   - Achieved 0.78 kg CO₂e/L theoretical minimum
   - Made fertility metrics properly impactful
   - Added performance penalties for poor KPIs

2. **UI Improvements**:
   - Implemented overflow menu for tabs (no more clipping)
   - Added performance penalty indicator in header
   - Fixed all accessibility issues

3. **Architecture**:
   - Dashboard-based architecture with lazy loading
   - Reduced bundle size by 66%
   - Clean separation of concerns

### V3 Planning Completed
- Created ARCHITECTURE_V3.md with full system diagram
- Created V3_IMPLEMENTATION_ROADMAP.md with sprint breakdown
- Defined NUE integration approach

## Next Steps for V3 Implementation

### Immediate Actions (Sprint 1):
1. **Add Feed Quality Parameter**:
   ```typescript
   // In src/types/index.ts
   interface FarmParameters {
     // existing...
     feedQuality: number; // NEW: 1-10 scale
   }
   ```

2. **Create Feed Tuning Component**:
   ```typescript
   // New file: src/components/FeedTuning.tsx
   export const FeedTuning: React.FC = () => {
     // Sliders for feed parameters
     // Real-time emission impact display
   };
   ```

3. **Update Validation Limits**:
   ```typescript
   // In src/constants/validation.ts
   VALIDATION_LIMITS.feedQuality = { min: 1, max: 10, default: 7 };
   ```

### Sprint 2 Preview - NUE Hook:
```typescript
// New file: src/hooks/useNue.ts
export const useNue = () => {
  const { parameters } = useFarmStore();
  const MILK_N_CONTENT = 0.0055; // kg N per L
  const HECTARES_PER_COW = 0.5;
  
  // Calculate NUE
  const nue = (milkNOutput / totalNApplied) * 100;
  
  return { nue, category: getNueCategory(nue) };
};
```

## Key Files for V3

### Core Calculation Files:
- `src/lib/calculations/emissions.ts` - Already has fertility impact
- `src/lib/calculations/lme.ts` - Needs NUE integration
- NEW: `src/lib/calculations/nue.ts` - NUE calculations
- NEW: `src/lib/calculations/lmePlus.ts` - LME+NUE combination

### Component Updates:
- `src/dashboards/BasicDashboard.tsx` - Add FeedTuning card
- `src/dashboards/EffectivenessDashboard.tsx` - Dual LME display
- `src/components/scenarios/ScenarioBuilder.tsx` - Feed practices

### State Management:
- `src/context/FarmContext.tsx` - Add feedQuality parameter
- `src/hooks/useDashboardState.ts` - Expose NUE calculation

## Testing Checklist for V3

- [ ] Feed quality slider updates emissions in real-time
- [ ] NUE calculation matches manual verification
- [ ] LME+NUE shows correct multiplier effect
- [ ] CSV export includes new columns
- [ ] Performance remains under 100ms
- [ ] No breaking changes for existing users

## Environment Setup

```bash
cd ghg-tool
npm install
npm run dev

# For testing
npm test

# For building
npm run build

# For deployment
vercel --prod
```

## Git Branch Strategy

```bash
# Create v3 feature branch
git checkout -b feature/v3-nue-integration

# After each sprint
git add .
git commit -m "feat(v3): [sprint description]"
git push origin feature/v3-nue-integration

# After validation
git checkout main
git merge feature/v3-nue-integration
```

## Critical Constants

```typescript
// NUE calculation constants
const MILK_N_CONTENT = 0.0055;    // kg N per L milk
const HECTARES_PER_COW = 0.5;     // assumed average
const N_TO_PROTEIN = 6.25;        // conversion factor

// NUE thresholds
const NUE_POOR = 60;              // Below this is poor
const NUE_AVERAGE = 80;           // 60-80 is average
const NUE_GOOD = 100;             // 80-100 is good
// Above 100 is excellent
```

## API Endpoints (Future)

```typescript
// Potential API structure for v3
GET /api/calculations
{
  version: "3.0",
  emissions: { ... },
  lme: {
    raw: 350,
    nueAdjusted: 280,
    nueMultiplier: 0.8
  },
  nue: {
    percentage: 80,
    category: "Good"
  }
}
```

## Deployment Notes

- Current production: https://ghg-tool-five.vercel.app
- GitHub repo: https://github.com/17871787/WiT_Risk_Score
- Vercel project: joe-towers-projects/ghg-tool

## Session Recovery

To continue after auto-compact:
1. Read this document first
2. Check V3_IMPLEMENTATION_ROADMAP.md for current sprint
3. Start with pending todo items
4. Reference ARCHITECTURE_V3.md for system overview

---

**Last Session Summary**:
- Fixed emissions to achieve 0.78 minimum
- Made fertility metrics impactful
- Improved UI with overflow menu
- Planned complete V3 architecture
- Ready for Sprint 1 implementation

**Next Session Should**:
1. Implement feed quality parameter
2. Create FeedTuning component
3. Add to BasicDashboard
4. Update validation limits
5. Test real-time updates

*Session prepared for handoff at: August 2, 2025, 11:45 UTC*