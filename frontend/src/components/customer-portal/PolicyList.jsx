import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { policyAPI, applicationAPI } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers';

export default function PolicyList() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all policies for this customer
        const policyResponse = await policyAPI.getByCustomer(user.id);
        const policyData = policyResponse.data || [];
        
        if (policyData.length > 0) {
          setPolicies(policyData);
        } else {
          // If no policies, create them from approved applications
          const appResponse = await applicationAPI.getByCustomer(user.id);
          const appData = appResponse.data || [];
          if (appData.length > 0) {
            const approvedApps = appData.filter(a => a.status === 'approved');
            if (approvedApps.length > 0) {
              // Create policies from approved applications
              const createdPolicies = approvedApps.map((app, idx) => ({
                id: `POL-${Date.now()}-${idx}`,
                customerId: user.id,
                productType: app.productType,
                coverage: app.coverage,
                premium: app.premium,
                startDate: app.appliedDate,
                endDate: new Date(new Date(app.appliedDate).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                renewalDate: new Date(new Date(app.appliedDate).getTime() + 355 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'active'
              }));
              setPolicies(createdPolicies);
            } else {
              setPolicies([]);
            }
          } else {
            setPolicies([]);
          }
        }
      } catch (err) {
        console.error('Failed to load policies:', err);
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.id]);

  if (loading) return <div className="text-center py-8">Loading policies...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">My Policies</h1>

      {policies.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <p className="text-gray-600 mb-4">No active policies yet.</p>
            <p className="text-sm text-gray-500">Submit an application to get started.</p>
            <p className="text-xs text-gray-400 mt-4">Note: Policies are created when your application is approved.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {policies.map(policy => (
            <div key={policy.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-body p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Policy ID</p>
                    <p className="font-semibold text-sm">{policy.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Product</p>
                    <p className="font-semibold capitalize">{policy.productType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Coverage</p>
                    <p className="font-semibold">{policy.coverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    {getStatusBadge(policy.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
                  <div>
                    <p className="text-gray-600 text-sm">Premium</p>
                    <p className="font-bold text-lg text-primary">${policy.premium}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Start Date</p>
                    <p className="font-semibold text-sm">{formatDate(policy.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">End Date</p>
                    <p className="font-semibold text-sm">{formatDate(policy.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Renewal</p>
                    <p className="font-semibold text-sm">{formatDate(policy.renewalDate)}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  <button className="btn-secondary text-sm">Download PDF</button>
                  <button className="btn-primary text-sm">View Details</button>
                  <button className="btn-secondary text-sm">File Claim</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information Box */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="card-body">
          <h3 className="font-bold mb-3">About Your Policies</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Policies are automatically created when your application is approved</li>
            <li>• Each policy is valid for 12 months from the start date</li>
            <li>• You'll receive renewal notices 30 days before expiry</li>
            <li>• Download your policy document anytime for records</li>
            <li>• You can file claims directly through this portal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
