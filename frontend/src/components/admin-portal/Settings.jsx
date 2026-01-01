import React, { useState } from 'react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('system');
  const [settings, setSettings] = useState({
    systemName: 'RiskGuard Insurance',
    maintenanceMode: false,
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    logLevel: 'info',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    twoFactorAuth: true,
    auditLogging: true,
    dataRetention: 365
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
      <h1 className="text-2xl md:text-3xl font-bold">System Settings</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 px-2 whitespace-nowrap ${activeTab === 'system' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          System
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-2 whitespace-nowrap ${activeTab === 'security' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 px-2 whitespace-nowrap ${activeTab === 'backup' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Backup & Logs
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`pb-3 px-2 whitespace-nowrap ${activeTab === 'api' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          API Configuration
        </button>
      </div>

      {saved && <div className="alert alert-success">Settings saved successfully!</div>}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">General Settings</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="form-group">
                <label>System Name</label>
                <input
                  type="text"
                  name="systemName"
                  value={settings.systemName}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="form-group">
                <label>Session Timeout (minutes)</label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  min="5"
                  max="240"
                  className="w-full"
                />
              </div>

              <div className="form-group">
                <label>Log Level</label>
                <select
                  name="logLevel"
                  value={settings.logLevel}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <button onClick={handleSave} className="btn-primary">
                Save Settings
              </button>
            </div>
          </div>

          <div className="card bg-yellow-50 border border-yellow-200">
            <div className="card-header">
              <h2 className="text-xl font-bold text-yellow-800">Maintenance Mode</h2>
            </div>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Enable Maintenance Mode</p>
                  <p className="text-sm text-gray-600">Temporarily disable user access for maintenance</p>
                </div>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Security Settings</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="form-group">
                <label>Password Expiry (days)</label>
                <input
                  type="number"
                  name="passwordExpiry"
                  value={settings.passwordExpiry}
                  onChange={handleChange}
                  min="30"
                  max="365"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Force password change after this many days</p>
              </div>

              <div className="form-group">
                <label>Max Login Attempts</label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={settings.maxLoginAttempts}
                  onChange={handleChange}
                  min="3"
                  max="10"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Lock account after this many failed attempts</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
                </div>
                <input
                  type="checkbox"
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <button onClick={handleSave} className="btn-primary">
                Save Security Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup & Logs Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Backup Settings</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">Auto-Backup Enabled</p>
                  <p className="text-sm text-gray-600">Automatically backup system data</p>
                </div>
                <input
                  type="checkbox"
                  name="autoBackupEnabled"
                  checked={settings.autoBackupEnabled}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="form-group">
                <label>Backup Frequency</label>
                <select
                  name="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Data Retention (days)</label>
                <input
                  type="number"
                  name="dataRetention"
                  value={settings.dataRetention}
                  onChange={handleChange}
                  min="30"
                  max="3650"
                  className="w-full"
                />
              </div>

              <button className="btn-secondary w-full">Manual Backup Now</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Audit Logging</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">Audit Logging</p>
                  <p className="text-sm text-gray-600">Log all system activities and user actions</p>
                </div>
                <input
                  type="checkbox"
                  name="auditLogging"
                  checked={settings.auditLogging}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <button className="btn-secondary w-full">View Audit Logs</button>
              <button className="btn-secondary w-full">Export Logs</button>
            </div>
          </div>
        </div>
      )}

      {/* API Configuration Tab */}
      {activeTab === 'api' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">API Configuration</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800 font-semibold mb-2">API Base URL</p>
              <code className="text-xs bg-white p-2 block border rounded">http://localhost:3001/api</code>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800 font-semibold mb-2">Available Endpoints</p>
              <div className="text-xs space-y-1">
                <code className="block">GET /api/applications - List applications</code>
                <code className="block">POST /api/applications - Create application</code>
                <code className="block">GET /api/users - List users</code>
                <code className="block">GET /api/analytics - Get analytics data</code>
                <code className="block">POST /api/decisions - Create underwriting decision</code>
              </div>
            </div>

            <div className="form-group">
              <label>API Rate Limit (requests/minute)</label>
              <input
                type="number"
                placeholder="1000"
                min="100"
                max="10000"
                className="w-full"
              />
            </div>

            <button className="btn-secondary w-full">Generate API Key</button>
            <button className="btn-secondary w-full">View API Documentation</button>
          </div>
        </div>
      )}
    </div>
  );
}
