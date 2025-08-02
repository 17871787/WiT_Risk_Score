#!/usr/bin/env node

/**
 * WiT_Risk_Score Calculation Script
 * 
 * This script calculates the risk score for a dairy farm based on:
 * - Emissions intensity (kg CO2e/L milk)
 * - Loan leverage (loan amount / herd size)
 * 
 * Usage:
 *   node scripts/calculateRiskScore.js --herd-size 100 --milk-yield 8000 --loan-amount 50000
 *   node scripts/calculateRiskScore.js --json params.json
 */

import { calculateEmissions } from '../src/lib/calculations/emissions';
import { calculateRiskScore, getRiskCategory } from '../src/lib/calculations/risk';
import { FarmParameters } from '../src/types';

// Default parameters
const defaultParams: Partial<FarmParameters> = {
  systemType: 'confined',
  feedQuality: 7,
  concentrateFeed: 8,
  avgLactations: 3.5,
  ageFirstCalving: 24,
  calvingInterval: 380,
  grazingMonths: 0,
  nitrogenRate: 200,
  crudeProtein: 16.5,
  soyaContent: 20,
  deforestationFree: false,
  methaneInhibitor: false,
  improvedManure: false,
  manureSystem: 'liquid/slurry',
  season: 'Annual',
  feedCarbonFootprint: 300,
  loanAmount: 0,
  loanTerm: 60,
  treesPerHa: 0,
  hedgerowLength: 0,
  soilCarbonContent: 2,
  coverCropsHa: 0,
  renewableEnergyKw: 0,
  dieselReductionPercent: 0
};

// Parse command line arguments
function parseArgs(): FarmParameters {
  const args = process.argv.slice(2);
  const params = { ...defaultParams } as FarmParameters;

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    switch (flag) {
      case '--herd-size':
        params.herdSize = parseInt(value);
        break;
      case '--milk-yield':
        params.milkYield = parseInt(value);
        break;
      case '--loan-amount':
        params.loanAmount = parseInt(value);
        break;
      case '--system-type':
        params.systemType = value as 'pasture' | 'confined' | 'hybrid';
        break;
      case '--feed-quality':
        params.feedQuality = parseInt(value);
        break;
      case '--concentrate-feed':
        params.concentrateFeed = parseFloat(value);
        break;
      case '--nitrogen-rate':
        params.nitrogenRate = parseInt(value);
        break;
      case '--crude-protein':
        params.crudeProtein = parseFloat(value);
        break;
      case '--json':
        // Load from JSON file
        const fs = require('fs');
        const jsonData = JSON.parse(fs.readFileSync(value, 'utf8'));
        Object.assign(params, jsonData);
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  // Validate required parameters
  if (!params.herdSize || !params.milkYield) {
    console.error('Error: herd-size and milk-yield are required parameters');
    printHelp();
    process.exit(1);
  }

  return params;
}

function printHelp() {
  console.log(`
WiT_Risk_Score Calculator

Usage:
  node calculateRiskScore.js --herd-size <number> --milk-yield <number> [options]
  node calculateRiskScore.js --json <file.json>

Required Parameters:
  --herd-size <number>        Number of cows in the herd
  --milk-yield <number>       Annual milk yield per cow (L/cow/year)

Optional Parameters:
  --loan-amount <number>      Loan amount in £ (default: 0)
  --system-type <type>        pasture|confined|hybrid (default: confined)
  --feed-quality <1-10>       Feed quality score (default: 7)
  --concentrate-feed <kg>     Concentrate feed kg/day (default: 8)
  --nitrogen-rate <kg/ha>     Nitrogen application rate (default: 200)
  --crude-protein <%>         Crude protein percentage (default: 16.5)
  --json <file>               Load all parameters from JSON file

Output:
  The script outputs a detailed risk assessment including:
  - Emissions intensity and breakdown
  - Risk score (0-100)
  - Risk category (Very Low to Very High)
  - Loan leverage metrics
  - Recommendations for improvement

Examples:
  # Basic calculation
  node calculateRiskScore.js --herd-size 100 --milk-yield 8000 --loan-amount 50000

  # Using JSON file
  node calculateRiskScore.js --json farm-params.json

  # Detailed parameters
  node calculateRiskScore.js --herd-size 150 --milk-yield 9000 --loan-amount 100000 \\
    --system-type hybrid --feed-quality 8 --nitrogen-rate 150
  `);
}

function calculateAndDisplayResults(params: FarmParameters) {
  // Calculate emissions
  const emissionsBreakdown = calculateEmissions(params);
  const emissionsIntensity = emissionsBreakdown.totalAnnualEmissions / params.milkYield;
  
  // Calculate risk score
  const riskScore = calculateRiskScore(emissionsIntensity, params.loanAmount, params.herdSize);
  const riskCategory = getRiskCategory(riskScore);
  
  // Calculate loan leverage
  const loanPerCow = params.loanAmount / params.herdSize;
  const loanAsPercentOfRevenue = (params.loanAmount / (params.milkYield * params.herdSize * 0.35)) * 100;
  
  // Display results
  console.log('\n=== WiT RISK SCORE CALCULATION RESULTS ===\n');
  
  console.log('FARM PARAMETERS:');
  console.log(`  Herd Size: ${params.herdSize} cows`);
  console.log(`  Milk Yield: ${params.milkYield.toLocaleString()} L/cow/year`);
  console.log(`  System Type: ${params.systemType}`);
  console.log(`  Loan Amount: £${params.loanAmount.toLocaleString()}`);
  
  console.log('\nEMISSIONS ANALYSIS:');
  console.log(`  Total Emissions: ${emissionsBreakdown.totalAnnualEmissions.toFixed(1)} kg CO₂e/cow/year`);
  console.log(`  Emissions Intensity: ${emissionsIntensity.toFixed(3)} kg CO₂e/L milk`);
  console.log(`  Breakdown:`);
  console.log(`    - Enteric: ${emissionsBreakdown.entericEmissions.toFixed(1)} kg CO₂e/cow/year`);
  console.log(`    - Manure: ${emissionsBreakdown.manureEmissions.toFixed(1)} kg CO₂e/cow/year`);
  console.log(`    - Feed: ${emissionsBreakdown.feedEmissions.toFixed(1)} kg CO₂e/cow/year`);
  console.log(`    - Nitrogen: ${emissionsBreakdown.nitrogenEmissions.toFixed(1)} kg CO₂e/cow/year`);
  
  console.log('\nRISK ASSESSMENT:');
  console.log(`  Risk Score: ${riskScore.toFixed(1)}/100`);
  console.log(`  Risk Category: ${riskCategory}`);
  console.log(`  Loan per Cow: £${loanPerCow.toFixed(0)}`);
  console.log(`  Loan as % of Revenue: ${loanAsPercentOfRevenue.toFixed(1)}%`);
  
  console.log('\nRECOMMENDATIONS:');
  if (riskScore > 60) {
    console.log('  ⚠️  HIGH RISK - Immediate action recommended:');
    if (emissionsIntensity > 1.2) {
      console.log('     • Reduce emissions intensity through improved feeding');
      console.log('     • Consider methane inhibitors or improved genetics');
    }
    if (loanPerCow > 1000) {
      console.log('     • High debt load - consider restructuring');
      console.log('     • Focus on increasing milk yield to improve cash flow');
    }
  } else if (riskScore > 40) {
    console.log('  ⚡ MODERATE RISK - Improvements recommended:');
    console.log('     • Optimize feed efficiency');
    console.log('     • Consider renewable energy investments');
    console.log('     • Monitor debt levels carefully');
  } else {
    console.log('  ✅ LOW RISK - Well positioned:');
    console.log('     • Continue current management practices');
    console.log('     • Consider expansion opportunities');
    console.log('     • Eligible for green financing options');
  }
  
  // Output JSON format if requested
  if (process.argv.includes('--output-json')) {
    const output = {
      parameters: {
        herdSize: params.herdSize,
        milkYield: params.milkYield,
        systemType: params.systemType,
        loanAmount: params.loanAmount
      },
      emissions: {
        total: emissionsBreakdown.totalAnnualEmissions,
        intensity: emissionsIntensity,
        breakdown: {
          enteric: emissionsBreakdown.entericEmissions,
          manure: emissionsBreakdown.manureEmissions,
          feed: emissionsBreakdown.feedEmissions,
          nitrogen: emissionsBreakdown.nitrogenEmissions
        }
      },
      risk: {
        score: riskScore,
        category: riskCategory,
        loanPerCow,
        loanAsPercentOfRevenue
      }
    };
    console.log('\n\nJSON OUTPUT:');
    console.log(JSON.stringify(output, null, 2));
  }
}

// Main execution
if (require.main === module) {
  try {
    const params = parseArgs();
    calculateAndDisplayResults(params);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}