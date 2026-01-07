import React, { useEffect, useState } from 'react';
import { applicationAPI, policyAPI, premiumPaymentAPI, underwritingDecisionAPI, underwriterPreferencesAPI, underwriterRulesAPI } from '../../utils/api';
import { formatDate, getStatusBadge } from '../../utils/helpers';
import { applyUnderwritingRules, calculateAge, generatePolicy, createPremiumPayment, generateRiskReport, createUnderwritingDecision } from '../../utils/riskEngine';

export default function ApplicationReview() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [reviewingId, setReviewingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [premiumAdjustments, setPremiumAdjustments] = useState({});
  const [preferences, setPreferences] = useState({
    autoApproveThreshold: 30
  });
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load preferences
        const prefRes = await underwriterPreferencesAPI.getAll();
        if (prefRes.data && prefRes.data.length > 0) {
          setPreferences(prefRes.data[0]);
        }

        // Load rules
        const rulesRes = await underwriterRulesAPI.getAll();
        if (rulesRes.data && rulesRes.data.length > 0 && rulesRes.data[0].rules) {
          setRules(rulesRes.data[0].rules);
        }

        // Load applications
        const response = await applicationAPI.getAll();
        const data = response.data || [];
        setApplications(data);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'highRisk') return app.riskScore > 70;
    return app.status === filter;
  });

  const getApplicableRule = (riskScore) => {
    if (rules.length === 0) return null;
    return rules.find(rule => riskScore >= rule.scoreMin && riskScore <= rule.scoreMax);
  };

  const calculateSuggestedPremium = (riskScore) => {
    const basePremium = 1500;
    const rule = getApplicableRule(riskScore);
    
    if (!rule) {
      // Fallback to original logic if no rule matches
      if (riskScore > 70) return Math.round(basePremium * 1.5);
      if (riskScore > 40) return basePremium;
      return Math.round(basePremium * 0.9);
    }

    // Extract percentage from premium adjustment string (e.g., "-20%" -> -0.2)
    const premiumStr = rule.premium;
    const match = premiumStr.match(/([+-]?\d+(?:\.\d+)?)/);
    if (match && premiumStr.includes('%')) {
      const percentage = parseInt(match[1]) / 100;
      return Math.round(basePremium * (1 + percentage));
    }
    return basePremium;
  };

  const isAutoApprovable = (app) => {
    const rule = getApplicableRule(app.riskScore);
    return rule && rule.decision === 'APPROVED' && app.riskScore <= preferences.autoApproveThreshold;
  };


  const handleApprove = async (app) => {
    setSavingId(app.id);
    try {
      // Create underwriting decision
      const decision = createUnderwritingDecision({ 
        id: `RA-${app.id}`, 
        result: 'APPROVED',
        riskScore: app.riskScore,
        reason: 'Application approved by underwriter',
        exclusions: []
      }, app.customerId);

      await underwritingDecisionAPI.create(decision);

      // Get the final premium from adjustments or use default
      const finalPremium = premiumAdjustments[app.id] || app.premium || 1500;

      // Generate policy with the confirmed premium
      const premiumBreakdown = {
        basePremium: 1500,
        riskFactor: app.riskScore > 70 ? 1.5 : app.riskScore > 40 ? 1.0 : 0.8,
        coverageMultiplier: 1.0,
        finalPremium: finalPremium
      };

      const policy = generatePolicy(app, {
        riskScore: app.riskScore,
        coverageLimits: { maxCoverage: 500000 },
        exclusions: []
      }, premiumBreakdown);

      await policyAPI.create(policy);

      // Create premium payment record with the confirmed premium
      const payment = createPremiumPayment(policy);
      await premiumPaymentAPI.create(payment);

      // Update application status
      await applicationAPI.updateStatus(app.id, 'approved');
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'approved' } : a));
      setReviewingId(null);
      setPremiumAdjustments(prev => {
        const updated = { ...prev };
        delete updated[app.id];
        return updated;
      });
      alert('✓ Application approved! Policy generated with confirmed premium.');
    } catch (err) {
      console.error('Error approving application:', err);
      alert('Error approving application');
    } finally {
      setSavingId(null);
    }
  };

  const handleReject = async (app) => {
    setSavingId(app.id);
    try {
      // Create underwriting decision
      const decision = createUnderwritingDecision({ 
        id: `RA-${app.id}`, 
        result: 'DECLINED',
        riskScore: app.riskScore,
        reason: 'Application declined by underwriter',
        exclusions: []
      }, app.customerId);

      await underwritingDecisionAPI.create(decision);

      // Update application status
      await applicationAPI.updateStatus(app.id, 'rejected');
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'rejected' } : a));
      setReviewingId(null);
      alert('Application rejected!');
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert('Error rejecting application');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Application Review</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected', 'highRisk'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={f === filter ? 'btn-primary' : 'btn-secondary'}
          >
            {f === 'all' ? 'All' : f === 'highRisk' ? 'High Risk' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading applications...</p>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-8">
              <p className="text-gray-600">No applications found.</p>
            </div>
          </div>
        ) : (
          filtered.map(app => {
            const assessment = applyUnderwritingRules(app.riskScore, calculateAge(app.dob) || 0, app);
            return (
              <div key={app.id} className="card">
                <div className="card-body">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Customer Name</p>
                      <p className="font-semibold text-sm">{app.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Product</p>
                      <p className="font-semibold capitalize">{app.productType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Applied</p>
                      <p className="font-semibold text-sm">{formatDate(app.appliedDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Status</p>
                      {getStatusBadge(app.status)}
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Risk Score</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.riskScore > 70 ? 'bg-red-100 text-red-700' :
                        app.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {app.riskScore}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Assessment</p>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        assessment.result === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        assessment.result === 'DECLINED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {assessment.result.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Auto-Approve Indicator */}
                  {app.riskScore <= preferences.autoApproveThreshold && app.status === 'pending' && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4 rounded">
                      <p className="text-green-800 text-sm font-semibold">
                        ✅ Eligible for Auto-Approval (Risk Score {app.riskScore} ≤ {preferences.autoApproveThreshold})
                      </p>
                    </div>
                  )}

                  {/* Enhanced Risk Analysis - Only show when reviewing */}
                  {reviewingId === app.id && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-4 border-2 border-blue-200">
                    <h4 className="font-bold text-lg mb-4 text-blue-900">Risk Analysis</h4>
                    
                    {/* Risk Score Gauge */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Overall Risk Score</span>
                        <span className={`text-2xl font-bold ${
                          app.riskScore > 70 ? 'text-red-600' :
                          app.riskScore > 40 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>{app.riskScore}/100</span>
                      </div>
                      <div className="risk-gauge">
                        <div
                          className={`risk-gauge-fill ${
                            app.riskScore > 70 ? 'risk-gauge-fill-red' :
                            app.riskScore > 40 ? 'risk-gauge-fill-yellow' :
                            'risk-gauge-fill-green'
                          }`}
                          style={{ width: `${app.riskScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Risk Components Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {app.riskComponents && (
                        <>
                          <div className="risk-component-card risk-component-card-blue">
                            <p className="text-xs text-gray-600 font-semibold">Age Risk</p>
                            <div className="flex items-end justify-between mt-2">
                              <span className="text-xl font-bold text-blue-600">{app.riskComponents.ageRisk}%</span>
                              <div className="risk-mini-bar risk-mini-bar-blue">
                                <div className="risk-mini-bar-fill risk-mini-bar-fill-blue" style={{height: `${app.riskComponents.ageRisk}%`}}></div>
                              </div>
                            </div>
                          </div>
                          <div className="risk-component-card risk-component-card-green">
                            <p className="text-xs text-gray-600 font-semibold">Health Risk</p>
                            <div className="flex items-end justify-between mt-2">
                              <span className="text-xl font-bold text-green-600">{app.riskComponents.healthRisk}%</span>
                              <div className="risk-mini-bar risk-mini-bar-green">
                                <div className="risk-mini-bar-fill risk-mini-bar-fill-green" style={{height: `${app.riskComponents.healthRisk}%`}}></div>
                              </div>
                            </div>
                          </div>
                          <div className="risk-component-card risk-component-card-yellow">
                            <p className="text-xs text-gray-600 font-semibold">Lifestyle</p>
                            <div className="flex items-end justify-between mt-2">
                              <span className="text-xl font-bold text-yellow-600">{app.riskComponents.lifestyleRisk}%</span>
                              <div className="risk-mini-bar risk-mini-bar-yellow">
                                <div className="risk-mini-bar-fill risk-mini-bar-fill-yellow" style={{height: `${app.riskComponents.lifestyleRisk}%`}}></div>
                              </div>
                            </div>
                          </div>
                          <div className="risk-component-card risk-component-card-red">
                            <p className="text-xs text-gray-600 font-semibold">Claim History</p>
                            <div className="flex items-end justify-between mt-2">
                              <span className="text-xl font-bold text-red-600">{app.riskComponents.claimHistoryRisk}%</span>
                              <div className="risk-mini-bar risk-mini-bar-red">
                                <div className="risk-mini-bar-fill risk-mini-bar-fill-red" style={{height: `${app.riskComponents.claimHistoryRisk}%`}}></div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Risk Assessment Details */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">ASSESSMENT</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-1 ${
                            assessment.result === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            assessment.result === 'DECLINED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {assessment.result.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">CONFIDENCE LEVEL</p>
                          <div className="mt-1">
                            <p className="font-bold text-green-600">92%</p>
                            <p className="text-xs text-gray-500">High confidence</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">PREMIUM ADJUSTMENT</p>
                          <div className="mt-1">
                            <p className={`font-bold ${app.riskScore > 70 ? 'text-red-600' : app.riskScore > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {app.riskScore > 70 ? '+20%' : app.riskScore > 40 ? '+0%' : '-10%'}
                            </p>
                            <p className="text-xs text-gray-500">{app.riskScore > 70 ? 'Surcharge' : app.riskScore > 40 ? 'Standard' : 'Discount'}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 border-t pt-3"><strong>Assessment Reason:</strong> {assessment.reason}</p>
                    </div>
                  </div>
                  )}

                  {/* Medical Information */}
                  {(app.medicalHistory || app.preExistingConditions || app.currentMedications) && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                      <h4 className="font-semibold mb-2">Medical Information</h4>
                      {app.preExistingConditions && (
                        <p className="text-sm mb-2"><strong>Conditions:</strong> {app.preExistingConditions}</p>
                      )}
                      {app.currentMedications && (
                        <p className="text-sm mb-2"><strong>Medications:</strong> {app.currentMedications}</p>
                      )}
                      {app.medicalHistory && (
                        <p className="text-sm"><strong>History:</strong> {app.medicalHistory}</p>
                      )}
                    </div>
                  )}

                  {reviewingId === app.id && app.status === 'pending' && (
                    <>
                    {/* Premium Adjustment Section */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg mb-4 border-2 border-green-300">
                      <h4 className="font-bold text-lg mb-4 text-green-900">Premium Configuration</h4>
                      
                      {/* Suggested Premium */}
                      <div className="bg-white p-4 rounded-lg mb-4 border border-green-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">BASE PREMIUM</p>
                            <p className="text-2xl font-bold text-blue-600">₹1,500</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">RISK ADJUSTMENT</p>
                            <p className={`text-2xl font-bold ${
                              app.riskScore > 70 ? 'text-red-600' : 
                              app.riskScore > 40 ? 'text-gray-600' : 
                              'text-green-600'
                            }`}>
                              {app.riskScore > 70 ? '+50%' : app.riskScore > 40 ? '+0%' : '-10%'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">SUGGESTED PREMIUM</p>
                            <p className="text-2xl font-bold text-emerald-600">₹{calculateSuggestedPremium(app.riskScore)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Final Premium Input */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Final Premium Amount (Editable)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="500"
                            max="10000"
                            value={premiumAdjustments[app.id] || calculateSuggestedPremium(app.riskScore)}
                            onChange={(e) => setPremiumAdjustments(prev => ({
                              ...prev,
                              [app.id]: parseInt(e.target.value) || 0
                            }))}
                            className="flex-1 px-4 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Enter premium amount"
                          />
                          <button
                            onClick={() => setPremiumAdjustments(prev => ({
                              ...prev,
                              [app.id]: calculateSuggestedPremium(app.riskScore)
                            }))}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200"
                          >
                            Use Suggested
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          💡 You can adjust this premium based on additional factors or underwriting discretion
                        </p>
                      </div>
                    </div>

                    {/* Decision Buttons */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                      <p className="font-semibold mb-3">Make Underwriting Decision:</p>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleApprove(app)}
                          disabled={savingId === app.id || !premiumAdjustments[app.id]}
                          className="btn-success disabled:opacity-50"
                        >
                          {savingId === app.id ? 'Processing...' : `Approve & Generate Policy (₹${premiumAdjustments[app.id] || calculateSuggestedPremium(app.riskScore)})`}
                        </button>
                        <button
                          onClick={() => handleReject(app)}
                          disabled={savingId === app.id}
                          className="btn-danger disabled:opacity-50"
                        >
                          {savingId === app.id ? 'Rejecting...' : 'Reject Application'}
                        </button>
                        <button
                          onClick={() => setReviewingId(null)}
                          disabled={savingId === app.id}
                          className="btn-secondary disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    {app.status === 'pending' && reviewingId !== app.id && (
                      <button
                        onClick={() => setReviewingId(app.id)}
                        className="btn-primary"
                      >
                        Review Application
                      </button>
                    )}
                    {app.status !== 'pending' && (
                      <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
                        Already {app.status}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
