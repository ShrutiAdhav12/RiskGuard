import Header from '../common/Header'
import Footer from '../common/Footer'

function UnderwriterDashboard() {
  return (
    <>
      <Header />
      <div className="page-container">
        <div className="container">
          <h1 className="page-title">Underwriter Dashboard</h1>
          <p className="page-subtitle">Review and manage insurance applications</p>

          <div className="grid grid-4">
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div>
                <h3 className="stat-number">12</h3>
                <p className="stat-label">Pending Review</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div>
                <h3 className="stat-number">5</h3>
                <p className="stat-label">High Risk Flagged</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div>
                <h3 className="stat-number">28</h3>
                <p className="stat-label">Approved Today</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div>
                <h3 className="stat-number">3</h3>
                <p className="stat-label">Rejected</p>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '2rem'}}>
            <h2 className="section-title">Quick Actions</h2>
            <div className="grid grid-2">
              <button className="action-btn">Review Applications</button>
              <button className="action-btn">Risk Assessment</button>
              <button className="action-btn">View Documents</button>
              <button className="action-btn">Analytics</button>
            </div>
          </div>

          <div className="placeholder-section">
            <h2 className="section-title">Application Queue</h2>
            <p className="placeholder-text">Applications waiting for review will appear here</p>
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
