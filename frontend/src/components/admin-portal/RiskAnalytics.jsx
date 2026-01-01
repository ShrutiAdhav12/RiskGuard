import React, { useEffect, useState } from 'react';
import { applicationAPI, riskReportAPI, premiumPaymentAPI, policyAPI } from '../../utils/api';
import { generateRiskReport } from '../../utils/riskEngine';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RiskAnalytics() {
  const [applications, setApplications] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [payments, setPayments] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyTrends, setMonthlyTrends] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [appsRes, policiesRes, paymentsRes] = await Promise.all([
          applicationAPI.getAll(),
          policyAPI.getAll(),
          premiumPaymentAPI.getAll()
        ]);

        const appsData = appsRes.data || [];
        const policiesData = policiesRes.data || [];
        const paymentsData = paymentsRes.data || [];

        setApplications(appsData);
        setPolicies(policiesData);
        setPayments(paymentsData);

        // Generate risk report
        const riskReport = generateRiskReport(appsData, policiesData);
        setReport(riskReport);

        // Calculate monthly trends (simulated data)
        const trends = [
          { month: 'Jan', submitted: 12, approved: 10, rejected: 2, revenue: 25000 },
          { month: 'Feb', submitted: 15, approved: 12, rejected: 3, revenue: 31000 },
          { month: 'Mar', submitted: 18, approved: 14, rejected: 4, revenue: 36000 },
          { month: 'Apr', submitted: 20, approved: 16, rejected: 4, revenue: 41000 },
          { month: 'May', submitted: 22, approved: 18, rejected: 4, revenue: 46000 },
          { month: 'Jun', submitted: 25, approved: 20, rejected: 5, revenue: 52000 },
        ];
        setMonthlyTrends(trends);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  if (loading) {
    return <p className="text-center text-gray-600">Loading analytics...</p>;
  }

  if (!report) {
    return <p className="text-center text-gray-600">No data available</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Risk Analytics & Reporting</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Average Risk Score</p>
            <p className="text-3xl font-bold text-primary">{report.metrics.averageRiskScore}</p>
            <p className="text-xs text-gray-500 mt-2">Portfolio Average</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Approval Rate</p>
            <p className="text-3xl font-bold text-green-600">{report.metrics.approvalRate}</p>
            <p className="text-xs text-gray-500 mt-2">Accepted Applications</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Total Premium Revenue</p>
            <p className="text-3xl font-bold text-blue-600">${report.metrics.totalPremiumCollected}</p>
            <p className="text-xs text-gray-500 mt-2">Active Policies</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 text-sm mb-2">Active Policies</p>
            <p className="text-3xl font-bold text-purple-600">{report.metrics.activePolicies}</p>
            <p className="text-xs text-gray-500 mt-2">Total Issued</p>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-body">
            <h3 className="font-semibold mb-3">Applications Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Applications</span>
                <span className="font-bold">{report.metrics.totalApplications}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Approved</span>
                <span className="font-bold">{report.metrics.approvedCount}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Rejected</span>
                <span className="font-bold">{report.metrics.rejectedCount}</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Pending</span>
                <span className="font-bold">{report.metrics.pendingCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="font-semibold mb-3">Risk Distribution</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Low Risk (0-40)</span>
                <div className="flex-1 mx-2 h-2 bg-green-200 rounded">
                  <div className="h-full bg-green-600 rounded" style={{width: `${(report.riskDistribution.low / report.metrics.totalApplications * 100) || 0}%`}}></div>
                </div>
                <span className="font-bold">{report.riskDistribution.low}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Medium Risk (40-70)</span>
                <div className="flex-1 mx-2 h-2 bg-yellow-200 rounded">
                  <div className="h-full bg-yellow-600 rounded" style={{width: `${(report.riskDistribution.medium / report.metrics.totalApplications * 100) || 0}%`}}></div>
                </div>
                <span className="font-bold">{report.riskDistribution.medium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>High Risk (70+)</span>
                <div className="flex-1 mx-2 h-2 bg-red-200 rounded">
                  <div className="h-full bg-red-600 rounded" style={{width: `${(report.riskDistribution.high / report.metrics.totalApplications * 100) || 0}%`}}></div>
                </div>
                <span className="font-bold">{report.riskDistribution.high}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="font-semibold mb-3">Coverage Portfolio</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Coverage</span>
                <span className="font-bold">${report.metrics.totalCoverageAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Policies</span>
                <span className="font-bold text-green-600">{report.metrics.activePolicies}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Premium</span>
                <span className="font-bold">${report.metrics.totalPremiumCollected > 0 ? Math.round(report.metrics.totalPremiumCollected / (report.metrics.activePolicies || 1)) : 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Distribution Pie Chart */}
        <div className="card">
          <div className="card-body">
            <h3 className="font-semibold mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Low Risk', value: report.riskDistribution.low },
                    { name: 'Medium Risk', value: report.riskDistribution.medium },
                    { name: 'High Risk', value: report.riskDistribution.high }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="card-body">
            <h3 className="font-semibold mb-4">Application Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { status: 'Approved', count: report.metrics.approvedCount, fill: '#22c55e' },
                  { status: 'Rejected', count: report.metrics.rejectedCount, fill: '#ef4444' },
                  { status: 'Pending', count: report.metrics.pendingCount, fill: '#eab308' }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#5968ff">
                  {[
                    { status: 'Approved', count: report.metrics.approvedCount, fill: '#22c55e' },
                    { status: 'Rejected', count: report.metrics.rejectedCount, fill: '#ef4444' },
                    { status: 'Pending', count: report.metrics.pendingCount, fill: '#eab308' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="card">
        <div className="card-body">
          <h3 className="font-semibold mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="submitted" stroke="#5968ff" name="Applications Submitted" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="approved" stroke="#22c55e" name="Approved" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" name="Revenue ($)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="card-body">
          <h3 className="font-semibold mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Export Options */}
      <div className="card bg-gray-50">
        <div className="card-body">
          <h3 className="font-semibold mb-3">Export Report</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="btn-secondary">Download as PDF</button>
            <button className="btn-secondary">Export as CSV</button>
            <button className="btn-secondary">Export as Excel</button>
          </div>
        </div>
      </div>

      {/* Report Metadata */}
      <div className="text-xs text-gray-500 text-center">
        <p>Report Generated: {report.generatedDate}</p>
        <p>Report Period: {report.month}</p>
      </div>
    </div>
  );
}
