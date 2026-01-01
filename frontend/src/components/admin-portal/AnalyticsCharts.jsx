import React, { useEffect, useState } from 'react';
import { applicationAPI, customerAPI } from '../../utils/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function AnalyticsCharts() {
  const [chartData, setChartData] = useState({
    statusData: [],
    riskData: [],
    monthlyData: [],
    riskMetrics: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const appsRes = await applicationAPI.getAll();
        const customersRes = await customerAPI.getAll();
        const apps = appsRes.data || [];
        const customers = customersRes.data || [];

        // Status Distribution
        const pending = (apps || []).filter(a => a.status === 'pending').length;
        const approved = (apps || []).filter(a => a.status === 'approved').length;
        const rejected = (apps || []).filter(a => a.status === 'rejected').length;

        const statusData = [
          { name: 'Pending', value: pending, fill: '#5968ff' },
          { name: 'Approved', value: approved, fill: '#22c55e' },
          { name: 'Rejected', value: rejected, fill: '#ef4444' }
        ];

        // Risk Distribution
        const lowRisk = (apps || []).filter(a => a.riskScore <= 40).length;
        const mediumRisk = (apps || []).filter(a => a.riskScore > 40 && a.riskScore <= 70).length;
        const highRisk = (apps || []).filter(a => a.riskScore > 70).length;

        const riskData = [
          { name: 'Low Risk', value: lowRisk, fill: '#22c55e' },
          { name: 'Medium Risk', value: mediumRisk, fill: '#eab308' },
          { name: 'High Risk', value: highRisk, fill: '#ef4444' }
        ];

        // Monthly Trend (Mock data)
        const monthlyData = [
          { month: 'Jan', applications: 12, approved: 8 },
          { month: 'Feb', applications: 19, approved: 14 },
          { month: 'Mar', applications: 15, approved: 11 },
          { month: 'Apr', applications: 22, approved: 18 },
          { month: 'May', applications: 25, approved: 20 },
          { month: 'Jun', applications: 28, approved: 23 }
        ];

        // Calculate Risk Metrics
        const avgRiskScore = apps.length > 0
          ? Math.round(apps.reduce((sum, a) => sum + (a.riskScore || 0), 0) / apps.length)
          : 0;
        
        const approvalRate = apps.length > 0
          ? Math.round((approved / apps.length) * 100)
          : 0;

        const riskMetrics = {
          avgRiskScore,
          approvalRate,
          totalApplied: apps.length,
          highRiskCount: highRisk,
          highRiskPercent: apps.length > 0 ? Math.round((highRisk / apps.length) * 100) : 0
        };

        setChartData({
          statusData: statusData.filter(d => d.value > 0),
          riskData: riskData.filter(d => d.value > 0),
          monthlyData,
          riskMetrics
        });
      } catch (err) {
        console.error('Failed to load chart data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadChartData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>

      {/* Status Distribution */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Application Status Distribution</h2>
        </div>
        <div className="card-body flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Risk Score Distribution</h2>
        </div>
        <div className="card-body flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Avg Risk Score</p>
            <p className="text-3xl font-bold text-yellow-600">{chartData.riskMetrics.avgRiskScore}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Approval Rate</p>
            <p className="text-3xl font-bold text-green-600">{chartData.riskMetrics.approvalRate}%</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">High-Risk Count</p>
            <p className="text-3xl font-bold text-red-600">{chartData.riskMetrics.highRiskCount}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">High-Risk Percent</p>
            <p className="text-3xl font-bold text-red-600">{chartData.riskMetrics.highRiskPercent}%</p>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Monthly Application Trends</h2>
        </div>
        <div className="card-body flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#5968ff" strokeWidth={2} />
              <Line type="monotone" dataKey="approved" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Export Reports</h2>
        </div>
        <div className="card-body">
          <div className="flex gap-2 flex-wrap">
            <button className="btn-primary">Export as PDF</button>
            <button className="btn-secondary">Export as CSV</button>
            <button className="btn-secondary">Export as Excel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
