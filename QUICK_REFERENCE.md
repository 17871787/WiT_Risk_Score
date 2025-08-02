# Quick Reference - GHG WHAT-IF Tool Development

## 🚀 Essential Commands

```bash
# Start development
cd ghg-tool
npm run dev

# Deploy to production
vercel --prod

# Git workflow
git add -A
git commit -m "feat: description"
git push origin main
```

## 📁 Project Structure
```
ghg-tool/
├── src/
│   ├── types/index.ts          # Add feedQuality here
│   ├── context/FarmContext.tsx # Update store here
│   ├── components/             # Add FeedTuning.tsx here
│   └── dashboards/             # Update BasicDashboard here
├── dist/                       # Build output
└── public/                     # Static assets
```

## 🔗 Important URLs
- **Live Site**: https://ghg-tool-five.vercel.app
- **GitHub**: https://github.com/17871787/WiT_Risk_Score
- **Vercel Dashboard**: https://vercel.com/joe-towers-projects/ghg-tool

## 📝 Current Task (Sprint 1)
1. Add `feedQuality: number` to FarmParameters
2. Create FeedTuning component
3. Add to BasicDashboard
4. Test and deploy

## 🎯 V3 Goal
Integrate NUE (Nitrogen Use Efficiency) to create LME+NUE metric:
- NUE = (Milk N output / Total N applied) × 100
- LME+NUE = LME × (NUE/100)

## ⚡ Key Constants
- Theoretical minimum: 0.78 kg CO₂e/L
- Milk N content: 0.0055 kg N/L
- Default feed quality: 7 (scale 1-10)

## 🐛 Debug Tips
```bash
# Check TypeScript
npm run type-check

# View build errors
npm run build

# Check current branch
git branch

# View deployment logs
vercel logs
```

---
*See AUTOCOMPACT_HANDOFF.md for detailed instructions*