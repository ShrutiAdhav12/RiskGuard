import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { applicationAPI, customerAPI } from '../../utils/api';
import { formatDate, getStatusBadge } from '../../utils/helpers';

export default function ProfileSection() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || ''
  });

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await applicationAPI.getByCustomer(user.id);
        const data = response.data || [];
        setApplications(data);
      } catch (err) {
        console.error('Failed to load applications:', err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await customerAPI.update(user.id, formData);
      alert('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>

      {/* Profile Information Card */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-xl font-bold">Personal Information</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className={editMode ? 'btn-secondary text-sm' : 'btn-primary text-sm'}
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="card-body">
          {editMode ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button type="submit" className="btn-success w-full md:w-auto">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Full Name</p>
                <p className="font-semibold text-lg">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold text-lg">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-semibold">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Date of Birth</p>
                <p className="font-semibold">{user?.dob ? formatDate(user.dob) : 'Not provided'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Applications Summary */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Application History</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center text-gray-600">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="text-gray-600">No applications submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2 hidden sm:table-cell">Coverage</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2 hidden md:table-cell">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{formatDate(app.appliedDate)}</td>
                      <td className="py-3">{app.productType}</td>
                      <td className="py-3 hidden sm:table-cell">{app.coverage}</td>
                      <td className="py-3">{getStatusBadge(app.status)}</td>
                      <td className="py-3 hidden md:table-cell">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.riskScore > 70 ? 'bg-red-100 text-red-700' :
                          app.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {app.riskScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
