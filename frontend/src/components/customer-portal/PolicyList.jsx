
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { policyAPI, applicationAPI } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers';

export default function PolicyList() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePaymentPolicy, setActivePaymentPolicy] = useState(null);
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    accountNumber: '',
    ifscCode: '',
    accountHolder: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({});

  const validatePaymentDetails = () => {
    const errors = {};

    if (selectedPaymentCategory === 'cards') {
      if (!paymentDetails.cardNumber.trim()) errors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) errors.cardNumber = 'Card number must be 16 digits';
      
      if (!paymentDetails.cardHolder.trim()) errors.cardHolder = 'Cardholder name is required';
      if (!paymentDetails.expiryDate.trim()) errors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) errors.expiryDate = 'Format: MM/YY';
      
      if (!paymentDetails.cvv.trim()) errors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) errors.cvv = 'CVV must be 3-4 digits';
    } else if (selectedPaymentCategory === 'wallets') {
      if (!paymentDetails.upiId.trim()) errors.upiId = 'UPI ID is required';
      else if (!/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId)) errors.upiId = 'Invalid UPI ID format (e.g., yourname@upi)';
    } else if (selectedPaymentCategory === 'netbanking') {
      if (!paymentDetails.accountNumber.trim()) errors.accountNumber = 'Account number is required';
      if (!paymentDetails.ifscCode.trim()) errors.ifscCode = 'IFSC code is required';
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(paymentDetails.ifscCode)) errors.ifscCode = 'Invalid IFSC code format';
      if (!paymentDetails.accountHolder.trim()) errors.accountHolder = 'Account holder name is required';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentDetailChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
    if (paymentErrors[field]) {
      setPaymentErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const resetPaymentModal = () => {
    setActivePaymentPolicy(null);
    setSelectedPaymentCategory(null);
    setSelectedPaymentMethod(null);
    setPaymentDetails({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
      accountNumber: '',
      ifscCode: '',
      accountHolder: ''
    });
    setPaymentErrors({});
  };

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

  const handleConfirmPayment = async (policyId) => {
    // Validate payment details first
    if (!validatePaymentDetails()) {
      return;
    }

    try {
      // Find the policy
      const policy = policies.find(p => p.id === policyId);
      if (!policy) {
        alert('Policy not found');
        return;
      }

      // Update policy status to 'paid' in database
      const updatedPolicy = { ...policy, status: 'paid', paidDate: new Date().toISOString() };
      await policyAPI.update(policyId, updatedPolicy);

      // Update UI
      setPolicies(prevPolicies => 
        prevPolicies.map(p => 
          p.id === policyId ? updatedPolicy : p
        )
      );
      resetPaymentModal();
      alert('✓ Payment confirmed! Status saved.');
    } catch (err) {
      console.error('Error confirming payment:', err);
      alert('Error: ' + err.message);
    }
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
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full h-fit max-h-[90vh] relative flex flex-col">
                      {/* Close Button */}
                      <button
                        onClick={resetPaymentModal}
                        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all z-10"
                        title="Close"
                      >
                        ✕
                      </button>

                      {/* Header */}
                      <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-3 flex-shrink-0">
                        <h3 className="text-lg font-bold">Secure Payment</h3>
                        <p className="text-xs text-blue-100">Select your payment method</p>
                      </div>

                      <div className="p-4 overflow-y-auto flex-1">
                        {/* Payment Summary Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600 text-xs">Policy ID</p>
                              <p className="font-bold text-gray-900 text-xs">{policy.id}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-xs">Coverage</p>
                              <p className="font-bold text-gray-900 text-xs">{policy.coverage}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600 text-xs">Amount</p>
                              <p className="text-lg font-bold text-primary">₹{policy.premium}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Categories */}
                        {!selectedPaymentCategory ? (
                          <>
                            <h4 className="font-bold text-gray-900 mb-3 text-base">Choose Payment Method</h4>
                            <div className="grid grid-cols-1 gap-2 mb-4">
                              {/* Credit/Debit Cards */}
                              <div 
                                className="p-3 border-2 border-gray-200 rounded-lg hover:border-red-400 hover:shadow-lg transition-all cursor-pointer hover:bg-red-50"
                                onClick={() => setSelectedPaymentCategory('cards')}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">💳</div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 text-sm">Credit/Debit Cards</h5>
                                    <p className="text-xs text-gray-600">Visa, Mastercard, RuPay</p>
                                  </div>
                                </div>
                              </div>

                              {/* Digital Wallets */}
                              <div 
                                className="p-3 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer hover:bg-purple-50"
                                onClick={() => setSelectedPaymentCategory('wallets')}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">📱</div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 text-sm">Digital Wallets</h5>
                                    <p className="text-xs text-gray-600">PhonePe, Google Pay, PayPal</p>
                                  </div>
                                </div>
                              </div>

                              {/* Net Banking */}
                              <div 
                                className="p-3 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:shadow-lg transition-all cursor-pointer hover:bg-green-50"
                                onClick={() => setSelectedPaymentCategory('netbanking')}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">🏦</div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 text-sm">Net Banking</h5>
                                    <p className="text-xs text-gray-600">IMPS, NEFT, RTGS</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-gray-900 text-base">
                                {selectedPaymentCategory === 'cards' && 'Select Card Type'}
                                {selectedPaymentCategory === 'wallets' && 'Select Digital Wallet'}
                                {selectedPaymentCategory === 'netbanking' && 'Select Bank Transfer Method'}
                              </h4>
                              <button 
                                onClick={() => {
                                  setSelectedPaymentCategory(null);
                                  setSelectedPaymentMethod(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 text-lg"
                              >
                                ←
                              </button>
                            </div>

                            {/* Credit/Debit Cards Sub-options */}
                            {selectedPaymentCategory === 'cards' && (
                              <div className="grid grid-cols-1 gap-2 mb-4">
                                {['Visa', 'Mastercard', 'RuPay'].map(card => (
                                  <div 
                                    key={card}
                                    className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                                      selectedPaymentMethod === card 
                                        ? 'border-red-500 bg-red-50 shadow-lg' 
                                        : 'border-gray-200 hover:border-red-300'
                                    }`}
                                    onClick={() => setSelectedPaymentMethod(card)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl">
                                        {card === 'Visa' && '🔷'}
                                        {card === 'Mastercard' && '🔴'}
                                        {card === 'RuPay' && '🟠'}
                                      </span>
                                      <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">{card}</p>
                                        <p className="text-xs text-gray-600">Debit / Credit Card</p>
                                      </div>
                                      {selectedPaymentMethod === card && <span className="text-sm">✓</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Digital Wallets Sub-options */}
                            {selectedPaymentCategory === 'wallets' && (
                              <div className="grid grid-cols-1 gap-2 mb-4">
                                {[
                                  { 
                                    name: 'PhonePe', 
                                    logo: 'https://static.phonepe.com/web/static/phonepe-logo-7a9e6f4.svg',
                                    bgColor: '#7D3C98' 
                                  },
                                  { 
                                    name: 'Google Pay', 
                                    logo: 'https://pay.google.com/about/static/images/brand/logo_googlepay_192.svg',
                                    bgColor: '#4285F4' 
                                  },
                                  { 
                                    name: 'PayPal', 
                                    logo: 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png', 
                                    bgColor: '#003087' 
                                  }
                                ].map(wallet => (
                                  <div 
                                    key={wallet.name}
                                    className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                                      selectedPaymentMethod === wallet.name 
                                        ? 'border-purple-500 bg-purple-50 shadow-lg' 
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                                    onClick={() => setSelectedPaymentMethod(wallet.name)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: `${wallet.bgColor}20` }}>
                                        <img 
                                          src={wallet.logo} 
                                          alt={wallet.name}
                                          className="w-10 h-10 object-contain"
                                          loading="eager"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">{wallet.name}</p>
                                        <p className="text-xs text-gray-600">Digital Wallet</p>
                                      </div>
                                      {selectedPaymentMethod === wallet.name && <span className="text-sm">✓</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Net Banking Sub-options */}
                            {selectedPaymentCategory === 'netbanking' && (
                              <div className="grid grid-cols-1 gap-2 mb-4">
                                {['IMPS', 'NEFT', 'RTGS'].map(method => (
                                  <div 
                                    key={method}
                                    className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                                      selectedPaymentMethod === method 
                                        ? 'border-green-500 bg-green-50 shadow-lg' 
                                        : 'border-gray-200 hover:border-green-300'
                                    }`}
                                    onClick={() => setSelectedPaymentMethod(method)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl">
                                        {method === 'IMPS' && '⚡'}
                                        {method === 'NEFT' && '📤'}
                                        {method === 'RTGS' && '📊'}
                                      </span>
                                      <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">{method}</p>
                                        <p className="text-xs text-gray-600">
                                          {method === 'IMPS' && 'Instant (24/7)'}
                                          {method === 'NEFT' && 'Next Day Settlement'}
                                          {method === 'RTGS' && 'Real Time Gross Settlement'}
                                        </p>
                                      </div>
                                      {selectedPaymentMethod === method && <span className="text-sm">✓</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Selected Method Summary */}
                            {selectedPaymentMethod && (
                              <>
                                {/* Payment Details Input Forms */}
                                {selectedPaymentCategory === 'cards' && (
                                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-4">
                                    <h4 className="font-bold text-blue-900 text-sm mb-3">Enter Card Details</h4>
                                    
                                    {/* Card Number */}
                                    <div className="mb-3">
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number *</label>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="19"
                                        value={paymentDetails.cardNumber}
                                        onChange={(e) => {
                                          let val = e.target.value.replace(/\D/g, '');
                                          if (val.length > 0) {
                                            val = val.replace(/(\d{4})/g, '$1 ').trim();
                                          }
                                          handlePaymentDetailChange('cardNumber', val);
                                        }}
                                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition ${
                                          paymentErrors.cardNumber 
                                            ? 'border-red-500 bg-red-50' 
                                            : 'border-blue-300 focus:border-blue-500'
                                        }`}
                                      />
                                      {paymentErrors.cardNumber && <p className="text-red-600 text-xs mt-1">{paymentErrors.cardNumber}</p>}
                                    </div>

                                    {/* Cardholder Name */}
                                    <div className="mb-3">
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">Cardholder Name *</label>
                                      <input
                                        type="text"
                                        value={paymentDetails.cardHolder}
                                        onChange={(e) => handlePaymentDetailChange('cardHolder', e.target.value)}
                                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition ${
                                          paymentErrors.cardHolder 
                                            ? 'border-red-500 bg-red-50' 
                                            : 'border-blue-300 focus:border-blue-500'
                                        }`}
                                      />
                                      {paymentErrors.cardHolder && <p className="text-red-600 text-xs mt-1">{paymentErrors.cardHolder}</p>}
                                    </div>

                                    {/* Expiry Date & CVV */}
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                      <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry (MM/YY) *</label>
                                        <input
                                          type="text"
                                          inputMode="numeric"
                                          maxLength="5"
                                          value={paymentDetails.expiryDate}
                                          onChange={(e) => {
                                            let val = e.target.value.replace(/\D/g, '');
                                            if (val.length >= 2) {
                                              val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                            }
                                            handlePaymentDetailChange('expiryDate', val);
                                          }}
                                          className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition ${
                                            paymentErrors.expiryDate 
                                              ? 'border-red-500 bg-red-50' 
                                              : 'border-blue-300 focus:border-blue-500'
                                          }`}
                                        />
                                        {paymentErrors.expiryDate && <p className="text-red-600 text-xs mt-1">{paymentErrors.expiryDate}</p>}
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">CVV *</label>
                                        <input
                                          type="password"
                                          inputMode="numeric"
                                          maxLength="4"
                                          value={paymentDetails.cvv}
                                          onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            handlePaymentDetailChange('cvv', val);
                                          }}
                                          className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition ${
                                            paymentErrors.cvv 
                                              ? 'border-red-500 bg-red-50' 
                                              : 'border-blue-300 focus:border-blue-500'
                                          }`}
                                        />
                                        {paymentErrors.cvv && <p className="text-red-600 text-xs mt-1">{paymentErrors.cvv}</p>}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {selectedPaymentCategory === 'wallets' && (
                                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 mb-4">
                                    <h4 className="font-bold text-purple-900 text-sm mb-3">Enter UPI ID</h4>
                                    
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">UPI ID *</label>
                                      <input
                                        type="text"
                                        value={paymentDetails.upiId}
                                        onChange={(e) => handlePaymentDetailChange('upiId', e.target.value)}
                                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition ${
                                          paymentErrors.upiId 
                                            ? 'border-red-500 bg-red-50' 
                                            : 'border-purple-300 focus:border-purple-500'
                                        }`}
                                      />
                                      {paymentErrors.upiId && <p className="text-red-600 text-xs mt-1">{paymentErrors.upiId}</p>}
                                    </div>
                                  </div>
                                )}

                                {selectedPaymentCategory === 'netbanking' && (
                                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 mb-4">
                                    <h4 className="font-bold text-green-900 text-sm mb-3">Enter Bank Details</h4>
                                    
                                    {/* Account Number */}
                                    <div className="mb-3">
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">Account Number *</label>
                                      <input
                                        type="text"
                                        value={paymentDetails.accountNumber}
                                        onChange={(e) => handlePaymentDetailChange('accountNumber', e.target.value)}
                                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition ${
                                          paymentErrors.accountNumber 
                                            ? 'border-red-500 bg-red-50' 
                                            : 'border-green-300 focus:border-green-500'
                                        }`}
                                      />
                                      {paymentErrors.accountNumber && <p className="text-red-600 text-xs mt-1">{paymentErrors.accountNumber}</p>}
                                    </div>

                                    {/* IFSC Code */}
                                    <div className="mb-3">
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">IFSC Code *</label>
                                      <input
                                        type="text"
                                        value={paymentDetails.ifscCode}
                                        onChange={(e) => handlePaymentDetailChange('ifscCode', e.target.value.toUpperCase())}
                                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition ${
                                          paymentErrors.ifscCode 
                                            ? 'border-red-500 bg-red-50' 
                                            : 'border-green-300 focus:border-green-500'
                                        }`}
                                      />
                                      {paymentErrors.ifscCode && <p className="text-red-600 text-xs mt-1">{paymentErrors.ifscCode}</p>}
                                    </div>

                                    {/* Account Holder */}
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">Account Holder Name *</label>
                                      <input
                                        type="text"
                                        value={paymentDetails.accountHolder}
                                        onChange={(e) => handlePaymentDetailChange('accountHolder', e.target.value)}
                                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition ${
                                          paymentErrors.accountHolder 
                                            ? 'border-red-500 bg-red-50' 
                                            : 'border-green-300 focus:border-green-500'
                                        }`}
                                      />
                                      {paymentErrors.accountHolder && <p className="text-red-600 text-xs mt-1">{paymentErrors.accountHolder}</p>}
                                    </div>
                                  </div>
                                )}

                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-3 mb-4">
                                  <p className="text-xs text-gray-600">Payment Method Selected</p>
                                  <p className="font-bold text-green-700 text-sm">{selectedPaymentMethod}</p>
                                  <p className="text-xs text-gray-600 mt-1">Amount: <span className="font-bold text-gray-900">₹{policy.premium}</span></p>
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* Footer Actions */}
                        <div className="flex gap-2 pt-3 border-t">
                          {selectedPaymentCategory && (
                            <button 
                              onClick={() => {
                                setSelectedPaymentCategory(null);
                                setSelectedPaymentMethod(null);
                                setPaymentDetails({
                                  cardNumber: '',
                                  cardHolder: '',
                                  expiryDate: '',
                                  cvv: '',
                                  upiId: '',
                                  accountNumber: '',
                                  ifscCode: '',
                                  accountHolder: ''
                                });
                                setPaymentErrors({});
                              }}
                              className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 transition"
                            >
                              Back
                            </button>
                          )}
                          {selectedPaymentMethod && (
                            <button 
                              onClick={() => handleConfirmPayment(policy.id)}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-3 text-sm rounded-lg transition-all shadow-lg"
                            >
                              Pay ₹{policy.premium}
                            </button>
                          )}
                          {!selectedPaymentMethod && !selectedPaymentCategory && (
                            <button 
                              onClick={resetPaymentModal}
                              className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 transition"
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
                        onClick={() => setActivePaymentPolicy(policy.id)}
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