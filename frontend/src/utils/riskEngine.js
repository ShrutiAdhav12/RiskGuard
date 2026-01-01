// Risk Scoring & Rule Engine Module
// Calculates risk scores and applies underwriting rules

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Calculate base risk score (0-100) based on age
 */
const assessAgeRisk = (age) => {
  if (!age) return 20; // Default if age unknown
  if (age < 18) return 50; // Too young
  if (age < 25) return 35; // Young adult
  if (age < 40) return 15; // Optimal age
  if (age < 60) return 25; // Middle age
  if (age < 75) return 40; // Senior
  return 70; // Very senior
};

/**
 * Assess health risk based on medical conditions
 */
const assessHealthRisk = (medicalHistory, preExistingConditions, currentMedications) => {
  let score = 0;

  if (!medicalHistory && !preExistingConditions) {
    return 5; // Excellent health
  }

  // Pre-existing conditions assessment
  if (preExistingConditions) {
    const conditions = preExistingConditions.toLowerCase();
    
    if (conditions.includes('diabetes')) score += 20;
    if (conditions.includes('hypertension') || conditions.includes('high blood pressure')) score += 15;
    if (conditions.includes('heart') || conditions.includes('cardiac')) score += 30;
    if (conditions.includes('cancer')) score += 35;
    if (conditions.includes('stroke')) score += 25;
    if (conditions.includes('asthma')) score += 10;
    if (conditions.includes('kidney')) score += 20;
    if (conditions.includes('liver')) score += 20;
  }

  // Medical history assessment
  if (medicalHistory) {
    const history = medicalHistory.toLowerCase();
    
    if (history.includes('surgery')) score += 5;
    if (history.includes('hospitalization')) score += 10;
    if (history.includes('chronic')) score += 15;
  }

  // Current medications assessment
  if (currentMedications) {
    const meds = currentMedications.toLowerCase().split(',').length;
    score += Math.min(meds * 3, 15); // Up to 15 points for multiple medications
  }

  return Math.min(score, 50); // Cap at 50
};

/**
 * Assess lifestyle risk
 */
const assessLifestyleRisk = (applicationType) => {
  // For insurance types, assess risk
  const type = applicationType?.toLowerCase();
  
  if (type === 'motor') return 20; // Motor insurance inherently risky
  if (type === 'life') return 15; // Moderate risk
  if (type === 'health') return 10; // Lower for health
  
  return 15; // Default
};

/**
 * Assess claim history risk (simulated)
 */
const assessClaimHistoryRisk = (customerId) => {
  // In production, this would query claim history from database
  // For now, generate consistent score based on customer ID
  const hash = customerId.toString().split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return (hash % 20); // 0-20 points
};

/**
 * Calculate comprehensive risk score
 */
export const calculateRiskScore = (applicationData, customerData) => {
  const {
    productType,
    medicalHistory,
    preExistingConditions,
    currentMedications,
  } = applicationData;

  const { dob, id: customerId } = customerData;

  const age = calculateAge(dob);
  const ageRisk = assessAgeRisk(age);
  const healthRisk = assessHealthRisk(medicalHistory, preExistingConditions, currentMedications);
  const lifestyleRisk = assessLifestyleRisk(productType);
  const claimHistoryRisk = assessClaimHistoryRisk(customerId);

  // Weighted calculation
  const totalRisk = (
    ageRisk * 0.25 +
    healthRisk * 0.35 +
    lifestyleRisk * 0.20 +
    claimHistoryRisk * 0.20
  );

  return {
    score: Math.round(totalRisk),
    components: {
      ageRisk,
      healthRisk,
      lifestyleRisk,
      claimHistoryRisk
    },
    age
  };
};

/**
 * Risk Assessment Rules Engine
 */
export const applyUnderwritingRules = (riskScore, age, applicationData) => {
  const rules = [];
  const exclusions = [];
  const limits = {};

  // Age-based rules
  if (age < 18) {
    rules.push('UNDER_MINIMUM_AGE');
    return {
      result: 'DECLINED',
      reason: 'Applicant is under minimum age requirement (18)',
      rules,
      exclusions,
      limits
    };
  }

  if (age > 85) {
    rules.push('OVER_MAXIMUM_AGE');
    return {
      result: 'REVIEW_REQUIRED',
      reason: 'Applicant exceeds standard age limit. Manual review required.',
      rules,
      exclusions,
      limits
    };
  }

  // Risk score-based rules
  if (riskScore < 30) {
    rules.push('LOW_RISK');
    limits.coverage = 'STANDARD';
    limits.premiumFactor = 0.8; // 20% discount
    return {
      result: 'APPROVED',
      reason: 'Low risk profile. Approved with standard coverage.',
      rules,
      exclusions,
      limits
    };
  }

  if (riskScore < 50) {
    rules.push('MODERATE_RISK');
    limits.coverage = 'STANDARD';
    limits.premiumFactor = 1.0; // Standard premium
    return {
      result: 'APPROVED',
      reason: 'Moderate risk profile. Approved with standard terms.',
      rules,
      exclusions,
      limits
    };
  }

  if (riskScore < 70) {
    rules.push('ELEVATED_RISK');
    limits.coverage = 'LIMITED';
    limits.premiumFactor = 1.5; // 50% surcharge
    exclusions.push('High-risk activities');
    return {
      result: 'REVIEW_REQUIRED',
      reason: 'Elevated risk profile. Requires manual underwriter review.',
      rules,
      exclusions,
      limits
    };
  }

  // High risk
  rules.push('HIGH_RISK');
  limits.coverage = 'RESTRICTED';
  limits.premiumFactor = 2.0; // Double premium
  exclusions.push('High-risk activities');
  exclusions.push('Hazardous occupations');
  
  if (riskScore >= 85) {
    return {
      result: 'DECLINED',
      reason: 'Risk score exceeds acceptable threshold. Application declined.',
      rules,
      exclusions,
      limits
    };
  }

  return {
    result: 'REVIEW_REQUIRED',
    reason: 'High risk profile. Mandatory manual underwriter review required.',
    rules,
    exclusions,
    limits
  };
};

/**
 * Calculate premium based on base amount, risk score, and coverage
 */
export const calculatePremium = (basePremium, riskScore, coverageLevel = 'standard') => {
  // Base assessment
  const assessment = applyUnderwritingRules(riskScore, 0, {});
  const premiumFactor = assessment.limits.premiumFactor || 1.0;

  // Coverage multiplier
  const coverageMultiplier = {
    'basic': 0.8,
    'standard': 1.0,
    'premium': 1.5
  }[coverageLevel?.toLowerCase()] || 1.0;

  const finalPremium = Math.round(basePremium * premiumFactor * coverageMultiplier);

  return {
    basePremium,
    riskFactor: premiumFactor,
    coverageMultiplier,
    finalPremium,
    breakdown: {
      base: basePremium,
      riskAdjustment: Math.round(basePremium * (premiumFactor - 1)),
      coverageAdjustment: Math.round(basePremium * (coverageMultiplier - 1)),
      total: finalPremium
    }
  };
};

/**
 * Create Risk Assessment Record
 */
export const createRiskAssessment = (applicationData, customerData) => {
  const riskCalculation = calculateRiskScore(applicationData, customerData);
  const assessment = applyUnderwritingRules(riskCalculation.score, riskCalculation.age, applicationData);

  return {
    id: `RA-${Date.now()}`,
    customerId: customerData.id,
    applicationId: applicationData.id,
    riskScore: riskCalculation.score,
    riskComponents: riskCalculation.components,
    rulesApplied: assessment.rules,
    exclusions: assessment.exclusions,
    coverageLimits: assessment.limits,
    result: assessment.result,
    reason: assessment.reason,
    assessmentDate: new Date().toISOString().split('T')[0],
    assessedBy: 'AUTOMATED_SYSTEM',
    status: 'COMPLETED'
  };
};

/**
 * Create Underwriting Decision
 */
export const createUnderwritingDecision = (riskAssessment, customerId) => {
  return {
    id: `UD-${Date.now()}`,
    customerId,
    assessmentId: riskAssessment.id,
    status: riskAssessment.result === 'APPROVED' ? 'APPROVED' : 
            riskAssessment.result === 'DECLINED' ? 'DECLINED' : 'PENDING_REVIEW',
    decisionDate: new Date().toISOString().split('T')[0],
    decisionReason: riskAssessment.reason,
    reviewRequired: riskAssessment.result === 'REVIEW_REQUIRED',
    createdAt: new Date().toISOString()
  };
};

/**
 * Generate Policy Document from Approved Application
 * Creates policy record with all coverage details and premium
 */
export const generatePolicy = (applicationData, riskAssessment, premiumCalculation) => {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  
  // Calculate end date (12 months from start)
  const endDate = new Date(today.setFullYear(today.getFullYear() + 1));
  const endDateStr = endDate.toISOString().split('T')[0];
  
  // Calculate renewal date (11 months from start, reminder before expiry)
  const renewalDate = new Date(today.setMonth(today.getMonth() + 11));
  const renewalDateStr = renewalDate.toISOString().split('T')[0];

  return {
    id: `POL-${Date.now()}`,
    applicationId: applicationData.id,
    customerId: applicationData.customerId,
    productType: applicationData.productType,
    insuranceType: applicationData.insuranceType,
    coverage: applicationData.coverage,
    coverageAmount: riskAssessment.coverageLimits?.maxCoverage || 500000,
    premium: premiumCalculation.finalPremium,
    basePremium: premiumCalculation.basePremium,
    riskFactor: premiumCalculation.riskFactor,
    coverageMultiplier: premiumCalculation.coverageMultiplier,
    startDate: startDate,
    endDate: endDateStr,
    renewalDate: renewalDateStr,
    status: 'ACTIVE',
    riskScore: riskAssessment.riskScore,
    exclusions: riskAssessment.exclusions || [],
    termsAccepted: true,
    issuedDate: new Date().toISOString().split('T')[0],
    issueBy: 'UNDERWRITING_SYSTEM',
    createdAt: new Date().toISOString()
  };
};

/**
 * Create Premium Payment Record
 * Tracks payment status and schedule for the policy
 */
export const createPremiumPayment = (policyData) => {
  return {
    id: `PAY-${Date.now()}`,
    policyId: policyData.id,
    customerId: policyData.customerId,
    amount: policyData.premium,
    basePremium: policyData.basePremium,
    taxAmount: Math.round(policyData.premium * 0.18), // 18% tax
    finalAmount: Math.round(policyData.premium * 1.18),
    status: 'UNPAID',
    dueDate: policyData.startDate,
    paymentDate: null,
    paymentMethod: null,
    transactionId: null,
    reminders: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Generate Risk Report for Analytics
 * Creates monthly/quarterly reports on risk metrics
 */
export const generateRiskReport = (applications, policies, metrics = {}) => {
  const now = new Date();
  const reportMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Calculate metrics
  const totalApplications = applications.length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const averageRiskScore = applications.length > 0 
    ? (applications.reduce((sum, a) => sum + (a.riskScore || 0), 0) / applications.length).toFixed(2)
    : 0;
  
  const lowRisk = applications.filter(a => a.riskScore < 40).length;
  const mediumRisk = applications.filter(a => a.riskScore >= 40 && a.riskScore < 70).length;
  const highRisk = applications.filter(a => a.riskScore >= 70).length;
  
  const approvalRate = totalApplications > 0 
    ? ((approvedCount / totalApplications) * 100).toFixed(2)
    : 0;

  return {
    id: `RPT-${Date.now()}`,
    month: reportMonth,
    metrics: {
      totalApplications,
      approvedCount,
      rejectedCount,
      pendingCount,
      averageRiskScore,
      approvalRate: `${approvalRate}%`,
      lowRiskCount: lowRisk,
      mediumRiskCount: mediumRisk,
      highRiskCount: highRisk,
      activePolicies: policies.filter(p => p.status === 'ACTIVE').length,
      totalCoverageAmount: policies.reduce((sum, p) => sum + (p.coverageAmount || 0), 0),
      totalPremiumCollected: policies.reduce((sum, p) => sum + (p.premium || 0), 0),
    },
    riskDistribution: {
      low: lowRisk,
      medium: mediumRisk,
      high: highRisk
    },
    statusDistribution: {
      approved: approvedCount,
      rejected: rejectedCount,
      pending: pendingCount
    },
    fraudFlags: [],
    recommendations: generateRecommendations(averageRiskScore, approvalRate, highRisk),
    generatedDate: new Date().toISOString().split('T')[0],
    generatedBy: 'ANALYTICS_ENGINE'
  };
};

/**
 * Generate recommendations based on current metrics
 */
const generateRecommendations = (avgRisk, approvalRate, highRiskCount) => {
  const recommendations = [];
  
  if (parseFloat(avgRisk) > 60) {
    recommendations.push('High average risk detected. Consider stricter underwriting rules.');
  }
  if (parseFloat(approvalRate) > 80) {
    recommendations.push('Approval rate is very high. Review underwriting criteria.');
  }
  if (highRiskCount > 20) {
    recommendations.push('High number of high-risk profiles. Consider enhanced due diligence.');
  }
  if (parseFloat(approvalRate) < 30) {
    recommendations.push('Low approval rate. Consider if rules are too strict.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Portfolio metrics are within acceptable ranges.');
  }
  
  return recommendations;
};

/**
 * Flag High-Risk Profile for Manual Review
 * Creates alert for underwriter to manually review
 */
export const flagHighRiskProfile = (applicationData, riskAssessment, reason) => {
  return {
    id: `FLAG-${Date.now()}`,
    applicationId: applicationData.id,
    customerId: applicationData.customerId,
    riskScore: riskAssessment.riskScore,
    flagReason: reason,
    flagType: riskAssessment.riskScore > 85 ? 'CRITICAL' : 'HIGH_RISK',
    priority: riskAssessment.riskScore > 85 ? 'URGENT' : 'HIGH',
    status: 'PENDING',
    assignedTo: null,
    flaggedDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
};

export default {
  calculateAge,
  calculateRiskScore,
  applyUnderwritingRules,
  calculatePremium,
  createRiskAssessment,
  createUnderwritingDecision,
  generatePolicy,
  createPremiumPayment,
  generateRiskReport,
  flagHighRiskProfile
};
