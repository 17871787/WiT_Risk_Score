# 🧪 Stakeholder Testing Scenarios - GHG WHAT-IF Tool

## Overview
This document provides test scenarios for stakeholder validation of the GHG WHAT-IF Tool V4. Each scenario represents a real-world farm configuration to validate calculations and user experience.

## Test Scenarios

### Scenario 1: High-Performing Pasture Farm
**Profile**: Efficient grass-based system with excellent genetics

**Parameters**:
- Herd Size: 200 cows
- Milk Yield: 7,500 L/cow/year
- System Type: Pasture
- Feed Quality: 9/10
- Concentrate Feed: 4 kg/day
- Nitrogen Rate: 150 kg N/ha
- Avg Lactations: 4.5
- Calving Interval: 365 days
- Loan Amount: £100,000

**Expected Results**:
- LME Score: ~7,000-8,000
- NUE: ~40-45%
- Risk Score: Low (20-30)
- Should be ~10-20% above TM

**Validation Points**:
- ✓ Emissions should be lower due to pasture system
- ✓ High LME due to good efficiency
- ✓ Low risk due to good performance
- ✓ Eligible for green financing

### Scenario 2: Intensive Confined System
**Profile**: High-yielding confined system with moderate efficiency

**Parameters**:
- Herd Size: 500 cows
- Milk Yield: 11,000 L/cow/year
- System Type: Confined
- Feed Quality: 7/10
- Concentrate Feed: 12 kg/day
- Nitrogen Rate: 250 kg N/ha
- Avg Lactations: 3.0
- Calving Interval: 400 days
- Loan Amount: £500,000

**Expected Results**:
- LME Score: ~5,500-6,500
- NUE: ~25-30%
- Risk Score: Moderate (40-50)
- Should be ~40-60% above TM

**Validation Points**:
- ✓ Higher emissions from confined system
- ✓ Moderate LME despite high yield
- ✓ Lower NUE due to high inputs
- ✓ Performance penalties applied

### Scenario 3: Struggling Small Farm
**Profile**: Small farm with poor KPIs and high debt

**Parameters**:
- Herd Size: 80 cows
- Milk Yield: 6,000 L/cow/year
- System Type: Hybrid
- Feed Quality: 5/10
- Concentrate Feed: 6 kg/day
- Nitrogen Rate: 200 kg N/ha
- Avg Lactations: 2.5
- Calving Interval: 420 days
- Loan Amount: £150,000

**Expected Results**:
- LME Score: ~3,500-4,500
- NUE: ~20-25%
- Risk Score: High (60-70)
- Should be ~80-100% above TM

**Validation Points**:
- ✓ Poor performance triggers penalties
- ✓ High debt/cow ratio increases risk
- ✓ Multiple reduction measures needed
- ✓ May struggle to reach TM

### Scenario 4: Progressive Carbon-Neutral Farm
**Profile**: Farm implementing multiple mitigation measures

**Parameters**:
- Herd Size: 250 cows
- Milk Yield: 8,500 L/cow/year
- System Type: Hybrid
- Feed Quality: 8/10
- Concentrate Feed: 8 kg/day
- Nitrogen Rate: 180 kg N/ha
- Avg Lactations: 4.0
- Calving Interval: 375 days
- Loan Amount: £200,000
- **Mitigation Measures**:
  - Trees: 50/ha
  - Hedgerows: 5,000m
  - Cover Crops: 100 ha
  - Renewable Energy: 100 kW
  - Methane Inhibitor: Yes
  - Improved Manure: Yes

**Expected Results**:
- LME Score: ~6,500-7,500
- NUE: ~35-40%
- Risk Score: Very Low (10-20)
- Should be approaching TM

**Validation Points**:
- ✓ Significant sequestration offsets
- ✓ Methane reduction visible
- ✓ Excellent financing options
- ✓ Near or at theoretical minimum

## Test Procedures

### 1. Input Validation
For each scenario:
- [ ] Enter all parameters manually
- [ ] Verify sliders respond correctly
- [ ] Check calculations update in real-time
- [ ] Confirm no error messages

### 2. Calculation Validation
For each scenario:
- [ ] Record all calculated values
- [ ] Compare with expected ranges
- [ ] Note any unexpected results
- [ ] Verify consistency across dashboards

### 3. Scenario Builder Testing
For each scenario:
- [ ] Create scenario with different practices
- [ ] Verify emissions changes are logical
- [ ] Check financing calculations
- [ ] Export scenario data

### 4. Export Testing
For each scenario:
- [ ] Export as CSV
- [ ] Export as JSON
- [ ] Print/PDF export
- [ ] Verify all data included

### 5. User Experience
For each scenario:
- [ ] Navigation is intuitive
- [ ] Charts are readable
- [ ] Recommendations make sense
- [ ] Help text is clear

## Validation Checklist

### Emissions Calculations
- [ ] Enteric emissions scale with yield
- [ ] Feed quality impacts are visible
- [ ] System type differences are clear
- [ ] Performance penalties applied correctly

### Financial Calculations
- [ ] Risk scores align with farm performance
- [ ] Loan calculations are accurate
- [ ] Green financing eligibility correct
- [ ] ROI calculations reasonable

### Advanced Features
- [ ] Theoretical Minimum tracking works
- [ ] Reduction pathways are feasible
- [ ] Financing packages optimize correctly
- [ ] NUE calculations are accurate

## Feedback Form

### For Each Scenario
**Scenario #**: _____

**Accuracy** (1-5): _____
- Are the calculations believable?
- Do results match real-world experience?

**Usability** (1-5): _____
- Is the interface intuitive?
- Can you find all features?

**Value** (1-5): _____
- Would this help farm decision-making?
- Are the insights actionable?

**Comments**:
```
[Space for detailed feedback]
```

### Overall Assessment

**Strengths**:
1. _________________________________
2. _________________________________
3. _________________________________

**Areas for Improvement**:
1. _________________________________
2. _________________________________
3. _________________________________

**Missing Features**:
1. _________________________________
2. _________________________________
3. _________________________________

**Would you recommend this tool?** Yes / No
**Why?** _________________________________

## Risk Matrix Validation

### Risk Score Ranges
Validate that these risk categories feel appropriate:

| Score | Category | Description | Appropriate? |
|-------|----------|-------------|--------------|
| 0-20 | Very Low | Excellent performance, low debt | ☐ Yes ☐ No |
| 20-40 | Low | Good performance, manageable debt | ☐ Yes ☐ No |
| 40-60 | Moderate | Average performance or debt concerns | ☐ Yes ☐ No |
| 60-80 | High | Poor performance or high debt | ☐ Yes ☐ No |
| 80-100 | Very High | Critical issues requiring action | ☐ Yes ☐ No |

### Suggested Adjustments:
```
[Space for risk matrix feedback]
```

## Technical Issues Log

| Date | Scenario | Issue Description | Steps to Reproduce | Severity |
|------|----------|------------------|-------------------|----------|
| | | | | |
| | | | | |
| | | | | |

## Next Steps

After stakeholder testing:
1. Compile all feedback
2. Prioritize issues by severity
3. Update calculations if needed
4. Refine user interface
5. Create training materials
6. Plan rollout strategy

---

*Testing Period: [Start Date] - [End Date]*
*Stakeholder Groups: Farmers, Consultants, Lenders, Researchers*