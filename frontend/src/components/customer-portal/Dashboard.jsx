import { useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import policiesData from '../../data/policies.json'

function CustomerDashboard() {
  // State for showing/hiding policies message
  let [showMessage, setShowMessage] = useState(false)
  
  // Get all policies from JSON data
  let allPolicies = policiesData.policies
  
  // Filter policies for customer with ID 1
  let customerPolicies = []
  for (let i = 0; i < allPolicies.length; i++) {
    if (allPolicies[i].customerId === 1) {
      customerPolicies.push(allPolicies[i])
    }
  }

  // Toggle message on button click
  function handleViewPolicies() {
    if (showMessage === true) {
      setShowMessage(false)
    } else {
      setShowMessage(true)
    }
  }

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="container">
          <h1 className="page-title">Customer Dashboard</h1>
          <p className="page-subtitle">Manage your policies and applications</p>

          <div className="grid grid-4">
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-blue">📋</div>
              <div>
                <h3 className="stat-number">{customerPolicies.length}</h3>
                <p className="stat-label">Active Policies</p>
              </div>
            </div>
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-amber">⧖</div>
              <div>
                <h3 className="stat-number">1</h3>
                <p className="stat-label">Pending Applications</p>
              </div>
            </div>
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-green">₹</div>
              <div>
                <h3 className="stat-number">₹2,07,500</h3>
                <p className="stat-label">Premium Due</p>
              </div>
            </div>
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-red">◎</div>
              <div>
                <h3 className="stat-number">8</h3>
                <p className="stat-label">Documents</p>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '2rem'}}>
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn" onClick={handleViewPolicies}>{showMessage ? 'Hide Policies' : 'View Policies'}</button>
              <button className="action-btn">New Application</button>
              <button className="action-btn">Pay Premium</button>
              <button className="action-btn">Download Documents</button>
            </div>
          </div>

          {showMessage && (
            <div className="success-message">✓ Showing your active policies below</div>
          )}

          {/* Active Policies Section */}
          <div className="placeholder-section">
            <h2 className="section-title">Your Policies</h2>
            
            {/* Show message if no policies */}
            {customerPolicies.length === 0 ? (
              <p className="placeholder-text">No active policies yet</p>
            ) : (
              <div style={{marginTop: '1rem'}}>
                {/* Loop through each policy */}
                {customerPolicies.map(function(policy) {
                  let statusClass = policy.status === 'active' ? 'active' : 'pending'
                  let formattedCoverage = policy.coverageAmount.toLocaleString('en-IN')
                  let formattedPremium = policy.premiumAmount.toLocaleString('en-IN')
                  
                  return (
                    <div key={policy.id} className="data-item">
                      <div className="data-item-header">
                        <h3 className="data-item-title">{policy.productName}</h3>
                        <span className={`status-badge-glass ${statusClass}`}>
                          {policy.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="data-item-text">Policy: {policy.policyNumber}</p>
                      <p className="data-item-text">Coverage: ₹{formattedCoverage}</p>
                      <p className="data-item-text">Monthly Premium: ₹{formattedPremium}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CustomerDashboard
