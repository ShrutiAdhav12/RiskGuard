import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { policyAPI } from '../utils/api';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const policy = location.state?.policy;

  const [step, setStep] = useState('method');
  const [method, setMethod] = useState('');
  const [upiProvider, setUpiProvider] = useState('');
  const [formData, setFormData] = useState({});
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-red-600">No policy selected</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleMethodSelect = (m) => {
    setMethod(m);
    setError('');
    if (m === 'upi') {
      setStep('upi-provider');
    } else {
      setStep('details');
    }
  };

  const handleUpiProviderSelect = (provider) => {
    setUpiProvider(provider);
    setStep('details');
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (method === 'card') {
      if (!formData.card || formData.card.length !== 16) return 'Card number must be 16 digits';
      if (!formData.holder) return 'Cardholder name is required';
      if (!formData.exp) return 'Expiry date is required';
      if (!formData.cvv || formData.cvv.length < 3) return 'CVV must be 3-4 digits';
    } else if (method === 'upi') {
      if (!formData.upi) return 'UPI ID is required';
      if (!formData.upi.includes('@')) return 'Invalid UPI ID format';
    } else if (method === 'bank') {
      if (!formData.account) return 'Account number is required';
      if (!formData.ifsc) return 'IFSC code is required';
      if (!formData.holder) return 'Account holder name is required';
    }
    return '';
  };

  const handlePay = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (processing) return;
    setProcessing(true);
    try {
      const updated = { ...policy, status: 'paid', paidDate: new Date().toISOString(), paymentMethod: method };
      await policyAPI.update(policy.id, updated);
      setError('');
      navigate('/customer/policies', { state: { paymentSuccess: true } });
    } catch (err) {
      setError('Payment failed: ' + err.message);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-xl font-bold">Payment</h1>
          <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 text-xl">✕</button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Amount */}
          <div className="bg-blue-50 p-3 rounded mb-5 border border-blue-200">
            <p className="text-xs text-gray-600">Amount to Pay</p>
            <p className="text-2xl font-bold text-blue-600">₹{policy.premium}</p>
          </div>

          {/* Error */}
          {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">{error}</div>}

          {/* Payment Method */}
          {step === 'method' && (
            <div className="space-y-2">
              <h2 className="font-bold text-gray-800 mb-3">Select Payment Method</h2>
              <button onClick={() => handleMethodSelect('card')} className="w-full p-3 border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left font-semibold">
                Card Payment
              </button>
              <button onClick={() => handleMethodSelect('upi')} className="w-full p-3 border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left font-semibold">
                UPI Payment
              </button>
              <button onClick={() => handleMethodSelect('bank')} className="w-full p-3 border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left font-semibold">
                Bank Transfer
              </button>
            </div>
          )}

          {/* UPI Provider */}
          {step === 'upi-provider' && (
            <div className="space-y-2">
              <h2 className="font-bold text-gray-800 mb-3">Choose UPI Provider</h2>
              <button onClick={() => handleUpiProviderSelect('google-pay')} className="w-full p-3 border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left font-semibold">
                Google Pay
              </button>
              <button onClick={() => handleUpiProviderSelect('phonepe')} className="w-full p-3 border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left font-semibold">
                PhonePe
              </button>
              <button onClick={() => handleUpiProviderSelect('paytm')} className="w-full p-3 border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left font-semibold">
                Paytm
              </button>
              <button onClick={() => setStep('method')} className="w-full mt-3 p-2 border-2 border-gray-300 rounded hover:bg-gray-50 text-gray-800 font-semibold text-sm">
                Back
              </button>
            </div>
          )}

          {/* Card Form */}
          {step === 'details' && method === 'card' && (
            <div className="space-y-3">
              <h2 className="font-bold text-gray-800 mb-3">Card Details</h2>
              <input type="text" name="card" placeholder="Card Number" maxLength="16" onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
              <input type="text" name="holder" placeholder="Cardholder Name" onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" name="exp" placeholder="MM/YY" maxLength="5" onChange={handleInputChange} className="px-3 py-2 border rounded" />
                <input type="text" name="cvv" placeholder="CVV" maxLength="4" onChange={handleInputChange} className="px-3 py-2 border rounded" />
              </div>
            </div>
          )}

          {/* UPI Form */}
          {step === 'details' && method === 'upi' && (
            <div className="space-y-3">
              <h2 className="font-bold text-gray-800 mb-3">UPI - {upiProvider === 'google-pay' ? 'Google Pay' : upiProvider === 'phonepe' ? 'PhonePe' : 'Paytm'}</h2>
              <input type="email" name="upi" placeholder="name@upi" onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
            </div>
          )}

          {/* Bank Form */}
          {step === 'details' && method === 'bank' && (
            <div className="space-y-3">
              <h2 className="font-bold text-gray-800 mb-3">Bank Details</h2>
              <input type="text" name="account" placeholder="Account Number" onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
              <input type="text" name="ifsc" placeholder="IFSC Code" onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
              <input type="text" name="holder" placeholder="Account Holder" onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex gap-2">
          {step === 'details' && (
            <>
              <button 
                onClick={() => method === 'upi' && upiProvider ? setStep('upi-provider') : setStep('method')} 
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 font-semibold"
              >
                Back
              </button>
              <button 
                onClick={handlePay} 
                disabled={processing} 
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-bold"
              >
                {processing ? 'Processing...' : `Pay ₹${policy.premium}`}
              </button>
            </>
          )}
          {step !== 'details' && (
            <button 
              onClick={() => navigate(-1)} 
              className="w-full px-3 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 font-semibold"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
