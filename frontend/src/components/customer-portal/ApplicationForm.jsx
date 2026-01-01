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
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: user?.name || '',
    dob: user?.dob || '',
    contactInfo: user?.phone || '',
    email: user?.email || '',
    // Step 2: Insurance Selection
    productType: 'health',
    coverage: 'Basic',
    insuranceType: 'health',
    // Step 3: Medical Info
    medicalHistory: '',
    preExistingConditions: '',
    currentMedications: '',
    // Step 4: Documents
    documents: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
    }));
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
            productType: 'health',
            coverage: 'Basic',
            insuranceType: 'health',
            medicalHistory: '',
            preExistingConditions: '',
            currentMedications: '',
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
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone *</label>
                  <input
                    type="tel"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Step 2: Insurance Selection</h2>
              
              <div className="form-group">
                <label>Insurance Type *</label>
                <select name="productType" value={formData.productType} onChange={handleChange} required>
                  <option value="">Select Insurance Type</option>
                  <option value="health">Health Insurance</option>
                  <option value="life">Life Insurance</option>
                  <option value="motor">Motor Insurance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Coverage Level *</label>
                <select name="coverage" value={formData.coverage} onChange={handleChange} required>
                  <option value="">Select Coverage</option>
                  <option value="basic">Basic Coverage</option>
                  <option value="standard">Standard Coverage</option>
                  <option value="premium">Premium Coverage</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm mb-3">Coverage Details</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  {formData.productType === 'health' && (
                    <>
                      <p>Maximum claim amount: $500,000</p>
                      <p>Annual limit: Based on coverage level</p>
                      <p>Co-payment: 10-20% depending on service</p>
                    </>
                  )}
                  {formData.productType === 'life' && (
                    <>
                      <p>Coverage amount: $1,000,000 base</p>
                      <p>Term: 20-30 years</p>
                      <p>Beneficiary support: Included</p>
                    </>
                  )}
                  {formData.productType === 'motor' && (
                    <>
                      <p>Vehicle coverage: $200,000</p>
                      <p>Liability coverage: Included</p>
                      <p>Roadside assistance: 24/7</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Step 3: Medical Information</h2>
              
              <div className="form-group">
                <label>Medical History</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  placeholder="Describe any past medical conditions or treatments..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Pre-existing Conditions</label>
                <textarea
                  name="preExistingConditions"
                  value={formData.preExistingConditions}
                  onChange={handleChange}
                  placeholder="List any current health conditions (diabetes, hypertension, etc.)"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Current Medications</label>
                <textarea
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  placeholder="List any medications you're currently taking with dosage"
                  rows="3"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Step 4: Documents & Review</h2>
              
              <div className="form-group">
                <label>Upload Supporting Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    onChange={handleDocumentChange}
                    className="hidden"
                    id="documents"
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <p className="text-gray-600 font-semibold mb-2">Drop files here or click to select</p>
                    <p className="text-xs text-gray-500">Supported: PDF, JPG, PNG (Max 5MB each)</p>
                    <p className="text-xs text-gray-500 mt-2">Requires: ID Proof, Medical Reports, Income Proof</p>
                  </label>
                </div>
                {formData.documents.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2">Uploaded Files:</h4>
                    <ul className="space-y-2">
                      {formData.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-primary">📄</span>
                          {doc.name} ({(doc.size / 1024).toFixed(2)} KB)
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
                onClick={() => setStep(step + 1)}
                className="btn-primary flex-1 ml-auto"
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                disabled={loading}
                className="btn-success flex-1 ml-auto"
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
