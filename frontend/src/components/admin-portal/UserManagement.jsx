import React, { useEffect, useState } from 'react';
import { customerAPI } from '../../utils/api';
import { formatDate } from '../../utils/helpers';

export default function UserManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await customerAPI.getAll();
        const data = response.data || [];
        setCustomers(data);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeactivate = (customerId) => {
    if (window.confirm('Are you sure you want to deactivate this customer?')) {
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, status: 'inactive' } : c));
      alert('Customer deactivated!');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>

      {/* Search Bar */}
      <div className="card">
        <div className="card-body">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Customers ({filtered.length})</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center text-gray-600">Loading customers...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-600">No customers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2 hidden sm:table-cell">Phone</th>
                    <th className="text-left py-2 hidden md:table-cell">Registered</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(customer => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-semibold">{customer.name}</td>
                      <td className="py-3 text-sm">{customer.email}</td>
                      <td className="py-3 hidden sm:table-cell text-sm">{customer.phone || '-'}</td>
                      <td className="py-3 hidden md:table-cell text-sm">
                        {customer.createdAt ? formatDate(customer.createdAt) : '-'}
                      </td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.status === 'active' ? 'badge-success' : 'badge-secondary'
                        }`}>
                          {customer.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3">
                        {customer.status !== 'inactive' ? (
                          <button
                            onClick={() => handleDeactivate(customer.id)}
                            className="btn-secondary text-sm"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button disabled className="btn-secondary text-sm opacity-50 cursor-not-allowed">
                            Inactive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-primary">{customers.length}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Active</p>
            <p className="text-3xl font-bold text-green-600">
              {customers.filter(c => c.status !== 'inactive').length}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Inactive</p>
            <p className="text-3xl font-bold text-red-600">
              {customers.filter(c => c.status === 'inactive').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
