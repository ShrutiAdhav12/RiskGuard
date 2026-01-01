import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI, customerAPI, productAPI } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalApps: 0,
    totalCustomers: 0,
    totalProducts: 0,
    approvalRate: 0,
    avgRiskScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const appsRes = await applicationAPI.getAll();
        const customersRes = await customerAPI.getAll();
        const productsRes = await productAPI.getAll();

        const apps = appsRes.data || [];
        const customers = customersRes.data || [];
        const products = productsRes.data || [];

        const approved = apps.filter(a => a.status === 'approved').length;
        const approvalRate = apps.length > 0 ? Math.round((approved / apps.length) * 100) : 0;
        const avgRisk = apps.length > 0 
          ? Math.round(apps.reduce((sum, a) => sum + (a.riskScore || 0), 0) / apps.length)
          : 0;

        setStats({
          totalApps: apps?.length || 0,
          totalCustomers: customers?.length || 0,
          totalProducts: products?.length || 0,
          approvalRate,
          avgRiskScore: avgRisk
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Total Applications</p>
            <p className="text-3xl font-bold text-primary">{stats.totalApps}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCustomers}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Total Products</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Approval Rate</p>
            <p className="text-3xl font-bold text-green-600">{stats.approvalRate}%</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Avg Risk Score</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.avgRiskScore}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/products" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body text-center">
            <p className="text-lg font-bold text-primary mb-2">PRODUCTS</p>
            <p className="font-bold">Manage Products</p>
            <p className="text-sm text-gray-600">Add/Edit Insurance Products</p>
          </div>
        </Link>
        <Link to="/admin/users" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body text-center">
            <p className="text-lg font-bold text-primary mb-2">CUSTOMERS</p>
            <p className="font-bold">Manage Customers</p>
            <p className="text-sm text-gray-600">View All Customers</p>
          </div>
        </Link>
        <Link to="/admin/reports" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="card-body text-center">
            <p className="text-lg font-bold text-primary mb-2">ANALYTICS</p>
            <p className="font-bold">Risk Reports</p>
            <p className="text-sm text-gray-600">Portfolio & Trends</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
