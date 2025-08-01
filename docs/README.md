# GHG WHAT-IF Tool Documentation

## Quick Links

- 📊 [Technical Documentation](../TECHNICAL_DOCUMENTATION.md) - Core equations, constants, and validation limits
- 🚦 [Lighthouse Setup](./lighthouse-setup.md) - Performance monitoring configuration
- 📁 [Project README](../README.md) - Project overview and setup instructions

## Documentation Overview

### Technical Documentation
The technical documentation contains:
- **Core Equations**: All mathematical formulas used in calculations
- **Conversion Formulas**: Unit conversions and GHG equivalencies  
- **Hardcoded Constants**: Emission factors, economic values, system factors
- **Assumptions**: Production, emissions, economic, and sequestration assumptions
- **Default Values**: Initial parameter settings
- **Validation Limits**: Min/max values and constraints for all inputs

### Key Calculation Areas

1. **Emissions Calculations**
   - Enteric methane (CH₄)
   - Manure management
   - Feed production
   - Nitrogen application (N₂O)
   - Energy use

2. **Lifetime Methane Efficiency (LME)**
   - Lifetime production calculations
   - Productive vs non-productive days
   - System efficiency factors

3. **Carbon Sequestration**
   - Tree planting (12 t CO₂e/ha/year)
   - Hedgerows (0.5 t CO₂e/km/year)
   - Soil carbon (2.5 t CO₂e/ha/year)
   - Cover crops (1.5 t CO₂e/ha/year)

4. **Economic Analysis**
   - Feed costs
   - Labor and veterinary costs
   - Revenue calculations
   - Cost per liter analysis

5. **Risk Assessment**
   - Environmental risk (emissions intensity)
   - Financial leverage impact
   - Composite risk scoring

### Important Constants

| Category | Key Values |
|----------|------------|
| **Emissions** | CH₄ GWP: 28, N₂O GWP: 298 |
| **Production** | Lactation: 305 days, DMI factor: 0.4 |
| **Economic** | Base milk price: £0.40/L |
| **Risk Thresholds** | Low: <1.0, Medium: 1.0-1.5, High: >1.5 kg CO₂e/L |

### Data Sources
- IPCC 2019 Guidelines
- UK dairy sector data (2023-2024)
- Peer-reviewed sequestration studies
- UK Met Office seasonal patterns

---

For detailed information, please refer to the [Technical Documentation](../TECHNICAL_DOCUMENTATION.md).