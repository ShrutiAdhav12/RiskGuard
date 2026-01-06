// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { applicationAPI, policyAPI } from '../../utils/api';
// import { formatCurrency, getStatusBadge } from '../../utils/helpers';
// import { Link } from 'react-router-dom';

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [applications, setApplications] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, [user]);

//   const loadData = async () => {
//     try {
//       if (user?.id) {
//         const [appsRes, policiesRes] = await Promise.all([
//           applicationAPI.getByCustomer(user.id),
//           policyAPI.getByCustomer(user.id)
//         ]);
//         setApplications(appsRes.data);
//         setPolicies(policiesRes.data);
        
//         // Simulate payment data
//         const outstandingPayments = [
//           { id: 1, policyId: 'POL001', amount: 125, dueDate: '2024-02-15', status: 'overdue' },
//           { id: 2, policyId: 'POL002', amount: 85, dueDate: '2024-02-20', status: 'due' }
//         ];
//         setPayments(outstandingPayments);
//       }
//     } catch (err) {
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const stats = {
//     totalApps: applications.length,
//     approved: applications.filter(a => a.status === 'approved').length,
//     pending: applications.filter(a => a.status === 'pending').length,
//     activePolicies: policies.filter(p => p.status === 'active').length
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
//         <p className="text-gray-600">Welcome back, {user?.name}</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="card">
//           <div className="card-body">
//             <p className="stat-label">Total Applications</p>
//             <p className="stat-value stat-value-primary">{stats.totalApps}</p>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-body">
//             <p className="stat-label">Approved</p>
//             <p className="stat-value stat-value-green">{stats.approved}</p>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-body">
//             <p className="stat-label">Pending</p>
//             <p className="stat-value stat-value-yellow">{stats.pending}</p>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-body">
//             <p className="stat-label">Active Policies</p>
//             <p className="stat-value stat-value-blue">{stats.activePolicies}</p>
//           </div>
//         </div>
//       </div>

//       {/* Payment Summary */}
//       {payments.length > 0 && (
//         <div className="card bg-red-50 border border-red-200">
//           <div className="card-header">
//             <div className="flex justify-between items-center">
//               <h2 className="text-red-700 font-bold">Outstanding Payments</h2>
//               <Link to="/customer/payments" className="text-primary hover:underline text-sm font-semibold">
//                 View All
//               </Link>
//             </div>
//           </div>
//           <div className="card-body">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {payments.map(payment => (
//                 <div key={payment.id} className="payment-card">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-sm text-gray-600">Policy {payment.policyId}</p>
//                       <p className="text-2xl font-bold text-red-600 mt-1">${payment.amount}</p>
//                       <p className="text-xs text-gray-500 mt-1">Due: {payment.dueDate}</p>
//                     </div>
//                     <span className={`badge ${payment.status === 'overdue' ? 'badge-danger' : 'badge-warning'}`}>
//                       {payment.status === 'overdue' ? 'Overdue' : 'Due Soon'}
//                     </span>
//                   </div>
//                   <button className="btn-primary w-full mt-3 text-sm">Pay Now</button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Recent Applications */}
//       <div className="card">
//         <div className="card-header">
//           <h2>Recent Applications</h2>
//         </div>
//         <div className="card-body">
//           {applications.length === 0 ? (
//             <p className="text-gray-600">No applications yet</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Product</th>
//                     <th className="hidden sm:table-cell">Applied Date</th>
//                     <th>Status</th>
//                     <th className="hidden md:table-cell">Premium</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {applications.slice(0, 5).map(app => (
//                     <tr key={app.id}>
//                       <td className="font-semibold">{app.productType}</td>
//                       <td className="hidden sm:table-cell text-sm">{app.appliedDate}</td>
//                       <td>{getStatusBadge(app.status)}</td>
//                       <td className="hidden md:table-cell">${app.premium}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Active Policies */}
//       <div className="card">
//         <div className="card-header">
//           <h2>Active Policies</h2>
//         </div>
//         <div className="card-body">
//           {policies.length === 0 ? (
//             <p className="text-gray-600">No active policies</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {policies.map(policy => (
//                 <div key={policy.id} className="border rounded-lg p-4">
//                   <h3 className="font-bold text-lg capitalize">{policy.productType}</h3>
//                   <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
//                     <div>
//                       <p className="text-gray-600">Coverage</p>
//                       <p className="font-semibold">${policy.coverage}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Premium</p>
//                       <p className="font-semibold">${policy.premium}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Start Date</p>
//                       <p className="font-semibold">{policy.startDate}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">End Date</p>
//                       <p className="font-semibold">{policy.endDate}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { applicationAPI, policyAPI } from '../../utils/api';
// import { formatCurrency, getStatusBadge } from '../../utils/helpers';
// import { Link } from 'react-router-dom';

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [applications, setApplications] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, [user]);

//   const loadData = async () => {
//     try {
//       if (user?.id) {
//         const [appsRes, policiesRes] = await Promise.all([
//           applicationAPI.getByCustomer(user.id),
//           policyAPI.getByCustomer(user.id)
//         ]);
//         setApplications(appsRes.data);
//         setPolicies(policiesRes.data);
        
//         // Simulate payment data
//         const outstandingPayments = [
//           { id: 1, policyId: 'POL001', amount: 125, dueDate: '2024-02-15', status: 'overdue' },
//           { id: 2, policyId: 'POL002', amount: 85, dueDate: '2024-02-20', status: 'due' }
//         ];
//         setPayments(outstandingPayments);
//       }
//     } catch (err) {
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const stats = {
//     totalApps: applications.length,
//     approved: applications.filter(a => a.status === 'approved').length,
//     pending: applications.filter(a => a.status === 'pending').length,
//     activePolicies: policies.filter(p => p.status === 'active').length
//   };

//   if (loading) {
//     return <div className="p-6 text-center">Loading dashboard...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
//         <p className="text-gray-600">Welcome back, {user?.name}</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="card">
//           <div className="card-body">
//             <p className="stat-label">Total Applications</p>
//             <p className="stat-value stat-value-primary">{stats.totalApps}</p>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-body">
//             <p className="stat-label">Approved</p>
//             <p className="stat-value stat-value-green">{stats.approved}</p>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-body">
//             <p className="stat-label">Pending</p>
//             <p className="stat-value stat-value-yellow">{stats.pending}</p>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-body">
//             <p className="stat-label">Active Policies</p>
//             <p className="stat-value stat-value-blue">{stats.activePolicies}</p>
//           </div>
//         </div>
//       </div>

//       {/* Payment Summary */}
//       {payments.length > 0 && (
//         <div className="card bg-red-50 border border-red-200">
//           <div className="card-header">
//             <div className="flex justify-between items-center">
//               <h2 className="text-red-700 font-bold">Outstanding Payments</h2>
//               <Link to="/customer/payments" className="text-primary hover:underline text-sm font-semibold">
//                 View All
//               </Link>
//             </div>
//           </div>
//           <div className="card-body">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {payments.map(payment => (
//                 <div key={payment.id} className="payment-card">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-sm text-gray-600">Policy {payment.policyId}</p>
//                       <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(payment.amount)}</p>
//                       <p className="text-xs text-gray-500 mt-1">Due: {payment.dueDate}</p>
//                     </div>
//                     <span className={`badge ${payment.status === 'overdue' ? 'badge-danger' : 'badge-warning'}`}>
//                       {payment.status === 'overdue' ? 'Overdue' : 'Due Soon'}
//                     </span>
//                   </div>
//                   <button className="btn-primary w-full mt-3 text-sm">Pay Now</button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Recent Applications */}
//       <div className="card">
//         <div className="card-header">
//           <h2>Recent Applications</h2>
//         </div>
//         <div className="card-body">
//           {applications.length === 0 ? (
//             <p className="text-gray-600">No applications yet</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Product</th>
//                     <th className="hidden sm:table-cell">Applied Date</th>
//                     <th>Status</th>
//                     <th className="hidden md:table-cell">Premium</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {applications.slice(0, 5).map(app => (
//                     <tr key={app.id}>
//                       <td className="font-semibold">{app.productType}</td>
//                       <td className="hidden sm:table-cell text-sm">{app.appliedDate}</td>
//                       <td>{getStatusBadge(app.status)}</td>
//                       <td className="hidden md:table-cell">{formatCurrency(app.premium)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { applicationAPI, policyAPI } from '../../utils/api';
// import { formatCurrency, getStatusBadge } from '../../utils/helpers';
// import { Link } from 'react-router-dom';

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [applications, setApplications] = useState([]);
//   const [policies, setPolicies] = useState([]);
//   const [unpaidPolicies, setUnpaidPolicies] = useState([]); 
//   const [loading, setLoading] = useState(true);
  
//   // Filter State
//   const [filterStatus, setFilterStatus] = useState('all');

//   useEffect(() => {
//     loadData();
//   }, [user]);

//   const loadData = async () => {
//     try {
//       if (user?.id) {
//         const [appsRes, policiesRes] = await Promise.all([
//           applicationAPI.getByCustomer(user.id),
//           policyAPI.getByCustomer(user.id)
//         ]);
        
//         const rawPolicies = policiesRes.data || [];
//         setApplications(appsRes.data || []);
//         setPolicies(rawPolicies);
        
//         const storageKey = `paid_policies_user_${user.id}`;
//         const paidPolicyIds = JSON.parse(localStorage.getItem(storageKey) || '[]');

//         const dues = rawPolicies.filter(p => !paidPolicyIds.includes(p.id));
//         setUnpaidPolicies(dues);
//       }
//     } catch (err) {
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Status Logic Helper
//   const getAppStatusInfo = (app) => {
//     const storageKey = `paid_policies_user_${user.id}`;
//     const paidPolicyIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
//     const policyIdToCheck = `POL-${app.id}`;
//     const isPaid = paidPolicyIds.includes(policyIdToCheck);

//     if (app.status === 'rejected') return { label: 'Rejected', class: 'bg-red-100 text-red-800' };
//     if (app.status === 'pending') return { label: 'Yet to be Approved', class: 'bg-gray-100 text-gray-800' };
//     if (app.status === 'approved') {
//       return isPaid 
//         ? { label: 'Paid', class: 'bg-green-100 text-green-800' }
//         : { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' };
//     }
//     return { label: app.status, class: 'bg-blue-100 text-blue-800' };
//   };

//   // Filter Logic
//   const filteredApplications = applications.filter(app => {
//     if (filterStatus === 'all') return true;
//     const statusInfo = getAppStatusInfo(app);
//     return statusInfo.label.toLowerCase() === filterStatus.toLowerCase();
//   });

//   const stats = {
//     totalApps: applications.length,
//     approved: applications.filter(a => a.status === 'approved').length,
//     pending: applications.filter(a => a.status === 'pending').length,
//     activePolicies: policies.filter(p => p.status === 'active').length
//   };

//   if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
//         <p className="text-gray-600">Welcome back, {user?.name}</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="card"><div className="card-body"><p className="stat-label">Total Applications</p><p className="stat-value stat-value-primary">{stats.totalApps}</p></div></div>
//         <div className="card"><div className="card-body"><p className="stat-label">Approved</p><p className="stat-value stat-value-green">{stats.approved}</p></div></div>
//         <div className="card"><div className="card-body"><p className="stat-label">Pending</p><p className="stat-value stat-value-yellow">{stats.pending}</p></div></div>
//         <div className="card"><div className="card-body"><p className="stat-label">Active Policies</p><p className="stat-value stat-value-blue">{stats.activePolicies}</p></div></div>
//       </div>

//       {/* Payment Dues Summary */}
//       {unpaidPolicies.length > 0 && (
//         <div className="card bg-amber-50 border border-amber-200">
//           <div className="card-header flex justify-between items-center">
//             <h2 className="text-amber-800 font-bold">Payment Dues</h2>
//             <Link to="/customer/policies" className="text-primary hover:underline text-sm font-semibold">Go to Policies</Link>
//           </div>
//           <div className="card-body">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {unpaidPolicies.map(policy => (
//                 <div key={policy.id} className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{policy.productType} Policy</p>
//                       <p className="text-sm font-semibold text-gray-700 mt-1">Coverage: {policy.coverage}</p>
//                       <p className="text-2xl font-black text-amber-600 mt-2">${policy.premium}</p>
//                     </div>
//                     <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded uppercase">Unpaid</span>
//                   </div>
//                   <Link to="/customer/policies"><button className="btn-primary w-full mt-3 text-sm">Pay Now</button></Link>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Recent Applications Table with Filter */}
//       <div className="card">
//         <div className="card-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <h2>Recent Applications</h2>
//           <div className="flex items-center gap-2">
//             <label className="text-sm text-gray-500 font-medium">Filter:</label>
//             <select 
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20"
//             >
//               <option value="all">All Status</option>
//               <option value="paid">Paid</option>
//               <option value="pending">Pending</option>
//               <option value="yet to be approved">Yet to be Approved</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//         <div className="card-body">
//           {filteredApplications.length === 0 ? (
//             <p className="text-gray-600 text-center py-4">No applications found matching this filter.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="text-left border-b">
//                     <th className="pb-3">Product</th>
//                     <th className="hidden sm:table-cell pb-3">Applied Date</th>
//                     <th className="pb-3">Status</th>
//                     <th className="hidden md:table-cell pb-3">Premium</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredApplications.slice(0, 10).map(app => {
//                     const status = getAppStatusInfo(app);
//                     return (
//                       <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
//                         <td className="py-4 font-semibold">{app.productType}</td>
//                         <td className="hidden sm:table-cell py-4 text-sm text-gray-600">{app.appliedDate}</td>
//                         <td className="py-4">
//                           <span className={`${status.class} text-xs px-2 py-1 rounded font-bold uppercase`}>
//                             {status.label}
//                           </span>
//                         </td>
//                         <td className="hidden md:table-cell py-4">{formatCurrency(app.premium)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { applicationAPI, policyAPI } from '../../utils/api';
import { formatCurrency, getStatusBadge } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [unpaidPolicies, setUnpaidPolicies] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      if (user?.id) {
        const [appsRes, policiesRes] = await Promise.all([
          applicationAPI.getByCustomer(user.id),
          policyAPI.getByCustomer(user.id)
        ]);
        
        const rawPolicies = policiesRes.data || [];
        setApplications(appsRes.data || []);
        setPolicies(rawPolicies);
        
        // Filter specifically for policies that are NOT 'paid'
        const dues = rawPolicies.filter(p => p.status !== 'paid');
        setUnpaidPolicies(dues);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Status Logic Helper
  const getAppStatusInfo = (app) => {
    // Check if a policy exists for this application and its status
    const associatedPolicy = policies.find(p => p.id === `POL-${app.id}` || p.applicationId === app.id);
    const isPaid = associatedPolicy?.status === 'paid';

    if (app.status === 'rejected') return { label: 'Rejected', class: 'bg-red-100 text-red-800' };
    if (app.status === 'pending') return { label: 'Yet to be Approved', class: 'bg-gray-100 text-gray-800' };
    if (app.status === 'approved') {
      return isPaid 
        ? { label: 'Paid', class: 'bg-green-100 text-green-800' }
        : { label: 'Pending Payment', class: 'bg-yellow-100 text-yellow-800' };
    }
    return { label: app.status, class: 'bg-blue-100 text-blue-800' };
  };

  // Filter Logic
  const filteredApplications = applications.filter(app => {
    if (filterStatus === 'all') return true;
    const statusInfo = getAppStatusInfo(app);
    return statusInfo.label.toLowerCase() === filterStatus.toLowerCase();
  });

  const stats = {
    totalApps: applications.length,
    approved: applications.filter(a => a.status === 'approved').length,
    pending: applications.filter(a => a.status === 'pending').length,
    activePolicies: policies.filter(p => p.status === 'active' || p.status === 'paid').length
  };

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card"><div className="card-body"><p className="stat-label">Total Applications</p><p className="stat-value stat-value-primary">{stats.totalApps}</p></div></div>
        <div className="card"><div className="card-body"><p className="stat-label">Approved</p><p className="stat-value stat-value-green">{stats.approved}</p></div></div>
        <div className="card"><div className="card-body"><p className="stat-label">Pending</p><p className="stat-value stat-value-yellow">{stats.pending}</p></div></div>
        <div className="card"><div className="card-body"><p className="stat-label">Active Policies</p><p className="stat-value stat-value-blue">{stats.activePolicies}</p></div></div>
      </div>

      {/* Payment Dues Summary */}
      <div className="card border border-gray-200">
        <div className="card-header flex justify-between items-center border-b">
          <h2 className="font-bold text-gray-800">Pending Payments</h2>
          <Link to="/customer/policies" className="text-primary hover:underline text-sm font-semibold">View All Policies</Link>
        </div>
        <div className="card-body">
          {unpaidPolicies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unpaidPolicies.map(policy => (
                <div key={policy.id} className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm bg-gradient-to-r from-amber-50 to-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">{policy.productType}</p>
                      <p className="text-sm font-semibold text-gray-700 mt-1">ID: {policy.id}</p>
                      <p className="text-2xl font-black text-gray-900 mt-2">₹{policy.premium}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded uppercase">Pending</span>
                  </div>
                  <Link to="/customer/policies">
                    <button className="btn-primary w-full mt-3 text-sm py-2">Pay Now</button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No pending payments. You're all caught up!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Applications Table with Filter */}
      <div className="card">
        <div className="card-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2>Recent Applications</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 font-medium">Filter:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending payment">Pending Payment</option>
              <option value="yet to be approved">Yet to be Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          {filteredApplications.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No applications found matching this filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3">Product</th>
                    <th className="hidden sm:table-cell pb-3">Applied Date</th>
                    <th className="pb-3">Status</th>
                    <th className="hidden md:table-cell pb-3">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.slice(0, 10).map(app => {
                    const status = getAppStatusInfo(app);
                    return (
                      <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-4 font-semibold">{app.productType}</td>
                        <td className="hidden sm:table-cell py-4 text-sm text-gray-600">{app.appliedDate}</td>
                        <td className="py-4">
                          <span className={`${status.class} text-xs px-2 py-1 rounded font-bold uppercase`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="hidden md:table-cell py-4">₹{app.premium}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}