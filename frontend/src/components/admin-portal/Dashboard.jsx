import Header from '../common/Header'
import Footer from '../common/Footer'

function AdminDashboard() {
  return (
    <>
      <Header />
      <div className="page-container">
        <div className="container">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System management and analytics</p>

          <div className="grid grid-4">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div>
                <h3 className="stat-number">1,245</h3>
                <p className="stat-label">Total Applications</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div>
                <h3 className="stat-number">92%</h3>
                <p className="stat-label">Approval Rate</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚖️</div>
              <div>
                <h3 className="stat-number">6.2</h3>
                <p className="stat-label">Avg Risk Score</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div>
                <h3 className="stat-number">234</h3>
                <p className="stat-label">Active Users</p>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '2rem'}}>
            <h2 className="section-title">Admin Tools</h2>
            <div className="grid grid-2">
              <button className="action-btn">User Management</button>
              <button className="action-btn">Product Management</button>
              <button className="action-btn">Analytics & Reports</button>
              <button className="action-btn">System Settings</button>
            </div>
          </div>

          <div className="placeholder-section">
            <h2 className="section-title">System Analytics</h2>
            <p className="placeholder-text">System analytics and reports will appear here</p>
          </div>

          <div className="placeholder-section">
            <h2 className="section-title">User Activity Log</h2>
            <p className="placeholder-text">Recent user activities will be displayed here</p>
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
    border: '1px solid #e0e0e0',
    marginBottom: '2rem'
  },
  placeholder: {
    color: '#999',
    fontSize: '0.95rem',
    margin: '0'
  }
}

export default AdminDashboard
