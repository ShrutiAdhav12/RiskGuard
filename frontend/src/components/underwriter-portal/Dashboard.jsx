import React, { useEffect, useState } from 'react';
import { applicationAPI } from '../../utils/api';
import { formatDate, getStatusBadge } from '../../utils/helpers';
import { applyUnderwritingRules } from '../../utils/riskEngine';

export default function UnderwriterDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    highRisk: 0
  });

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await applicationAPI.getAll();
        const data = response.data || [];
        setApplications(data);

        const newStats = {
          pending: data.filter(a => a.status === 'pending').length,
          approved: data.filter(a => a.status === 'approved').length,
          rejected: data.filter(a => a.status === 'rejected').length,
          highRisk: data.filter(a => a.riskScore > 70).length
        };
        setStats(newStats);
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const pendingApps = applications.filter(a => a.status === 'pending');

  const underwritingRules = [
    {
      score: '0-30',
      decision: 'APPROVED',
      label: 'Low Risk',
      discount: '20% premium discount',
      color: 'bg-green-100 text-green-700',
      rules: ['No exclusions', 'Standard coverage', 'Fast approval']
    },
    {
      score: '30-50',
      decision: 'APPROVED',
      label: 'Moderate Risk',
      discount: 'Standard terms',
      color: 'bg-blue-100 text-blue-700',
      rules: ['Standard underwriting', 'Normal premium', 'Regular exclusions apply']
    },
    {
      score: '50-70',
      decision: 'REVIEW_REQUIRED',
      label: 'Elevated Risk',
      discount: '50% premium surcharge',
      color: 'bg-yellow-100 text-yellow-700',
      rules: ['Manual review required', 'Enhanced underwriting', 'Possible exclusions', 'Higher premium']
    },
    {
      score: '70-85',
      decision: 'REVIEW_REQUIRED',
      label: 'High Risk',
      discount: '100% premium surcharge',
      color: 'bg-orange-100 text-orange-700',
      rules: ['Urgent review', 'Executive decision', 'Strict exclusions', 'Coverage limits apply']
    },
    {
      score: '85+',
      decision: 'DECLINED',
      label: 'Critical Risk',
      discount: 'Not insurable',
      color: 'bg-red-100 text-red-700',
      rules: ['Automatic decline', 'Risk exceeds threshold', 'No coverage available']
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Underwriter Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Pending Review</p>
            <p className="text-3xl font-bold text-primary">{stats.pending}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">High Risk</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.highRisk}</p>
          </div>
        </div>
      </div>

      {/* Pending Applications */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Pending Applications ({pendingApps.length})</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center text-gray-600">Loading applications...</p>
          ) : pendingApps.length === 0 ? (
            <p className="text-gray-600">No pending applications.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Customer Name</th>
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Risk Score</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApps.map(app => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{formatDate(app.appliedDate)}</td>
                      <td className="py-3 font-semibold">{app.productType}</td>
                      <td className="py-3 hidden sm:table-cell text-sm">{app.customerId}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.riskScore > 70 ? 'bg-red-100 text-red-700' :
                          app.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {app.riskScore}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="btn-primary text-sm">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Underwriting Rules Reference */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Underwriting Rules & Decision Matrix</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {underwritingRules.map((rule, idx) => (
              <div key={idx} className={`border rounded-lg p-3 ${rule.color}`}>
                <div className="font-bold text-sm mb-2">{rule.label}</div>
                <div className="text-xs space-y-1 mb-3">
                  <p><strong>Score:</strong> {rule.score}</p>
                  <p><strong>Decision:</strong> {rule.decision}</p>
                  <p><strong>Premium:</strong> {rule.discount}</p>
                </div>
                <div className="text-xs border-t pt-2">
                  <p className="font-semibold mb-1">Rules:</p>
                  <ul className="space-y-1">
                    {rule.rules.map((r, i) => (
                      <li key={i} className="list-disc list-inside">{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
