# 🔀 Context for Next Session - GHG WHAT-IF Tool

## Quick Start Commands
```bash
# Navigate to project
cd ghg-tool

# Install dependencies (if needed)
npm install

# Start development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Run tests
npm test
```

## Current URLs
- **Production**: https://ghg-tool-five.vercel.app
- **GitHub**: https://github.com/17871787/WiT_Risk_Score
- **Vercel Dashboard**: https://vercel.com/joe-towers-projects/ghg-tool

## Authentication Status
- GitHub CLI: Authenticated as user 17871787
- Vercel CLI: Authenticated to team joe-towers-projects
- Git remote: origin points to GitHub repo

## What's Ready to Use
1. **All V4 features are live** - TM, pathways, financing
2. **Testing framework ready** - See `tests/stakeholder-scenarios.md`
3. **Risk calculator CLI** - `node scripts/calculateRiskScore.js --help`
4. **Export functionality** - CSV, JSON, PDF all working

## Only Remaining Task
**Sprint 5: Stakeholder testing and risk matrix validation**
- Use the 4 test scenarios provided
- Validate risk score thresholds
- Gather feedback on new V4 features
- Adjust calculations based on feedback

## Key Technical Details
- **Framework**: React 18 + TypeScript + Vite
- **State**: Zustand store in `src/context/FarmContext.tsx`
- **Calculations**: Pure functions in `src/lib/calculations/`
- **Bundle**: 186KB (Recharts is 100KB of that)
- **Node**: Requires 18.x or 20.x

## Important Constants
- **Theoretical Minimum**: 2000 kg CO₂e/cow/year
- **Carbon Price**: £25/tonne
- **Risk Weights**: 70% emissions, 30% debt
- **Milk Price**: £0.35/L

## Common Tasks

### To modify calculations
1. Edit files in `src/lib/calculations/`
2. Update tests in `src/__tests__/calculations/`
3. Run `npm test` to verify

### To add a new dashboard
1. Create component in `src/dashboards/`
2. Add lazy import in `src/components/DashboardContainer.tsx`
3. Add tab in `src/App.tsx`

### To adjust risk scoring
1. Edit `src/lib/calculations/risk.ts`
2. Update thresholds in `RISK_CATEGORIES`
3. Test with CLI tool

### To deploy changes
```bash
git add -A
git commit -m "description"
git push origin main
vercel --prod
```

## Gotchas & Tips
1. **TypeScript strict** - All parameters need types
2. **Lazy loading** - Dashboards load on demand
3. **Memoization** - Calculations are cached
4. **Feature flags** - Check `src/config/features.ts`
5. **Build errors** - Usually TypeScript, check types

## File Structure
```
ghg-tool/
├── src/
│   ├── components/      # UI components
│   ├── dashboards/      # Dashboard views
│   ├── lib/calculations/  # Business logic
│   ├── hooks/          # React hooks
│   └── context/        # State management
├── scripts/            # CLI tools
├── tests/             # Test scenarios
└── docs/              # Documentation
```

## Contact & Support
- GitHub Issues: https://github.com/17871787/WiT_Risk_Score/issues
- Vercel Support: https://vercel.com/support
- Domain Expert: [Stakeholder contacts needed]

---

**Ready to Continue!** Everything is set up and working. Just need to run the stakeholder testing to complete V4.