import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { applicationAPI, policyAPI } from '../../utils/api';
import { formatCurrency, getStatusBadge } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      if (user?.id) {
        const [appsRes, policiesRes] = await Promise.all([
          applicationAPI.getByCustomer(user.id),
          policyAPI.getByCustomer(user.id)
        ]);
        setApplications(appsRes.data);
        setPolicies(policiesRes.data);
        
        // Simulate payment data
        const outstandingPayments = [
          { id: 1, policyId: 'POL001', amount: 125, dueDate: '2024-02-15', status: 'overdue' },
          { id: 2, policyId: 'POL002', amount: 85, dueDate: '2024-02-20', status: 'due' }
        ];
        setPayments(outstandingPayments);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalApps: applications.length,
    approved: applications.filter(a => a.status === 'approved').length,
    pending: applications.filter(a => a.status === 'pending').length,
    activePolicies: policies.filter(p => p.status === 'active').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="stat-label">Total Applications</p>
            <p className="stat-value stat-value-primary">{stats.totalApps}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="stat-label">Approved</p>
            <p className="stat-value stat-value-green">{stats.approved}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="stat-label">Pending</p>
            <p className="stat-value stat-value-yellow">{stats.pending}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="stat-label">Active Policies</p>
            <p className="stat-value stat-value-blue">{stats.activePolicies}</p>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      {payments.length > 0 && (
        <div className="card bg-red-50 border border-red-200">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-red-700 font-bold">Outstanding Payments</h2>
              <Link to="/customer/payments" className="text-primary hover:underline text-sm font-semibold">
                View All
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payments.map(payment => (
                <div key={payment.id} className="payment-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Policy {payment.policyId}</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">${payment.amount}</p>
                      <p className="text-xs text-gray-500 mt-1">Due: {payment.dueDate}</p>
                    </div>
                    <span className={`badge ${payment.status === 'overdue' ? 'badge-danger' : 'badge-warning'}`}>
                      {payment.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                    </span>
                  </div>
                  <button className="btn-primary w-full mt-3 text-sm">Pay Now</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Applications</h2>
        </div>
        <div className="card-body">
          {applications.length === 0 ? (
            <p className="text-gray-600">No applications yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="hidden sm:table-cell">Applied Date</th>
                    <th>Status</th>
                    <th className="hidden md:table-cell">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map(app => (
                    <tr key={app.id}>
                      <td className="font-semibold">{app.productType}</td>
                      <td className="hidden sm:table-cell text-sm">{app.appliedDate}</td>
                      <td>{getStatusBadge(app.status)}</td>
                      <td className="hidden md:table-cell">${app.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Active Policies */}
      <div className="card">
        <div className="card-header">
          <h2>Active Policies</h2>
        </div>
        <div className="card-body">
          {policies.length === 0 ? (
            <p className="text-gray-600">No active policies</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map(policy => (
                <div key={policy.id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg capitalize">{policy.productType}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-gray-600">Coverage</p>
                      <p className="font-semibold">${policy.coverage}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Premium</p>
                      <p className="font-semibold">${policy.premium}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-semibold">{policy.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-semibold">{policy.endDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
