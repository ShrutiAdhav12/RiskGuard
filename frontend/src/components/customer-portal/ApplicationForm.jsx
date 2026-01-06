import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { applicationAPI, riskAssessmentAPI } from '../../utils/api';
import { INSURANCE_TYPES, COVERAGE_LEVELS } from '../../utils/constants';
import { calculateRiskScore, calculatePremium, createRiskAssessment } from '../../utils/riskEngine';

export default function ApplicationForm() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: user?.name || '',
    dob: user?.dob || '',
    contactInfo: user?.phone || '',
    email: user?.email || '',
    // Step 2: Insurance Selection
    productType: '',
    coverage: '',
    insuranceType: 'health',
    // Step 3: Medical/Motor Info
    medicalHistory: '',
    preExistingConditions: '',
    currentMedications: '',
    vehicleDetails: '',
    drivingHistory: '',
    previousClaims: '',
    // Step 4: Documents
    documents: []
  });

  // Sync formData with updated user data when user changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: user?.name || '',
      dob: user?.dob || '',
      contactInfo: user?.phone || '',
      email: user?.email || ''
    }));
  }, [user?.name, user?.dob, user?.phone, user?.email]);

  // Validation functions
  const validateName = (value) => {
    if (!value) return 'Full name is required';
    if (!/^[a-zA-Z\s]*$/.test(value)) return 'Full name must contain only letters';
    if (value.length > 15) return 'Full name must not exceed 15 characters';
    return '';
  };

  const validateContact = (value) => {
    if (!value) return 'Contact phone is required';
    const digitsOnly = value.replace(/\D/g, '');
    // Only valid if exactly 10 digits
    if (digitsOnly.length < 10) return 'Contact number must be at least 10 digits';
    if (digitsOnly.length > 10) return 'Contact number must not exceed 10 digits';
    if (!/^[\d\s\-\(\)\+]*$/.test(value)) {
      return 'Contact number must contain only numbers and formatting characters';
    }
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
    let validatedValue = value;
    let error = '';

    // Validate name field - only allow letters and spaces, max 15 chars
    if (name === 'name') {
      validatedValue = value.replace(/[^a-zA-Z\s]/g, '');
      // Prevent input if exceeding 15 characters
      if (validatedValue.length > 15) {
        return;
      }
      error = validateName(validatedValue);
    }

    // Validate contact field - only allow numbers, max 10 digits
    if (name === 'contactInfo') {
      const digitsOnly = value.replace(/\D/g, '');
      // Prevent input if exceeding 10 digits
      if (digitsOnly.length > 10) {
        return;
      }
      validatedValue = digitsOnly;
      error = validateContact(validatedValue);
    }

    // Validate email field
    if (name === 'email') {
      validatedValue = value;
      error = validateEmail(value);
    }

    setFormData(prev => ({ ...prev, [name]: validatedValue }));
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const ALLOWED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'];
  const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpeg', '.jpg', '.txt'];

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    let fileError = '';
    const validFiles = [];

    files.forEach(f => {
      const fileExtension = '.' + f.name.split('.').pop().toLowerCase();
      const isValidType = ALLOWED_FILE_TYPES.includes(f.type) || ALLOWED_EXTENSIONS.includes(fileExtension);
      
      if (!isValidType) {
        fileError = `Invalid file type: ${f.name}. Only PDF, PNG, JPEG, JPG, and TXT files are allowed.`;
      } else {
        validFiles.push({ name: f.name, size: f.size, type: f.type });
      }
    });

    setFormData(prev => ({
      ...prev,
      documents: validFiles
    }));

    setErrors(prev => ({ ...prev, documents: fileError }));
  };

  // Remove a document from the list
  const handleRemoveDocument = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Check if step 4 is valid (documents uploaded)
  const isStep4Valid = () => {
    return formData.documents.length > 0;
  };

  // Check if step 1 is valid (without modifying state)
  const isStep1Valid = () => {
    const nameError = validateName(formData.name);
    const contactError = validateContact(formData.contactInfo);
    const dobError = !formData.dob;
    const emailError = validateEmail(formData.email);

    return !nameError && !contactError && !dobError && !emailError;
  };

  // Validate and set errors when trying to proceed
  const validateStep1AndShowErrors = () => {
    const nameError = validateName(formData.name);
    const contactError = validateContact(formData.contactInfo);
    const dobError = !formData.dob;
    const emailError = validateEmail(formData.email);

    setErrors({
      name: nameError,
      contactInfo: contactError,
      dob: dobError ? 'Date of birth is required' : '',
      email: emailError
    });

    return !nameError && !contactError && !dobError && !emailError;
  };

  // Check if step 2 is valid (without modifying state)
  const isStep2Valid = () => {
    return formData.productType && formData.coverage;
  };

  // Validate and set errors when trying to proceed on step 2
  const validateStep2AndShowErrors = () => {
    const productTypeError = !formData.productType;
    const coverageError = !formData.coverage;

    setErrors({
      productType: productTypeError ? 'Please select an insurance type' : '',
      coverage: coverageError ? 'Please select a coverage level' : ''
    });

    return !productTypeError && !coverageError;
  };

  // Check if step 3 is valid (without modifying state)
  const isStep3Valid = () => {
    if (formData.productType === 'motor') {
      return (
        formData.vehicleDetails.trim().length >= 15 &&
        formData.drivingHistory.trim().length >= 15 &&
        formData.previousClaims.trim().length >= 15
      );
    } else {
      return (
        formData.medicalHistory.trim().length >= 15 &&
        formData.preExistingConditions.trim().length >= 15 &&
        formData.currentMedications.trim().length >= 15
      );
    }
  };

  // Validate and set errors when trying to proceed on step 3
  const validateStep3AndShowErrors = () => {
    if (formData.productType === 'motor') {
      const vehicleDetailsError = formData.vehicleDetails.trim().length < 15;
      const drivingHistoryError = formData.drivingHistory.trim().length < 15;
      const previousClaimsError = formData.previousClaims.trim().length < 15;

      setErrors({
        vehicleDetails: vehicleDetailsError ? 'Vehicle details must be at least 15 characters' : '',
        drivingHistory: drivingHistoryError ? 'Driving history must be at least 15 characters' : '',
        previousClaims: previousClaimsError ? 'Previous claims information must be at least 15 characters' : ''
      });

      return !vehicleDetailsError && !drivingHistoryError && !previousClaimsError;
    } else {
      const medicalHistoryError = formData.medicalHistory.trim().length < 15;
      const preExistingConditionsError = formData.preExistingConditions.trim().length < 15;
      const currentMedicationsError = formData.currentMedications.trim().length < 15;

      setErrors({
        medicalHistory: medicalHistoryError ? 'Medical history must be at least 15 characters' : '',
        preExistingConditions: preExistingConditionsError ? 'Pre-existing conditions must be at least 15 characters' : '',
        currentMedications: currentMedicationsError ? 'Current medications must be at least 15 characters' : ''
      });

      return !medicalHistoryError && !preExistingConditionsError && !currentMedicationsError;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calculate risk score using risk engine
      const riskCalculation = calculateRiskScore(formData, user);
      
      // Calculate premium based on risk score
      const premiumCalc = calculatePremium(1500, riskCalculation.score, formData.coverage);
      
      const applicationData = {
        ...formData,
        customerId: user.id,
        status: 'pending',
        riskScore: riskCalculation.score,
        premium: premiumCalc.finalPremium,
        appliedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        riskComponents: riskCalculation.components
      };
      
      const response = await applicationAPI.create(applicationData);
      
      // Create and store risk assessment record
      const riskAssessment = createRiskAssessment(applicationData, user);
      riskAssessment.applicationId = response.data.id;
      
      try {
        await riskAssessmentAPI.create(riskAssessment);
        console.log('Risk Assessment created:', riskAssessment);
      } catch (err) {
        console.log('Risk assessment creation note:', err.message);
      }
      
      if (response.data.id) {
        setSuccess(true);
        setTimeout(() => {
          setStep(1);
          setSuccess(false);
          setFormData({
            name: user?.name || '',
            dob: user?.dob || '',
            contactInfo: user?.phone || '',
            email: user?.email || '',
            productType: '',
            coverage: '',
            insuranceType: 'health',
            medicalHistory: '',
            preExistingConditions: '',
            currentMedications: '',
            vehicleDetails: '',
            drivingHistory: '',
            previousClaims: '',
            documents: []
          });
        }, 2000);
      }
    } catch (err) {
      alert('Error submitting application: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Application Submitted!</h2>
            <p className="text-gray-600">Your application has been successfully submitted for review.</p>
            <p className="text-sm text-gray-500 mt-4">Application ID: APP-{Date.now()}</p>
            <p className="text-sm text-gray-500">Our underwriting team will review your application within 3-5 business days.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">New Insurance Application</h1>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map(num => (
          <div key={num} className={`flex-1 h-2 rounded-full ${step >= num ? 'bg-primary' : 'bg-gray-200'}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Step 1: Personal Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Full Name * (max 15 letters)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'border-red-500' : ''}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={errors.dob ? 'border-red-500' : ''}
                    required
                  />
                  {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="form-group">
                  <label>Contact Phone * (exactly 10 digits)</label>
                  <input
                    type="tel"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="Enter 10 digits"
                    className={errors.contactInfo ? 'border-red-500' : ''}
                    required
                  />
                  {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Step 2: Insurance Selection</h2>
              
              <div className="form-group">
                <label>Insurance Type *</label>
                <select name="productType" value={formData.productType} onChange={handleChange} className={errors.productType ? 'border-red-500' : ''} required>
                  <option value="">Select Insurance Type</option>
                  <option value="health">Health Insurance</option>
                  <option value="life">Life Insurance</option>
                  <option value="motor">Motor Insurance</option>
                </select>
                {errors.productType && <p className="text-red-500 text-sm mt-1">{errors.productType}</p>}
              </div>

              <div className="form-group">
                <label>Coverage Level *</label>
                <select name="coverage" value={formData.coverage} onChange={handleChange} className={errors.coverage ? 'border-red-500' : ''} required>
                  <option value="">Select Coverage</option>
                  <option value="basic">Basic Coverage</option>
                  <option value="standard">Standard Coverage</option>
                  <option value="premium">Premium Coverage</option>
                </select>
                {errors.coverage && <p className="text-red-500 text-sm mt-1">{errors.coverage}</p>}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm mb-3">Coverage Details</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  {formData.productType === 'health' && (
                    <>
                      {formData.coverage === 'basic' && (
                        <>
                          <p>Maximum claim amount: $300,000</p>
                          <p>Annual limit: Based on coverage level</p>
                          <p>Co-payment: 10-20% depending on service</p>
                        </>
                      )}
                      {formData.coverage === 'standard' && (
                        <>
                          <p>Maximum claim amount: $500,000</p>
                          <p>Annual limit: Based on coverage level</p>
                          <p>Co-payment: 20-30% depending on service</p>
                        </>
                      )}
                      {formData.coverage === 'premium' && (
                        <>
                          <p>Maximum claim amount: $600,000</p>
                          <p>Annual limit: Based on coverage level</p>
                          <p>Co-payment: 25-30% depending on service</p>
                        </>
                      )}
                    </>
                  )}
                  {formData.productType === 'life' && (
                    <>
                      {formData.coverage === 'basic' && (
                        <>
                          <p>Coverage amount: $1,000,000</p>
                          <p>Term: 10-15 years</p>
                          <p>Beneficiary support: Included</p>
                        </>
                      )}
                      {formData.coverage === 'standard' && (
                        <>
                          <p>Coverage amount: $2,000,000</p>
                          <p>Term: 15-20 years</p>
                          <p>Beneficiary support: Included</p>
                        </>
                      )}
                      {formData.coverage === 'premium' && (
                        <>
                          <p>Coverage amount: $4,000,000</p>
                          <p>Term: 20-30 years</p>
                          <p>Beneficiary support: Included</p>
                        </>
                      )}
                    </>
                  )}
                  {formData.productType === 'motor' && (
                    <>
                      {formData.coverage === 'basic' && (
                        <>
                          <p>Vehicle coverage: $200,000</p>
                          <p>Liability coverage: Not Included</p>
                          <p>Roadside assistance: 24/7</p>
                        </>
                      )}
                      {formData.coverage === 'standard' && (
                        <>
                          <p>Vehicle coverage: $300,000</p>
                          <p>Liability coverage: Included</p>
                          <p>Roadside assistance: 24/7</p>
                        </>
                      )}
                      {formData.coverage === 'premium' && (
                        <>
                          <p>Vehicle coverage: $400,000</p>
                          <p>Liability coverage: Included</p>
                          <p>Roadside assistance: 24/7</p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Step 3: {formData.productType === 'motor' ? 'Vehicle Information' : 'Medical Information'}</h2>
              
              {formData.productType === 'motor' ? (
                <>
                  <div className="form-group">
                    <label>Vehicle Details * (min 15 characters)</label>
                    <textarea
                      name="vehicleDetails"
                      value={formData.vehicleDetails}
                      onChange={handleChange}
                      placeholder="Describe your vehicle (make, model, year, registration number, etc.)..."
                      rows="4"
                      className={errors.vehicleDetails ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.vehicleDetails.length}/15 characters</p>
                    {errors.vehicleDetails && <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails}</p>}
                  </div>

                  <div className="form-group">
                    <label>Driving History * (min 15 characters)</label>
                    <textarea
                      name="drivingHistory"
                      value={formData.drivingHistory}
                      onChange={handleChange}
                      placeholder="Describe your driving experience and history (years of driving, accidents, etc.)..."
                      rows="3"
                      className={errors.drivingHistory ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.drivingHistory.length}/15 characters</p>
                    {errors.drivingHistory && <p className="text-red-500 text-sm mt-1">{errors.drivingHistory}</p>}
                  </div>

                  <div className="form-group">
                    <label>Previous Claims * (min 15 characters)</label>
                    <textarea
                      name="previousClaims"
                      value={formData.previousClaims}
                      onChange={handleChange}
                      placeholder="Describe any previous insurance claims or incidents..."
                      rows="3"
                      className={errors.previousClaims ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.previousClaims.length}/15 characters</p>
                    {errors.previousClaims && <p className="text-red-500 text-sm mt-1">{errors.previousClaims}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Medical History * (min 15 characters)</label>
                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      placeholder="Describe any past medical conditions or treatments..."
                      rows="4"
                      className={errors.medicalHistory ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.medicalHistory.length}/15 characters</p>
                    {errors.medicalHistory && <p className="text-red-500 text-sm mt-1">{errors.medicalHistory}</p>}
                  </div>

                  <div className="form-group">
                    <label>Pre-existing Conditions * (min 15 characters)</label>
                    <textarea
                      name="preExistingConditions"
                      value={formData.preExistingConditions}
                      onChange={handleChange}
                      placeholder="List any current health conditions (diabetes, hypertension, etc.)"
                      rows="3"
                      className={errors.preExistingConditions ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.preExistingConditions.length}/15 characters</p>
                    {errors.preExistingConditions && <p className="text-red-500 text-sm mt-1">{errors.preExistingConditions}</p>}
                  </div>

                  <div className="form-group">
                    <label>Current Medications * (min 15 characters)</label>
                    <textarea
                      name="currentMedications"
                      value={formData.currentMedications}
                      onChange={handleChange}
                      placeholder="List any medications you're currently taking with dosage"
                      rows="3"
                      className={errors.currentMedications ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.currentMedications.length}/15 characters</p>
                    {errors.currentMedications && <p className="text-red-500 text-sm mt-1">{errors.currentMedications}</p>}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Step 4: Documents & Review</h2>
              
              <div className="form-group">
                <label>Upload Supporting Documents * (Required)</label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${errors.documents ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-primary'}`}>
                  <input
                    type="file"
                    multiple
                    onChange={handleDocumentChange}
                    className="hidden"
                    id="documents"
                    accept=".pdf,.png,.jpeg,.jpg,.txt"
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <p className="text-gray-600 font-semibold mb-2">Drop files here or click to select</p>
                    <p className="text-xs text-gray-500">Supported: PDF, PNG, JPEG, JPG, TXT (Max 5MB each)</p>
                    <p className="text-xs text-gray-500 mt-2">Requires: ID Proof, Medical Reports, Income Proof</p>
                  </label>
                </div>
                {errors.documents && <p className="text-red-500 text-sm mt-1">{errors.documents}</p>}
                {!formData.documents.length && <p className="text-red-500 text-sm mt-1">At least one document is required</p>}
                {formData.documents.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2">Uploaded Files:</h4>
                    <ul className="space-y-2">
                      {formData.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center justify-between gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-primary">📄</span>
                            <div>
                              <p>{doc.name}</p>
                              <p className="text-xs text-gray-500">({(doc.size / 1024).toFixed(2)} KB)</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(idx)}
                            className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3 mt-6">
                <h3 className="font-semibold">Application Summary:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name:</p>
                    <p className="font-semibold">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">DOB:</p>
                    <p className="font-semibold">{formData.dob}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Insurance Type:</p>
                    <p className="font-semibold">{formData.productType.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Coverage:</p>
                    <p className="font-semibold">{formData.coverage}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
                By submitting this application, you confirm that all information provided is accurate and complete.
            </div>
          </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex-1"
              >
                Previous
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={() => {
                  if (step === 1) {
                    if (validateStep1AndShowErrors()) {
                      setStep(step + 1);
                    }
                  } else if (step === 2) {
                    if (validateStep2AndShowErrors()) {
                      setStep(step + 1);
                    }
                  } else if (step === 3) {
                    if (validateStep3AndShowErrors()) {
                      setStep(step + 1);
                    }
                  } else {
                    setStep(step + 1);
                  }
                }}
                disabled={(step === 1 && !isStep1Valid()) || (step === 2 && !isStep2Valid()) || (step === 3 && !isStep3Valid())}
                className={`btn-primary flex-1 ml-auto ${((step === 1 && !isStep1Valid()) || (step === 2 && !isStep2Valid()) || (step === 3 && !isStep3Valid())) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                disabled={loading || !isStep4Valid()}
                className={`btn-success flex-1 ml-auto ${(!isStep4Valid()) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { applicationAPI, riskAssessmentAPI } from '../../utils/api';
// import { INSURANCE_TYPES, COVERAGE_LEVELS } from '../../utils/constants';
// import { calculateRiskScore, calculatePremium, createRiskAssessment } from '../../utils/riskEngine';

// export default function ApplicationForm() {
//   const { user } = useAuth();
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     // Step 1: Personal Details
//     name: user?.name || '',
//     dob: user?.dob || '',
//     contactInfo: user?.phone || '',
//     email: user?.email || '',
//     // Step 2: Insurance Selection
//     productType: '',
//     coverage: '',
//     insuranceType: 'health',
//     // Step 3: Medical/Motor Info
//     medicalHistory: '',
//     preExistingConditions: '',
//     currentMedications: '',
//     vehicleDetails: '',
//     drivingHistory: '',
//     previousClaims: '',
//     // Step 4: Documents
//     documents: []
//   });

//   // Check if DOB is already saved in profile to lock it for new applications
//   const isDobLocked = !!user?.dob;

//   // Sync formData with updated user data when user changes
//   useEffect(() => {
//     setFormData(prev => ({
//       ...prev,
//       name: user?.name || '',
//       dob: user?.dob || '',
//       contactInfo: user?.phone || '',
//       email: user?.email || ''
//     }));
//   }, [user?.name, user?.dob, user?.phone, user?.email]);

//   // Validation functions
//   const validateName = (value) => {
//     if (!value) return 'Full name is required';
//     if (!/^[a-zA-Z\s]*$/.test(value)) return 'Full name must contain only letters';
//     if (value.length > 15) return 'Full name must not exceed 15 characters';
//     return '';
//   };

//   const validateContact = (value) => {
//     if (!value) return 'Contact phone is required';
//     const digitsOnly = value.replace(/\D/g, '');
//     if (digitsOnly.length !== 10) return 'Contact number must be exactly 10 digits';
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

//     // Prevent any changes to DOB if it is already locked
//     if (name === 'dob' && isDobLocked) return;

//     if (name === 'name') {
//       validatedValue = value.replace(/[^a-zA-Z\s]/g, '');
//       if (validatedValue.length > 15) return;
//       error = validateName(validatedValue);
//     }

//     if (name === 'contactInfo') {
//       const digitsOnly = value.replace(/\D/g, '');
//       if (digitsOnly.length > 10) return;
//       validatedValue = digitsOnly;
//       error = validateContact(validatedValue);
//     }

//     if (name === 'email') {
//       error = validateEmail(value);
//     }

//     setFormData(prev => ({ ...prev, [name]: validatedValue }));
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   const ALLOWED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'];
//   const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpeg', '.jpg', '.txt'];

//   const handleDocumentChange = (e) => {
//     const files = Array.from(e.target.files);
//     let fileError = '';
//     const validFiles = [];

//     files.forEach(f => {
//       const fileExtension = '.' + f.name.split('.').pop().toLowerCase();
//       const isValidType = ALLOWED_FILE_TYPES.includes(f.type) || ALLOWED_EXTENSIONS.includes(fileExtension);
      
//       if (!isValidType) {
//         fileError = `Invalid file type: ${f.name}. Only PDF, PNG, JPEG, JPG, and TXT files are allowed.`;
//       } else {
//         validFiles.push({ name: f.name, size: f.size, type: f.type });
//       }
//     });

//     setFormData(prev => ({ ...prev, documents: validFiles }));
//     setErrors(prev => ({ ...prev, documents: fileError }));
//   };

//   const handleRemoveDocument = (indexToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       documents: prev.documents.filter((_, index) => index !== indexToRemove)
//     }));
//   };

//   const isStep1Valid = () => {
//     const nameError = validateName(formData.name);
//     const contactError = validateContact(formData.contactInfo);
//     const dobError = !formData.dob;
//     const emailError = validateEmail(formData.email);
//     return !nameError && !contactError && !dobError && !emailError;
//   };

//   const validateStep1AndShowErrors = () => {
//     const nameError = validateName(formData.name);
//     const contactError = validateContact(formData.contactInfo);
//     const dobError = !formData.dob;
//     const emailError = validateEmail(formData.email);

//     setErrors({
//       name: nameError,
//       contactInfo: contactError,
//       dob: dobError ? 'Date of birth is required' : '',
//       email: emailError
//     });

//     return !nameError && !contactError && !dobError && !emailError;
//   };

//   const isStep2Valid = () => formData.productType && formData.coverage;

//   const validateStep2AndShowErrors = () => {
//     const productTypeError = !formData.productType;
//     const coverageError = !formData.coverage;
//     setErrors({
//       productType: productTypeError ? 'Please select an insurance type' : '',
//       coverage: coverageError ? 'Please select a coverage level' : ''
//     });
//     return !productTypeError && !coverageError;
//   };

//   const isStep3Valid = () => {
//     if (formData.productType === 'motor') {
//       return (
//         formData.vehicleDetails.trim().length >= 15 &&
//         formData.drivingHistory.trim().length >= 15 &&
//         formData.previousClaims.trim().length >= 15
//       );
//     } else {
//       return (
//         formData.medicalHistory.trim().length >= 15 &&
//         formData.preExistingConditions.trim().length >= 15 &&
//         formData.currentMedications.trim().length >= 15
//       );
//     }
//   };

//   const validateStep3AndShowErrors = () => {
//     if (formData.productType === 'motor') {
//       const vErr = formData.vehicleDetails.trim().length < 15;
//       const dErr = formData.drivingHistory.trim().length < 15;
//       const pErr = formData.previousClaims.trim().length < 15;
//       setErrors({
//         vehicleDetails: vErr ? 'Vehicle details must be at least 15 characters' : '',
//         drivingHistory: dErr ? 'Driving history must be at least 15 characters' : '',
//         previousClaims: pErr ? 'Previous claims must be at least 15 characters' : ''
//       });
//       return !vErr && !dErr && !pErr;
//     } else {
//       const mErr = formData.medicalHistory.trim().length < 15;
//       const peErr = formData.preExistingConditions.trim().length < 15;
//       const cErr = formData.currentMedications.trim().length < 15;
//       setErrors({
//         medicalHistory: mErr ? 'Medical history must be at least 15 characters' : '',
//         preExistingConditions: peErr ? 'Pre-existing conditions must be at least 15 characters' : '',
//         currentMedications: cErr ? 'Current medications must be at least 15 characters' : ''
//       });
//       return !mErr && !peErr && !cErr;
//     }
//   };

//   const isStep4Valid = () => formData.documents.length > 0;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const riskCalculation = calculateRiskScore(formData, user);
//       const premiumCalc = calculatePremium(1500, riskCalculation.score, formData.coverage);
      
//       const applicationData = {
//         ...formData,
//         customerId: user.id,
//         status: 'pending',
//         riskScore: riskCalculation.score,
//         premium: premiumCalc.finalPremium,
//         appliedDate: new Date().toISOString().split('T')[0],
//         createdAt: new Date().toISOString(),
//         riskComponents: riskCalculation.components
//       };
      
//       const response = await applicationAPI.create(applicationData);
//       const riskAssessment = createRiskAssessment(applicationData, user);
//       riskAssessment.applicationId = response.data.id;
      
//       try {
//         await riskAssessmentAPI.create(riskAssessment);
//       } catch (err) {
//         console.log('Risk assessment creation note:', err.message);
//       }
      
//       if (response.data.id) {
//         setSuccess(true);
//         setTimeout(() => {
//           setStep(1);
//           setSuccess(false);
//           setFormData({
//             ...formData, // Keep name, dob, etc.
//             productType: '',
//             coverage: '',
//             documents: []
//           });
//         }, 2000);
//       }
//     } catch (err) {
//       alert('Error submitting application: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="max-w-2xl mx-auto">
//         <div className="card">
//           <div className="card-body text-center py-12">
//             <div className="text-5xl mb-4 text-green-500">✓</div>
//             <h2 className="text-2xl font-bold text-green-600 mb-2">Application Submitted!</h2>
//             <p className="text-gray-600">Your application has been successfully submitted for review.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <h1 className="text-2xl md:text-3xl font-bold mb-8">New Insurance Application</h1>

//       <div className="flex gap-2 mb-8">
//         {[1, 2, 3, 4].map(num => (
//           <div key={num} className={`flex-1 h-2 rounded-full ${step >= num ? 'bg-primary' : 'bg-gray-200'}`} />
//         ))}
//       </div>

//       <form onSubmit={handleSubmit} className="card shadow-md">
//         <div className="card-body">
//           {step === 1 && (
//             <div className="space-y-4">
//               <h2 className="text-xl font-bold mb-6">Step 1: Personal Details</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-group">
//                   <label className="block text-sm font-medium mb-1">Full Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
//                     required
//                   />
//                   {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//                 </div>
//                 <div className="form-group">
//                   <label className="block text-sm font-medium mb-1">Date of Birth *</label>
//                   <input
//                     type="date"
//                     name="dob"
//                     value={formData.dob}
//                     onChange={handleChange}
//                     disabled={isDobLocked}
//                     className={`w-full p-2 border rounded ${isDobLocked ? 'bg-gray-100 cursor-not-allowed border-gray-200' : errors.dob ? 'border-red-500' : 'border-gray-300'}`}
//                     required
//                   />
//                   {isDobLocked && (
//                     <p className="text-amber-600 text-[10px] mt-1 italic font-medium">
//                       Note: Date of Birth is locked and cannot be changed.
//                     </p>
//                   )}
//                   {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-group">
//                   <label className="block text-sm font-medium mb-1">Email Address *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
//                     required
//                   />
//                   {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                 </div>
//                 <div className="form-group">
//                   <label className="block text-sm font-medium mb-1">Contact Phone *</label>
//                   <input
//                     type="tel"
//                     name="contactInfo"
//                     value={formData.contactInfo}
//                     onChange={handleChange}
//                     placeholder="10 digits only"
//                     className={`w-full p-2 border rounded ${errors.contactInfo ? 'border-red-500' : 'border-gray-300'}`}
//                     required
//                   />
//                   {errors.contactInfo && <p className="text-red-500 text-xs mt-1">{errors.contactInfo}</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="space-y-4">
//               <h2 className="text-xl font-bold mb-6">Step 2: Insurance Selection</h2>
//               <div className="form-group">
//                 <label className="block text-sm font-medium mb-1">Insurance Type *</label>
//                 <select name="productType" value={formData.productType} onChange={handleChange} className="w-full p-2 border rounded border-gray-300" required>
//                   <option value="">Select Type</option>
//                   <option value="health">Health Insurance</option>
//                   <option value="life">Life Insurance</option>
//                   <option value="motor">Motor Insurance</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label className="block text-sm font-medium mb-1">Coverage Level *</label>
//                 <select name="coverage" value={formData.coverage} onChange={handleChange} className="w-full p-2 border rounded border-gray-300" required>
//                   <option value="">Select Coverage</option>
//                   <option value="basic">Basic</option>
//                   <option value="standard">Standard</option>
//                   <option value="premium">Premium</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="space-y-4">
//               <h2 className="text-xl font-bold mb-6">Step 3: Details</h2>
//               {formData.productType === 'motor' ? (
//                 <>
//                   <textarea name="vehicleDetails" value={formData.vehicleDetails} onChange={handleChange} placeholder="Vehicle Details..." rows="3" className="w-full p-2 border rounded" />
//                   <textarea name="drivingHistory" value={formData.drivingHistory} onChange={handleChange} placeholder="Driving History..." rows="3" className="w-full p-2 border rounded" />
//                   <textarea name="previousClaims" value={formData.previousClaims} onChange={handleChange} placeholder="Previous Claims..." rows="3" className="w-full p-2 border rounded" />
//                 </>
//               ) : (
//                 <>
//                   <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} placeholder="Medical History..." rows="3" className="w-full p-2 border rounded" />
//                   <textarea name="preExistingConditions" value={formData.preExistingConditions} onChange={handleChange} placeholder="Pre-existing Conditions..." rows="3" className="w-full p-2 border rounded" />
//                   <textarea name="currentMedications" value={formData.currentMedications} onChange={handleChange} placeholder="Current Medications..." rows="3" className="w-full p-2 border rounded" />
//                 </>
//               )}
//             </div>
//           )}

//           {step === 4 && (
//             <div className="space-y-4">
//               <h2 className="text-xl font-bold mb-6">Step 4: Documents</h2>
//               <input type="file" multiple onChange={handleDocumentChange} className="w-full p-2 border border-dashed border-gray-400 rounded" />
//               <div className="bg-gray-50 p-3 rounded text-sm">
//                 <p><strong>Review Summary:</strong> {formData.name} | {formData.productType} | {formData.coverage}</p>
//               </div>
//             </div>
//           )}

//           <div className="flex gap-4 mt-8">
//             {step > 1 && (
//               <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex-1 border py-2 rounded">Previous</button>
//             )}
//             {step < 4 ? (
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (step === 1 && validateStep1AndShowErrors()) setStep(2);
//                   else if (step === 2 && validateStep2AndShowErrors()) setStep(3);
//                   else if (step === 3 && validateStep3AndShowErrors()) setStep(4);
//                 }}
//                 disabled={(step === 1 && !isStep1Valid()) || (step === 2 && !isStep2Valid()) || (step === 3 && !isStep3Valid())}
//                 className="btn-primary flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             ) : (
//               <button type="submit" disabled={loading || !isStep4Valid()} className="btn-success flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50">
//                 {loading ? 'Submitting...' : 'Submit Application'}
//               </button>
//             )}
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }