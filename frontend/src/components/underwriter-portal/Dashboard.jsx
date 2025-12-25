import { useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import applicationsData from '../../data/applications.json'

function UnderwriterDashboard() {
  // State for filtering high risk applications
  let [filterApps, setFilterApps] = useState(false)
  
  // Get all applications from JSON data
  let allApplications = applicationsData.applications
  
  // Get pending applications
  let pendingApplications = []
  for (let i = 0; i < allApplications.length; i++) {
    if (allApplications[i].status === 'pending') {
      pendingApplications.push(allApplications[i])
    }
  }
  
  // Get high risk applications (risk score > 6)
  let highRiskApps = []
  for (let i = 0; i < pendingApplications.length; i++) {
    if (pendingApplications[i].riskScore > 6) {
      highRiskApps.push(pendingApplications[i])
    }
  }

  // Toggle high risk filter
  function handleReviewApplications() {
    if (filterApps === true) {
      setFilterApps(false)
    } else {
      setFilterApps(true)
    }
  }

  // Get risk level class name based on score
  function getRiskClass(riskScore) {
    if (riskScore < 3) {
      return 'low'
    } else if (riskScore < 6) {
      return 'medium'
    } else {
      return 'high'
    }
  }
  return (
    <>
      <Header />
      <div className="page-container">
        <div className="container">
          <h1 className="page-title">Underwriter Dashboard</h1>
          <p className="page-subtitle">Review and manage insurance applications</p>

          <div className="grid grid-4">
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-blue">⧖</div>
              <div>
                <h3 className="stat-number">{pendingApplications.length}</h3>
                <p className="stat-label">Pending Review</p>
              </div>
            </div>
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-red">⚑</div>
              <div>
                <h3 className="stat-number">5</h3>
                <p className="stat-label">High Risk Flagged</p>
              </div>
            </div>
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-green">✓</div>
              <div>
                <h3 className="stat-number">28</h3>
                <p className="stat-label">Approved Today</p>
              </div>
            </div>
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-amber">✕</div>
              <div>
                <h3 className="stat-number">3</h3>
                <p className="stat-label">Rejected</p>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '2rem'}}>
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn" onClick={handleReviewApplications}>{filterApps ? 'Show All' : 'High Risk Only'}</button>
              <button className="action-btn">Risk Assessment</button>
              <button className="action-btn">View Documents</button>
              <button className="action-btn">Analytics</button>
            </div>
          </div>

          {filterApps && (
            <div className="warning-message">⚠ Filtering high-risk applications only ({highRiskApps.length})</div>
          )}

          <div className="placeholder-section">
            {/* Decide which applications to show */}
            {filterApps === true ? (
              <h2 className="section-title">High Risk Applications ({highRiskApps.length})</h2>
            ) : (
              <h2 className="section-title">Pending Applications ({pendingApplications.length})</h2>
            )}
            
            {/* Get applications to display */}
            {filterApps === true ? (
              highRiskApps.length > 0 ? (
                <div style={{marginTop: '1rem'}}>
                  {highRiskApps.map(function(app) {
                    let riskClass = getRiskClass(app.riskScore)
                    return (
                      <div key={app.id} className="data-item">
                        <div className="data-item-header">
                          <h3 className="data-item-title">Application #{app.id}</h3>
                          <div>
                            <span className={`risk-badge-glass ${riskClass}`}>Risk: {app.riskScore}</span>
                            <span style={{marginLeft: '0.5rem'}}></span>
                            <button className="btn-glass primary">Review</button>
                          </div>
                        </div>
                        <p className="data-item-text">Customer ID: {app.customerId}</p>
                        <p className="data-item-text">Submitted: {app.submittedDate}</p>
                        <p className="data-item-text">Notes: {app.reviewerNotes}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="placeholder-text">No high risk applications</p>
              )
            ) : (
              pendingApplications.length > 0 ? (
                <div style={{marginTop: '1rem'}}>
                  {pendingApplications.map(function(app) {
                    let riskClass = getRiskClass(app.riskScore)
                    return (
                      <div key={app.id} className="data-item">
                        <div className="data-item-header">
                          <h3 className="data-item-title">Application #{app.id}</h3>
                          <div>
                            <span className={`risk-badge-glass ${riskClass}`}>Risk: {app.riskScore}</span>
                            <span style={{marginLeft: '0.5rem'}}></span>
                            <button className="btn-glass primary">Review</button>
                          </div>
                        </div>
                        <p className="data-item-text">Customer ID: {app.customerId}</p>
                        <p className="data-item-text">Submitted: {app.submittedDate}</p>
                        <p className="data-item-text">Notes: {app.reviewerNotes}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="placeholder-text">No pending applications</p>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}



const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: 'calc(100vh - 200px)'
  },
  header: {
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#004499',
    margin: '0'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: '0.5rem 0 0 0'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
  },
  statIcon: {
    fontSize: '2.5rem',
    minWidth: '50px'
  },
  statNumber: {
    margin: '0',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#0066cc'
  },
  statLabel: {
    margin: '0.25rem 0 0 0',
    color: '#666',
    fontSize: '0.9rem'
  },
  actionsSection: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#004499',
    margin: '0 0 1rem 0'
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem'
  },
  actionBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 102, 204, 0.2)'
  },
  placeholderSection: {
    backgroundColor: '#f0f4f8',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  placeholder: {
    color: '#999',
    fontSize: '0.95rem',
    margin: '0'
  }
}

export default UnderwriterDashboard
