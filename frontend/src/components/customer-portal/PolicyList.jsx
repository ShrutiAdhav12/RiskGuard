// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { policyAPI, applicationAPI } from '../../utils/api';
// import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers';

// export default function PolicyList() {
//   const { user } = useAuth();
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const handleDownloadPDF = (policy) => {
//     // Get phone from user object - check multiple possible fields
//     const userPhone = user?.phone || user?.contactInfo || 'Not provided';
    
//     // Create a styled HTML content for the PDF
//     const htmlContent = `
//       <html>
//         <head>
//           <meta charset="utf-8">
//           <link rel="stylesheet" href="${window.location.origin}/globals.css">
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
//             .pdf-header { text-align: center; border-bottom: 3px solid #003366; padding-bottom: 20px; margin-bottom: 30px; }
//             .pdf-logo { font-size: 28px; font-weight: bold; color: #003366; margin-bottom: 5px; }
//             .pdf-subtitle { font-size: 12px; color: #666; }
//             .pdf-section { margin-bottom: 25px; }
//             .pdf-section-title { font-size: 14px; font-weight: bold; background-color: #f0f0f0; padding: 10px; margin-bottom: 15px; border-left: 4px solid #003366; }
//             .pdf-row { display: flex; margin-bottom: 12px; }
//             .pdf-label { width: 35%; font-weight: bold; color: #003366; }
//             .pdf-value { width: 65%; word-break: break-word; }
//             .pdf-highlight { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
//             .pdf-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
//             .pdf-badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
//             .pdf-badge-active { background-color: #d4edda; color: #155724; }
//           </style>
//         </head>
//         <body>
//           <div class="pdf-header">
//             <div class="pdf-logo">🛡️ RiskGuard Insurance</div>
//             <div class="pdf-subtitle">Policy Document</div>
//           </div>

//           <div class="pdf-section">
//             <div class="pdf-section-title">Policy Information</div>
//             <div class="pdf-row">
//               <div class="pdf-label">Policy ID:</div>
//               <div class="pdf-value">${policy.id}</div>
//             </div>
//             <div class="pdf-row">
//               <div class="pdf-label">Product Type:</div>
//               <div class="pdf-value">${policy.productType.charAt(0).toUpperCase() + policy.productType.slice(1)}</div>
//             </div>
//             <div class="pdf-row">
//               <div class="pdf-label">Coverage Level:</div>
//               <div class="pdf-value">${policy.coverage.charAt(0).toUpperCase() + policy.coverage.slice(1)}</div>
//             </div>
//             <div class="pdf-row">
//               <div class="pdf-label">Status:</div>
//               <div class="pdf-value"><span class="pdf-badge pdf-badge-active">${policy.status.toUpperCase()}</span></div>
//             </div>
//           </div>

//           <div class="pdf-section">
//             <div class="pdf-section-title">Coverage & Premium Details</div>
//             <div class="pdf-row">
//               <div class="pdf-label">Annual Premium:</div>
//               <div class="pdf-value">$${policy.premium}</div>
//             </div>
//             <div class="pdf-row">
//               <div class="pdf-label">Policy Start Date:</div>
//               <div class="pdf-value">${formatDate(policy.startDate)}</div>
//             </div>
//             <div class="pdf-row">
//               <div class="pdf-label">Policy End Date:</div>
//               <div class="pdf-value">${formatDate(policy.endDate)}</div>
//             </div>
//             <div class="pdf-row">
//               <div class="pdf-label">Renewal Date:</div>
//               <div class="pdf-value">${formatDate(policy.renewalDate)}</div>
//             </div>
//           </div>

//           <div class="pdf-section">
//             <div class="pdf-section-title">Policyholder Information</div>
//             <div class="pdf-row">
//               <div class="pdf-label">Name:</div>
//               <div class="pdf-value">${user.name}</div>
//             </div>
//             <div class="pdf-row">
//               <div class="pdf-label">Email:</div>
//               <div class="pdf-value">${user.email}</div>
//             </div>
//             <div class="pdf-row">
//               <div class="pdf-label">Phone:</div>
//               <div class="pdf-value">${userPhone}</div>
//             </div>
//           </div>

//           <div class="pdf-highlight">
//             <strong>Important:</strong> Please keep this document safe. You will need to reference your Policy ID for any claims or inquiries. For more information, visit our website or contact our customer support team.
//           </div>

//           <div class="pdf-footer">
//             <p>This document was generated on ${new Date().toLocaleString()}</p>
//             <p>© 2026 RiskGuard Insurance. All rights reserved.</p>
//           </div>
//         </body>
//       </html>
//     `;

//     // Create a blob from the HTML content
//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const url = window.URL.createObjectURL(blob);
    
//     // Create an invisible iframe
//     const iframe = document.createElement('iframe');
//     iframe.style.display = 'none';
//     iframe.src = url;
//     document.body.appendChild(iframe);

//     // Wait for the iframe to load, then print to PDF
//     iframe.onload = function() {
//       iframe.contentWindow.print();
//       setTimeout(() => {
//         document.body.removeChild(iframe);
//         window.URL.revokeObjectURL(url);
//       }, 100);
//     };
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Get all policies for this customer
//         const policyResponse = await policyAPI.getByCustomer(user.id);
//         const policyData = policyResponse.data || [];
        
//         if (policyData.length > 0) {
//           setPolicies(policyData);
//         } else {
//           // If no policies, create them from approved applications
//           const appResponse = await applicationAPI.getByCustomer(user.id);
//           const appData = appResponse.data || [];
//           if (appData.length > 0) {
//             const approvedApps = appData.filter(a => a.status === 'approved');
//             if (approvedApps.length > 0) {
//               // Create policies from approved applications
//               const createdPolicies = approvedApps.map((app, idx) => ({
//                 id: `POL-${Date.now()}-${idx}`,
//                 customerId: user.id,
//                 productType: app.productType,
//                 coverage: app.coverage,
//                 premium: app.premium,
//                 startDate: app.appliedDate,
//                 endDate: new Date(new Date(app.appliedDate).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//                 renewalDate: new Date(new Date(app.appliedDate).getTime() + 355 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//                 status: 'active'
//               }));
//               setPolicies(createdPolicies);
//             } else {
//               setPolicies([]);
//             }
//           } else {
//             setPolicies([]);
//           }
//         }
//       } catch (err) {
//         console.error('Failed to load policies:', err);
//         setPolicies([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [user.id]);

//   if (loading) return <div className="text-center py-8">Loading policies...</div>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl md:text-3xl font-bold">My Policies</h1>

//       {policies.length === 0 ? (
//         <div className="card">
//           <div className="card-body text-center py-12">
//             <p className="text-gray-600 mb-4">No active policies yet.</p>
//             <p className="text-sm text-gray-500">Submit an application to get started.</p>
//             <p className="text-xs text-gray-400 mt-4">Note: Policies are created when your application is approved.</p>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {policies.map(policy => (
//             <div key={policy.id} className="card hover:shadow-lg transition-shadow">
//               <div className="card-body p-4 md:p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                   <div>
//                     <p className="text-gray-600 text-sm">Policy ID</p>
//                     <p className="font-semibold text-sm">{policy.id}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Product</p>
//                     <p className="font-semibold capitalize">{policy.productType}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Coverage</p>
//                     <p className="font-semibold">{policy.coverage}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Status</p>
//                     {getStatusBadge(policy.status)}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
//                   <div>
//                     <p className="text-gray-600 text-sm">Premium</p>
//                     <p className="font-bold text-lg text-primary">${policy.premium}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Start Date</p>
//                     <p className="font-semibold text-sm">{formatDate(policy.startDate)}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">End Date</p>
//                     <p className="font-semibold text-sm">{formatDate(policy.endDate)}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Renewal</p>
//                     <p className="font-semibold text-sm">{formatDate(policy.renewalDate)}</p>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex gap-2 flex-wrap">
//                   <button 
//                     onClick={() => handleDownloadPDF(policy)}
//                     className="btn-secondary text-sm"
//                   >
//                     Download PDF
//                   </button>
//                   <button className="btn-primary text-sm">Pay Now</button>
//                   <button className="btn-secondary text-sm">File Claim</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Information Box */}
//       <div className="card bg-blue-50 border border-blue-200">
//         <div className="card-body">
//           <h3 className="font-bold mb-3">About Your Policies</h3>
//           <ul className="text-sm text-gray-700 space-y-2">
//             <li>• Policies are automatically created when your application is approved</li>
//             <li>• Each policy is valid for 12 months from the start date</li>
//             <li>• You'll receive renewal notices 30 days before expiry</li>
//             <li>• Download your policy document anytime for records</li>
//             <li>• You can file claims directly through this portal</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { policyAPI, applicationAPI } from '../../utils/api';
// import { formatDate, getStatusBadge } from '../../utils/helpers';

// export default function PolicyList() {
//   const { user } = useAuth();
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // State for the Payment Flow
//   const [activePayment, setActivePayment] = useState(null);

//   const handleDownloadPDF = (policy) => {
//     const userPhone = user?.phone || user?.contactInfo || 'Not provided';
    
//     const htmlContent = `
//       <html>
//         <head>
//           <meta charset="utf-8">
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
//             .pdf-header { text-align: center; border-bottom: 3px solid #003366; padding-bottom: 20px; margin-bottom: 30px; }
//             .pdf-logo { font-size: 28px; font-weight: bold; color: #003366; margin-bottom: 5px; }
//             .pdf-subtitle { font-size: 12px; color: #666; }
//             .pdf-section { margin-bottom: 25px; }
//             .pdf-section-title { font-size: 14px; font-weight: bold; background-color: #f0f0f0; padding: 10px; margin-bottom: 15px; border-left: 4px solid #003366; }
//             .pdf-row { display: flex; margin-bottom: 12px; }
//             .pdf-label { width: 35%; font-weight: bold; color: #003366; }
//             .pdf-value { width: 65%; word-break: break-word; }
//             .pdf-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
//           </style>
//         </head>
//         <body>
//           <div class="pdf-header">
//             <div class="pdf-logo">🛡️ RiskGuard Insurance</div>
//             <div class="pdf-subtitle">Policy Document</div>
//           </div>
//           <div class="pdf-section">
//             <div class="pdf-section-title">Policy Information</div>
//             <div class="pdf-row"><div class="pdf-label">Policy ID:</div><div class="pdf-value">${policy.id}</div></div>
//             <div class="pdf-row"><div class="pdf-label">Product Type:</div><div class="pdf-value">${policy.productType}</div></div>
//             <div class="pdf-row"><div class="pdf-label">Status:</div><div class="pdf-value">PAID</div></div>
//           </div>
//           <div class="pdf-footer">
//             <p>Generated on ${new Date().toLocaleString()}</p>
//             <p>© 2026 RiskGuard Insurance.</p>
//           </div>
//         </body>
//       </html>
//     `;

//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const url = window.URL.createObjectURL(blob);
//     const iframe = document.createElement('iframe');
//     iframe.style.display = 'none';
//     iframe.src = url;
//     document.body.appendChild(iframe);

//     iframe.onload = function() {
//       iframe.contentWindow.print();
//       setTimeout(() => {
//         document.body.removeChild(iframe);
//         window.URL.revokeObjectURL(url);
//       }, 100);
//     };
//   };

//   const handleFinalizePayment = async () => {
//     // 1. Update local UI state
//     setPolicies(prev => prev.map(p => 
//       p.id === activePayment.id ? { ...p, paymentStatus: 'paid' } : p
//     ));

//     // 2. PERMANENT STORAGE (Linked to User ID)
//     // We create a unique key for this specific user so it persists after re-login
//     const storageKey = `paid_policies_user_${user.id}`;
//     const paidPolicyIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
//     if (!paidPolicyIds.includes(activePayment.id)) {
//       paidPolicyIds.push(activePayment.id);
//       localStorage.setItem(storageKey, JSON.stringify(paidPolicyIds));
//     }

//     // 3. Optional: Try to update the backend if the API supports it
//     try {
//         if(policyAPI.updateStatus) {
//             await policyAPI.updateStatus(activePayment.id, { paymentStatus: 'paid' });
//         }
//     } catch (e) {
//         console.warn("Backend update failed, falling back to persistent local storage.");
//     }

//     setActivePayment(null);
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       if (!user?.id) return;
      
//       try {
//         const policyResponse = await policyAPI.getByCustomer(user.id);
//         const policyData = policyResponse.data || [];
        
//         // Retrieve persistent payment data for THIS specific user
//         const storageKey = `paid_policies_user_${user.id}`;
//         const paidPolicyIds = JSON.parse(localStorage.getItem(storageKey) || '[]');

//         const processPolicies = (data) => data.map(p => ({
//           ...p,
//           paymentStatus: paidPolicyIds.includes(p.id) ? 'paid' : (p.paymentStatus || 'unpaid')
//         }));

//         if (policyData.length > 0) {
//           setPolicies(processPolicies(policyData));
//         } else {
//           const appResponse = await applicationAPI.getByCustomer(user.id);
//           const appData = appResponse.data || [];
//           const approvedApps = appData.filter(a => a.status === 'approved');
          
//           const createdPolicies = approvedApps.map((app, idx) => ({
//             id: `POL-${app.id || idx}`, // Use app ID for more consistent mapping
//             customerId: user.id,
//             productType: app.productType,
//             coverage: app.coverage,
//             premium: app.premium,
//             startDate: app.appliedDate,
//             endDate: new Date(new Date(app.appliedDate).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//             renewalDate: new Date(new Date(app.appliedDate).getTime() + 355 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//             status: 'active'
//           }));
//           setPolicies(processPolicies(createdPolicies));
//         }
//       } catch (err) {
//         console.error('Failed to load policies:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [user?.id]);

//   if (loading) return <div className="text-center py-8">Loading policies...</div>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl md:text-3xl font-bold">My Policies</h1>

//       {policies.length === 0 ? (
//         <div className="card">
//           <div className="card-body text-center py-12">
//             <p className="text-gray-600 mb-4">No active policies yet.</p>
//             <p className="text-sm text-gray-500">Submit an application to get started.</p>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {policies.map(policy => (
//             <div key={policy.id} className="card hover:shadow-lg transition-shadow">
//               <div className="card-body p-4 md:p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                   <div>
//                     <p className="text-gray-600 text-sm">Policy ID</p>
//                     <p className="font-semibold text-sm">{policy.id}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Product</p>
//                     <p className="font-semibold capitalize">{policy.productType}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Coverage</p>
//                     <p className="font-semibold">{policy.coverage}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Status</p>
//                     {policy.paymentStatus === 'paid' ? (
//                       <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">PAID</span>
//                     ) : (
//                       getStatusBadge(policy.status)
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
//                   <div>
//                     <p className="text-gray-600 text-sm">Premium</p>
//                     <p className="font-bold text-lg text-primary">${policy.premium}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Start Date</p>
//                     <p className="font-semibold text-sm">{formatDate(policy.startDate)}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">End Date</p>
//                     <p className="font-semibold text-sm">{formatDate(policy.endDate)}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Renewal</p>
//                     <p className="font-semibold text-sm">{formatDate(policy.renewalDate)}</p>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex gap-2 flex-wrap">
//                   <button onClick={() => handleDownloadPDF(policy)} className="btn-secondary text-sm">
//                     Download PDF
//                   </button>

//                   {policy.paymentStatus === 'paid' ? (
//                     <button disabled className="bg-gray-200 text-gray-500 px-8 py-2 rounded text-sm font-bold cursor-not-allowed border">
//                       Paid
//                     </button>
//                   ) : (
//                     <button onClick={() => setActivePayment(policy)} className="btn-primary text-sm">
//                       Pay Now
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {activePayment && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-xl">
//             <h2 className="text-xl font-bold mb-4 text-center">Confirm Payment</h2>
            
//             <div className="bg-gray-50 p-4 rounded-lg mb-6 text-gray-700">
//               <p className="text-sm">Policy: <span className="font-semibold">{activePayment.productType}</span></p>
//               <p className="text-sm">Coverage: <span className="font-semibold">{activePayment.coverage}</span></p>
//               <div className="pt-2 border-t mt-2">
//                 <p className="text-xs text-gray-500 uppercase">Amount to be Paid</p>
//                 <p className="text-3xl font-black text-blue-600">${activePayment.premium}</p>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Payment Method</label>
//               <select className="w-full border rounded p-2 bg-white outline-none">
//                 <option>Credit Card (Ending 4421)</option>
//                 <option>Debit Card</option>
//                 <option>Digital Wallet</option>
//               </select>
//             </div>

//             <div className="flex gap-3">
//               <button onClick={() => setActivePayment(null)} className="flex-1 py-2 text-gray-500 hover:bg-gray-100 rounded font-semibold">
//                 Cancel
//               </button>
//               <button onClick={handleFinalizePayment} className="flex-1 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">
//                 Final Pay
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="card bg-blue-50 border border-blue-200">
//         <div className="card-body">
//           <h3 className="font-bold mb-3">About Your Policies</h3>
//           <ul className="text-sm text-gray-700 space-y-2">
//             <li>• Policies are automatically created when your application is approved</li>
//             <li>• Each policy is valid for 12 months from the start date</li>
//             <li>• You'll receive renewal notices 30 days before expiry</li>
//             <li>• Download your policy document anytime for records</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { policyAPI, applicationAPI } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers';

export default function PolicyList() {
  const { user } = useAuth();
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

  const handleConfirmPayment = (policyId) => {
    setPolicies(prevPolicies => 
      prevPolicies.map(p => 
        p.id === policyId ? { ...p, status: 'paid' } : p
      )
    );
    setActivePaymentPolicy(null);
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
          {policies.map(policy => (
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
                    ) : getStatusBadge(policy.status)}
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
                  <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                    <h4 className="font-bold mb-2">Payment Details</h4>
                    <p className="text-sm">Amount: <strong>₹{policy.premium}</strong></p>
                    <p className="text-sm mb-3">Coverage Level: <strong>{policy.coverage}</strong></p>
                    
                    <div className="flex gap-4 mb-4">
                        <label className="text-sm"><input type="radio" name="gate" defaultChecked /> UPI</label>
                        <label className="text-sm"><input type="radio" name="gate" /> Net Banking</label>
                        <label className="text-sm"><input type="radio" name="gate" /> Card</label>
                    </div>

                    <button 
                      onClick={() => handleConfirmPayment(policy.id)}
                      className="btn-primary text-sm mr-2"
                    >
                      Confirm Payment
                    </button>
                    <button onClick={() => setActivePaymentPolicy(null)} className="btn-secondary text-sm">Cancel</button>
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