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
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const appsRes = await applicationAPI.getAll();
        const customersRes = await customerAPI.getAll();
        let appsList = appsRes.data || [];
        const customers = customersRes.data || [];

        // FILTER TO ONLY 2 APPLICATIONS
        appsList = appsList.slice(0, 2);

        setApps(appsList);

        // Status Distribution
        const pending = (appsList || []).filter(a => a.status === 'pending').length;
        const approved = (appsList || []).filter(a => a.status === 'approved').length;
        const rejected = (appsList || []).filter(a => a.status === 'rejected').length;

        const statusData = [
          { name: 'Pending', value: pending, fill: '#5968ff' },
          { name: 'Approved', value: approved, fill: '#22c55e' },
          { name: 'Rejected', value: rejected, fill: '#ef4444' }
        ];

        // Risk Distribution
        const lowRisk = (appsList || []).filter(a => a.riskScore <= 40).length;
        const mediumRisk = (appsList || []).filter(a => a.riskScore > 40 && a.riskScore <= 70).length;
        const highRisk = (appsList || []).filter(a => a.riskScore > 70).length;

        const riskData = [
          { name: 'Low Risk', value: lowRisk, fill: '#22c55e' },
          { name: 'Medium Risk', value: mediumRisk, fill: '#eab308' },
          { name: 'High Risk', value: highRisk, fill: '#ef4444' }
        ];

        // Monthly Trend - Generated from actual application data
        const monthlyData = generateMonthlyTrends(appsList);

        // Calculate Risk Metrics
        const avgRiskScore = appsList.length > 0
          ? Math.round(appsList.reduce((sum, a) => sum + (a.riskScore || 0), 0) / appsList.length)
          : 0;
        
        const approvalRate = appsList.length > 0
          ? Math.round((approved / appsList.length) * 100)
          : 0;

        const riskMetrics = {
          avgRiskScore,
          approvalRate,
          totalApplied: appsList.length,
          highRiskCount: highRisk,
          highRiskPercent: appsList.length > 0 ? Math.round((highRisk / appsList.length) * 100) : 0
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

  // Generate monthly trends based on actual application dates
  const generateMonthlyTrends = (appsList) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyCount = {};

    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      monthlyCount[monthNames[i]] = { applications: 0, approved: 0 };
    }

    // Count applications and approvals by month
    appsList.forEach(app => {
      const appliedDate = new Date(app.appliedDate || app.createdAt);
      if (appliedDate.getFullYear() === currentYear) {
        const month = monthNames[appliedDate.getMonth()];
        monthlyCount[month].applications += 1;
        if (app.status === 'approved') {
          monthlyCount[month].approved += 1;
        }
      }
    });

    // Convert to array format for chart - only show months with data
    return monthNames
      .map(month => ({
        month,
        applications: monthlyCount[month].applications,
        approved: monthlyCount[month].approved
      }))
      .filter(d => d.applications > 0);
  };

  // Export as CSV
  const exportToCSV = () => {
    if (apps.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Name', 'Email', 'Status', 'Risk Score', 'Applied Date', 'Premium', 'Insurance Type'];
    const csvContent = [
      headers.join(','),
      ...apps.map(app =>
        [
          `"${app.name}"`,
          `"${app.email}"`,
          app.status,
          app.riskScore,
          app.appliedDate || app.createdAt,
          app.premium,
          app.insuranceType
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as Excel
  const exportToExcel = () => {
    if (apps.length === 0) {
      alert('No data to export');
      return;
    }

    let excelContent = '<html><head><meta charset="UTF-8"></head><body>';
    excelContent += '<h2>Applications Report</h2>';
    excelContent += `<p>Generated on: ${new Date().toLocaleDateString()}</p>`;
    excelContent += `<p>Total Applications: ${apps.length}</p>`;
    excelContent += '<h3>Summary Metrics</h3>';
    excelContent += '<ul>';
    excelContent += `<li>Average Risk Score: ${chartData.riskMetrics.avgRiskScore}</li>`;
    excelContent += `<li>Approval Rate: ${chartData.riskMetrics.approvalRate}%</li>`;
    excelContent += `<li>High-Risk Count: ${chartData.riskMetrics.highRiskCount}</li>`;
    excelContent += `<li>High-Risk Percentage: ${chartData.riskMetrics.highRiskPercent}%</li>`;
    excelContent += '</ul>';
    excelContent += '<h3>Application Details</h3>';
    excelContent += '<table border="1" cellpadding="10">';
    excelContent += '<tr style="background-color: #5968ff; color: white;">';
    excelContent += '<th>Name</th><th>Email</th><th>Status</th><th>Risk Score</th><th>Applied Date</th><th>Premium</th><th>Insurance Type</th>';
    excelContent += '</tr>';

    apps.forEach(app => {
      excelContent += '<tr>';
      excelContent += `<td>${app.name}</td>`;
      excelContent += `<td>${app.email}</td>`;
      excelContent += `<td>${app.status}</td>`;
      excelContent += `<td>${app.riskScore}</td>`;
      excelContent += `<td>${app.appliedDate || app.createdAt}</td>`;
      excelContent += `<td>${app.premium}</td>`;
      excelContent += `<td>${app.insuranceType}</td>`;
      excelContent += '</tr>';
    });

    excelContent += '</table></body></html>';

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications-report-${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as PDF
  const exportToPDF = () => {
    if (apps.length === 0) {
      alert('No data to export');
      return;
    }

    let pdfContent = 'APPLICATIONS REPORT\n';
    pdfContent += '='.repeat(100) + '\n\n';
    pdfContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
    pdfContent += `Total Applications: ${apps.length}\n\n`;

    pdfContent += 'SUMMARY METRICS:\n';
    pdfContent += '-'.repeat(100) + '\n';
    pdfContent += `Average Risk Score: ${chartData.riskMetrics.avgRiskScore}\n`;
    pdfContent += `Approval Rate: ${chartData.riskMetrics.approvalRate}%\n`;
    pdfContent += `High-Risk Count: ${chartData.riskMetrics.highRiskCount}\n`;
    pdfContent += `High-Risk Percentage: ${chartData.riskMetrics.highRiskPercent}%\n`;
    pdfContent += `Total Applications Analyzed: ${chartData.riskMetrics.totalApplied}\n\n`;

    pdfContent += 'STATUS DISTRIBUTION:\n';
    pdfContent += '-'.repeat(100) + '\n';
    chartData.statusData.forEach(status => {
      pdfContent += `${status.name}: ${status.value}\n`;
    });
    pdfContent += '\n';

    pdfContent += 'RISK DISTRIBUTION:\n';
    pdfContent += '-'.repeat(100) + '\n';
    chartData.riskData.forEach(risk => {
      pdfContent += `${risk.name}: ${risk.value}\n`;
    });
    pdfContent += '\n';

    pdfContent += 'APPLICATIONS DETAILS:\n';
    pdfContent += '-'.repeat(100) + '\n';
    pdfContent += `${'Name'.padEnd(20)} | ${'Email'.padEnd(25)} | ${'Status'.padEnd(12)} | ${'Risk'.padEnd(6)} | ${'Premium'.padEnd(10)}\n`;
    pdfContent += '-'.repeat(100) + '\n';

    apps.forEach(app => {
      pdfContent += `${(app.name || '').padEnd(20)} | ${(app.email || '').padEnd(25)} | ${(app.status || '').padEnd(12)} | ${(app.riskScore || '0').toString().padEnd(6)} | ${(app.premium || '0').toString().padEnd(10)}\n`;
    });

    pdfContent += '\n' + '='.repeat(100) + '\n';
    pdfContent += 'End of Report\n';

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications-report-${new Date().toISOString().split('T')[0]}.pdf`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
      <p className="text-gray-600">Displaying data for 2 applications</p>

      {/* Status Distribution */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Application Status Distribution</h2>
        </div>
        <div className="card-body flex justify-center">
          {chartData.statusData.length > 0 ? (
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
          ) : (
            <p className="text-gray-600">No status data available</p>
          )}
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Risk Score Distribution</h2>
        </div>
        <div className="card-body flex justify-center">
          {chartData.riskData.length > 0 ? (
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
          ) : (
            <p className="text-gray-600">No risk data available</p>
          )}
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
          {chartData.monthlyData.length > 0 ? (
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
          ) : (
            <p className="text-gray-600">No monthly trend data available</p>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Export Reports</h2>
        </div>
        <div className="card-body">
          <div className="flex gap-2 flex-wrap">
            <button onClick={exportToPDF} className="btn-primary">Export as PDF</button>
            <button onClick={exportToCSV} className="btn-secondary">Export as CSV</button>
            <button onClick={exportToExcel} className="btn-secondary">Export as Excel</button>
          </div>
        </div>
      </div>
    </div>
  );
}