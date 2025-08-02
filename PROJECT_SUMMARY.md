# GHG WHAT-IF Tool - Quick Project Summary

## 🎯 Project Purpose
A React/TypeScript web application for dairy farmers to optimize greenhouse gas emissions, calculate carbon footprints, and explore financing options for sustainable practices.

## 🔗 Key URLs
- **Live App**: https://ghg-tool-five.vercel.app
- **GitHub**: https://github.com/17871787/WiT_Risk_Score
- **Vercel**: https://vercel.com/joe-towers-projects/ghg-tool

## 📁 Project Location
```
C:\Users\jtowe\ghg-tool
```

## 🛠️ Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Zustand (state management)
- Tailwind CSS (styling)
- Recharts (charts)
- Vercel (deployment)

## 🚀 Essential Commands
```bash
npm run dev          # Start development
npm run build        # Build for production
vercel --prod        # Deploy to production
git status           # Check git status
```

## 📊 Current Features
1. **Emissions Calculator** - Calculates farm GHG emissions
2. **Risk Scoring** - Based on emissions intensity + loan amount
3. **LME** - Lifetime Methane Efficiency metric
4. **NUE** - Nitrogen Use Efficiency (V3)
5. **Theoretical Minimum** - Biological floor tracking (V4)
6. **Scenario Builder** - What-if analysis
7. **Loan Calculator** - Green financing options
8. **Carbon Sequestration** - Planning and projections

## 🏗️ Architecture
- **6 Lazy-loaded dashboards** (Basic, Farm, Heifer, Sequestration, Effectiveness, Scenarios)
- **40+ components** organized by type (charts, parameters, ui)
- **Pure calculation functions** in /lib/calculations/
- **Custom hooks** for data flow
- **Zustand store** for global state

## 📈 Project Status
- **Version**: 4.0 (Sprint 1 complete)
- **Bundle Size**: ~172KB gzipped
- **Performance**: 90+ Lighthouse score
- **Last Deploy**: August 2, 2025

## ⚡ Quick Facts
- No backend required (all client-side)
- Fully typed with TypeScript
- Mobile responsive
- ~2 second load time
- Comprehensive input validation
- Real-time recalculations

## 🔐 Access
- GitHub CLI: ✅ Authenticated
- Vercel CLI: ✅ Authenticated
- No additional login needed

## 📝 Next Sprint
V4 Sprint 2: Reduction Pathway Logic
- Show opportunities to reach Theoretical Minimum
- Calculate specific interventions needed
- Visualize pathway to net zero

---

*Everything needed to understand and continue development is documented in the accompanying architecture files.*