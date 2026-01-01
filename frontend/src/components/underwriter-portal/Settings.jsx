import React, { useState } from 'react';

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
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-2 whitespace-nowrap ${activeTab === 'notifications' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Notifications
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
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Current Decision Rules</h2>
            </div>
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Risk Level</th>
                      <th className="text-left py-2">Score Range</th>
                      <th className="text-left py-2">Decision</th>
                      <th className="text-left py-2">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3"><span className="badge badge-success">Very Low</span></td>
                      <td>0-30</td>
                      <td>APPROVED</td>
                      <td>-20% discount</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3"><span className="badge badge-info">Low</span></td>
                      <td>31-50</td>
                      <td>APPROVED</td>
                      <td>-10% discount</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3"><span className="badge badge-warning">Medium</span></td>
                      <td>51-70</td>
                      <td>REVIEW REQUIRED</td>
                      <td>0% (Standard)</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3"><span className="badge badge-orange">High</span></td>
                      <td>71-85</td>
                      <td>REVIEW REQUIRED</td>
                      <td>+20% surcharge</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3"><span className="badge badge-danger">Very High</span></td>
                      <td>85+</td>
                      <td>DECLINED</td>
                      <td>Not Insurable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-4">Rules are managed by administration. Contact admin to modify.</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Notification Settings</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-semibold">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive alerts for new applications</p>
              </div>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-semibold">Daily Report Email</p>
                <p className="text-sm text-gray-600">Get daily summary of your decisions</p>
              </div>
              <input
                type="checkbox"
                name="dailyReportEmail"
                checked={settings.dailyReportEmail}
                onChange={handleChange}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <button onClick={handleSave} className="btn-primary">
              Save Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
