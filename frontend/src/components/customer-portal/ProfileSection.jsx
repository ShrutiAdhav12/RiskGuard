// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { applicationAPI, customerAPI } from '../../utils/api';
// import { formatDate, getStatusBadge } from '../../utils/helpers';

// export default function ProfileSection() {
//   const { user, updateUser } = useAuth();
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     dob: user?.dob || ''
//   });

//   // Validation functions
//   const validateName = (value) => {
//     if (!value) return 'Full name is required';
//     if (!/^[a-zA-Z\s]*$/.test(value)) return 'Full name must contain only letters';
//     if (value.length > 15) return 'Full name must not exceed 15 characters';
//     return '';
//   };

//   const validatePhone = (value) => {
//     if (!value) return 'Phone number is required';
//     const digitsOnly = value.replace(/\D/g, '');
//     if (digitsOnly.length !== 10) return 'Phone number must be exactly 10 digits';
//     if (!/^\d{10}$/.test(digitsOnly)) return 'Phone number must contain only digits';
//     return '';
//   };

//   const validateEmail = (value) => {
//     if (!value) return 'Email is required';
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(value)) return 'Please enter a valid email address';
//     return '';
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let validatedValue = value;
//     let error = '';

//     // Name validation - only letters and spaces, max 15 chars
//     if (name === 'name') {
//       validatedValue = value.replace(/[^a-zA-Z\s]/g, '');
//       // Prevent input if exceeding 15 characters
//       if (validatedValue.length > 15) {
//         return;
//       }
//       error = validateName(validatedValue);
//     }

//     // Phone validation - only numbers, max 10 digits
//     if (name === 'phone') {
//       const digitsOnly = value.replace(/\D/g, '');
//       // Prevent input if exceeding 10 digits
//       if (digitsOnly.length > 10) {
//         return;
//       }
//       error = validatePhone(value);
//     }

//     // Email validation
//     if (name === 'email') {
//       error = validateEmail(value);
//     }

//     setFormData(prev => ({ ...prev, [name]: validatedValue || value }));
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   const isFormValid = () => {
//     const nameError = validateName(formData.name);
//     const phoneError = validatePhone(formData.phone);
//     const emailError = validateEmail(formData.email);
//     const dobError = !formData.dob;
    
//     return !nameError && !phoneError && !emailError && !dobError;
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
    
//     // Validate all fields before saving
//     const nameError = validateName(formData.name);
//     const phoneError = validatePhone(formData.phone);
//     const emailError = validateEmail(formData.email);

//     if (nameError || phoneError || emailError) {
//       setErrors({
//         name: nameError,
//         phone: phoneError,
//         email: emailError
//       });
//       return;
//     }

//     try {
//       await customerAPI.update(user.id, {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         dob: formData.dob
//       });
      
//       // Update context to sync with ApplicationForm
//       updateUser({
//         ...user,
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         dob: formData.dob
//       });

//       setEditMode(false);
//       setErrors({});
//       alert('Profile updated successfully!');
//     } catch (err) {
//       console.error('Failed to save profile:', err);
//       alert('Failed to save profile');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>

//       {/* Profile Information Card */}
//       <div className="card">
//         <div className="card-header flex justify-between items-center">
//           <h2 className="text-xl font-bold">Personal Information</h2>
//           <button
//             onClick={() => setEditMode(!editMode)}
//             className={editMode ? 'btn-secondary text-sm' : 'btn-primary text-sm'}
//           >
//             {editMode ? 'Cancel' : 'Edit'}
//           </button>
//         </div>
//         <div className="card-body">
//           {editMode ? (
//             <form onSubmit={handleSave} className="space-y-4">
//               <div className="form-group">
//                 <label>Full Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className={errors.name ? 'border-red-500' : ''}
//                   maxLength="15"
//                 />
//                 {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//               </div>
//               <div className="form-group">
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={errors.email ? 'border-red-500' : ''}
//                 />
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-group">
//                   <label>Phone</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className={errors.phone ? 'border-red-500' : ''}
//                     placeholder="10-digit number"
//                   />
//                   {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//                 </div>
//                 <div className="form-group">
//                   <label>Date of Birth</label>
//                   <input
//                     type="date"
//                     name="dob"
//                     value={formData.dob}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <button 
//                 type="submit" 
//                 className="btn-success w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={!isFormValid()}
//               >
//                 Save Changes
//               </button>
//             </form>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-gray-600 text-sm">Full Name</p>
//                 <p className="font-semibold text-lg">{user?.name}</p>
//               </div>
//               <div>
//                 <p className="text-gray-600 text-sm">Email</p>
//                 <p className="font-semibold text-lg">{user?.email}</p>
//               </div>
//               <div>
//                 <p className="text-gray-600 text-sm">Phone</p>
//                 <p className="font-semibold">{user?.phone || 'Not provided'}</p>
//               </div>
//               <div>
//                 <p className="text-gray-600 text-sm">Date of Birth</p>
//                 <p className="font-semibold">{user?.dob ? formatDate(user.dob) : 'Not provided'}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Applications Summary */}
//       <div className="card">
//         <div className="card-header">
//           <h2 className="text-xl font-bold">Application History</h2>
//         </div>
//         <div className="card-body">
//           {loading ? (
//             <p className="text-center text-gray-600">Loading applications...</p>
//           ) : applications.length === 0 ? (
//             <p className="text-center text-gray-600 py-8">No applications submitted</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left py-2">Date</th>
//                     <th className="text-left py-2">Product</th>
//                     <th className="text-left py-2 hidden sm:table-cell">Coverage</th>
//                     <th className="text-left py-2">Status</th>
//                     <th className="text-left py-2 hidden md:table-cell">Risk Score</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {applications.map(app => (
//                     <tr key={app.id} className="border-b hover:bg-gray-50">
//                       <td className="py-3">{formatDate(app.appliedDate)}</td>
//                       <td className="py-3">{app.productType}</td>
//                       <td className="py-3 hidden sm:table-cell">{app.coverage}</td>
//                       <td className="py-3">{getStatusBadge(app.status)}</td>
//                       <td className="py-3 hidden md:table-cell">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           app.riskScore > 70 ? 'bg-red-100 text-red-700' :
//                           app.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
//                           'bg-green-100 text-green-700'
//                         }`}>
//                           {app.riskScore}
//                         </span>
//                       </td>
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
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { applicationAPI, customerAPI } from '../../utils/api';
import { formatDate } from '../../utils/helpers';

export default function ProfileSection() {
  const { user, updateUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || ''
  });

  // Check if DOB is already set to lock it
  const isDobLocked = !!user?.dob;

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        if (user?.id) {
          const response = await applicationAPI.getByCustomer(user.id);
          setApplications(response.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch risk data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRiskData();
  }, [user?.id]);

  // Validation functions
  const validateName = (value) => {
    if (!value) return 'Full name is required';
    if (!/^[a-zA-Z\s]*$/.test(value)) return 'Full name must contain only letters';
    return '';
  };

  const validatePhone = (value) => {
    if (!value) return 'Phone number is required';
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length !== 10) return 'Phone number must be exactly 10 digits';
    return '';
  };

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'name') {
      const validatedLetters = value.replace(/[^a-zA-Z\s]/g, '');
      if (validatedLetters.length > 15) return; 
      error = validateName(validatedLetters);
      setFormData(prev => ({ ...prev, [name]: validatedLetters }));
    } 
    else if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) return; 
      error = validatePhone(digitsOnly);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } 
    else {
      if (name === 'email') error = validateEmail(value);
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const nameError = validateName(formData.name);
    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);
    const dobError = !formData.dob;
    return !nameError && !phoneError && !emailError && !dobError;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await customerAPI.update(user.id, formData);
      updateUser({ ...user, ...formData });
      setEditMode(false);
      setErrors({});
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to save profile');
    }
  };

  // Calculate average risk score from all applications
  const averageRisk = applications.length > 0 
    ? Math.round(applications.reduce((acc, curr) => acc + curr.riskScore, 0) / applications.length)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card shadow-sm border border-gray-100">
            <div className="card-header flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className={editMode ? 'btn-secondary text-sm' : 'btn-primary text-sm'}
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="card-body">
              {editMode ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700">Full Name (Max 15 chars)</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      maxLength="15"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="text-sm font-semibold text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div className="form-group">
                      <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        className={`w-full p-2 border rounded ${isDobLocked ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'}`}
                        value={formData.dob}
                        onChange={handleChange}
                        disabled={isDobLocked}
                      />
                      {isDobLocked && (
                        <p className="text-amber-600 text-[10px] mt-1 italic font-medium">
                          Note: Date of Birth cannot be changed once saved.
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="btn-success px-6 py-2 rounded font-bold text-white bg-green-600 disabled:opacity-50"
                    disabled={!isFormValid()}
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Full Name</p>
                    <p className="font-semibold text-lg">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Email</p>
                    <p className="font-semibold text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Phone</p>
                    <p className="font-semibold">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Date of Birth</p>
                    <p className="font-semibold">{user?.dob ? formatDate(user.dob) : 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Risk Score Card */}
        <div className="lg:col-span-1">
          <div className="card shadow-sm border border-gray-100 h-full">
            <div className="card-header bg-gray-50/50">
              <h2 className="text-xl font-bold">Risk Assessment</h2>
            </div>
            <div className="card-body flex flex-col items-center justify-center py-10">
              <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-4 ${
                averageRisk > 70 ? 'border-red-500 text-red-600' :
                averageRisk > 40 ? 'border-yellow-500 text-yellow-600' :
                'border-green-500 text-green-600'
              }`}>
                <span className="text-4xl font-black">{loading ? '...' : averageRisk}</span>
              </div>
              <p className="text-sm font-bold uppercase text-gray-500 mb-2">Current Risk Profile</p>
              <p className="text-xs text-center text-gray-400">
                Based on your {applications.length} latest application results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}