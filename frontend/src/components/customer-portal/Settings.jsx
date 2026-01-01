import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function CustomerSettings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    notificationsEmail: true,
    notificationsSMS: false,
    marketingEmails: false
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
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
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-3 px-2 ${activeTab === 'account' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-2 ${activeTab === 'notifications' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 px-2 ${activeTab === 'privacy' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Privacy & Security
        </button>
      </div>

      {saved && <div className="alert alert-success">Settings saved successfully!</div>}

      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Account Information</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address"
                rows="3"
                className="w-full"
              />
            </div>
            <button onClick={handleSave} className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Notification Preferences</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-semibold">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates about applications and policies</p>
              </div>
              <input
                type="checkbox"
                name="notificationsEmail"
                checked={formData.notificationsEmail}
                onChange={handleChange}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-semibold">SMS Notifications</p>
                <p className="text-sm text-gray-600">Get important alerts via text message</p>
              </div>
              <input
                type="checkbox"
                name="notificationsSMS"
                checked={formData.notificationsSMS}
                onChange={handleChange}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-semibold">Marketing Emails</p>
                <p className="text-sm text-gray-600">Receive offers and updates about new products</p>
              </div>
              <input
                type="checkbox"
                name="marketingEmails"
                checked={formData.marketingEmails}
                onChange={handleChange}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <button onClick={handleSave} className="btn-primary">
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Privacy & Security */}
      {activeTab === 'privacy' && (
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Password</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" className="w-full" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm new password" className="w-full" />
              </div>
              <button className="btn-primary">Update Password</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Data & Privacy</h2>
            </div>
            <div className="card-body space-y-3">
              <p className="text-sm text-gray-700">Your data is protected under our privacy policy. You can:</p>
              <button className="btn-secondary w-full">Download Your Data</button>
              <button className="btn-secondary w-full">Delete Account</button>
            </div>
          </div>

          <div className="card bg-red-50 border border-red-200">
            <div className="card-header">
              <h2 className="text-xl font-bold text-red-700">Logout</h2>
            </div>
            <div className="card-body space-y-3">
              <p className="text-sm text-gray-700">Sign out from all devices</p>
              <button onClick={logout} className="btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
