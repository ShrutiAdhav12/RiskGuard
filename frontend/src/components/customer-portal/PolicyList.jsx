
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { policyAPI, applicationAPI } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers';

export default function PolicyList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePaymentPolicy, setActivePaymentPolicy] = useState(null);

  const handleDownloadPDF = (policy) => {
    const userPhone = user?.phone || user?.contactInfo || 'Not provided';
    
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="${window.location.origin}/globals.css">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .pdf-header { text-align: center; border-bottom: 3px solid #003366; padding-bottom: 20px; margin-bottom: 30px; }
            .pdf-logo { font-size: 28px; font-weight: bold; color: #003366; margin-bottom: 5px; }
            .pdf-subtitle { font-size: 12px; color: #666; }
            .pdf-section { margin-bottom: 25px; }
            .pdf-section-title { font-size: 14px; font-weight: bold; background-color: #f0f0f0; padding: 10px; margin-bottom: 15px; border-left: 4px solid #003366; }
            .pdf-row { display: flex; margin-bottom: 12px; }
            .pdf-label { width: 35%; font-weight: bold; color: #003366; }
            .pdf-value { width: 65%; word-break: break-word; }
            .pdf-highlight { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .pdf-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
            .pdf-badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .pdf-badge-active { background-color: #d4edda; color: #155724; }
          </style>
        </head>
        <body>
          <div class="pdf-header">
            <div class="pdf-logo">🛡️ RiskGuard Insurance</div>
            <div class="pdf-subtitle">Policy Document</div>
          </div>

          <div class="pdf-section">
            <div class="pdf-section-title">Policy Information</div>
            <div class="pdf-row">
              <div class="pdf-label">Policy ID:</div>
              <div class="pdf-value">${policy.id}</div>
            </div>
            <div class="pdf-row">
              <div class="pdf-label">Product Type:</div>
              <div class="pdf-value">${policy.productType.charAt(0).toUpperCase() + policy.productType.slice(1)}</div>
            </div>
            <div class="pdf-row">
              <div class="pdf-label">Coverage Level:</div>
              <div class="pdf-value">${policy.coverage.charAt(0).toUpperCase() + policy.coverage.slice(1)}</div>
            </div>
            <div class="pdf-row">
              <div class="pdf-label">Status:</div>
              <div class="pdf-value"><span class="pdf-badge pdf-badge-active">${policy.status.toUpperCase()}</span></div>
            </div>
            <div class="pdf-row">
              <div class="pdf-label">Payment Status:</div>
              <div class="pdf-value" style="text-transform: capitalize; font-weight: bold; color: ${policy.status === 'paid' ? 'green' : 'red'};">${policy.status === 'paid' ? 'Paid' : 'Pending'}</div>
            </div>
          </div>

          <div class="pdf-section">
            <div class="pdf-section-title">Coverage & Premium Details</div>
            <div class="pdf-row">
              <div class="pdf-label">Annual Premium:</div>
              <div class="pdf-value">₹${policy.premium}</div>
            </div>
            <div class="pdf-row">
              <div class="pdf-label">Policy Start Date:</div>
              <div class="pdf-value">${formatDate(policy.startDate)}</div>
            </div>
            <div class="pdf-row">
              <div class="pdf-label">Policy End Date:</div>
              <div class="pdf-value">${formatDate(policy.endDate)}</div>
            </div>
            <div class="pdf-row">
              <div class="pdf-label">Renewal Date:</div>
              <div class="pdf-value">${formatDate(policy.renewalDate)}</div>
            </div>
          </div>

          <div class="pdf-section">
            <div class="pdf-section-title">Policyholder Information</div>
            <div class="pdf-row">
              <div class="pdf-label">Name:</div>
              <div class="pdf-value">${user.name}</div>
            </div>
            <div class="pdf-row">
              <div class="pdf-label">Email:</div>
              <div class="pdf-value">${user.email}</div>
            </div>
            <div class="pdf-row">
              <div class="pdf-label">Phone:</div>
              <div class="pdf-value">${userPhone}</div>
            </div>
          </div>

          <div class="pdf-highlight">
            <strong>Important:</strong> Please keep this document safe. For inquiries, quote Policy ID: ${policy.id}.
          </div>

          <div class="pdf-footer">
            <p>This document was generated on ${new Date().toLocaleString()}</p>
            <p>© 2026 RiskGuard Insurance. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = function() {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        window.URL.revokeObjectURL(url);
      }, 100);
    };
  };

  const handlePaymentSuccess = (updatedPolicy) => {
    setPolicies(prevPolicies => 
      prevPolicies.map(p => 
        p.id === updatedPolicy.id ? updatedPolicy : p
      )
    );
    setActivePaymentPolicy(null);
  };

  const handlePayNow = (policy) => {
    navigate('/customer/payment', { state: { policy } });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const policyResponse = await policyAPI.getByCustomer(user.id);
        const policyData = policyResponse.data || [];
        
        if (policyData.length > 0) {
          setPolicies(policyData);
        } else {
          const appResponse = await applicationAPI.getByCustomer(user.id);
          const appData = appResponse.data || [];
          if (appData.length > 0) {
            const approvedApps = appData.filter(a => a.status === 'approved');
            if (approvedApps.length > 0) {
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
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {policies
            .sort((a, b) => {
              // Approved (not paid) policies first
              if (a.status !== 'paid' && b.status === 'paid') return -1;
              if (a.status === 'paid' && b.status !== 'paid') return 1;
              // Then by date (newest first)
              return new Date(b.startDate) - new Date(a.startDate);
            })
            .map(policy => (
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
                    {policy.status === 'paid' ? (
                        <span className="badge-success">PAID</span>
                    ) : (
                        <span className="text-amber-600 font-semibold text-sm">Pending</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
                  <div>
                    <p className="text-gray-600 text-sm">Premium</p>
                    <p className="font-bold text-lg text-primary">₹{policy.premium}</p>
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

                {activePaymentPolicy === policy.id ? (
                  <div />
                ) : (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button 
                      onClick={() => handleDownloadPDF(policy)}
                      className="btn-secondary text-sm"
                    >
                      Download PDF
                    </button>
                    {policy.status !== 'paid' && (
                      <button 
                        onClick={() => handlePayNow(policy)}
                        className="btn-primary text-sm"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card bg-blue-50 border border-blue-200">
        <div className="card-body">
          <h3 className="font-bold mb-3">About Your Policies</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Policies are automatically created when your application is approved</li>
            <li>• Download your policy document anytime for records</li>
          </ul>
        </div>
      </div>
    </div>
  );
}