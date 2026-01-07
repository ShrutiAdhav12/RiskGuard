import React, { useEffect, useState } from 'react';
import { underwriterPreferencesAPI } from '../../utils/api';

export default function UnderwriterNotifications() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await underwriterPreferencesAPI.getAll();
      if (data && data.length > 0) {
        setPreferences(data[0]);
      } else {
        setPreferences({
          id: '1',
          emailNotifications: true,
          dailyReportEmail: true
        });
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError('Failed to load preferences');
      setPreferences({
        id: '1',
        emailNotifications: true,
        dailyReportEmail: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);

    try {
      await underwriterPreferencesAPI.update(updated.id, updated);
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to save preferences');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
          <p className="text-gray-600 mt-2">Manage how you receive alerts and reports</p>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="text-gray-600 mt-2">Manage how you receive alerts and reports</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Email Notifications Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg font-bold">EN</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
                <p className="text-sm text-gray-600">Toggle for receiving alerts when new applications arrive</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences?.emailNotifications || false}
                onChange={() => handleToggle('emailNotifications')}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {preferences?.emailNotifications && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              You will receive email alerts for new applications
            </div>
          )}
        </div>

        {/* Daily Report Email Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg font-bold">DR</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Daily Report Email</h2>
                <p className="text-sm text-gray-600">Toggle for getting a daily summary of your underwriting decisions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences?.dailyReportEmail || false}
                onChange={() => handleToggle('dailyReportEmail')}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          {preferences?.dailyReportEmail && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
              You will receive daily reports at 9:00 AM
            </div>
          )}
        </div>

        {/* Save Status */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Your preferences are automatically saved</p>
        </div>
      </div>
    </div>
  );
}
