# Changelog

All notable changes to the GHG WHAT-IF Tool will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2025-08-02

### Added

#### Theoretical Minimum (TM) Features
- Biological floor calculation at 2000 kg CO₂e/cow/year
- Percentage above TM tracking across all dashboards
- Visual TM line on Net Carbon Glide Path
- TM achievement indicators in UI
- Regional reference values (UK, NZ, EU averages)

#### Reduction Pathway Analysis
- 8 reduction measures with ROI calculations
  - Feed quality improvements
  - Methane inhibitors
  - Manure system upgrades
  - Genetics optimization
  - Energy efficiency
  - Heat recovery
  - Renewable energy
  - Precision agriculture
- Waterfall chart visualization
- Implementation timeline projections
- Cost-effectiveness ranking

#### Green Financing Module
- 5 financing options
  - Green Agriculture Loans
  - Government Grants
  - Carbon Credits
  - Sustainability Bonds
  - Blended Finance
- NPV and IRR calculations
- Automatic package optimization
- Payback period analysis
- Interest rate discounts for green practices

#### Scenario-Finance Integration
- Real-time financing updates when scenarios change
- Investment requirements for each practice
- ROI calculations per scenario
- Linked carbon credit potential

#### Enhanced Exports
- CSV export with all V4 metrics
- JSON export with complete data structure
- PDF/Print functionality
- Includes TM, pathways, and financing data

### Changed

#### Performance Optimizations
- Bundle size reduced from 570KB to 191KB gzipped
- Lazy loading for all dashboards
- React.memo on heavy chart components
- Memoized calculation hooks
- Debounce utilities for expensive operations

#### Calculation Improvements
- Centralized constants with citations
- Environment variable override capability
- Edge case protection (division by zero)
- Upper bounds on unrealistic values

#### Testing
- Comprehensive tests for NUE calculations
- Tests for Theoretical Minimum functions
- Edge case and boundary testing
- Integration scenario testing

### Fixed
- TypeScript build errors for Vercel deployment
- Missing export data for V4 features
- Chart rendering performance issues
- Accessibility warnings in console

## [3.0.0] - 2025-07-15

### Added

#### Nitrogen Use Efficiency (NUE)
- NUE calculation based on N inputs/outputs
- Integration with LME for combined metric
- Visual NUE display with interpretation
- Feed quality impact on NUE
- Manure system efficiency factors

#### Enhanced Scenario Builder
- NUE-aware scenario comparisons
- Feed parameter toggles
- Protein optimization scenarios
- Real-time NUE updates

#### Dashboard Architecture
- ViewContext for tab management
- Lazy-loaded dashboard components
- Suspense boundaries for code splitting
- Error boundaries per dashboard

### Changed
- Migrated from Create React App to Vite
- Improved state management with Zustand
- Enhanced TypeScript coverage
- Modular component architecture

### Fixed
- Performance penalties for poor KPIs
- Risk scoring sensitivity
- Feed parameter visibility
- Mobile responsive layouts

## [2.0.0] - 2025-06-01

### Added

#### Risk Scoring System
- Emissions intensity-based risk calculation
- Loan leverage component
- Risk categories (Very Low to Very High)
- Visual risk indicators

#### Loan Calculator
- Risk-based interest rates
- Monthly payment calculations
- Total interest projections
- Loan comparison tools

#### Scenario Builder
- Practice toggle interface
- Side-by-side comparisons
- Real-time emission updates
- Financial impact analysis

### Changed
- Refactored monolithic component into modules
- Added TypeScript for type safety
- Implemented proper state management
- Created reusable calculation utilities

### Fixed
- Critical calculation bugs
- Division by zero errors
- Input validation issues
- Accessibility problems

## [1.0.0] - 2025-04-01

### Initial Release
- Basic emissions calculations
- Lifetime Methane Efficiency (LME)
- Simple parameter inputs
- Basic visualization
- CSV export functionality

---

## Versioning Strategy

- **Major versions (X.0.0)**: Breaking changes or significant feature additions
- **Minor versions (0.X.0)**: New features that are backwards compatible
- **Patch versions (0.0.X)**: Bug fixes and minor improvements

## Migration Guides

### Migrating from V3 to V4
1. Update all imports for lazy-loaded components
2. Add TM tracking to custom dashboards
3. Update export parsing for new V4 fields
4. Review financing options configuration

### Migrating from V2 to V3
1. Update calculation imports for NUE
2. Add crude protein parameter to forms
3. Update scenario builder for feed parameters
4. Review dashboard routing changes