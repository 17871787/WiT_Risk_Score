#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const URL = process.argv[2] || 'https://ghg-tool-five.vercel.app';

console.log(`🚀 Running Lighthouse audit on ${URL}...`);

try {
  // Run Lighthouse
  execSync(`npx lighthouse ${URL} --output=json --output-path=./lighthouse-report.json --quiet`, {
    stdio: 'inherit'
  });

  // Read and parse the report
  const report = JSON.parse(await fs.readFile('./lighthouse-report.json', 'utf-8'));
  
  // Extract scores
  const scores = {
    performance: Math.round(report.categories.performance.score * 100),
    accessibility: Math.round(report.categories.accessibility.score * 100),
    'best-practices': Math.round(report.categories['best-practices'].score * 100),
    seo: Math.round(report.categories.seo.score * 100),
  };

  // Display results
  console.log('\n📊 Lighthouse Scores:');
  console.log('═══════════════════════════════════════');
  
  Object.entries(scores).forEach(([category, score]) => {
    const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
    console.log(`${emoji} ${category.padEnd(20)} ${score}%`);
  });

  // Key metrics
  console.log('\n⚡ Core Web Vitals:');
  console.log('═══════════════════════════════════════');
  
  const metrics = {
    'First Contentful Paint': report.audits['first-contentful-paint'].displayValue,
    'Largest Contentful Paint': report.audits['largest-contentful-paint'].displayValue,
    'Total Blocking Time': report.audits['total-blocking-time'].displayValue,
    'Cumulative Layout Shift': report.audits['cumulative-layout-shift'].displayValue,
  };

  Object.entries(metrics).forEach(([metric, value]) => {
    console.log(`${metric.padEnd(30)} ${value}`);
  });

  // Accessibility issues
  const a11yAudits = Object.values(report.audits)
    .filter(audit => audit.details && audit.score !== null && audit.score < 1)
    .filter(audit => report.categories.accessibility.auditRefs.some(ref => ref.id === audit.id));

  if (a11yAudits.length > 0) {
    console.log('\n⚠️  Accessibility Issues:');
    console.log('═══════════════════════════════════════');
    a11yAudits.forEach(audit => {
      console.log(`• ${audit.title}`);
    });
  }

  // Check against thresholds
  console.log('\n✅ Threshold Checks:');
  console.log('═══════════════════════════════════════');
  
  const thresholds = {
    performance: 70,
    accessibility: 90,
    'best-practices': 80,
    seo: 80,
  };

  let passed = true;
  Object.entries(thresholds).forEach(([category, threshold]) => {
    const score = scores[category];
    const status = score >= threshold ? '✅ PASS' : '❌ FAIL';
    console.log(`${category.padEnd(20)} ${status} (${score}% / ${threshold}% required)`);
    if (score < threshold) passed = false;
  });

  // Generate HTML report
  execSync(`npx lighthouse ${URL} --output=html --output-path=./lighthouse-report.html --quiet`);
  console.log('\n📄 Full report saved to: lighthouse-report.html');

  // Exit with error if thresholds not met
  if (!passed) {
    console.log('\n❌ Some thresholds were not met!');
    process.exit(1);
  } else {
    console.log('\n✅ All thresholds passed!');
  }

} catch (error) {
  console.error('Error running Lighthouse:', error.message);
  process.exit(1);
}