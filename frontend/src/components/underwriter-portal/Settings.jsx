import React, { useState, useEffect } from 'react';
import { underwriterPreferencesAPI, underwriterRulesAPI } from '../../utils/api';

export default function UnderwriterSettings() {
  const [activeTab, setActiveTab] = useState('preferences');
  const [settings, setSettings] = useState({
    autoApproveThreshold: 30,
    riskAssessmentLevel: 'comprehensive',
    emailNotifications: true,
    decisionTemplates: 'standard',
    caseAssignmentMethod: 'round-robin',
    dailyReportEmail: true
  });
  const [rules, setRules] = useState([]);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preferencesId, setPreferencesId] = useState(null);
  const [rulesId, setRulesId] = useState(null);

  // Load preferences and rules from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load preferences
        const prefsResponse = await underwriterPreferencesAPI.getAll();
        const prefsData = prefsResponse.data || [];
        if (prefsData.length > 0) {
          const prefs = prefsData[0];
          setPreferencesId(prefs.id);
          setSettings({
            autoApproveThreshold: prefs.autoApproveThreshold,
            riskAssessmentLevel: prefs.riskAssessmentLevel,
            emailNotifications: prefs.emailNotifications,
            decisionTemplates: prefs.decisionTemplates,
            caseAssignmentMethod: prefs.caseAssignmentMethod,
            dailyReportEmail: prefs.dailyReportEmail
          });
        }

        // Load rules
        const rulesResponse = await underwriterRulesAPI.getAll();
        const rulesData = rulesResponse.data || [];
        if (rulesData.length > 0) {
          const rulesRecord = rulesData[0];
          setRulesId(rulesRecord.id);
          setRules(rulesRecord.rules || []);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRuleChange = (ruleId, field, value) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    ));
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...settings,
        underwriterId: "1",
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (preferencesId) {
        // Update existing preferences
        await underwriterPreferencesAPI.update(preferencesId, dataToSave);
      } else {
        // Create new preferences
        const newData = {
          ...dataToSave,
          createdAt: new Date().toISOString().split('T')[0]
        };
        const response = await underwriterPreferencesAPI.create(newData);
        setPreferencesId(response.data.id);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      alert('Error saving preferences');
    }
  };

  const handleSaveRules = async () => {
    try {
      const dataToSave = {
        underwriterId: "1",
        rules: rules,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (rulesId) {
        // Update existing rules
        await underwriterRulesAPI.update(rulesId, dataToSave);
      } else {
        // Create new rules
        const newData = {
          ...dataToSave,
          createdAt: new Date().toISOString().split('T')[0]
        };
        const response = await underwriterRulesAPI.create(newData);
        setRulesId(response.data.id);
      }
      
      setEditingRuleId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving rules:', err);
      alert('Error saving rules');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 px-2 whitespace-nowrap ${activeTab === 'preferences' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Preferences
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 px-2 whitespace-nowrap ${activeTab === 'rules' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Decision Rules
        </button>
      </div>

      {saved && <div className="alert alert-success">Settings saved successfully!</div>}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Underwriting Preferences</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <label>Auto-Approve Risk Threshold (%)</label>
              <input
                type="number"
                name="autoApproveThreshold"
                value={settings.autoApproveThreshold}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Applications below this risk score auto-approve</p>
            </div>

            <div className="form-group">
              <label>Risk Assessment Level</label>
              <select
                name="riskAssessmentLevel"
                value={settings.riskAssessmentLevel}
                onChange={handleChange}
                className="w-full"
              >
                <option value="basic">Basic Assessment</option>
                <option value="standard">Standard Assessment</option>
                <option value="comprehensive">Comprehensive Assessment</option>
                <option value="expert">Expert Review</option>
              </select>
            </div>

            <div className="form-group">
              <label>Decision Template</label>
              <select
                name="decisionTemplates"
                value={settings.decisionTemplates}
                onChange={handleChange}
                className="w-full"
              >
                <option value="standard">Standard Template</option>
                <option value="detailed">Detailed Template</option>
                <option value="brief">Brief Template</option>
                <option value="custom">Custom Template</option>
              </select>
            </div>

            <div className="form-group">
              <label>Case Assignment Method</label>
              <select
                name="caseAssignmentMethod"
                value={settings.caseAssignmentMethod}
                onChange={handleChange}
                className="w-full"
              >
                <option value="round-robin">Round-Robin</option>
                <option value="skill-based">Skill-Based</option>
                <option value="workload-balanced">Workload Balanced</option>
              </select>
            </div>

            <button onClick={handleSave} className="btn-primary">
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Decision Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {loading ? (
            <p>Loading rules...</p>
          ) : (
            <>
              {rules.length === 0 ? (
                <p className="text-gray-500">No rules loaded</p>
              ) : (
                rules.map((rule) => (
                  <div key={rule.id} className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-bold">{rule.label}</h3>
                    </div>
                    <div className="card-body space-y-4">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="form-group">
                          <label>Min Score</label>
                          <input
                            type="number"
                            value={rule.scoreMin}
                            onChange={(e) => handleRuleChange(rule.id, 'scoreMin', parseInt(e.target.value))}
                            disabled={editingRuleId !== rule.id}
                            className="w-full"
                          />
                        </div>
                        <div className="form-group">
                          <label>Max Score</label>
                          <input
                            type="number"
                            value={rule.scoreMax}
                            onChange={(e) => handleRuleChange(rule.id, 'scoreMax', parseInt(e.target.value))}
                            disabled={editingRuleId !== rule.id}
                            className="w-full"
                          />
                        </div>
                        <div className="form-group">
                          <label>Decision</label>
                          <select
                            value={rule.decision}
                            onChange={(e) => handleRuleChange(rule.id, 'decision', e.target.value)}
                            disabled={editingRuleId !== rule.id}
                            className="w-full"
                          >
                            <option value="APPROVED">APPROVED</option>
                            <option value="REVIEW_REQUIRED">REVIEW REQUIRED</option>
                            <option value="DECLINED">DECLINED</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Premium Adjustment</label>
                          <input
                            type="text"
                            value={rule.premium}
                            onChange={(e) => handleRuleChange(rule.id, 'premium', e.target.value)}
                            disabled={editingRuleId !== rule.id}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Rules Description</label>
                        <textarea
                          value={rule.rules ? rule.rules.join('\n') : ''}
                          onChange={(e) => handleRuleChange(rule.id, 'rules', e.target.value.split('\n'))}
                          disabled={editingRuleId !== rule.id}
                          rows="3"
                          className="w-full"
                        />
                      </div>

                      <div className="flex gap-2">
                        {editingRuleId === rule.id ? (
                          <>
                            <button
                              onClick={handleSaveRules}
                              className="btn-primary"
                            >
                              Save Rule
                            </button>
                            <button
                              onClick={() => setEditingRuleId(null)}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingRuleId(rule.id)}
                            className="btn-secondary"
                          >
                            Edit Rule
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}
