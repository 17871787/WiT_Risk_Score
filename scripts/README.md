# 📜 GHG WHAT-IF Tool Scripts

This directory contains utility scripts for the GHG WHAT-IF Tool.

## Available Scripts

### 1. WiT Risk Score Calculator
Calculate risk scores for dairy farms based on emissions and financial leverage.

**Usage**:
```bash
# Basic usage with required parameters
node scripts/calculateRiskScore.js --herd-size 100 --milk-yield 8000 --loan-amount 50000

# Using a JSON file for parameters
node scripts/calculateRiskScore.js --json scripts/example-params.json

# With additional options
node scripts/calculateRiskScore.js --herd-size 150 --milk-yield 9000 --loan-amount 100000 \
  --system-type hybrid --feed-quality 8 --nitrogen-rate 150

# Output as JSON
node scripts/calculateRiskScore.js --herd-size 100 --milk-yield 8000 --output-json

# Show help
node scripts/calculateRiskScore.js --help
```

**Parameters**:
- `--herd-size` (required): Number of cows
- `--milk-yield` (required): Annual milk yield per cow (L/cow/year)
- `--loan-amount`: Loan amount in £ (default: 0)
- `--system-type`: pasture|confined|hybrid (default: confined)
- `--feed-quality`: Feed quality score 1-10 (default: 7)
- `--concentrate-feed`: Concentrate feed kg/day (default: 8)
- `--nitrogen-rate`: Nitrogen application kg N/ha (default: 200)
- `--json`: Load all parameters from JSON file
- `--output-json`: Also output results as JSON

**Example Output**:
```
=== WiT RISK SCORE CALCULATION RESULTS ===

FARM PARAMETERS:
  Herd Size: 150 cows
  Milk Yield: 8,500 L/cow/year
  System Type: hybrid
  Loan Amount: £120,000

EMISSIONS ANALYSIS:
  Total Emissions: 4,234.5 kg CO₂e/cow/year
  Emissions Intensity: 0.498 kg CO₂e/L milk
  Breakdown:
    - Enteric: 2,520.0 kg CO₂e/cow/year
    - Manure: 720.0 kg CO₂e/cow/year
    - Feed: 724.5 kg CO₂e/cow/year
    - Nitrogen: 270.0 kg CO₂e/cow/year

RISK ASSESSMENT:
  Risk Score: 28.4/100
  Risk Category: Low
  Loan per Cow: £800
  Loan as % of Revenue: 26.9%

RECOMMENDATIONS:
  ✅ LOW RISK - Well positioned:
     • Continue current management practices
     • Consider expansion opportunities
     • Eligible for green financing options
```

### 2. Example Parameters File
`example-params.json` provides a template for batch processing multiple farms.

**Structure**:
```json
{
  "herdSize": 150,
  "milkYield": 8500,
  "loanAmount": 120000,
  "systemType": "hybrid",
  "feedQuality": 8,
  // ... additional parameters
}
```

## Running Scripts in Production

For production use with the built application:

1. Build the project first:
   ```bash
   npm run build
   ```

2. The TypeScript version (`calculateRiskScore.ts`) can be compiled:
   ```bash
   npx tsc scripts/calculateRiskScore.ts --outDir scripts/dist
   node scripts/dist/calculateRiskScore.js --help
   ```

3. The JavaScript version (`calculateRiskScore.js`) includes simplified calculations and can be run directly.

## Integration with CI/CD

These scripts can be integrated into CI/CD pipelines for automated testing:

```yaml
# Example GitHub Actions usage
- name: Test Risk Calculations
  run: |
    node scripts/calculateRiskScore.js --herd-size 100 --milk-yield 8000 --loan-amount 50000 --output-json > test-output.json
    # Add assertions on test-output.json
```

## Development

To add new scripts:

1. Create the script file in this directory
2. Add documentation to this README
3. Include example usage and parameters
4. Consider both TypeScript and JavaScript versions
5. Add to package.json scripts if frequently used:
   ```json
   "scripts": {
     "risk-score": "node scripts/calculateRiskScore.js"
   }
   ```

## Notes

- Scripts use simplified calculations for standalone operation
- For exact calculations matching the web app, import from the built dist folder
- All monetary values are in GBP (£)
- Emissions are in kg CO₂e unless otherwise specified