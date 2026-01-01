import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { premiumPaymentAPI, policyAPI } from '../../utils/api';
import { formatDate, getStatusBadge } from '../../utils/helpers';

export default function PaymentTracker() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDue: 0,
    paid: 0,
    unpaid: 0,
    overdue: 0
  });

  useEffect(() => {
    const loadPayments = async () => {
      try {
        // Load policies
        const policyRes = await policyAPI.getByCustomer(user.id);
        const policyData = policyRes.data || [];
        setPolicies(policyData);

        // Load payments
        const paymentRes = await premiumPaymentAPI.getByCustomer(user.id);
        const paymentData = paymentRes.data || [];
        setPayments(paymentData);

        // Calculate stats
        const totalDue = paymentData.reduce((sum, p) => sum + (p.finalAmount || 0), 0);
        const paid = paymentData.filter(p => p.status === 'PAID').length;
        const unpaid = paymentData.filter(p => p.status === 'UNPAID').length;
        const today = new Date();
        const overdue = paymentData.filter(p => {
          const dueDate = new Date(p.dueDate);
          return p.status === 'UNPAID' && dueDate < today;
        }).length;

        setStats({
          totalDue,
          paid,
          unpaid,
          overdue
        });
      } catch (err) {
        console.error('Failed to load payments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadPayments();
    }
  }, [user?.id]);

  const handleMarkAsPaid = async (paymentId) => {
    try {
      await premiumPaymentAPI.recordPayment(paymentId, {
        paymentMethod: 'ONLINE',
        transactionId: `TXN-${Date.now()}`
      });
      
      setPayments(prev => prev.map(p => 
        p.id === paymentId ? { ...p, status: 'PAID', paymentDate: new Date().toISOString().split('T')[0] } : p
      ));
      alert('Payment marked as paid!');
    } catch (err) {
      console.error('Error updating payment:', err);
      alert('Error updating payment status');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Payment Tracking</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Total Amount Due</p>
            <p className="text-3xl font-bold text-primary">${stats.totalDue}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Payments Made</p>
            <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Pending Payments</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.unpaid}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Overdue</p>
            <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Payment History & Invoices</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center text-gray-600">Loading payments...</p>
          ) : payments.length === 0 ? (
            <p className="text-gray-600">No payment records found. Premium payments will appear after policy issuance.</p>
          ) : (
            <div className="space-y-4">
              {payments.map(payment => {
                const policy = policies.find(p => p.id === payment.policyId);
                const isOverdue = payment.status === 'UNPAID' && new Date(payment.dueDate) < new Date();
                
                return (
                  <div key={payment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-3">
                      <div>
                        <p className="text-gray-600 text-sm">Payment ID</p>
                        <p className="font-semibold text-sm">{payment.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Policy</p>
                        <p className="font-semibold capitalize text-sm">{policy?.productType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Amount</p>
                        <p className="font-bold text-lg text-primary">${payment.finalAmount || payment.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Due Date</p>
                        <p className="font-semibold">{formatDate(payment.dueDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
                          isOverdue ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {payment.status === 'PAID' ? 'PAID' : isOverdue ? 'OVERDUE' : 'DUE'}
                        </span>
                      </div>
                      <div className="flex flex-col justify-end">
                        {payment.status === 'UNPAID' && (
                          <button
                            onClick={() => handleMarkAsPaid(payment.id)}
                            className="btn-success text-xs"
                          >
                            Pay Now
                          </button>
                        )}
                        {payment.status === 'PAID' && payment.paymentDate && (
                          <p className="text-xs text-green-600 font-semibold">Paid {formatDate(payment.paymentDate)}</p>
                        )}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Base Premium:</span>
                        <span>${payment.basePremium || payment.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (18%):</span>
                        <span>${payment.taxAmount || Math.round((payment.amount || 0) * 0.18)}</span>
                      </div>
                      <div className="border-t pt-1 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${payment.finalAmount || payment.amount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {payments.some(p => p.status === 'UNPAID') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Payment Methods</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="btn-secondary">Credit Card</button>
            <button className="btn-secondary">Debit Card</button>
            <button className="btn-secondary">Bank Transfer</button>
          </div>
        </div>
      )}
    </div>
  );
}
