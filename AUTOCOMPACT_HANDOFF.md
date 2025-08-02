# Auto-Compact Handoff Instructions

## 🔑 Critical Information

### Credentials & Access
- **GitHub Repo**: https://github.com/17871787/WiT_Risk_Score
- **Vercel Production**: https://ghg-tool-five.vercel.app
- **Vercel Project**: joe-towers-projects/ghg-tool
- **Working Directory**: `C:\Users\jtowe\ghg-tool`

### Current Authentication Status
- ✅ GitHub CLI authenticated
- ✅ Vercel CLI authenticated
- ✅ Git configured with repo access

## 📍 Where We Left Off

### Session Summary
1. **Emissions Calibrated**: Achieved 0.78 kg CO₂e/L theoretical minimum
2. **Fertility Impact**: Made age at first calving, lactations, and calving interval properly affect emissions
3. **UI Fixed**: Implemented overflow menu for sidebar tabs (no more clipping)
4. **V3 Planned**: Complete architecture and roadmap for NUE integration
5. **Documentation**: Created all V3 planning documents

### Last Deployment
- **Commit**: `f274e9b` - "docs: create V3 architecture and implementation roadmap for NUE integration"
- **Production URL**: https://ghg-tool-five.vercel.app
- **All changes pushed and deployed**

## 🎯 Next Immediate Task: Sprint 1

### Add Feed Quality Parameter

1. **Update Types** (`src/types/index.ts`):
```typescript
export interface FarmParameters {
  // ... existing parameters
  feedQuality: number; // NEW: 1-10 scale for digestibility
}
```

2. **Update Validation** (`src/constants/validation.ts`):
```typescript
export const VALIDATION_LIMITS = {
  // ... existing limits
  feedQuality: { min: 1, max: 10, default: 7 },
};
```

3. **Update Zustand Store** (`src/context/FarmContext.tsx`):
```typescript
interface FarmState {
  parameters: FarmParameters;
  // ... existing state
  updateParameter: <K extends keyof FarmParameters>(
    key: K, 
    value: FarmParameters[K]
  ) => void;
}

const DEFAULT_PARAMETERS: FarmParameters = {
  // ... existing defaults
  feedQuality: 7,
};
```

4. **Create Feed Tuning Component** (`src/components/FeedTuning.tsx`):
```typescript
import React from 'react';
import { Slider } from './common/Slider';
import { useFarmStore } from '../context/FarmContext';

export const FeedTuning: React.FC = () => {
  const { parameters, updateParameter } = useFarmStore();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Feed Parameters</h3>
      
      <div className="space-y-4">
        <Slider
          label="Feed Quality"
          value={parameters.feedQuality}
          onChange={(value) => updateParameter('feedQuality', value)}
          min={1}
          max={10}
          step={1}
          unit=""
          tooltip="Higher quality feed improves efficiency"
        />
        
        <Slider
          label="Concentrate Feed"
          value={parameters.concentrateFeed}
          onChange={(value) => updateParameter('concentrateFeed', value)}
          min={0}
          max={12}
          step={0.5}
          unit="kg/day"
        />
        
        <Slider
          label="Feed Carbon Footprint"
          value={parameters.feedCarbonFootprint}
          onChange={(value) => updateParameter('feedCarbonFootprint', value)}
          min={0.3}
          max={2.0}
          step={0.1}
          unit="kg CO₂e/kg"
        />
      </div>
    </div>
  );
};
```

5. **Add to BasicDashboard** (`src/dashboards/BasicDashboard.tsx`):
```typescript
import { FeedTuning } from '../components/FeedTuning';

// In the component, add after LoanCalculator:
<div className="col-span-1 lg:col-span-2">
  <FeedTuning />
</div>
```

## 🧪 Testing Commands

```bash
# Navigate to project
cd ghg-tool

# Install dependencies (if needed)
npm install

# Run development server
npm run dev
# Should open at http://localhost:5173

# Run tests
npm test

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 📝 Git Workflow

```bash
# Check current status
git status

# Stage changes
git add -A

# Commit with descriptive message
git commit -m "feat(v3): add feed quality parameter and tuning component

- Added feedQuality to FarmParameters interface
- Created FeedTuning component with sliders
- Integrated into BasicDashboard
- Updated validation limits

Part of Sprint 1 implementation"

# Push to GitHub
git push origin main

# Deploy to production
vercel --prod
```

## 🔍 Key Files Reference

### For Sprint 1:
- `src/types/index.ts` - Add feedQuality to FarmParameters
- `src/constants/validation.ts` - Add validation limits
- `src/context/FarmContext.tsx` - Update store with feedQuality
- `src/components/FeedTuning.tsx` - NEW component to create
- `src/dashboards/BasicDashboard.tsx` - Add FeedTuning component

### For Sprint 2 (Preview):
- `src/hooks/useNue.ts` - NEW hook to create
- `src/lib/calculations/nue.ts` - NEW calculation file
- `src/lib/calculations/lmePlus.ts` - NEW LME+NUE calculation
- `src/dashboards/EffectivenessDashboard.tsx` - Update with dual display

## 📊 V3 Constants to Remember

```typescript
// NUE calculation
const MILK_N_CONTENT = 0.0055; // kg N per L milk
const HECTARES_PER_COW = 0.5;  // assumed average

// NUE categories
const NUE_THRESHOLDS = {
  POOR: 60,      // < 60%
  AVERAGE: 80,   // 60-80%
  GOOD: 100,     // 80-100%
  // > 100% is Excellent
};
```

## ✅ Verification Checklist

After implementing Sprint 1:
- [ ] Feed Quality slider appears in BasicDashboard
- [ ] Moving slider updates emissions in real-time
- [ ] Values persist on page refresh
- [ ] Validation limits enforced (1-10)
- [ ] No TypeScript errors
- [ ] Tests pass
- [ ] Deployed successfully

## 🚨 Common Issues & Solutions

1. **TypeScript errors after adding feedQuality**:
   - Ensure DEFAULT_PARAMETERS includes feedQuality: 7
   - Check all FarmParameters usages are updated

2. **Slider not updating**:
   - Verify updateParameter is properly typed
   - Check Slider component onChange handler

3. **Build fails**:
   - Run `npm run type-check` to find issues
   - Check for missing imports

## 📚 Documentation References

- **V3 Architecture**: See `ARCHITECTURE_V3.md`
- **Full Roadmap**: See `V3_IMPLEMENTATION_ROADMAP.md`
- **Session Details**: See `SESSION_HANDOFF_V3.md`
- **Technical Specs**: See `TECHNICAL_DOCUMENTATION.md`

## 🎯 Success Criteria

Sprint 1 is complete when:
1. Feed quality parameter is added and functional
2. FeedTuning component displays in BasicDashboard
3. All sliders update emissions in real-time
4. Code is committed and deployed
5. No regressions in existing functionality

---

**Session State**: Ready for handoff
**Next Action**: Implement feedQuality parameter
**Expected Time**: 2-3 hours for Sprint 1

*Good luck with the implementation! The codebase is well-structured and all authentication is in place.*