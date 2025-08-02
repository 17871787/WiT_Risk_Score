import React, { useState } from 'react';
import { Download, FileText, FileJson } from 'lucide-react';
import { useFarmStore } from '../context/FarmContext';
import { generateExportData, exportToCSV, exportToJSON, downloadFile } from '../utils/exportData';

export const ExportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const parameters = useFarmStore((state) => state.parameters);
  
  const handleExportCSV = () => {
    const data = generateExportData(parameters);
    const csv = exportToCSV(data);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `ghg-report-${timestamp}.csv`, 'text/csv');
    setIsOpen(false);
  };
  
  const handleExportJSON = () => {
    const data = generateExportData(parameters);
    const json = exportToJSON(data);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(json, `ghg-report-${timestamp}.json`, 'application/json');
    setIsOpen(false);
  };
  
  const handleExportPDF = () => {
    // For PDF export, we'll create a printable HTML version
    const data = generateExportData(parameters);
    const timestamp = new Date().toISOString().split('T')[0];
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GHG Report - ${timestamp}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1f2937; }
          h2 { color: #374151; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background-color: #f3f4f6; font-weight: bold; }
          .metric { display: flex; justify-content: space-between; padding: 5px 0; }
          .value { font-weight: bold; }
          .category-${data.theoreticalMinimum.category.toLowerCase()} { 
            color: ${
              data.theoreticalMinimum.category === 'Excellent' ? '#10b981' :
              data.theoreticalMinimum.category === 'Good' ? '#3b82f6' :
              data.theoreticalMinimum.category === 'Average' ? '#f59e0b' : '#ef4444'
            }; 
          }
          @media print { 
            body { margin: 0; }
            h2 { page-break-before: auto; }
          }
        </style>
      </head>
      <body>
        <h1>GHG WHAT-IF Tool Report</h1>
        <p>Generated: ${new Date(data.timestamp).toLocaleString()}</p>
        <p>Farm: ${data.farmName}</p>
        
        <h2>Executive Summary</h2>
        <div class="metric">
          <span>Total Annual Emissions:</span>
          <span class="value">${data.emissions.total.toFixed(1)} t CO₂e</span>
        </div>
        <div class="metric">
          <span>Emissions Intensity:</span>
          <span class="value">${data.emissions.intensity.toFixed(3)} kg CO₂e/L</span>
        </div>
        <div class="metric">
          <span>Performance vs Theoretical Minimum:</span>
          <span class="value category-${data.theoreticalMinimum.category.toLowerCase()}">
            ${data.theoreticalMinimum.percentageAbove.toFixed(1)}% above (${data.theoreticalMinimum.category})
          </span>
        </div>
        
        <h2>Performance Metrics</h2>
        <table>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Unit</th>
          </tr>
          <tr>
            <td>LME (Lifetime Methane Efficiency)</td>
            <td>${data.performance.lme.toFixed(0)}</td>
            <td>L milk/t CO₂e</td>
          </tr>
          <tr>
            <td>NUE (Nitrogen Use Efficiency)</td>
            <td>${data.performance.nue.toFixed(1)}</td>
            <td>%</td>
          </tr>
          <tr>
            <td>Combined LME+NUE</td>
            <td>${data.performance.lmePlusNue.toFixed(1)}</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Sustainability Score</td>
            <td>${data.performance.sustainabilityScore.toFixed(1)}</td>
            <td>/100</td>
          </tr>
        </table>
        
        <h2>Emissions Breakdown</h2>
        <table>
          <tr>
            <th>Source</th>
            <th>Emissions</th>
            <th>Unit</th>
          </tr>
          <tr>
            <td>Enteric Methane</td>
            <td>${data.emissions.breakdown.enteric.toFixed(1)}</td>
            <td>kg CO₂e/cow/year</td>
          </tr>
          <tr>
            <td>Manure</td>
            <td>${data.emissions.breakdown.manure.toFixed(1)}</td>
            <td>kg CO₂e/cow/year</td>
          </tr>
          <tr>
            <td>Feed</td>
            <td>${data.emissions.breakdown.feed.toFixed(1)}</td>
            <td>kg CO₂e/cow/year</td>
          </tr>
          <tr>
            <td>Nitrogen</td>
            <td>${data.emissions.breakdown.nitrogen.toFixed(1)}</td>
            <td>kg CO₂e/cow/year</td>
          </tr>
        </table>
        
        <h2>Reduction Pathway</h2>
        <p>Total reduction potential: <strong>${(data.reductionPathway.totalPotential / 1000).toFixed(1)} t CO₂e/year</strong></p>
        <p>Investment needed: <strong>£${data.reductionPathway.totalCost.toLocaleString()}</strong></p>
        <p>Can reach theoretical minimum: <strong>${data.reductionPathway.canReachTM ? 'Yes' : 'No'}</strong></p>
        
        <h3>Top Reduction Measures</h3>
        <table>
          <tr>
            <th>Measure</th>
            <th>Potential</th>
            <th>Cost</th>
            <th>ROI</th>
          </tr>
          ${data.reductionPathway.measures.slice(0, 5).map(m => `
            <tr>
              <td>${m.name}</td>
              <td>${m.potential.toFixed(0)} kg CO₂e</td>
              <td>£${m.cost.toLocaleString()}</td>
              <td>${m.roi.toFixed(0)}%</td>
            </tr>
          `).join('')}
        </table>
        
        <h2>Financing Summary</h2>
        <table>
          <tr>
            <td>Total Investment</td>
            <td>£${data.financing.totalInvestment.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Monthly Payment</td>
            <td>£${data.financing.monthlyPayment.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Payback Period</td>
            <td>${data.financing.paybackPeriod.toFixed(1)} years</td>
          </tr>
          <tr>
            <td>NPV (10 years)</td>
            <td>£${data.financing.npv.toFixed(0)}</td>
          </tr>
          <tr>
            <td>IRR</td>
            <td>${(data.financing.irr * 100).toFixed(1)}%</td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        Export Report
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-gray-600" />
            Export as CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <FileJson className="w-4 h-4 text-gray-600" />
            Export as JSON
          </button>
          <button
            onClick={handleExportPDF}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors rounded-b-lg"
          >
            <FileText className="w-4 h-4 text-gray-600" />
            Print/PDF Report
          </button>
        </div>
      )}
    </div>
  );
};