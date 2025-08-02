# V3 Implementation Roadmap - NUE Integration

## Executive Summary
Version 3 integrates Nitrogen Use Efficiency (NUE) into the GHG WHAT-IF Tool, creating a comprehensive sustainability metric (LME+NUE) that better reflects whole-farm nutrient management.

## Sprint Timeline

### Sprint 0: Documentation & Architecture (Current)
**Status**: In Progress
**Duration**: Immediate
**Deliverables**:
- [x] Architecture diagram (ARCHITECTURE_V3.md)
- [x] Implementation roadmap (this document)
- [ ] TypeScript type documentation
- [ ] Updated TECHNICAL_DOCUMENTATION.md

### Sprint 1: Feed Parameter Restoration
**Duration**: 0.5 week
**Owner**: Full-stack developer

#### Tasks:
1. **Backend Changes**:
   ```typescript
   // Add to FarmParameters interface
   feedQuality: number; // 1-10 scale
   
   // Add to VALIDATION_LIMITS
   feedQuality: { min: 1, max: 10, default: 7 }
   
   // Add to useDashboardActions
   updateFeedQuality: (value: number) => void
   ```

2. **UI Implementation**:
   - Create `FeedTuning.tsx` component
   - Add collapsible card to BasicDashboard
   - Include sliders for: feed quality, carbon footprint
   - Show real-time emission impact

3. **Testing**:
   - Unit tests for feed parameter validation
   - Integration test for emission recalculation
   - UI test for slider interactions

### Sprint 2: NUE → LME+ Integration
**Duration**: 1 week
**Owner**: Agri-scientist + Frontend developer

#### Tasks:
1. **Create NUE Calculation Hook**:
   ```typescript
   // src/hooks/useNue.ts
   export const useNue = () => {
     const { parameters } = useFarmStore();
     const { nitrogenRate, milkYield, herdSize } = parameters;
     
     const MILK_N_CONTENT = 0.0055; // kg N per L
     const HECTARES_PER_COW = 0.5;
     
     const totalNApplied = nitrogenRate * HECTARES_PER_COW * herdSize / 1000;
     const milkNOutput = milkYield * MILK_N_CONTENT * herdSize / 1000;
     
     const nue = totalNApplied > 0 
       ? (milkNOutput / totalNApplied) * 100 
       : 0;
       
     return {
       nue: Math.min(200, Math.max(0, nue)),
       category: getNueCategory(nue),
       milkNOutput,
       totalNApplied
     };
   };
   ```

2. **Extend LME Calculations**:
   ```typescript
   // src/lib/calculations/lmePlus.ts
   export const calculateLMEPlus = (
     params: FarmParameters, 
     nue: number
   ): LMEPlusResult => {
     const baseLME = calculateLME(params);
     
     return {
       lme: baseLME.lme,
       nueAdjustedLme: baseLME.lme * (nue / 100),
       nueMultiplier: nue / 100,
       improvement: baseLME.lme * (nue / 100) - baseLME.lme
     };
   };
   ```

3. **Update EffectivenessDashboard**:
   - Add NueIndicator component
   - Show dual LME metrics
   - Color-coded thresholds
   - Tooltip explanations

### Sprint 3: Scenario Builder Enhancement
**Duration**: 0.5 week
**Owner**: Frontend developer

#### Tasks:
1. **Add Feed Practices**:
   ```typescript
   const feedPractices: Practice[] = [
     {
       id: 'home-grown-feed',
       name: 'Switch to Home-grown Feed',
       type: 'feed',
       apply: () => {
         updateParameter('feedCarbonFootprint', 0.5);
         updateParameter('feedQuality', 8);
       },
       revert: () => {
         updateParameter('feedCarbonFootprint', 1.2);
         updateParameter('feedQuality', 7);
       },
       impact: 'NUE +15%, Feed carbon -60%'
     },
     {
       id: 'precision-feeding',
       name: 'Implement Precision Feeding',
       type: 'feed',
       apply: () => {
         updateParameter('feedQuality', 9);
         updateParameter('concentrateFeed', params.concentrateFeed * 0.9);
       },
       impact: 'NUE +10%, Feed use -10%'
     }
   ];
   ```

2. **Update Comparison Display**:
   - Add NUE row to comparison table
   - Show feed cost implications
   - Highlight sustainability improvements

### Sprint 4: Export Updates
**Duration**: 1 week
**Owner**: Full-stack developer

#### Tasks:
1. **CSV Export Enhancement**:
   ```typescript
   const csvHeaders = [
     ...existingHeaders,
     'NUE (%)',
     'LME (Raw)',
     'LME (NUE-Adjusted)',
     'Feed Quality',
     'NUE Category'
   ];
   ```

2. **PDF Report Updates**:
   - Add NUE gauge chart
   - Include feed optimization section
   - Version stamp "v3.0"
   - Add glossary for new terms

3. **API Schema Update**:
   ```json
   {
     "version": "3.0",
     "calculations": {
       "emissions": {...},
       "lme": {
         "raw": 350,
         "nueAdjusted": 280
       },
       "nue": {
         "percentage": 80,
         "category": "Good",
         "milkNOutput": 45.5,
         "totalNApplied": 56.9
       }
     }
   }
   ```

### Sprint 5: Testing & Validation
**Duration**: 1 week (buffer)
**Owner**: Product team

#### Tasks:
1. **Farmer Pilot Testing**:
   - 3 farms with different profiles
   - Validate NUE calculations
   - Gather UX feedback
   - Document edge cases

2. **Barclays Validation**:
   - Confirm risk matrix alignment
   - Test interest rate calculations
   - Verify loan eligibility

3. **Performance Testing**:
   - Target: <100ms recalculation
   - Load test with 100 concurrent users
   - Memory profiling

## Technical Specifications

### New Types
```typescript
interface NUEResult {
  nue: number;
  category: 'Poor' | 'Average' | 'Good' | 'Excellent';
  milkNOutput: number;
  totalNApplied: number;
}

interface LMEPlusResult {
  lme: number;
  nueAdjustedLme: number;
  nueMultiplier: number;
  improvement: number;
}
```

### NUE Thresholds
- Poor: < 60%
- Average: 60-80%
- Good: 80-100%
- Excellent: > 100%

### Breaking Changes
- CSV column order (new columns at end)
- PDF report layout (additional section)
- API response structure (additive only)

## Rollout Strategy

1. **Week 1**: Deploy behind feature flag
2. **Week 2**: Enable for 10% of users
3. **Week 3**: Gather feedback, fix issues
4. **Week 4**: Full rollout

## Success Metrics

- NUE calculation accuracy: ±2%
- User engagement with feed parameters: >60%
- Performance: No regression from v2
- Farmer satisfaction: >80% positive

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| NUE calculation errors | High | Extensive unit testing, farmer validation |
| Performance degradation | Medium | Profiling, memoization, lazy calculation |
| User confusion | Medium | Clear tooltips, tutorial, gradual rollout |
| Breaking changes | Low | Backwards compatibility, versioned exports |

## Post-Launch Support

- Daily monitoring for first week
- Hotfix process established
- Farmer feedback channel
- Monthly review of NUE accuracy

---

*Document Version: 1.0*
*Last Updated: August 2, 2025*
*Next Review: Post Sprint 1*