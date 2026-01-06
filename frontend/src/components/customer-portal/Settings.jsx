import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { customerAPI } from '../../utils/api';

export default function CustomerSettings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [formData, setFormData] = useState({
    notificationsEmail: true,
    notificationsSMS: false,
    marketingEmails: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : e.target.value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    setPasswordErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    }

    // Check if new password and confirm password match
    if (passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'New password and confirm password must match';
    }

    // Check if new password is different from current password
    if (passwordData.currentPassword && passwordData.newPassword && passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    return errors;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordLoading(true);
    try {
      // Verify current password by attempting to login
      const loginResponse = await customerAPI.login(user.email, passwordData.currentPassword);
      
      if (!loginResponse.data || loginResponse.data.length === 0) {
        setPasswordErrors({ currentPassword: 'Current password is incorrect' });
        setPasswordLoading(false);
        return;
      }

      // Verify new password and confirm password match (double check)
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordErrors({ confirmPassword: 'New password and confirm password must match' });
        setPasswordLoading(false);
        return;
      }

      // Verify new password is different from current password
      if (passwordData.currentPassword === passwordData.newPassword) {
        setPasswordErrors({ newPassword: 'New password must be different from current password' });
        setPasswordLoading(false);
        return;
      }

      // Update password in the customer record
      await customerAPI.update(user.id, {
        password: passwordData.newPassword
      });

      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});

      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Password update error:', err);
      if (err.response?.status === 404) {
        setPasswordErrors({ currentPassword: 'Current password is incorrect' });
      } else {
        setPasswordErrors({ currentPassword: 'Error updating password. Please try again.' });
      }
    } finally {
      setPasswordLoading(false);
    }
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
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-2 ${activeTab === 'notifications' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`pb-3 px-2 ${activeTab === 'password' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}
        >
          Password Change
        </button>
      </div>

      {saved && <div className="alert alert-success">Settings saved successfully!</div>}

      {passwordSuccess && (
        <div className="alert alert-success">
          <p className="font-semibold">Password updated successfully!</p>
          <p className="text-sm mt-1">Please logout and login again with your new password.</p>
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

      {/* Password Change */}
      {activeTab === 'password' && (
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Change Password</h2>
            </div>
            <form onSubmit={handlePasswordUpdate} className="card-body space-y-4">
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password" 
                  className={`w-full ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 6 characters)" 
                  className={`w-full ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password" 
                  className={`w-full ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>
              <button 
                type="submit"
                disabled={passwordLoading}
                className="btn-primary"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
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
